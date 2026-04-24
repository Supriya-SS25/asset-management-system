"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Clock } from "lucide-react";

type HistoryRecord = {
  id: number;
  asset_id: number;
  asset_name: string;
  action: string;
  date: string;
}

export default function AssetHistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetchWithAuth("/users/me/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 mb-8 shadow-sm">
         <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
           <Clock className="text-[#E50914]" /> Asset History
         </h1>
         <p className="text-gray-400">
           A log of equipment previously assigned to you and past return actions.
         </p>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-gray-500 animate-pulse">Loading history...</div>
        ) : history.length === 0 ? (
           <div className="p-12 text-center text-gray-500">
             <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p>You have no recorded asset history.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141414] border-b border-[#333] text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Asset ID</th>
                  <th className="p-4 font-medium">Asset Name</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-[#232323] transition-colors">
                    <td className="p-4 text-gray-300">
                      {new Date(record.date).toLocaleDateString()} {new Date(record.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-sm">#{record.asset_id}</td>
                    <td className="p-4 text-white font-medium">{record.asset_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${
                        record.action.toLowerCase().includes('assign') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                        record.action.toLowerCase().includes('return') ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                      }`}>
                        {record.action.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
