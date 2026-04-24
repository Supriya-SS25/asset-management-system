'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { Monitor, Laptop, Settings, LogOut, MessageSquare, BarChart3, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchWithAuth } from "@/lib/api";
export default function Reports() {
  const { user, logout } = useAuth();

  const handleDownload = async (type: string) => {
    try {
      if (type === 'Asset Inventory CSV') {
        const res = await fetchWithAuth('/assets/');
        if (!res.ok) throw new Error('Failed to fetch assets');
        
        const assets = await res.json();
        
        if (assets.length === 0) {
          alert("No assets found in the database to export.");
          return;
        }

        const headers = Object.keys(assets[0]).join(',');
        const csvRows = assets.map((asset: any) => {
          return Object.values(asset).map(value => {
            const stringValue = String(value ?? '');
            if (stringValue.includes(',') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',');
        });

        const csvContent = [headers, ...csvRows].join('\n');
        downloadBlob(csvContent, `Asset_Inventory_${new Date().toISOString().split('T')[0]}.csv`);

      } else if (type === 'Utilization Analytics') {
        const res = await fetchWithAuth('/assets/');
        if (!res.ok) throw new Error('Failed to fetch assets');
        
        const assets = await res.json();
        if (assets.length === 0) {
          alert("No assets found in the database to export.");
          return;
        }

        const stats: any = {};
        assets.forEach((a: any) => {
            if (!stats[a.category]) {
                stats[a.category] = { Total: 0, Assigned: 0, Available: 0, Maintenance: 0 };
            }
            stats[a.category].Total += 1;
            if (a.status === 'assigned' || a.status === 'in_use') stats[a.category].Assigned += 1;
            else if (a.status === 'available') stats[a.category].Available += 1;
            else if (a.status === 'maintenance') stats[a.category].Maintenance += 1;
        });

        const csvRows = Object.keys(stats).map(category => {
            const s = stats[category];
            const rate = s.Total > 0 ? ((s.Assigned / s.Total) * 100).toFixed(1) : 0;
            return `${category},${s.Total},${s.Assigned},${s.Available},${s.Maintenance},${rate}%`;
        });
        
        const csvContent = "Category,Total Assets,Assigned,Available,Maintenance,Utilization Rate\n" + csvRows.join('\n');
        downloadBlob(csvContent, `Utilization_Audit_${new Date().toISOString().split('T')[0]}.csv`);

      } else if (type === 'Maintenance Log CSV') {
        const res = await fetchWithAuth('/tickets/');
        if (!res.ok) throw new Error('Failed to fetch tickets');
        
        const tickets = await res.json();
        if (tickets.length === 0) {
          alert("No maintenance tickets found to export.");
          return;
        }

        const headers = "Ticket ID,Asset ID,Request Type,Description,Status,Created At,Resolved At";
        const csvRows = tickets.map((t: any) => {
            return `${t.id},${t.asset_id || ''},${t.request_type},"${(t.description || '').replace(/"/g, '""')}",${t.status},${t.created_at},${t.resolved_at || ''}`;
        });
        
        const csvContent = headers + "\n" + csvRows.join('\n');
        downloadBlob(csvContent, `Maintenance_Log_${new Date().toISOString().split('T')[0]}.csv`);

      } else {
        alert(`${type} generation started! This feature is still under development.`);
      }
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("An error occurred while generating the report.");
    }
  };

  const downloadBlob = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#141414] flex text-[#E5E5E5] font-sans overflow-hidden">
      {/* Professional Sidebar */}
      <aside className="w-[80px] md:w-64 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-center md:items-start transition-all z-20">
        <div className="h-20 w-full flex items-center justify-center md:justify-start md:px-8 border-b border-[#333]">
          <span className="text-xl font-bold text-white hidden md:block tracking-wide">Asset Management</span>
          <span className="text-xl font-bold text-white md:hidden">AM</span>
        </div>
        <nav className="flex-1 w-full py-8 px-4 flex flex-col gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-4 px-4 py-3 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-all">
            <Monitor size={20} /> <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link href="/assets" className="flex items-center gap-4 px-4 py-3 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-all">
            <Laptop size={20} /> <span className="hidden md:inline">Inventory</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-4 px-4 py-3 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-all">
            <Settings size={20} /> <span className="hidden md:inline">User Control</span>
          </Link>
          <Link href="/reports" className="flex items-center gap-4 px-4 py-3 bg-[#333] text-white font-medium rounded-lg transition-all">
            <BarChart3 size={20} /> <span className="hidden md:inline">Reports</span>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center border-b border-[#333] pb-6">
            <div>
              <Link href="/admin/dashboard" className="text-sm text-[#aaa] hover:text-white mb-2 inline-flex items-center gap-1 transition-colors">
                <ChevronLeft size={16} /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-white tracking-wide">Enterprise Reports</h1>
              <p className="text-gray-400">Generate and analyze organizational asset data</p>
            </div>
            <button 
              onClick={() => handleDownload('Master Enterprise Report')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
            >
              <BarChart3 size={18} /> Master Report
            </button>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Laptop size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Asset Inventory</h3>
              <p className="text-gray-400 mb-6 text-sm">Full export of all hardware registered in the OptiAsset database.</p>
              <button 
                onClick={() => handleDownload('Asset Inventory CSV')}
                className="w-full py-3 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg font-medium transition-all border border-[#444]"
              >
                Generate CSV
              </button>
            </div>

            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                <Monitor size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Utilization Audit</h3>
              <p className="text-gray-400 mb-6 text-sm">Analytics on how assets are currently assigned across the organization.</p>
              <button 
                onClick={() => handleDownload('Utilization Analytics')}
                className="w-full py-3 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg font-medium transition-all border border-[#444]"
              >
                Generate CSV
              </button>
            </div>

            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                <Settings size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Maintenance Log</h3>
              <p className="text-gray-400 mb-6 text-sm">Historical record of service requests and hardware updates.</p>
              <button 
                onClick={() => handleDownload('Maintenance Log CSV')}
                className="w-full py-3 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg font-medium transition-all border border-[#444]"
              >
                Generate CSV
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
