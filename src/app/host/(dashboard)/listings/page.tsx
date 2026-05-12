'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, MoreVertical, Edit2, TrendingUp, Users, MapPin, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { hostService } from '@/services/hostService';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ListingsManagerPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchListings = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      const data = await hostService.getHostListings(user.id);
      setListings(data || []);
    } catch (err) {
      console.error('Failed to load listings', err);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.area?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Property listings</h1>
        <p className="text-sm text-slate-500">Manage all agent-owned properties across the Kenyan coast.</p>
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
            placeholder="Search by name or area..."
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 text-xs font-bold bg-white border border-slate-100 rounded-xl text-slate-600 outline-none">
            <option>All types</option>
            <option>Long-term</option>
            <option>Short stay</option>
          </select>
          <Link href="/host/listings/new" className="flex items-center gap-2 bg-teal-800 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-teal-900/10 active:scale-95">
            <Plus size={18} />
            Add listing
          </Link>
        </div>
      </div>

      {/* Listings Datatable */}
      <div className="bg-white rounded-3xl border border-teal-50 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-teal-50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-6 border-b border-slate-50">
                    <div className="h-4 bg-slate-100 rounded-full w-48 mb-2" />
                    <div className="h-3 bg-slate-50 rounded-full w-24" />
                  </td>
                </tr>
              ))
            ) : filteredListings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-slate-400 text-sm font-medium">
                  No properties found. List your first coastal home!
                </td>
              </tr>
            ) : (
              filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-teal-50/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">{listing.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{listing.currency} {(listing.type === 'rental' ? listing.price_per_month : listing.price_per_night)?.toLocaleString()}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <MapPin size={12} className="text-slate-400" />
                      {listing.area}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {listing.type === 'rental' ? 'Long-term' : 'Short stay'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      listing.status === 'active' 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Eye size={14} className="text-slate-400" />
                      {listing.view_count || 0}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/listing-detail/${listing.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:bg-white hover:text-teal-600 transition-all shadow-sm"
                        title="View public listing"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link 
                        href={`/host/listings/edit/${listing.id}`}
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:bg-white hover:text-amber-600 transition-all shadow-sm"
                        title="Edit property"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button 
                        onClick={() => toast.info('Promotion features coming soon!')}
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:bg-white hover:text-purple-600 transition-all shadow-sm"
                        title="Feature this listing"
                      >
                        <TrendingUp size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
