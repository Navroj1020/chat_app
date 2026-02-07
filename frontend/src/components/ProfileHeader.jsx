import React from "react";
import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3")

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const MAX_SIZE_MB = 2;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const handleImgUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images are allowed");
      return;
    }

    // Validate size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB`);
      return;
    }

    try {
      toast.loading("Uploading...", { id: "upload" });

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64Image = reader.result;

        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });

        toast.success("Profile picture updated!", { id: "upload" });
      };
    } catch (error) {
      console.log("profile upload error", error)
      toast.error("Upload failed", { id: "upload" });
    }
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="rounded-full">
            <button
              className="size-14 rounded-full avatar-online relative "
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full rounded-full object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              ref={fileInputRef}
              onChange={handleImgUpload}
              className="hidden"
            />
          </div>
          <div>
            {/* USERNAME and ONLINE TEXT */}
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400">Online</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {/* BUTTONS */}
          <button className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              //play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start so that it sounds good
              mouseClickSound.play().catch((error) => console.log("Audio play failed: ", error))
              toggleSound();
            }}
          >
            {isSoundEnabled ? (<Volume2Icon className="size-5" />) : (<VolumeOffIcon className="size-5" />)}

          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
