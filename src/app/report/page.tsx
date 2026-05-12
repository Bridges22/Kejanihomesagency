'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Flag, Send, CheckCircle2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';

export default function ReportListingPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [listingId, setListingId] = useState('');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.submitReport({
        listing_id: listingId,
        reason,
        evidence
      });
      setSubmitted(true);
      toast.error('Listing flagged for immediate review.', {
        description: 'Our security team has received your report.',
        icon: <ShieldAlert className="text-rose-500" />
      });
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-rose-50 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-rose-100/50 -skew-x-12 translate-x-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 shadow-lg shadow-rose-500/20">
              <AlertTriangle size={14} />
              Trust & Safety
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Report a <span className="text-rose-600 underline decoration-rose-200 underline-offset-8">Listing</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8">
              If you have seen a listing on Kejani Homes that looks fake, suspicious, or dishonest — please report it. Your report helps us keep the platform safe and trustworthy for everyone.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                Verified Review within 24h
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                Immediate Action on Fraud
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8 uppercase tracking-widest">When Should You <span className="text-rose-600">Report?</span></h2>
              <div className="space-y-4">
                {[
                  'The property does not exist or is already rented/sold.',
                  'Photos or description do not match the actual property.',
                  'Price is suspiciously low compared to the area.',
                  'Agent is asking for money BEFORE viewing.',
                  'Contact details are fake or unreachable.',
                  'Listing contains offensive or inappropriate content.'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldAlert size={14} />
                    </div>
                    <p className="text-sm font-bold text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-[40px] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldAlert size={120} />
              </div>
              <h3 className="text-xl font-black text-rose-400 uppercase tracking-widest mb-6 relative z-10">What Happens Next?</h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">1</div>
                  <p className="text-sm text-slate-300 font-medium">Our admin team will review the listing within <span className="text-white font-black">24 hours</span>.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">2</div>
                  <p className="text-sm text-slate-300 font-medium">If found to be fake or dishonest, the listing is <span className="text-white font-black">removed immediately</span>.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">3</div>
                  <p className="text-sm text-slate-300 font-medium">Agents who break terms may face <span className="text-white font-black">permanent account suspension</span>.</p>
                </li>
              </ul>
              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Anonymous Reporting</p>
                <p className="text-xs text-slate-400 leading-relaxed">You can report a listing without giving your name, but providing your email helps us follow up with the outcome.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-8 lg:p-16 relative overflow-hidden border-t-4 border-t-rose-500">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-20">
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center animate-pulse">
                <ShieldAlert size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Report Received</h2>
                <p className="text-slate-500 font-medium max-w-sm">Thank you for your vigilance. Our administrators will review this property and take appropriate action within 4 hours.</p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 bg-slate-900 text-white font-black px-10 py-4 rounded-2xl hover:bg-rose-600 transition-all"
              >
                File Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Listing Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <Flag className="text-rose-500" size={20} />
                  Listing Information
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Property URL or ID</label>
                    <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. /search-results/luxury-villa-diani"
                        value={listingId}
                        onChange={(e) => setListingId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Type */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Reason for Reporting</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Fraudulent / Scam',
                    'Inaccurate Photos',
                    'Incorrect Location',
                    'Incorrect Pricing',
                    'Unresponsive Host',
                    'Inappropriate Content',
                    'Off-platform Payment Request'
                  ].map((r) => (
                    <label key={r} className="relative flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:border-rose-200 hover:bg-rose-50/30 transition-all group">
                      <input 
                        type="radio" 
                        name="reason" 
                        value={r} 
                        checked={reason === r}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-5 h-5 accent-rose-500" 
                        required 
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Comments */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Detailed Evidence</h3>
                <textarea 
                  required 
                  rows={5}
                  placeholder="Please describe exactly what is wrong with this listing. Be as specific as possible to help our team investigate."
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all font-medium resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-rose-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Urgent Report
                      <ShieldAlert size={20} />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
                  False reporting may lead to account suspension.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
