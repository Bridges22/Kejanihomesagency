'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  User, 
  MapPin, 
  Clock, 
  Loader2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminModerationPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isModerating, setIsModerating] = useState(false);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPendingApprovals();
      setListings(data || []);
    } catch (err) {
      toast.error('Failed to load pending listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleDecision = async (id: string, status: 'approved' | 'rejected' | 'changes_requested') => {
    if ((status === 'rejected' || status === 'changes_requested') && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection or change request');
      return;
    }

    try {
      setIsModerating(true);
      await adminService.moderateListing(id, status, rejectionReason);
      toast.success(`Listing ${status === 'approved' ? 'Approved' : 'Updated'} successfully`);
      setRejectionReason('');
      setSelectedListing(null);
      fetchPending();
    } catch (err) {
      toast.error('Moderation failed');
    } finally {
      setIsModerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Property Moderation</h2>
        </div>
        <p className="text-slate-500 font-medium">Review and verify new properties before they go live on the platform.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Queue */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending Queue</span>
            <span className="px-2.5 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-full">
              {listings.length} Items
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
              <Loader2 className="w-8 h-8 text-slate-200 animate-spin mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Scanning Database...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed text-center px-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Queue Empty</h3>
              <p className="text-slate-500 text-sm mt-1">All properties have been reviewed. Great job!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => setSelectedListing(listing)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedListing?.id === listing.id 
                    ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 translate-x-1' 
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedListing?.id === listing.id ? 'text-slate-400' : 'text-teal-600'}`}>
                      {listing.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                      <Clock size={10} /> {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className={`font-black text-sm mb-2 line-clamp-1 ${selectedListing?.id === listing.id ? 'text-white' : 'text-slate-900'}`}>
                    {listing.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] font-medium text-slate-400">
                    <div className="flex items-center gap-1">
                      <User size={10} /> {listing.host?.full_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={10} /> {listing.area}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Review Workspace */}
        <div className="xl:col-span-2">
          {selectedListing ? (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
              {/* Header */}
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded">Pending Approval</span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-slate-400 text-xs font-bold">ID: {selectedListing.id.slice(0, 8)}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedListing.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/listing-detail/${selectedListing.slug}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Eye size={14} /> Preview Live
                  </Link>
                </div>
              </div>

              {/* Grid Content */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">
                <div className="space-y-6">
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Property Details</h5>
                    <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium text-xs">Category:</span>
                        <span className="text-slate-900 font-bold">{selectedListing.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium text-xs">Pricing:</span>
                        <span className="text-slate-900 font-black">
                          KES {selectedListing.price_per_night?.toLocaleString() || selectedListing.price_per_month?.toLocaleString() || selectedListing.sale_price?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium text-xs">Location:</span>
                        <span className="text-slate-900 font-bold">{selectedListing.area}, {selectedListing.cities?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium text-xs">Specs:</span>
                        <span className="text-slate-900 font-bold">{selectedListing.bedrooms} BR | {selectedListing.bathrooms} Bath</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Host Information</h5>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg">
                        {selectedListing.host?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{selectedListing.host?.full_name}</div>
                        <div className="text-xs text-slate-500 font-medium">{selectedListing.host?.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-2xl shadow-slate-900/30">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Moderation Decision</h5>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-2">Internal Note / Rejection Reason</label>
                        <textarea 
                          placeholder="Why are you rejecting or requesting changes?"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all min-h-[100px] text-white placeholder:text-slate-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button 
                          onClick={() => handleDecision(selectedListing.id, 'approved')}
                          disabled={isModerating}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 transition-all disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} /> Approve
                        </button>
                        <button 
                          onClick={() => handleDecision(selectedListing.id, 'changes_requested')}
                          disabled={isModerating}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-amber-600 transition-all disabled:opacity-50"
                        >
                          <MessageSquare size={16} /> Changes
                        </button>
                        <button 
                          onClick={() => handleDecision(selectedListing.id, 'rejected')}
                          disabled={isModerating}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-rose-600 transition-all disabled:opacity-50"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                    <AlertCircle className="text-blue-500 flex-shrink-0" size={20} />
                    <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                      Approving this property will immediately make it visible to guests in search results and on the homepage. Rejection will notify the host to update the details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border border-slate-100 border-dashed py-32 text-center px-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <ShieldCheck size={40} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-400">Moderation Workspace</h3>
              <p className="text-slate-400 font-medium max-w-xs mt-2">Select a property from the queue on the left to review its details and make an approval decision.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
