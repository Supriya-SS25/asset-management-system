"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { AlertTriangle, CheckCircle2, RefreshCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type Asset = {
  id: number;
  asset_name: string;
  category: string;
  status: string;
  assigned_user_id: number | null;
  purchase_date: string;
}

export default function EmployeeDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Ticketing State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [issueDesc, setIssueDesc] = useState("");
  const [submittingIssue, setSubmittingIssue] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.userRole !== "employee") {
         router.replace("/admin/dashboard");
         return;
      }

      loadAssets();
    }
  }, [isAuthenticated, user, router]);

  const loadAssets = async () => {
    try {
      const res = await fetchWithAuth("/assets/");
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (category: string, id: number) => {
    const laptops = [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531297172864-822d10bf0d21?auto=format&fit=crop&q=80&w=800"
    ];
    const phones = [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800"
    ];
    const tablets = [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=800"
    ];
    const printers = [
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1588607380962-421715871bfa?auto=format&fit=crop&q=80&w=800"
    ];
    const headphones = [
       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
       "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800"
    ];
    const monitors = [
       "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
       "https://images.unsplash.com/photo-1616450849187-5c26b681498b?auto=format&fit=crop&q=80&w=800"
    ];
    
    const getImg = (arr: string[]) => arr[id % arr.length];

    switch (category.toLowerCase()) {
        case "laptop": return getImg(laptops);
        case "phone": case "mobile": return getImg(phones);
        case "monitor": return getImg(monitors);
        case "headphones": case "headphone": case "audio": return getImg(headphones);
        case "tablet": case "tab": return getImg(tablets);
        case "printer": return getImg(printers);
        default: return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800";
    }
  };

  const openIssueModal = (assetId: number) => {
    setSelectedAssetId(assetId);
    setIssueDesc("");
    setIssueModalOpen(true);
  };

  const handeSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingIssue(true);
    
    await fetchWithAuth("/tickets/", {
      method: "POST",
      body: JSON.stringify({
        asset_id: selectedAssetId,
        request_type: "maintenance",
        description: issueDesc
      })
    });

    setSubmittingIssue(false);
    setIssueModalOpen(false);
    alert("Ticket successfully submitted to IT.");
  };

  const handleReturnRequest = async (assetId: number) => {
    if (!confirm("Are you sure you want to return this asset?")) return;
    
    try {
      const res = await fetchWithAuth(`/assets/${assetId}/return_request`, {
        method: "POST"
      });
      if (res.ok) {
        alert("Return request submitted successfully.");
        loadAssets(); // Refresh assets
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to submit return request.");
      }
    } catch (error) {
      console.error("Error submitting return request:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  if (!isAuthenticated || !user || user.userRole !== "employee") {
     return <div className="flex items-center justify-center text-white h-full">Loading Employee Profile...</div>;
  }

  return (
    <>
      {/* Modal for issue reporting */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#232323] border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
             <button onClick={() => setIssueModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">X</button>
             <h2 className="text-xl font-bold text-[#E50914] flex items-center gap-2 mb-4"><AlertTriangle /> Report Hardware Issue</h2>
             <p className="text-sm text-gray-400 mb-6">Describe the malfunction or damage with your equipment. Your IT admin will be notified.</p>
             <form onSubmit={handeSubmitIssue} className="space-y-4">
               <textarea 
                 value={issueDesc}
                 onChange={e => setIssueDesc(e.target.value)}
                 required
                 placeholder="e.g., Screen flickers when plugged in..."
                 className="w-full bg-[#141414] border border-white/10 p-3 rounded text-white focus:outline-none focus:border-[#E50914] min-h-[120px]"
               />
               <button type="submit" disabled={submittingIssue} className="w-full bg-[#E50914] text-white py-3 rounded font-black tracking-widest hover:bg-red-700 transition disabled:opacity-50">
                 {submittingIssue ? "SUBMITTING..." : "FILE TICKET"}
               </button>
             </form>
           </div>
        </div>
      )}

      {/* Professional Header */}
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 mb-8 shadow-sm">
         <h1 className="text-3xl font-bold text-white mb-2">
           Welcome back, {user?.userName}
         </h1>
         <p className="text-gray-400 text-lg">
           Here are your assigned company assets and devices.
         </p>
      </div>

      {/* Dashboard Statistics / Summary */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
              <p className="text-gray-400 text-sm font-medium mb-1">My Assigned Assets</p>
              <p className="text-3xl font-bold text-white">{assets.filter(a => a.status !== 'return_requested').length}</p>
           </div>
        </div>
      )}

      <div>
         <h2 className="text-xl font-semibold mb-6 text-white border-b border-[#333] pb-2">
           My Assigned Devices
         </h2>
        
        {loading ? (
           <div className="flex h-40 items-center text-gray-500 animate-pulse text-xl">Loading data...</div>
        ) : (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hover-group">
              {assets.map(asset => (
                <div key={asset.id} className="relative group rounded-md bg-[#232323] overflow-hidden card-hover border border-white/5 flex flex-col">
                   <div className="aspect-video w-full overflow-hidden relative">
                     <img src={getCategoryImage(asset.category, asset.id)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80"></div>
                   </div>
                   <div className="p-4 relative z-10 flex-1 flex flex-col">
                     <h3 className="font-bold text-lg text-white mb-1 truncate">{asset.asset_name}</h3>
                     <div className="flex items-center justify-between mt-2 mb-4">
                       <span className="text-sm text-[#808080] font-medium">{asset.category}</span>
                       <span className={`text-xs px-2 py-0.5 rounded font-black tracking-wider ${asset.status === 'available' ? 'text-green-500 border border-green-500/30' : asset.status === 'return_requested' ? 'text-yellow-500 border border-yellow-500/30' : 'text-[#E50914] border border-[#E50914]/30'}`}>
                         {asset.status === 'return_requested' ? 'RETURN REQUESTED' : asset.status.toUpperCase()}
                       </span>
                     </div>
                     
                     <div className="mt-auto space-y-2">
                       <button 
                          onClick={() => openIssueModal(asset.id)}
                          className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-[#E50914] text-gray-400 hover:text-[#E50914] py-1.5 rounded text-xs tracking-widest font-bold transition">
                          <AlertTriangle size={14} /> REPORT ISSUE
                       </button>
                       {asset.status !== 'return_requested' && (
                         <button 
                            onClick={() => handleReturnRequest(asset.id)}
                            className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-yellow-500 text-gray-400 hover:text-yellow-500 py-1.5 rounded text-xs tracking-widest font-bold transition">
                            <RefreshCcw size={14} /> RETURN ASSET
                         </button>
                       )}
                     </div>
                   </div>
                </div>
              ))}
              {assets.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>You currently have no equipment assigned to you.<br />Contact IT if this is an error.</p>
                </div>
              )}
           </div>
        )}
      </div>
    </>
  );
}
