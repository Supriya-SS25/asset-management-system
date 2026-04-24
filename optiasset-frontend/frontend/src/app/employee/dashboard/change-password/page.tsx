"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Key, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "New passwords do not match." });
      setSubmitting(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: "New password must be at least 6 characters long." });
      setSubmitting(false);
      return;
    }
    
    try {
      const res = await fetchWithAuth("/users/change_password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "Password updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.detail || "Failed to update password." });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: 'error', text: "An error occurred while updating the password." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 mb-8 shadow-sm">
         <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
           <Key className="text-[#E50914]" /> Change Password
         </h1>
         <p className="text-gray-400">
           Secure your account by updating your password regularly.
         </p>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8">
        {message && (
          <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-500' : 'bg-red-500/10 border border-red-500/30 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full bg-[#141414] border border-[#333] rounded-md py-3 pl-10 pr-3 text-white focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 mt-6 border-t border-[#333] pt-4">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full bg-[#141414] border border-[#333] rounded-md py-3 pl-10 pr-3 text-white focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="w-full bg-[#141414] border border-[#333] rounded-md py-3 pl-10 pr-3 text-white focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="flex items-center justify-center gap-2 w-full mt-8 bg-[#E50914] text-white py-3 rounded font-bold tracking-widest hover:bg-red-700 transition disabled:opacity-50"
          >
            {submitting ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
}
