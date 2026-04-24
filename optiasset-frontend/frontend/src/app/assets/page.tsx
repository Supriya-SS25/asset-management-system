"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AssetsPage() {
  const { user, isAuthenticated } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // Create Asset Form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Laptop");
  const [cost, setCost] = useState(""); 


  const loadData = async () => {
    try {
      const resAssets = await fetchWithAuth("/assets/");
      if (resAssets.ok) {
        const data = await resAssets.json();
        setAssets(data);
      }
      
      if (user?.userRole === "admin") {
        const resUsers = await fetchWithAuth("/users/");
        if (resUsers.ok) {
          const uData = await resUsers.json();
          // only assign to employees
          setUsers(uData.filter((u: any) => u.role === "employee"));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    const payload = {
        asset_name: name,
        category: category,
        cost: parseFloat(cost),
        status: "available"
    };
    
    try {
      const res = await fetchWithAuth("/assets/", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setName("");
        setCategory("Laptop");
        setCost(""); 
        loadData(); // reload
      }
    } catch (err) {
      console.error("Error creating asset", err);
    }
  };

  const handleAssign = async (assetId: number, userId: string) => {
    if (!userId) return;
    try {
      const res = await fetchWithAuth(`/assets/${assetId}/assign`, {
        method: "POST",
        body: JSON.stringify({ user_id: parseInt(userId) })
      });
      if (res.ok) {
        loadData(); // reload assets
      }
    } catch (err) {
      console.error("Error assigning asset", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-[#E5E5E5] font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
          <div>
            <Link href="/dashboard" className="text-sm text-[#aaa] hover:text-white mb-2 inline-block transition-colors">{"<- Back to Dashboard"}</Link>
            <h1 className="text-3xl font-bold text-white tracking-wide">Hardware Database</h1>
          </div>
        </div>

        {user?.userRole === "admin" && (
          <div className="bg-[#1e1e1e] p-6 rounded-md border border-[#333] shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Add Device</h2>
              <form onSubmit={handleCreate} className="flex gap-4">
                 <input type="text" placeholder="Device Name (e.g. MacBook Pro M3)" value={name} onChange={e=>setName(e.target.value)} required className="flex-1 bg-[#121212] border border-[#333] p-3 rounded text-white focus:outline-none focus:border-white" />
                 <select value={category} onChange={e=>setCategory(e.target.value)} className="bg-[#121212] border border-[#333] p-3 rounded text-white focus:outline-none focus:border-white">
                   <option value="Laptop">Laptop</option>
                   <option value="Monitor">Monitor</option>
                   <option value="Phone">Phone</option>
                   <option value="Tablet">Tablet</option>
                   <option value="Headphones">Headphones</option>
                   <option value="Keyboard">Keyboard</option>
                   <option value="Mouse">Mouse</option>
                   <option value="Webcam">Webcam</option>
                   <option value="Router">Router</option>
                   <option value="Printer">Printer</option>
                   <option value="Server">Server</option>
                   <option value="Hardware">Other Hardware</option>
                 </select>
                 <input type="number" placeholder="Cost $" value={cost} onChange={e=>setCost(e.target.value)} required className="w-32 bg-[#121212] border border-[#333] p-3 rounded text-white focus:outline-none focus:border-white" />
                 <button type="submit" className="bg-[#333] text-white px-8 py-3 rounded font-semibold hover:bg-[#444] transition">Add Asset</button>
              </form>
          </div>
        )}

        <div className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#2a2a2a] border-b border-[#333]">
              <tr>
                <th className="p-4 text-xs font-semibold text-[#aaa] uppercase tracking-wider">Asset ID</th>
                <th className="p-4 text-xs font-semibold text-[#aaa] uppercase tracking-wider">Nomenclature</th>
                <th className="p-4 text-xs font-semibold text-[#aaa] uppercase tracking-wider">Class</th>
                <th className="p-4 text-xs font-semibold text-[#aaa] uppercase tracking-wider">Cost</th>
                <th className="p-4 text-xs font-semibold text-[#aaa] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-[#aaa] uppercase tracking-wider">Assigned Employee</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-[#333] last:border-0 hover:bg-[#2a2a2a] transition-colors">
                  <td className="p-4 font-mono text-[#aaa]">#{a.id}</td>
                  <td className="p-4 font-bold text-white">{a.asset_name}</td>
                  <td className="p-4 text-gray-400">{a.category}</td>
                  <td className="p-4 text-gray-400">${a.cost ? a.cost.toFixed(2) : '0.00'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${a.status === 'available' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
                  </td>
                  <td className="p-4">
                    {a.status === 'assigned' ? (
                       <span className="text-white">{a.assigned_user_name || 'Unknown'}</span>
                    ) : user?.userRole === "admin" ? (
                       <select 
                         className="bg-[#121212] border border-[#333] p-1 rounded text-sm text-white focus:outline-none"
                         onChange={(e) => handleAssign(a.id, e.target.value)}
                         defaultValue=""
                       >
                         <option value="" disabled>Assign to...</option>
                         {users.map(u => (
                           <option key={u.id} value={u.id}>{u.name}</option>
                         ))}
                       </select>
                    ) : (
                       <span className="text-[#aaa]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {assets.length === 0 && <div className="p-8 text-center text-[#aaa]">No assets recorded.</div>}
        </div>
      </div>
    </div>
  );
}
