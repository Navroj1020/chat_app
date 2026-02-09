import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        //extract token from http-only cookies
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];

        if(!token){
            console.log("Socket connection rejected: No token provieded")
            return next(new Error("Unauthorized - No token"))
        }

        //verify token
        const decoded = jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded){
            console.log("Socket connection rejected: Invalid token")
            return next(new Error("Unauthorized - Invalid token"))
        }

        //find user by id from DB
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            console.log("Socket connection rejected: User not found")
            return next(new Error("User not found"))
        }

        //attach user info to socket object for later use in event handlers
        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`Socket connection accepted: User ${user.fullName} connected with socket id ${user._id}`)
        next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Unauthorized - Authentication failed"))
     }
};
