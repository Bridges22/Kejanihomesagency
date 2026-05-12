'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MapPin, TrendingUp, Users, Target, Loader2, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { hostService } from '@/services/hostService';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const res = await hostService.getHostMetrics(data.user.id);
          setMetrics(res);
        }
      } catch (err) {
        console.error('Analytics Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="text-teal-600 animate-spin" />
        <p className="text-slate-500 font-medium tracking-tight">Gathering coastal insights...</p>
      </div>
    );
  }

  // Calculate Real Conversion Rate
  const conversionRate = metrics?.totalViews > 0 
    ? Math.round((metrics.totalUnlocks / metrics.totalViews) * 100) 
    : 0;

  // Prepare Chart Data from Real Areas
  const chartData = metrics?.areaBreakdown 
    ? Object.entries(metrics.areaBreakdown).map(([name, stats]: any) => ({
        name,
        Views: stats.views,
        Leads: stats.unlock_count
      })).slice(0, 6) // Top 6 areas
    : [];

  // Heat Map Data
  const heatMapData = metrics?.areaBreakdown
    ? Object.entries(metrics.areaBreakdown).map(([name, stats]: any) => {
        const val = stats.views;
        let status = 'low';
        let color = 'bg-slate-50 text-slate-800';
        
        if (val > 100) { status = 'very high'; color = 'bg-teal-50 text-teal-800'; }
        else if (val > 50) { status = 'high'; color = 'bg-emerald-50 text-emerald-800'; }
        else if (val > 20) { status = 'medium'; color = 'bg-amber-50 text-amber-800'; }

        return { name, value: val, status, color };
      }).sort((a, b) => b.value - a.value)
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
        <p className="text-sm text-slate-500">Real-time engagement tracking across your coastal properties.</p>
      </header>

      {/* Filters (Mock for now, but UI is live) */}
      <div className="flex gap-2 p-1 bg-slate-100 w-fit rounded-2xl border border-slate-200">
        <button className="px-4 py-1.5 rounded-xl text-[11px] font-bold bg-white text-teal-800 shadow-sm border border-slate-200">Overall Performance</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-teal-50 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Leads vs Views</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Top performing locations by engagement</p>
            </div>
          </div>

          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  <Bar dataKey="Views" fill="#0D9488" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Leads" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                <RefreshCw size={24} className="text-slate-300 mb-2" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Awaiting property data</p>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Goal Card */}
        <div className="bg-teal-900 rounded-[40px] p-8 text-white shadow-xl shadow-teal-900/40 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-teal-400/20 rounded-2xl">
                <Target size={24} className="text-teal-400" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em]">Efficiency</h4>
                <div className="text-2xl font-bold">Lead Conversion</div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-xs font-bold text-teal-100 uppercase tracking-widest">Real-time Rate</span>
                  <span className="text-4xl font-black italic tracking-tighter text-teal-300">{conversionRate}%</span>
                </div>
                <div className="w-full h-2 bg-teal-800 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.6)] transition-all duration-1000" 
                    style={{ width: `${conversionRate}%` }}
                   />
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-teal-200/60 font-medium">
                This shows the percentage of people who unlocked your contact details after viewing your properties.
              </p>
            </div>
          </div>
          {/* Background Decor */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-50" />
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <MapPin size={18} className="text-teal-600" />
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Market Demand Heat Map</h3>
           </div>
           <span className="text-[10px] font-bold text-slate-400 uppercase">Views per location</span>
        </div>
        
        {heatMapData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {heatMapData.map((area) => (
              <div key={area.name} className={`${area.color} p-5 rounded-3xl border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center group`}>
                 <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">{area.name}</div>
                 <div className="text-3xl font-black tracking-tighter mb-1">{area.value}</div>
                 <div className="text-[9px] font-black uppercase tracking-widest opacity-40">{area.status}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No location data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}