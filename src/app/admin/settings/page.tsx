'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Globe, 
  Lock, 
  Save,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 font-medium mt-1">Configure global platform behavior and administrative security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* General Configuration */}
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              General Platform Settings
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Platform Name</label>
                  <input 
                    type="text" 
                    defaultValue="Kejani Homes Agency"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Contact Email</label>
                  <input 
                    type="email" 
                    defaultValue="support@kejani-homes.co.ke"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="text-amber-600 mt-0.5" size={18} />
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  <strong>Maintenance Mode:</strong> Enabling this will block public access to the marketplace and show a "Coming Soon" page to all users except Admins.
                </p>
                <div className="ml-auto">
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security & Authentication
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Two-Factor Authentication', desc: 'Require 2FA for all Agent accounts', enabled: false },
                { label: 'Login Notifications', desc: 'Notify Admin of new device logins', enabled: true },
                { label: 'Session Timeout', desc: 'Auto logout after 24 hours of inactivity', enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.label}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-teal-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Admin Profile Summary */}
        <div className="space-y-8">
          <section className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 opacity-50" />
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20 flex items-center justify-center mx-auto mb-6 text-3xl font-black">
                BM
              </div>
              <h3 className="text-xl font-black">Bridges Mwashighadi</h3>
              <p className="text-teal-400 text-xs font-black uppercase tracking-widest mt-1">Super Admin</p>
              
              <div className="mt-8 pt-8 border-t border-white/10 space-y-4 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Account Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Shield size={12} /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Last Password Change</span>
                  <span className="text-white font-bold">May 6, 2026</span>
                </div>
              </div>

              <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                Update Security Key
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
