'use client';

import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Loader2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { bookingsService } from '@/services/bookingsService';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsService.getAllBookings();
      setBookings(data || []);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await bookingsService.updateStatus(id, newStatus);
      toast.success(`Booking ${newStatus}`);
      fetchBookings(); // Refresh data
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.listings?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guest_phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reservations</h2>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor all property bookings across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total:</span>
            <span className="text-sm font-black text-slate-900">{filteredBookings.length}</span>
          </div>
        </div>
      </header>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by guest name, phone, or property..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button 
            onClick={fetchBookings}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Loader2 className={`w-5 h-5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property & Stay</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <Loader2 className="w-10 h-10 text-slate-200 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Bookings...</p>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <p className="text-slate-400 font-bold text-sm">No bookings found.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className="text-sm font-black text-slate-900">{booking.guest_name}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 ml-5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Phone size={10} /> {booking.guest_phone}
                          </div>
                          {booking.guest_email && booking.guest_email !== 'Not provided' && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Mail size={10} /> {booking.guest_email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{booking.listings?.title}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Calendar size={10} /> {new Date(booking.check_in_date).toLocaleDateString()} – {new Date(booking.check_out_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-black text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                             {booking.guests_count} Guests
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">
                          KES {(booking.total_amount || booking.total_price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          KES {booking.price_per_night?.toLocaleString()} / night
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {booking.status === 'confirmed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-100 shadow-sm">
                          <CheckCircle size={12} /> Confirmed
                        </span>
                      ) : booking.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-wider border border-rose-100 shadow-sm">
                          <XCircle size={12} /> Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider border border-amber-100 shadow-sm">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                              title="Confirm Booking"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                              title="Cancel Booking"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <Link 
                          href={`/admin/listings?search=${booking.listings?.title}`}
                          className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          title="View Listing"
                        >
                          <ExternalLink size={16} />
                        </Link>
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
