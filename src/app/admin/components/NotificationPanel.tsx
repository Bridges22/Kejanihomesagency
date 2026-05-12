'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Bell, Info, AlertTriangle, MessageSquare, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await adminService.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark read');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'REPORT': return <AlertTriangle className="text-rose-500" size={16} />;
      case 'MESSAGE': return <MessageSquare className="text-blue-500" size={16} />;
      case 'LISTING_PENDING': return <Clock className="text-amber-500" size={16} />;
      default: return <Info className="text-slate-500" size={16} />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <Bell size={16} className="text-teal-600" />
          Alert Center
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {notifications.filter(n => !n.is_read).length} New
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Checking for alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle className="text-slate-100" size={48} />
            <p className="text-sm font-medium text-slate-400">All clear! No new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 hover:bg-slate-50 transition-colors flex gap-4 relative group ${!n.is_read ? 'bg-teal-50/20' : ''}`}
                onClick={() => handleMarkRead(n.id)}
              >
                {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />}
                <div className="mt-1 flex-shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.content}</p>
                  {n.link && (
                    <Link 
                      href={n.link} 
                      onClick={(e) => { e.stopPropagation(); onClose(); }}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:underline uppercase tracking-widest pt-1"
                    >
                      View Details
                      <ArrowRight size={10} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
        <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
          View Audit History
        </button>
      </div>
    </div>
  );
}
