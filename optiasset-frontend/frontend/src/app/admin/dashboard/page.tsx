"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";
import { Monitor, Laptop, Settings, LogOut, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getAssetImage } from "@/lib/utils";

type Asset = {
  id: number;
  asset_name: string;
  category: string;
  status: string;
  assigned_user_id: number | null;
  purchase_date: string;
  image_url: string | null;
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Security hook to redirect unauthorized access
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.userRole !== "admin") {
         router.replace("/employee/dashboard");
         return;
      }
      
      console.log("✅ Admin Dashboard - NEW VERSION DEPLOYED");
      const loadAssets = async () => {
        try {
          const res = await fetchWithAuth("/assets/");
          if (res.ok) {
            const data = await res.json();
            setAssets(data);
          } else {
            console.error("Failed to load assets for dashboard");
          }
        } catch (error) {
          console.error("Error fetching dashboard assets:", error);
        } finally {
          setLoading(false);
        }
      };
      
      loadAssets();
    }
  }, [isAuthenticated, user, router]);



  if (!isAuthenticated || !user || user.userRole !== "admin") {
     return <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">Loading Admin Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#141414] flex text-[#E5E5E5] font-sans overflow-hidden">
      
      {/* Professional Sidebar */}
      <aside className="w-[80px] md:w-64 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-center md:items-start transition-all z-20">
        <div className="h-20 w-full flex items-center justify-center md:justify-start md:px-8 border-b border-[#333]">
          <span className="text-xl font-bold text-white hidden md:block tracking-wide">Asset Management</span>
          <span className="text-xl font-bold text-white md:hidden">AM</span>
        </div>
        <nav className="flex-1 w-full py-8 px-4 flex flex-col gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-4 px-4 py-3 bg-[#333] text-white font-medium rounded-lg transition-all">
            <Monitor size={20} /> <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link href="/assets" className="flex items-center gap-4 px-4 py-3 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-all">
            <Laptop size={20} /> <span className="hidden md:inline">Inventory</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-4 px-4 py-3 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-all">
            <Settings size={20} /> <span className="hidden md:inline">User Control</span>
          </Link>
          <Link href="/reports" className="flex items-center gap-4 px-4 py-3 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-all">
            <MessageSquare size={20} /> <span className="hidden md:inline">Reports</span>
          </Link>
        </nav>
        <button 
           onClick={logout}
           className="w-full p-6 text-[#aaa] hover:text-white flex items-center justify-center md:justify-start gap-4 transition-colors border-t border-[#333]">
          <LogOut size={20} /> <span className="hidden md:inline">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#121212] p-8">
        {/* Professional Header */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 mb-8 shadow-sm">
           <h1 className="text-3xl font-bold text-white mb-2">
             Welcome, Administrator {user?.userName}
           </h1>
           <p className="text-gray-400 text-lg">
             Manage company assets globally and oversee organizational allocation.
           </p>
        </div>

        {/* Dashboard Statistics / Summary */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
                <p className="text-gray-400 text-sm font-medium mb-1">Total Assets</p>
                <p className="text-3xl font-bold text-white">{assets.length}</p>
             </div>
             <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
                <p className="text-gray-400 text-sm font-medium mb-1">Assigned Assets</p>
                <p className="text-3xl font-bold text-white">{assets.filter(a => a.status === 'assigned').length}</p>
             </div>
             <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
                <p className="text-gray-400 text-sm font-medium mb-1">Available Assets</p>
                <p className="text-3xl font-bold text-white">{assets.filter(a => a.status === 'available').length}</p>
             </div>
          </div>
        )}

        <div>
           <h2 className="text-xl font-semibold mb-6 text-white border-b border-[#333] pb-2">
             Company Asset Overview
           </h2>
          
          {loading ? (
             <div className="flex h-40 items-center text-gray-500 animate-pulse text-xl">Loading data...</div>
          ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hover-group">
                {assets.map(asset => (
                  <div key={asset.id} className="relative group rounded-md bg-[#232323] overflow-hidden card-hover border border-white/5">
                     <div className="aspect-video w-full overflow-hidden relative">
                       <img src={getAssetImage(asset)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80"></div>
                     </div>
                     <div className="p-4 relative z-10">
                       <h3 className="font-bold text-lg text-white mb-1 truncate">{asset.asset_name}</h3>
                       <div className="flex items-center justify-between mt-2">
                         <span className="text-sm text-[#808080] font-medium">{asset.category}</span>
                         <span className={`text-xs px-2 py-0.5 rounded font-black tracking-wider ${asset.status === 'available' ? 'text-green-500 border border-green-500/30' : 'text-[#E50914] border border-[#E50914]/30'}`}>
                           {asset.status.toUpperCase()}
                         </span>
                       </div>
                     </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
