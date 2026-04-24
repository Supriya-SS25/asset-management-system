"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { User, Mail, Shield, ChevronLeft, Monitor, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">Loading Profile...</div>;
  }

  const dashboardLink = user.userRole === "admin" ? "/admin/dashboard" : "/employee/dashboard";

  return (
    <div className="min-h-screen bg-[#141414] flex text-[#E5E5E5] font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-[80px] md:w-64 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-center md:items-start transition-all z-20">
        <div className="h-20 w-full flex items-center justify-center md:justify-start md:px-8 border-b border-[#333]">
          <span className="text-xl font-bold text-white hidden md:block tracking-wide">Asset Management</span>
          <span className="text-xl font-bold text-white md:hidden">AM</span>
        </div>
        <nav className="flex-1 w-full py-8 px-4 flex flex-col gap-2">
          <Link href={dashboardLink} className="flex items-center gap-4 px-4 py-3 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-all">
            <Monitor size={20} /> <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-4 px-4 py-3 bg-[#333] text-white font-medium rounded-lg transition-all">
            <User size={20} /> <span className="hidden md:inline">Profile</span>
          </Link>
        </nav>
        <button 
           onClick={logout}
           className="w-full p-6 text-[#aaa] hover:text-white flex items-center justify-center md:justify-start gap-4 transition-colors border-t border-[#333]">
          <LogOut size={20} /> <span className="hidden md:inline">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#121212] p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href={dashboardLink} className="text-sm text-[#aaa] hover:text-white mb-4 inline-flex items-center gap-1 transition-colors">
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-gray-400 mt-2">View your personal account details.</p>
          </div>

          <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-6 mb-8 border-b border-[#333] pb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                {user.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.userName}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${user.userRole === 'admin' ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-blue-500/20 text-blue-500 border border-blue-500/50'}`}>
                    {user.userRole}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 font-semibold tracking-wider uppercase mb-2 block">Full Name</label>
                <div className="flex items-center gap-3 bg-[#141414] p-4 rounded-lg border border-[#333]">
                  <User size={18} className="text-gray-400" />
                  <span className="text-white text-lg">{user.userName}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 font-semibold tracking-wider uppercase mb-2 block">Email Address</label>
                <div className="flex items-center gap-3 bg-[#141414] p-4 rounded-lg border border-[#333]">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-white text-lg">{user.userEmail}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 font-semibold tracking-wider uppercase mb-2 block">Access Level</label>
                <div className="flex items-center gap-3 bg-[#141414] p-4 rounded-lg border border-[#333]">
                  <Shield size={18} className="text-gray-400" />
                  <span className="text-white text-lg capitalize">{user.userRole} Privileges</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-[#333]">
              <p className="text-sm text-gray-500">
                To update your profile information, please contact an IT Administrator.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
