import { resendClient,sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const sendWelcomeEmail = async(email,name,clientURL) =>{
    const {data,error} = await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,
        to: email,
        subject:"Welcome to ChatApp",
        html: createWelcomeEmailTemplate(name,clientURL)
    })
    if (error){
        console.log("Error sending Welcome Email: ",error)
        throw new Error("Failed to send welcome email")
    }else{
        console.log("Welcome Email Sent Successfully",data);

    }
}