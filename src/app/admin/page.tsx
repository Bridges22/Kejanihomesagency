'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Home, 
  Eye, 
  Map, 
  TrendingUp, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { adminService } from '@/services/adminService';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, l] = await Promise.all([
          adminService.getGlobalMetrics(),
          adminService.getAllListings()
        ]);
        setMetrics(m);
        setListings(l);
      } catch (err) {
        console.error('Admin Load Error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: 'Total Listings', value: metrics?.totalListings || 0, icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Agents', value: metrics?.totalUsers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Page Views', value: (metrics?.totalViews || 0).toLocaleString(), icon: Eye, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Active Cities', value: metrics?.totalCities || 0, icon: Map, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h2>
        <p className="text-slate-500 font-medium mt-1">Global statistics and recent activity across Kejani Homes.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full uppercase tracking-wider">
                +12.5%
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Listings Table */}
      <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Recent Listing Submissions</h3>
          <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-4">
            View All Listings
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {listings.slice(0, 10).map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{listing.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{listing.property_category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{listing.host?.full_name || 'Anonymous Agent'}</span>
                      <span className="text-[10px] text-slate-400">{listing.host?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{listing.area}, {listing.cities?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    {listing.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : listing.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-wider">
                        <XCircle size={12} /> Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <MoreVertical size={18} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
