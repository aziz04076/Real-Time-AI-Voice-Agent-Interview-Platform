"use client";

import React, { useState, useEffect } from "react";
import { Users, Video, BarChart2, ShieldCheck, RefreshCw, Activity, ArrowUpIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UsersTable from "@/components/admin/UsersTable";
import Link from "next/link";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      toast.error("Error loading dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success("Refreshing dashboard data...");
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Dashboard Overview</h1>
          <p className="text-light-400">Monitor your platform's growth and daily active usage.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleRefresh} variant="outline" className="glass h-11 rounded-lg flex items-center gap-2 border-white/5 hover:bg-white/10 transition-colors hidden sm:flex">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> 
            Sync Data
          </Button>
          <Button asChild className="btn-primary h-11 rounded-lg shadow-[0_0_20px_rgba(202,197,254,0.3)]">
            <Link href="/admin/analytics">
              View Analytics <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="size-6 text-blue-400" />} 
          label="Total Users" 
          value={stats?.totalUsers?.toLocaleString() || "0"} 
          loading={loading}
          trend="+12%"
          colorClass="from-blue-500/10 to-transparent border-blue-500/20"
        />
        <StatCard 
          icon={<Video className="size-6 text-purple-400" />} 
          label="Interviews Conducted" 
          value={stats?.totalInterviews?.toLocaleString() || "0"} 
          loading={loading}
          trend="+24%"
          colorClass="from-purple-500/10 to-transparent border-purple-500/20"
        />
        <StatCard 
          icon={<BarChart2 className="size-6 text-green-400" />} 
          label="Average Match Score" 
          value={stats ? `${stats.averageScore}/100` : "0"} 
          loading={loading}
          trend="+5%"
          colorClass="from-green-500/10 to-transparent border-green-500/20"
        />
        <StatCard 
          icon={<ShieldCheck className="size-6 text-orange-400" />} 
          label="Pro Subscribers" 
          value={stats?.proUsers?.toLocaleString() || "0"} 
          loading={loading}
          trend="+8%"
          colorClass="from-orange-500/10 to-transparent border-orange-500/20"
        />
      </div>
      
      {/* System Health / Top Level Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-dark rounded-3xl border border-white/5 overflow-hidden relative">
           <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
             <h3 className="font-bold text-lg text-white">Interview Activity</h3>
             <span className="text-xs font-semibold px-3 py-1 bg-primary-200/10 text-primary-200 rounded-full border border-primary-200/20">LIVE</span>
           </div>
           <div className="p-2">
             <div className="h-[300px] w-full overflow-hidden">
                <AnalyticsCharts mini />
             </div>
           </div>
        </div>

        <div className="glass-dark rounded-3xl border border-white/5 overflow-hidden flex flex-col relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/5 blur-3xl rounded-full pointer-events-none" />
           <div className="p-6 border-b border-white/5 bg-white/5">
             <h3 className="font-bold text-lg text-white flex items-center gap-2">
               <Activity className="size-5 text-green-400" /> Platform Health
             </h3>
           </div>
           <div className="p-6 flex flex-col gap-6 flex-1">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-200/50 border border-white/5">
                <div>
                   <p className="text-xs text-light-500 font-bold tracking-wider uppercase mb-1">Active Users (7d)</p>
                   <p className="text-2xl font-bold text-white">{loading ? "..." : stats?.activeUsers || "0"}</p>
                </div>
                <div className="size-12 rounded-full bg-primary-200/10 flex items-center justify-center border border-primary-200/20">
                   <Users className="size-5 text-primary-200" />
                </div>
             </div>
             
             <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-200/50 border border-white/5">
                <div>
                   <p className="text-xs text-light-500 font-bold tracking-wider uppercase mb-1">API Latency Avg</p>
                   <p className="text-2xl font-bold text-white">~45<span className="text-sm text-light-500 ml-1">ms</span></p>
                </div>
                <div className="size-12 rounded-full bg-blue-400/10 flex items-center justify-center border border-blue-400/20">
                   <Activity className="size-5 text-blue-400" />
                </div>
             </div>

             <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-200/50 border border-white/5 mt-auto">
                <p className="text-sm font-medium text-light-400">Server Status</p>
                <div className="flex items-center gap-2 text-sm font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                  <span className="size-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" /> Operational
                </div>
             </div>
           </div>
        </div>
      </div>

      <UsersTable refreshTrigger={refreshTrigger} />
    </div>
  );
}

function StatCard({ icon, label, value, trend, loading, colorClass }: { icon: any, label: string, value: string, trend: string, loading: boolean, colorClass: string }) {
    return (
        <div className={`bg-gradient-to-br bg-dark-200 p-6 rounded-3xl border border-white/5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-all duration-300`}>
           {/* Glow Effect */}
           <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity pointer-events-none rounded-full transform translate-x-10 -translate-y-10`} />
           
           {loading && (
             <div className="absolute inset-0 bg-dark-200/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                <RefreshCw className="size-6 text-primary-200 animate-spin" />
             </div>
           )}
           
           <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner`}>
                {icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                <ArrowUpIcon className="size-3" />
                {trend}
              </div>
           </div>
           
           <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md mb-1">{value}</h3>
              <p className="text-light-500 text-sm font-medium">{label}</p>
           </div>
        </div>
    );
}

