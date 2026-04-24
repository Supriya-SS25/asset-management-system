"use client";

import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 mb-8 shadow-sm">
         <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
           <User className="text-[#E50914]" /> Employee Profile
         </h1>
         <p className="text-gray-400">
           Your personal details and system access level.
         </p>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-[#333]">
            <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center border-2 border-[#E50914] text-3xl font-bold text-white uppercase">
              {user?.userName?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.userName || "Loading..."}</h2>
              <p className="text-[#E50914] font-medium uppercase tracking-wider text-sm mt-1">
                {user?.userRole || "EMPLOYEE"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="bg-[#141414] border border-[#333] rounded-md p-3 text-white">
                {user?.userName || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="bg-[#141414] border border-[#333] rounded-md p-3 text-white">
                {user?.userEmail || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Role / Access Level</label>
              <div className="bg-[#141414] border border-[#333] rounded-md p-3 text-white capitalize">
                {user?.userRole || "N/A"} Access
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <div className="bg-[#141414] border border-[#333] rounded-md p-3 text-green-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
