'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, AlertCircle, Utensils, Home, 
  ExternalLink, Layers, Building, MapPin, Calendar, 
  ShieldCheck, Smartphone, Mail, User, Info, Phone
} from 'lucide-react';

interface ListingDescriptionProps {
  listing: any;
}

export default function ListingDescription({ listing }: ListingDescriptionProps) {
  const [descExpanded, setDescExpanded] = useState(false);

  const SHORT_LENGTH = 300;
  const description = listing.description || '';
  const isLong = description.length > SHORT_LENGTH;
  const displayedText = descExpanded || !isLong
    ? description
    : description.slice(0, SHORT_LENGTH) + '...';

  return (
    <div className="border-t border-gray-100 pt-8 space-y-10">
      
      {/* Structural Stats Grid */}
      {listing.property_category !== 'Land' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Kitchens', value: listing.kitchens, icon: Utensils },
            { label: 'Toilets', value: listing.toilets, icon: Info },
            { label: 'Balconies', value: listing.balconies, icon: ExternalLink },
            { label: 'Parking', value: listing.parking_spaces, icon: MapPin },
            { label: 'Floor No', value: listing.floor, icon: Layers },
            { label: 'Total Floors', value: listing.totalFloors, icon: Building },
            { label: 'Year Built', value: listing.year_built, icon: Calendar },
            { label: 'Condition', value: listing.property_condition, icon: SparkleIcon },
          ].filter(i => i.value).map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center text-center space-y-1 hover:shadow-sm transition-shadow">
              <stat.icon size={18} className="text-teal-600 mb-1" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="text-sm font-bold text-slate-900 capitalize">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <div>
        <h2 className="font-display text-xl font-bold text-gray-900 mb-4">About this listing</h2>
        {listing.short_description && (
          <p className="text-teal-800 font-bold text-sm mb-4 italic italic">"{listing.short_description}"</p>
        )}
        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {displayedText}
        </div>
        {isLong && (
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            {descExpanded ? <>Show less <ChevronUp size={15} /></> : <>Read more <ChevronDown size={15} /></>}
          </button>
        )}
      </div>

      {/* Specific Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dynamic Category Specs */}
        <div className={`p-6 rounded-[32px] border ${
          listing.category === 'Sale' || listing.category === 'Land' || listing.category === 'Commercial' ? 'bg-teal-50/50 border-teal-100' : 
          listing.category === 'Airbnb' ? 'bg-rose-50 border-rose-100' : 'bg-blue-50 border-blue-100'
        }`}>
          <h3 className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${
            listing.category === 'Sale' || listing.category === 'Land' || listing.category === 'Commercial' ? 'text-teal-900' : 
            listing.category === 'Airbnb' ? 'text-rose-900' : 'text-blue-900'
          }`}>
            <AlertCircle size={16} />
            {listing.category === 'Airbnb' ? 'Short Stay Particulars' : 
             listing.category === 'Land' ? 'Land Particulars' :
             listing.category === 'Sale' || listing.category === 'Commercial' ? 'Sale/Commercial Particulars' : 'Rental Terms'}
          </h3>
          
          <div className="grid grid-cols-2 gap-y-4">
            {listing.category === 'Rental' && (
              <>
                <DetailItem label="Security Deposit" value={listing.deposit ? listing.deposit : `${listing.depositMonths} Months`} />
                <DetailItem label="Lease Period" value={listing.lease_duration || listing.lease_period || 'Negotiable'} />
                <DetailItem label="Service Charge" value={listing.service_charge_included ? 'Included' : 'Not Included'} />
                <DetailItem label="Available From" value={listing.available_from || 'Immediately'} />
              </>
            )}
            {(listing.category === 'Airbnb' || listing.category === 'Short Stay' || listing.listing_type === 'airbnb') && (
              <>
                <DetailItem label="Check-in Time" value={listing.check_in_time || '2:00 PM'} />
                <DetailItem label="Check-out Time" value={listing.check_out_time || '10:00 AM'} />
                <DetailItem label="Max Guests" value={listing.maxGuests || 'Not specified'} />
              </>
            )}
            {(listing.category === 'Sale' || listing.category === 'Commercial' || listing.category === 'Land' || listing.listing_type === 'sale') && (
              <>
                <DetailItem label="Title Deed" value={listing.title_deed_status || (listing.has_title_deed ? 'Available' : 'Pending')} />
                <DetailItem label="Tenure" value={listing.tenure_type} />
                <DetailItem label="Lease Remaining" value={listing.remaining_lease_years ? `${listing.remaining_lease_years} Years` : 'N/A'} />
                <DetailItem label="Property Condition" value={listing.property_condition} />
              </>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 rounded-[32px] border bg-slate-50 border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={16} className="text-slate-400" />
            Contact Information
          </h3>
          {listing.agent?.show_contact ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <User size={14} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Listed by</div>
                  <div className="text-xs font-bold text-slate-900">{listing.agent?.name} {listing.agent?.agency && `(${listing.agent.agency})`}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                {listing.agent?.phone && (
                  <a href={`tel:${listing.agent.phone}`} className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700">
                    <PhoneCallIcon size={14} /> Call
                  </a>
                )}
                {listing.agent?.whatsapp && (
                  <a href={`https://wa.me/${listing.agent.whatsapp}`} className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700">
                    <Smartphone size={14} /> WhatsApp
                  </a>
                )}
                {listing.agent?.email && (
                  <a href={`mailto:${listing.agent.email}`} className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700">
                    <Mail size={14} /> Email
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contact details are private</p>
              <button className="px-6 py-2 rounded-xl bg-teal-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-teal-700 transition-all">
                Send Inquiry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* House Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {listing.property_category !== 'Land' && (
            <>
              <h3 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-teal-600" />
                House Rules
              </h3>
              <ul className="space-y-3">
                {(listing.rules || ['No specific rules provided.']).map((rule: string, i: number) => (
                  <li key={`rule-${i}`} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 text-xs text-gray-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-[10px] font-bold text-teal-600 shrink-0">
                      {i + 1}
                    </div>
                    {rule}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Nearby Landmarks */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={20} className="text-rose-500" />
            Nearby Landmarks
          </h3>
          <div className="space-y-3">
            {/* Display multiple landmarks from amenities_config */}
            {(() => {
              const landmarkList = [
                { id: 'Diani Beach Hospital', label: 'Diani Beach Hospital', icon: '🏥' },
                { id: 'Colobus Conservation', label: 'Colobus Conservation', icon: '🐒' },
                { id: 'KFI Supermarket', label: 'KFI Supermarket', icon: '🛒' }
              ].filter(item => listing.amenities?.[item.id]);

              if (landmarkList.length === 0 && !listing.landmark) {
                return <p className="text-xs text-slate-400 italic">No landmarks selected.</p>;
              }

              return (
                <>
                  {listing.landmark && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                        <Building size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Landmark</div>
                        <div className="text-sm font-bold text-slate-900">{listing.landmark}</div>
                      </div>
                    </div>
                  )}
                  {landmarkList.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                        <span className="text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nearby Landmark</div>
                        <div className="text-sm font-bold text-slate-900">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

function NearbyPlace({ icon, label, dist }: { icon: string, label: string, dist: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all">
      <div className="flex items-center gap-3">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-bold text-slate-700">{label}</span>
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase">{dist}</span>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: any }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
      <div className="text-sm font-bold text-slate-900 capitalize">{value}</div>
    </div>
  );
}

function SparkleIcon({ size, className }: { size: number, className?: string }) {
  return <div className={className}><span style={{ fontSize: size }}>✨</span></div>;
}

function PhoneCallIcon({ size, className }: { size: number, className?: string }) {
  return <Phone size={size} className={className} />;
}