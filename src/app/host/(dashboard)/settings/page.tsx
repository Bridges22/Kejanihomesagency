'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  Wallet, 
  KeyRound, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Zap,
  Settings,
  Lock,
  Loader2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('agency');
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        setUser(data?.user);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  const tabs = [
    { id: 'agency', label: 'Agency Profile', icon: Building, color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: 'account', label: 'Agent Account', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'billing', label: 'Billing & Payouts', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 backdrop-blur-xl relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-grid-slate-800/5 [background-size:100px_100px] animate-pulse" />
      </div>

      <div className="relative z-10 space-y-8 p-6 lg:p-12 animate-in fade-in duration-1000">
        {/* Premium Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-3xl bg-white/80 border border-white/60 rounded-[40px] p-8 shadow-2xl shadow-black/5"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight mb-2">
                Control Center
              </h1>
              <p className="text-lg font-medium text-slate-500">Configure your agency and agent profile settings.</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-teal-500/20">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-[32px] transition-all font-bold text-sm ${
                    isActive 
                      ? 'bg-white border border-slate-100 shadow-xl text-slate-900' 
                      : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isActive ? `${tab.bg} ${tab.color} shadow-sm` : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon size={22} />
                  </div>
                  <span className="flex-1 text-left">{tab.label}</span>
                  {isActive && <ChevronRight size={16} className="text-slate-300" />}
                </button>
              );
            })}
          </aside>

          {/* Content Area */}
          <main className="flex-1 bg-white/80 backdrop-blur-xl rounded-[48px] border border-white/50 shadow-2xl shadow-black/5 p-8 lg:p-12 min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === 'agency' && (
                <motion.div
                  key="agency"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agency Profile</h2>
                    <p className="text-slate-500 font-medium">Manage your official business identification and contact info.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Agency Name</label>
                        <input 
                          type="text" 
                          defaultValue="Kejani Homes Agency Ltd" 
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-8 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-base font-bold text-slate-800"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                        <input 
                          type="email" 
                          defaultValue="support@kejanihomes.co.ke" 
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-8 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-base font-bold text-slate-800"
                        />
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-slate-900 text-white font-black text-base py-6 rounded-3xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                      {isSaving ? 'Updating...' : 'Save Agency Profile'}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agent Account</h2>
                    <p className="text-slate-500 font-medium">Manage your personal agent identity and permissions.</p>
                  </div>

                  <div className="bg-blue-50/50 p-8 rounded-[40px] border border-blue-100/50 flex gap-6 items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-md">
                      <Shield size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">System Administrator</h3>
                      <p className="text-blue-800 font-medium">Active session: <span className="underline">{user?.email || 'Loading...'}</span></p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" 
                          defaultValue={user?.user_metadata?.full_name || 'Agent'} 
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-base font-bold text-slate-800"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Agent Phone</label>
                        <input 
                          type="tel" 
                          defaultValue="+254 700 000 000" 
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-base font-bold text-slate-800"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleSave}
                      className="w-full bg-blue-600 text-white font-black text-base py-6 rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                    >
                      Update Profile
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security</h2>
                    <p className="text-slate-500 font-medium">Protect your account with enterprise security tools.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-8 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-base font-bold"
                      />
                    </div>
                    <button 
                      onClick={handleSave}
                      className="w-full bg-purple-600 text-white font-black text-base py-6 rounded-3xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20"
                    >
                      Change Password
                    </button>
                  </div>
                </motion.div>
              )}

              {(activeTab === 'billing' || activeTab === 'notifications') && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-20 space-y-6"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-[40px] flex items-center justify-center text-slate-300 border border-white">
                    <ShieldAlert size={48} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Phase 2 Module</h3>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">This configuration panel will be activated in the next system update.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
