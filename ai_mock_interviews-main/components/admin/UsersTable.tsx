"use client";

import React, { useState, useEffect } from "react";
import { Search, MoreVertical, Trash, ShieldAlert, ShieldCheck, ArrowUpCircle, ArrowDownCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UsersTable({ refreshTrigger }: { refreshTrigger: number }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&search=${search}&plan=${planFilter}&sortBy=${sortBy}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, planFilter, sortBy, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/user/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdatePlan = async (id: string, newPlan: string) => {
    try {
      const res = await fetch(`/api/admin/user/${id}/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });
      if (!res.ok) throw new Error("Failed to update plan");
      toast.success(`Plan updated to ${newPlan}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user plan");
    }
  };

  const handleBlockToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/user/${id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to toggle block status");
      toast.success(`User ${!currentStatus ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update block status");
    }
  };

  const handleRoleToggle = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Are you sure you want to make this user an ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/admin/user/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      toast.success(`User is now an ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const exportCSV = () => {
    if (users.length === 0) return toast.error("No users to export");
    const headers = ["ID,Name,Email,Role,Plan,Interviews,Status,Joined"];
    const rows = users.map(u => 
      `${u._id},"${u.name}","${u.email}",${u.role},${u.plan},${u.interviewsTaken},${u.isBlocked ? "Blocked" : "Active"},${new Date(u.createdAt).toISOString()}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported users to CSV");
  };

  return (
    <div className="glass-dark rounded-3xl border border-white/5 overflow-hidden flex flex-col mt-4">
      {/* Header Controls */}
      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/5">
        <div>
          <h2 className="text-xl font-bold flex-shrink-0 text-white">User Management</h2>
          <p className="text-sm text-light-500 mt-1">Review, manage, and promote platform members.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-light-600" />
            <Input 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-dark-100/50 h-11 pl-12 rounded-lg border-white/10 w-full focus:border-primary-200/50 transition-colors" 
            />
          </div>
          
          <select 
            value={planFilter} 
            onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
            className="bg-dark-100/50 h-11 px-4 rounded-lg border border-white/10 text-white outline-none cursor-pointer focus:border-primary-200/50 transition-colors"
          >
            <option value="all" className="bg-dark-200">All Plans</option>
            <option value="free" className="bg-dark-200">Free</option>
            <option value="pro" className="bg-dark-200">Pro</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="bg-dark-100/50 h-11 px-4 rounded-lg border border-white/10 text-white outline-none cursor-pointer focus:border-primary-200/50 transition-colors"
          >
            <option value="createdAt" className="bg-dark-200">Newest</option>
            <option value="interviewsTaken" className="bg-dark-200">Most Active</option>
          </select>

          <Button onClick={exportCSV} variant="outline" className="bg-white/5 h-11 rounded-lg border border-white/5 hover:bg-white/10 transition-colors px-4 flex gap-2">
            <Download className="size-4 text-light-400" /> Export
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-dark-200/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin size-8 border-4 border-primary-200 border-t-transparent rounded-full" />
          </div>
        )}
        
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-white/5 text-xs font-bold uppercase tracking-widest text-light-500">
            <tr>
              <th className="px-8 py-5 border-b border-light-800/20 font-semibold">User</th>
              <th className="px-8 py-5 border-b border-light-800/20 font-semibold">Role & Plan</th>
              <th className="px-8 py-5 border-b border-light-800/20 font-semibold">Activity</th>
              <th className="px-8 py-5 border-b border-light-800/20 font-semibold w-32">Status</th>
              <th className="px-8 py-5 border-b border-light-800/20 font-semibold text-right w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-light-500">No users found matching your criteria.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className={`hover:bg-white/[0.02] transition-colors group ${user.isBlocked ? 'opacity-60 saturate-50' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-xl bg-dark-200 flex items-center justify-center border border-white/10 font-bold text-primary-200 uppercase shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary-200/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {user.name && user.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <p className="font-bold text-white text-sm truncate max-w-[200px]" title={user.name}>{user.name}</p>
                        <p className="text-xs text-light-500 truncate max-w-[200px]" title={user.email}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2 items-center">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${user.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-light-600/10 text-light-400 border-light-600/20"}`}>
                        {user.role}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${user.plan === "pro" ? "bg-primary-200/10 text-primary-200 border-primary-200/20" : "bg-dark-200/50 text-light-500 border-white/10"}`}>
                        {user.plan}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-light-100 font-medium">
                    {user.interviewsTaken || 0} {/* This can be visually enhanced later */}
                  </td>
                  <td className="px-8 py-5">
                    {user.isBlocked ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-400/10 max-w-min px-3 py-1 rounded-full border border-red-400/20">
                        <span className="size-1.5 rounded-full bg-red-400" />
                        Blocked
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-400/10 max-w-min px-3 py-1 rounded-full border border-green-400/20">
                        <span className="size-1.5 rounded-full bg-green-400" />
                        Active
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {user.plan === "free" ? (
                        <Button onClick={() => handleUpdatePlan(user._id, "pro")} size="sm" variant="ghost" className="size-8 p-0 text-primary-200 hover:bg-primary-200/20 hover:text-primary-100" title="Upgrade to Pro">
                          <ArrowUpCircle className="size-4" />
                        </Button>
                      ) : (
                        <Button onClick={() => handleUpdatePlan(user._id, "free")} size="sm" variant="ghost" className="size-8 p-0 text-light-500 hover:bg-white/10 hover:text-white" title="Downgrade to Free">
                          <ArrowDownCircle className="size-4" />
                        </Button>
                      )}
                      
                      <Button onClick={() => handleRoleToggle(user._id, user.role)} size="sm" variant="ghost" className={`size-8 p-0 ${user.role === "admin" ? "text-purple-400 hover:bg-purple-400/20 hover:text-purple-300" : "text-light-500 hover:bg-white/10 hover:text-white"}`} title={user.role === "admin" ? "Revoke Admin" : "Make Admin"}>
                        <ShieldAlert className="size-4" />
                      </Button>

                      <Button onClick={() => handleBlockToggle(user._id, user.isBlocked)} size="sm" variant="ghost" className={`size-8 p-0 ${user.isBlocked ? "text-green-400 hover:bg-green-400/20" : "text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-400"}`} title={user.isBlocked ? "Unblock User" : "Block User"}>
                        {user.isBlocked ? <ShieldCheck className="size-4" /> : <ShieldAlert className="size-4" />}
                      </Button>

                      <Button onClick={() => handleDelete(user._id)} size="sm" variant="ghost" className="size-8 p-0 text-red-500/70 hover:bg-red-500/20 hover:text-red-400" title="Delete User">
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-white/5 flex justify-center gap-2">
          <Button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            variant="ghost" 
            className="text-white hover:bg-white/10"
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-light-400">
            Page {page} of {totalPages}
          </span>
          <Button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
            variant="ghost" 
            className="text-white hover:bg-white/10"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
