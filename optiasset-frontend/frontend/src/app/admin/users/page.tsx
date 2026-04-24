"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function UsersPage() {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Create User Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.userRole !== "admin") {
        window.location.href = "/employee/dashboard";
        return;
      }
      loadUsers();
    }
  }, [isAuthenticated, user]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/users");
      if (res.ok) {
        setUsers(await res.json());
      } else if (res.status === 403) {
        window.location.href = "/employee/dashboard";
      }
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setCreating(true);
    setCreateMsg({ text: "Creating user...", type: "info" });
    
    const payload = {
      name,
      email,
      role,
      department_id: 1, // Default
      password: "password123" // Default password
    };

    try {
      const res = await fetchWithAuth("/users", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setCreateMsg({ text: "User created successfully", type: "success" });
        setName("");
        setEmail("");
        setRole("employee");
        loadUsers();
        setTimeout(() => setCreateMsg({ text: "", type: "" }), 3000);
      } else {
        const err = await res.json();
        setCreateMsg({ text: err.detail || "Error creating user", type: "error" });
      }
    } catch (error) {
      setCreateMsg({ text: "Network error", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const res = await fetchWithAuth(`/users/${id}`, { method: "DELETE" });
      if (res.ok) loadUsers();
      else alert("Failed to delete user");
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await fetchWithAuth(`/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) loadUsers();
    else alert("Failed to update status");
  };

  const handleRoleToggle = async (id: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "employee" : "admin";
    const res = await fetchWithAuth(`/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) loadUsers();
    else alert("Failed to change role");
  };

  // Filter and paginate
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage, 
    currentPage * usersPerPage
  );

  return (
    <div className="min-h-screen bg-[#0F0F13] p-8 text-[#E5E5E5] font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-white/10 pb-4 gap-4">
          <div>
            <div className="text-sm text-[#808080] mb-2 font-medium tracking-wide">
              <Link href="/dashboard" className="hover:text-white transition-colors">Admin</Link> / <span className="text-white">Users</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">User Management</h1>
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full bg-[#1A1A1E] border border-white/10 p-3 pl-10 rounded text-sm text-white focus:outline-none focus:border-[#4F46E5] transition-colors"
            />
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* Create User Form */}
        <div className="bg-[#1A1A1E] p-6 rounded-lg border border-white/5 shadow-xl mb-8">
          <h2 className="text-lg font-bold mb-4 text-white">Create New User</h2>
          <form onSubmit={handleCreate} className="flex flex-wrap md:flex-nowrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-[#808080] uppercase mb-2">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[#0F0F13] border border-white/10 p-2.5 rounded text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-[#808080] uppercase mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#0F0F13] border border-white/10 p-2.5 rounded text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors" />
            </div>
            <div className="min-w-[150px]">
              <label className="block text-xs font-semibold text-[#808080] uppercase mb-2">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-[#0F0F13] border border-white/10 p-2.5 rounded text-white text-sm focus:outline-none focus:border-[#4F46E5]">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button disabled={creating} type="submit" className="bg-[#4F46E5] text-white px-6 py-2.5 rounded text-sm font-bold tracking-wide hover:bg-[#4338CA] transition-colors disabled:opacity-50">
              {creating ? "Creating..." : "Create User"}
            </button>
          </form>
          {createMsg.text && (
            <div className={`mt-4 text-sm ${createMsg.type === 'success' ? 'text-green-400' : createMsg.type === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
              {createMsg.text}
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-[#1A1A1E] border border-white/5 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-[#0F0F13] border-b border-white/5">
                <tr>
                  <th className="p-4 text-xs font-bold text-[#808080] uppercase">ID</th>
                  <th className="p-4 text-xs font-bold text-[#808080] uppercase">Name</th>
                  <th className="p-4 text-xs font-bold text-[#808080] uppercase">Email</th>
                  <th className="p-4 text-xs font-bold text-[#808080] uppercase">Role</th>
                  <th className="p-4 text-xs font-bold text-[#808080] uppercase">Status</th>
                  <th className="p-4 text-xs font-bold text-[#808080] uppercase">Created Date</th>
                  <th className="p-4 text-xs font-bold text-[#808080] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#808080]">Loading users...</td>
                  </tr>
                ) : displayedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#808080]">No users found.</td>
                  </tr>
                ) : (
                  displayedUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-sm text-[#808080]">{u.id}</td>
                      <td className="p-4 text-sm font-semibold text-white">{u.name}</td>
                      <td className="p-4 text-sm text-gray-400">{u.email}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#808080]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-sm text-right space-x-2">
                        <button onClick={() => handleStatusToggle(u.id, u.status || 'active')} className="text-xs text-[#808080] hover:text-white transition-colors">
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <span className="text-[#808080]">|</span>
                        <button onClick={() => handleRoleToggle(u.id, u.role)} className="text-xs text-[#808080] hover:text-white transition-colors">
                          Change Role
                        </button>
                        <span className="text-[#808080]">|</span>
                        <button onClick={() => handleDelete(u.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="bg-[#0F0F13] p-4 border-t border-white/5 flex items-center justify-between text-sm">
              <span className="text-[#808080]">
                Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} entries
              </span>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded bg-[#1A1A1E] text-white disabled:opacity-50 hover:bg-[#2A2A2E] transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded transition-colors ${currentPage === page ? 'bg-[#4F46E5] text-white font-bold' : 'bg-[#1A1A1E] text-[#808080] hover:bg-[#2A2A2E] hover:text-white'}`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded bg-[#1A1A1E] text-white disabled:opacity-50 hover:bg-[#2A2A2E] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
