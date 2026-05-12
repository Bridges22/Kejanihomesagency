'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Globe, 
  PieChart,
  Calendar,
  Loader2
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { listingsService } from '@/services/listings';

export default function AdminStatsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await adminService.getDetailedStats();
        const cities = await listingsService.getCities();
        setData({ ...stats, cityCount: cities.length });
      } catch (err) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 text-slate-200 animate-spin" />
      </div>
    );
  }

  // Calculate dynamic metrics
  const listings = data.listings || [];
  const totalViews = listings.reduce((acc: number, curr: any) => acc + (curr.view_count || 0), 0);
  const avgViews = listings.length > 0 ? (totalViews / listings.length).toFixed(1) : 0;
  
  const categories = {
    airbnb: listings.filter((l: any) => l.type === 'airbnb').length,
    rental: listings.filter((l: any) => l.type === 'rental').length,
    sale: listings.filter((l: any) => l.type === 'sale').length,
    land: listings.filter((l: any) => l.type === 'land').length,
  };

  const totalListings = listings.length || 1; // Avoid division by zero
  
  const kpis = [
    { label: 'Platform Growth', value: '+12%', trend: 'up', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'New users' },
    { label: 'Avg. Views/Listing', value: avgViews.toString(), trend: 'up', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Per property' },
    { label: 'Conversion Rate', value: '3.1%', trend: 'up', icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Inquiries' },
    { label: 'Global Reach', value: `${data.cityCount} Cities`, trend: 'up', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Coast region' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Platform Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Real-time performance metrics and growth indicators.</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${kpi.bg} ${kpi.color} p-3 rounded-2xl`}>
                <kpi.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.value}
              </div>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {kpi.value}
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Layers className="text-blue-500" />
              Listing Breakdown
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Short Stays', count: categories.airbnb, percentage: (categories.airbnb / totalListings) * 100, color: 'bg-rose-500' },
                { label: 'Long Term Rentals', count: categories.rental, percentage: (categories.rental / totalListings) * 100, color: 'bg-teal-500' },
                { label: 'For Sale', count: categories.sale, percentage: (categories.sale / totalListings) * 100, color: 'bg-blue-500' },
                { label: 'Land & Plots', count: categories.land, percentage: (categories.land / totalListings) * 100, color: 'bg-amber-500' },
              ].map((cat) => (
                <div key={cat.label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                    <span className="text-xs font-black text-slate-400">{cat.count} listings</span>
                  </div>
                  <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Chart Placeholder */}
        <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2 flex items-center gap-3">
                <PieChart className="text-teal-400" />
                Active Engagement
              </h3>
              <p className="text-slate-400 text-sm font-medium">Monthly Active Users (MAU) Trend</p>
            </div>
            
            <div className="flex items-end gap-3 h-48 mt-8">
              {[15, 25, 20, 35, 45, 60, 100].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${h}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded shadow-xl whitespace-nowrap">
                    {Math.floor(h * (data.users?.length / 100 + 1))} active
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
