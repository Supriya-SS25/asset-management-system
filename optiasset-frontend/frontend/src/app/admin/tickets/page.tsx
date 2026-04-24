"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminTicketsPage() {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated && user?.userRole === "admin") {
      console.log("✅ Admin tickets page - Admin authenticated, loading tickets");

      // Use mock data for immediate functionality
      const mockTickets = [
        {
          id: 1,
          asset_name: "MacBook Pro M3",
          issue_type: "Screen Flickering",
          status: "open",
          created_at: "2024-03-15T10:30:00Z",
          user_email: "employee@assettrack.com"
        },
        {
          id: 2,
          asset_name: "iPhone 15 Pro",
          issue_type: "Battery Drain",
          status: "in_progress",
          created_at: "2024-03-14T14:20:00Z",
          user_email: "employee@assettrack.com"
        }
      ];

      setTickets(mockTickets);
      console.log("📋 Mock tickets loaded:", mockTickets);
    }
  }, [isAuthenticated, user]);

  const loadTickets = async () => {
    const res = await fetchWithAuth("/tickets/");
    if (res.ok) {
      setTickets(await res.json());
    } else if (res.status === 403) {
      alert("Access Denied: Admins Only");
      window.location.href = "/dashboard";
    }
  };

  const updateStatus = async (ticketId: number, newStatus: string) => {
    await fetchWithAuth(`/tickets/${ticketId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus })
    });
    loadTickets();
  };

  return (
    <div className="min-h-screen cinematic-bg p-8 text-[#E5E5E5] font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div>
            <Link href="/dashboard" className="text-sm text-[#808080] hover:text-white mb-2 inline-block transition-colors">{"<- Back to Dashboard"}</Link>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">IT Support Desk</h1>
          </div>
        </div>

        <div className="bg-[#232323] border border-white/5 rounded-md shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#141414] border-b border-white/5">
              <tr>
                <th className="p-4 text-xs font-black text-[#808080] tracking-widest uppercase">Ticket ID</th>
                <th className="p-4 text-xs font-black text-[#808080] tracking-widest uppercase">Asset ID</th>
                <th className="p-4 text-xs font-black text-[#808080] tracking-widest uppercase">Description</th>
                <th className="p-4 text-xs font-black text-[#808080] tracking-widest uppercase">Status</th>
                <th className="p-4 text-xs font-black text-[#808080] tracking-widest uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-[#808080]">#{t.id}</td>
                  <td className="p-4 text-green-500 font-bold">{t.asset_id ? `HW-${t.asset_id}` : 'General'}</td>
                  <td className="p-4 text-gray-300 pr-12">{t.description}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-full w-fit ${t.status === 'resolved' ? 'bg-green-500/20 text-green-500' : t.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-white/10 text-gray-300'}`}>
                      {t.status === 'pending' && <Clock size={12} />}
                      {t.status === 'resolved' && <CheckCircle size={12} />}
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {t.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(t.id, 'resolved')} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded transition">RESOLVE</button>
                        <button onClick={() => updateStatus(t.id, 'rejected')} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition">REJECT</button>
                      </div>
                    )}
                    {t.status !== 'pending' && <span className="text-xs text-[#808080] font-bold">LOCKED</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && <div className="p-12 text-center text-[#808080]">No open tickets found. Excellent!</div>}
        </div>
      </div>
    </div>
  );
}
