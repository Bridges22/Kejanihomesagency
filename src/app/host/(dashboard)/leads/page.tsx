'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Calendar, Home, Loader2 } from 'lucide-react';
import { hostService } from '@/services/hostService';
import { createClient } from '@/lib/supabase/client';

const statusStyles = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-teal-50 text-teal-700',
  viewing: 'bg-amber-50 text-amber-700',
  closed: 'bg-slate-100 text-slate-500',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      const data = await hostService.getHostLeads(user.id);
      setLeads(data || []);
    } catch (err) {
      console.error('Failed to load leads', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = leads.filter(l => 
    l.seeker?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads & Inquiries</h1>
        <p className="text-sm text-slate-500">Seekers who have viewed your property contact details.</p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
            placeholder="Search by name or property..."
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <select className="bg-transparent outline-none border-none cursor-pointer">
              <option>All statuses</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Viewing</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-teal-50 shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-teal-50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seeker</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <Loader2 className="h-6 w-6 text-teal-500 animate-spin mx-auto" />
                  <p className="mt-2 text-sm text-slate-500">Loading leads...</p>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-sm font-medium">
                  No leads found. When seekers view your contact details, they'll appear here.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const status = lead.payment_status === 'completed' ? 'new' : lead.payment_status;
                return (
                  <tr key={lead.id} className="hover:bg-teal-50/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">{lead.seeker?.full_name || 'Anonymous'}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{lead.seeker?.email}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium whitespace-nowrap">
                        <Home size={12} className="text-slate-400" />
                        {lead.listing?.title}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <Calendar size={12} />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusStyles[status as keyof typeof statusStyles] || statusStyles['new']}`}>
                        {status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <select className="p-1 px-2 text-[10px] font-bold bg-slate-50 border border-slate-100 rounded-lg text-slate-600 outline-none hover:bg-white hover:border-teal-200 transition-all cursor-pointer shadow-sm">
                        <option value="new" selected={status === 'new'}>New</option>
                        <option value="contacted">Contacted</option>
                        <option value="viewing">Viewing</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
