"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { RefreshCw, TrendingUp, Users as UsersIcon, Activity } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const COLORS = ['#d1952f', '#4f46e5', '#10b981', '#f43f5e', '#8b5cf6'];

export default function AnalyticsCharts({ mini = false }: { mini?: boolean }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const json = await res.json();
      setData(json);
    } catch (error) {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] w-full h-full">
        <div className="animate-spin size-8 border-4 border-primary-200 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data?.timeSeriesData) {
    return <div className="text-center text-light-400 py-10 w-full h-full flex items-center justify-center">No data available yet.</div>;
  }

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d1952f" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#d1952f" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        {!mini && <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} dy={10} />}
        {!mini && <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />}
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        {!mini && <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />}
        <Area type="monotone" name="Interviews" dataKey="interviews" stroke="#d1952f" strokeWidth={mini ? 2 : 3} fillOpacity={1} fill="url(#colorInterviews)" />
        <Area type="monotone" name="New Users" dataKey="newUsers" stroke="#4f46e5" strokeWidth={mini ? 2 : 3} fillOpacity={1} fill="url(#colorUsers)" />
      </AreaChart>
    </ResponsiveContainer>
  );

  if (mini) {
    return (
      <div className="w-full h-full pb-4">
        {renderAreaChart()}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Over time Area Chart */}
      <div className="glass-dark p-6 sm:p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/5 rounded-full blur-3xl -z-10" />
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="size-5 text-primary-200" />
              Platform Activity (Last 7 Days)
            </h3>
            <p className="text-sm text-light-500 mt-1">Daily overview of new registrations and interviews completed.</p>
          </div>
          <Button onClick={fetchAnalytics} variant="ghost" className="size-10 p-0 rounded-full hover:bg-white/10">
            <RefreshCw className="size-4 text-light-400" />
          </Button>
        </div>
        
        <div className="h-[350px] w-full">
          {renderAreaChart()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Average Match Score Trend */}
        <div className="glass-dark p-6 sm:p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
            <TrendingUp className="size-5 text-green-400" />
            Average Score Trend
          </h3>
          <p className="text-sm text-light-500 mb-8">Daily average performance score across all candidates.</p>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.timeSeriesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
                <Bar name="Avg Score" dataKey="averageScore" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Common Interview Types */}
        <div className="glass-dark p-6 sm:p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
            <UsersIcon className="size-5 text-purple-400" />
            Popular Interview Types
          </h3>
          <p className="text-sm text-light-500 mb-8">Breakdown of the top interview modalities used.</p>

          <div className="h-[250px] w-full flex items-center justify-center">
            {data.topInterviewTypes && data.topInterviewTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.topInterviewTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="count"
                    label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.topInterviewTypes.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-light-500 text-sm">Not enough data to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
