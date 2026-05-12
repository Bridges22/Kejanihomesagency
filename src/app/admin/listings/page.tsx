'use client';

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MoreVertical,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllListings();
      setListings(data || []);
    } catch (err) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: 'active' | 'rejected') => {
    try {
      await adminService.updateListingStatus(id, newStatus);
      toast.success(`Listing ${newStatus === 'active' ? 'Approved' : 'Rejected'}`);
      fetchListings(); // Refresh data
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this listing? This cannot be undone.')) return;
    try {
      await adminService.deleteListing(id);
      toast.success('Listing deleted successfully');
      fetchListings();
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         l.host?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Property Management</h2>
          <p className="text-slate-500 font-medium mt-1">Review, approve, or moderate all platform listings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total:</span>
            <span className="text-sm font-black text-slate-900">{filteredListings.length}</span>
          </div>
        </div>
      </header>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title or agent name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Live)</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
          <button 
            onClick={fetchListings}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Loader2 className={`w-5 h-5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property & Agent</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location & Type</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <Loader2 className="w-10 h-10 text-slate-200 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Platform Data...</p>
                  </td>
                </tr>
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <p className="text-slate-400 font-bold text-sm">No listings match your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-slate-900 group-hover:text-slate-700 transition-colors">{listing.title}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                            {listing.host?.full_name?.charAt(0) || 'A'}
                          </div>
                          <span className="text-xs font-bold text-slate-400">{listing.host?.full_name || 'Anonymous Agent'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-600">{listing.area}, {listing.cities?.name}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{listing.property_category} • {listing.type}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-slate-900">
                        KES {(listing.total_price || listing.price_per_month || listing.price_per_night || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {listing.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-100 shadow-sm">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : listing.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-wider border border-rose-100 shadow-sm">
                          <XCircle size={12} /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider border border-amber-100 shadow-sm">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2 transition-opacity">
                        <Link 
                          href={`/listing-detail/${listing.slug}`} 
                          target="_blank"
                          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          title="View on site"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        
                        <Link 
                          href={`/host/listings/edit/${listing.id}?admin=true`} 
                          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                          title="Edit Property"
                        >
                          <Eye size={16} />
                        </Link>

                        {listing.status !== 'active' && (
                          <button 
                            onClick={() => handleStatusUpdate(listing.id, 'active')}
                            className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg font-bold text-[10px]"
                            title="Approve"
                          >
                            <CheckCircle size={14} />
                            APPROVE
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(listing.id)}
                          className="p-2 bg-white border border-rose-200 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Delete Listing"
                        >
                          <XCircle size={16} />
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
    </div>
  );
}
