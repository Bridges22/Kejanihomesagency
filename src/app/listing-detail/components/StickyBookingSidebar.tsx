'use client';

import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Eye, CreditCard, Smartphone, AlertCircle, Check, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentService';

interface StickyBookingSidebarProps {
  listing: any;
}

export default function StickyBookingSidebar({ listing }: StickyBookingSidebarProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [booking, setBooking] = useState(false);

  // Always unlocked now as per new free-to-view policy
  const unlocked = true;
  const checking = false;
  const showPaywall = false;
  const unlocking = false;
  const paymentMethod = 'mpesa';
  const phoneNumber = '';

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isSale = listing.category === 'Sale' || listing.category === 'Land' || (listing.category === 'Commercial' && listing.listing_type_detailed === 'commercial_sale') || listing.listing_type === 'sale';
  const isRental = listing.category === 'Rental' || (listing.category === 'Commercial' && listing.listing_type_detailed === 'commercial_rent') || listing.listing_type === 'rental';
  const isAirbnb = !isSale && !isRental; // fallback

  const nightlyRate = listing.price_per_night ?? listing.price ?? 0;
  const platformFee = Math.round(nightlyRate * nights * 0.1);
  const total = nightlyRate * nights + platformFee;

  const handleUnlock = async () => {
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    // setUnlocking(true);
    try {
      if (paymentMethod === 'mpesa') {
        await paymentService.triggerStkPush(phoneNumber, listing.unlockFee, listing.id);
        toast.info('STK Push sent! Please enter your PIN on your phone.');
        
        // In a real app, we would poll or wait for a webhook
        // For now, we simulate the wait for the STK confirmation
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 5000)),
          {
            loading: 'Waiting for payment confirmation...',
            success: () => {
              // setUnlocked(true);
              // setShowPaywall(false);
              return 'Listing unlocked! Contact details revealed.';
            },
            error: 'Payment failed or timed out. Please try again.',
          }
        );
      } else {
        // Mock card payment
        await new Promise(r => setTimeout(r, 2000));
        // setUnlocked(true);
        // setShowPaywall(false);
        toast.success('Listing unlocked! Contact details revealed.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment failed');
    } finally {
      // setUnlocking(false);
    }
  };

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (!guestName || !guestPhone) {
      toast.error('Please provide your name and phone number');
      return;
    }
    
    setBooking(true);
    try {
      const { bookingsService } = await import('@/services/bookingsService');
      await bookingsService.createBooking({
        listing_id: listing.id,
        guest_name: guestName,
        guest_email: guestEmail || 'Not provided',
        guest_phone: guestPhone,
        check_in_date: checkIn,
        check_out_date: checkOut,
        guests_count: guests,
        price_per_night: nightlyRate,
        total_amount: total
      });
      toast.success('Booking confirmed! The host has been notified.');
      // Optional: reset form
      setCheckIn('');
      setCheckOut('');
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit booking');
    } finally {
      setBooking(false);
    }
  };

  if (checking) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-10 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Verifying access...</p>
      </div>
    );
  }

  if (isSale) {
    const salePrice = listing.sale_price ?? listing.land_price ?? listing.commercial_sale_price ?? listing.total_price ?? listing.price ?? 0;
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {/* Price Header */}
        <div className="p-5 border-b border-gray-50 bg-teal-50/30">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="font-display text-3xl font-black text-gray-900 tabular-nums">
              {listing.currency} {salePrice.toLocaleString()}
            </span>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Price</p>
        </div>

        {/* Contact Section */}
        <div className="p-5">
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">📞 Agent Phone</div>
                <div className="font-display text-sm font-bold text-gray-900">{listing.agent?.phone || listing.agent_phone || 'Not provided'}</div>
              </div>
              {(listing.agent?.email || listing.agent_email) && (
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">📧 Email Address</div>
                  <div className="font-display text-sm font-bold text-gray-900">{listing.agent?.email || listing.agent_email}</div>
                </div>
              )}
            </div>

            {(listing.agent?.phone || listing.agent_phone) ? (
              <div className="grid grid-cols-1 gap-2">
                <a
                  href={`tel:${listing.agent?.phone || listing.agent_phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl transition-all duration-150 shadow-lg shadow-teal-600/10 active:scale-[0.98]"
                >
                  📞 Call Agent Now
                </a>
                {(listing.agent?.whatsapp || listing.agent_whatsapp) && (
                  <a
                    href={`https://wa.me/${(listing.agent?.whatsapp || listing.agent_whatsapp).replace(/\+/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all duration-150 shadow-lg shadow-green-500/10 active:scale-[0.98]"
                  >
                    💬 WhatsApp Agent
                  </a>
                )}
              </div>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all duration-150 shadow-lg active:scale-[0.98]">
                ✉️ Send Inquiry
              </button>
            )}

            <p className="text-xs text-center text-gray-400 leading-relaxed mt-2">
              Interested in this {listing.property_category === 'Land' ? 'plot' : 'property'}? Contact the agent directly to negotiate or arrange a viewing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isRental) {
    const rentPrice = listing.price_per_month ?? listing.commercial_rent_price ?? listing.pricePerMonth ?? listing.price ?? 0;
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {/* Price Header */}
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="font-display text-3xl font-black text-gray-900 tabular-nums">
              {listing.currency} {rentPrice.toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm font-semibold">/month</span>
          </div>
          {listing.avgRating && listing.avgRating > 0 ? (
            <div className="flex items-center gap-2">
              <div className="bg-teal-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center justify-center tabular-nums">
                {(listing.avgRating * 2).toFixed(1)}
              </div>
              <span className="text-xs font-bold text-gray-900">Very Good</span>
              <span className="text-xs text-gray-400">· {listing.reviewCount || listing.review_count || 0} reviews</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">No reviews yet</span>
          )}
        </div>

        {/* Unlock Section */}
        <div className="p-5">
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
              <AlertCircle size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-teal-800 leading-relaxed">
                <span className="font-bold uppercase tracking-wider block mb-1">Viewing Fee Information</span>
                A small viewing fee applies if you request a physical tour with the agent. 
                {listing.viewingFee ? (
                  <> The fee for this property is <span className="font-bold">KES {listing.viewingFee}</span>.</>
                ) : (
                  <> Please confirm the exact fee amount with the agent when contacting them.</>
                )}
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">📞 Agent Phone</div>
                  <div className="font-display text-sm font-bold text-gray-900">{listing.agent?.phone || listing.agent_phone || 'Not provided'}</div>
                </div>
                {(listing.agent?.email || listing.agent_email) && (
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">📧 Email Address</div>
                    <div className="font-display text-sm font-bold text-gray-900">{listing.agent?.email || listing.agent_email}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">📍 Exact Location</div>
                  <div className="font-display text-sm font-bold text-gray-900">
                    {listing.street_name || listing.area}, {listing.city || listing.cities?.name}
                  </div>
                </div>
                {(listing.viewing_instructions || listing.landmark) && (
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">🗓️ Viewing Instructions</div>
                    <div className="text-sm text-gray-600">{listing.viewing_instructions || listing.landmark}</div>
                  </div>
                )}
              </div>

              {(listing.agent?.phone || listing.agent_phone) && (
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href={`tel:${listing.agent?.phone || listing.agent_phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl transition-all duration-150 shadow-lg shadow-teal-600/10 active:scale-[0.98]"
                  >
                    📞 Call Agent Now
                  </a>
                  {(listing.agent?.whatsapp || listing.agent_whatsapp) && (
                    <a
                      href={`https://wa.me/${(listing.agent?.whatsapp || listing.agent_whatsapp).replace(/\+/g, '')}`}
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all duration-150 shadow-lg shadow-green-500/10 active:scale-[0.98]"
                    >
                      💬 WhatsApp Agent
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Airbnb booking widget
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {/* Price Header */}
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="font-display text-3xl font-black text-gray-900 tabular-nums">
              {listing.currency} {nightlyRate.toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm font-semibold">/night</span>
          </div>
          {listing.avgRating && listing.avgRating > 0 ? (
            <div className="flex items-center gap-2">
              <div className="bg-teal-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center justify-center tabular-nums">
                {(listing.avgRating * 2).toFixed(1)}
              </div>
              <span className="text-xs font-bold text-gray-900">Very Good</span>
              <span className="text-xs text-gray-400">· {listing.reviewCount || listing.review_count || 0} reviews</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">No reviews yet</span>
          )}
        </div>

      <div className="p-5 space-y-4">
        {/* Date pickers */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="input-field text-sm py-2.5"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="input-field text-sm py-2.5"
            />
          </div>
        </div>

        {/* Guests selector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Guests</label>
          <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl">
            <span className="text-sm text-gray-700">{guests} guest{guests !== 1 ? 's' : ''}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors text-lg leading-none"
              >
                −
              </button>
              <span className="font-semibold text-gray-800 w-4 text-center tabular-nums">{guests}</span>
              <button
                onClick={() => setGuests(Math.min(listing.max_guests || listing.maxGuests || 1, guests + 1))}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Max {listing.max_guests || listing.maxGuests || 1} guests</p>
        </div>

        {/* Contact details */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Guest Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="input-field text-sm py-2.5 w-full border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Phone</label>
              <input
                type="tel"
                placeholder="07XX..."
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="input-field text-sm py-2.5 w-full border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="Optional"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="input-field text-sm py-2.5 w-full border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        {nights > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 animate-fade-in">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                {listing.currency} {(listing.pricePerNight ?? 0).toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
              </span>
              <span className="font-medium text-gray-800 tabular-nums">
                {listing.currency} {(nightlyRate * nights).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Platform fee (10%)</span>
              <span className="font-medium text-gray-800 tabular-nums">
                {listing.currency} {platformFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-teal-600 tabular-nums">
                {listing.currency} {total.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Book CTA */}
        <button
          onClick={handleBook}
          disabled={booking}
          className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-rose-500/20 text-base"
        >
          {booking ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Confirming booking...
            </>
          ) : (
            <>🌟 Book Now</>
          )}
        </button>

        <p className="text-xs text-center text-gray-400">You won&apos;t be charged yet</p>

        {/* Trust signals */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Free cancellation up to 48 hours before check-in. After that, the first night is non-refundable.
          </p>
        </div>
      </div>
    </div>
  );
}