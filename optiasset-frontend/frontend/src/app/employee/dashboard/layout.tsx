"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monitor, Clock, PlusSquare, User, Key, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: "My Assets", href: "/employee/dashboard", icon: <Monitor size={20} /> },
    { name: "Request Asset", href: "/employee/dashboard/request-asset", icon: <PlusSquare size={20} /> },
    { name: "Asset History", href: "/employee/dashboard/history", icon: <Clock size={20} /> },
    { name: "Profile", href: "/employee/dashboard/profile", icon: <User size={20} /> },
    { name: "Change Password", href: "/employee/dashboard/change-password", icon: <Key size={20} /> },
  ];

  if (!user || user.userRole !== "employee") {
      // Handled by pages or global auth protection
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#141414] flex text-[#E5E5E5] font-sans overflow-hidden">
      {/* Professional Sidebar */}
      <aside className="w-[80px] md:w-64 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-center md:items-start transition-all z-20">
        <div className="h-20 w-full flex items-center justify-center md:justify-start md:px-8 border-b border-[#333]">
          <span className="text-xl font-bold text-white hidden md:block tracking-wide">OptiAsset</span>
          <span className="text-xl font-bold text-white md:hidden">OA</span>
        </div>
        
        <nav className="flex-1 w-full py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-4 px-4 py-3 font-medium rounded-lg transition-all ${
                  isActive 
                    ? "bg-[#333] text-white" 
                    : "text-[#aaa] hover:text-white hover:bg-[#333]"
                }`}
              >
                {item.icon} <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button 
           onClick={logout}
           className="w-full p-6 text-[#aaa] hover:text-white flex items-center justify-center md:justify-start gap-4 transition-colors border-t border-[#333]">
          <LogOut size={20} /> <span className="hidden md:inline">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#121212] p-8">
        {children}
      </main>
    </div>
  );
}
