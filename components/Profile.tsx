"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Github,
  Twitter,
  Globe,
  Save,
  LogOut,
  Scan,
  Cpu,
  Activity,
  Fingerprint,
  Aperture,
  Camera,
  MapPin,
  Calendar,
  Linkedin,
} from "lucide-react";
import { UserProfile } from "../types";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { handleSignOut } from "@/app/(pages)/auth/authService";
import { updateUserProfile } from "@/actions/userActions";
import { authClient } from "@/lib/better-auth/auth-client";
import { redirect } from "next/navigation";

const Profile: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    role: "",
    email: "",
    bio: "",
    age: "",
    country: "",
    twitter: "",
    github: "",
    linkedin: "",
    website: "",

  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Populate local profile state from user once it's available
  useEffect(() => {
    if (!user) return;

    console.log("User data:", user);

    setProfile((prev) => ({
      ...prev,
      name: user.name || "",
      role: user.role || "",
      email: user.email || "",
      bio: user.bio || "",
      age: user.age || "",
      country: user.country || "",
      twitter: user.twitter || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      website: user.website || "",
    }));
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  const saveProfileToDatabase = async () => {
    try {
      setLoading(true);

      const result = await updateUserProfile(profile);

      if (result.success) {
        alert("Profile updated successfully!");
        console.log("Profile updated successfully:", profile);
      } else {
        alert("Failed to update profile: " + result.error);
        console.error("Failed to update user in database:", result.error);
      }
    } catch (error) {
      console.error("Failed to update user in database:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/auth/login");
        },
      },
    });
  };

  return (
    <div className="p-12 max-w-7xl mx-auto w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#030303]">
      {/* Atmospheric Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-orange-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[40px_40px] perspective-grid"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 blur-sm animate-scanline"></div>
      </div>

      {/* Holographic ID Card Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Identity Visual */}
        <div className="lg:col-span-4">
          <div className="relative group">
            {/* Hologram Border */}
            <div className="absolute -inset-1 bg-linear-to-b from-cyan-500/50 to-transparent opacity-20 group-hover:opacity-40 transition-opacity rounded-none border border-cyan-500/30 clip-corners"></div>

            <div className="bg-[#050505] border border-cyan-900/50 p-1 relative overflow-hidden">
              {/* Glitch Image Effect */}
              <div className="relative h-96 w-full bg-neutral-900 overflow-hidden flex flex-col items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, #06b6d4 3px)",
                  }}
                ></div>

                <div className="w-40 h-40 bg-neutral-800 relative mb-6 group-hover:scale-105 transition-transform duration-500">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-neutral-700">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                        />
                      ) : (
                        <User size={60} className="text-neutral-500" />
                      )}
                    </div>
                  )}

                  {/* Upload Overlay */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="text-white" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />

                  {/* Targeting Reticle */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>
                </div>

                <h1
                  className="text-3xl font-bold text-white font-mono tracking-tighter uppercase mb-1 glitch-text"
                  data-text={profile.name || user?.name}
                >
                  {profile.name || user?.name}
                </h1>
                <p className="text-cyan-500 text-xs font-mono tracking-[0.3em] uppercase mb-8">
                  {profile.role || user?.role}
                </p>

                <div className="flex gap-4 w-full px-8">
                  <div className="flex-1 border border-cyan-900/50 p-2 text-center">
                    <div className="text-[8px] text-neutral-500 uppercase tracking-widest mb-1">
                      Status
                    </div>
                    <div className="text-green-500 text-[10px] font-bold uppercase animate-pulse">
                      Active
                    </div>
                  </div>
                  <div className="flex-1 border border-cyan-900/50 p-2 text-center bg-cyan-950/10">
                    <div className="text-[8px] text-neutral-500 uppercase tracking-widest mb-1">
                      Location
                    </div>
                    <div className="text-cyan-500 text-[10px] font-mono truncate px-1">
                      {profile.country || user?.country}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="mt-4 w-full py-4 border border-red-900/50 bg-red-950/10 text-red-500 hover:bg-red-900/20 hover:border-red-500/50 uppercase font-mono font-bold tracking-widest text-xs transition-all flex items-center justify-center gap-3 group"
          >
            <LogOut
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Disconnect</span>
          </button>
        </div>

        {/* RIGHT: Data Entry */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Header Panel */}
          <div className="border-b border-cyan-900/30 pb-4 flex justify-between items-end">
            <div>
              <h2 className="text-2xl text-white font-mono uppercase tracking-widest flex items-center gap-3">
                <Fingerprint className="text-cyan-500" /> User Profile
              </h2>
            </div>
            <div className="text-right">
              <div className="text-cyan-500/50 font-mono text-xs">
                SYS_V.3.92
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-neutral-900/20 border border-white/5 p-6 relative group hover:border-cyan-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-2 opacity-50">
              <Aperture size={16} className="text-cyan-500" />
            </div>
            <label className="block text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-4">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full bg-transparent border-l-2 border-neutral-800 pl-4 text-neutral-300 font-mono text-sm leading-relaxed outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900/20 border border-white/5 p-6 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-4 text-cyan-600">
                <Cpu size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Name
                </span>
              </div>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full bg-transparent border-b border-neutral-800 py-2 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-colors"
              />
            </div>

            <div className="bg-neutral-900/20 border border-white/5 p-6 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-4 text-cyan-600">
                <Activity size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Role
                </span>
              </div>
              <input
                type="text"
                value={profile.role}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full bg-transparent border-b border-neutral-800 py-2 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-colors"
              />
            </div>

            <div className="bg-neutral-900/20 border border-white/5 p-6 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-4 text-cyan-600">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Age
                </span>
              </div>
              <input
                type="text"
                value={profile.age}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, age: e.target.value }))
                }
                className="w-full bg-transparent border-b border-neutral-800 py-2 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-colors"
              />
            </div>

            <div className="bg-neutral-900/20 border border-white/5 p-6 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-4 text-cyan-600">
                <MapPin size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Country
                </span>
              </div>
              <input
                type="text"
                value={profile.country}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, country: e.target.value }))
                }
                className="w-full bg-transparent border-b border-neutral-800 py-2 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Social Uplink */}
          <div className="bg-neutral-900/20 border border-white/5 p-6 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-cyan-600">
              <Scan size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Contact Links
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="text-neutral-600" size={14} />
                <input
                  type="text"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="bg-transparent border-b border-neutral-800 outline-none text-xs font-mono text-white w-full focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <Twitter className="text-neutral-600" size={14} />
                <input
                  type="text"
                  value={profile.twitter}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      twitter: e.target.value,
                    }))
                  }
                  className="bg-transparent border-b border-neutral-800 outline-none text-xs font-mono text-white w-full focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <Github className="text-neutral-600" size={14} />
                <input
                  type="text"
                  value={profile.github}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      github: e.target.value,
                    }))
                  }
                  className="bg-transparent border-b border-neutral-800 outline-none text-xs font-mono text-white w-full focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="text-neutral-600" size={14} />
                <input
                  type="text"
                  value={profile.linkedin}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                  className="bg-transparent border-b border-neutral-800 outline-none text-xs font-mono text-white w-full focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <Globe className="text-neutral-600" size={14} />
                <input
                  type="text"
                  value={profile.website}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  className="bg-transparent border-b border-neutral-800 outline-none text-xs font-mono text-white w-full focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={saveProfileToDatabase}
            className="w-full py-4 bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all uppercase font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-3 group"
          >
            <Save size={16} />
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
