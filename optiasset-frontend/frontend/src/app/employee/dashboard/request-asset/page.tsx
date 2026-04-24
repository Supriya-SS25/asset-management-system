"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { PlusSquare, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RequestAssetPage() {
  const router = useRouter();
  const [assetType, setAssetType] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    
    try {
      const description = `Asset Type: ${assetType}\nReason: ${reason}`;
      const res = await fetchWithAuth("/tickets/", {
        method: "POST",
        body: JSON.stringify({
          request_type: "new_asset",
          description: description
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "Asset request submitted successfully. IT will review your request." });
        setAssetType("");
        setReason("");
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.detail || "Failed to submit request." });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage({ type: 'error', text: "An error occurred while submitting." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8 mb-8 shadow-sm">
         <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
           <PlusSquare className="text-[#E50914]" /> Request New Asset
         </h1>
         <p className="text-gray-400">
           Submit a request for new equipment. Provide a clear reason for the IT department.
         </p>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-8">
        {message && (
          <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-500' : 'bg-red-500/10 border border-red-500/30 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Asset Category / Type</label>
            <select 
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              required
              className="w-full bg-[#141414] border border-[#333] rounded-md p-3 text-white focus:outline-none focus:border-[#E50914] transition-colors"
            >
              <option value="" disabled>Select Asset Type</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Mobile Phone">Mobile Phone</option>
              <option value="Tablet">Tablet</option>
              <option value="Headphones">Headphones</option>
              <option value="Other">Other Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Reason for Request</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Explain why you need this equipment (e.g., current one is broken, new project requirement...)"
              className="w-full bg-[#141414] border border-[#333] rounded-md p-3 text-white focus:outline-none focus:border-[#E50914] min-h-[150px] transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="flex items-center justify-center gap-2 w-full bg-[#E50914] text-white py-3 rounded font-bold tracking-widest hover:bg-red-700 transition disabled:opacity-50"
          >
            {submitting ? "SUBMITTING..." : <><Send size={18} /> SUBMIT REQUEST</>}
          </button>
        </form>
      </div>
    </div>
  );
}
