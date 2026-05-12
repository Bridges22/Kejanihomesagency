'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  User, 
  Home, 
  Shield, 
  AlertCircle,
  Clock,
  Search,
  RefreshCw
} from 'lucide-react';
import { auditService } from '@/services/auditService';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await auditService.getRecentLogs();
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Audit Trail</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time log of every action taken across the Kejani Homes platform.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw size={20} className={`text-slate-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-teal-400" />
            <span className="font-black uppercase tracking-widest text-sm">Live Event Feed</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded">
            Auto-refresh enabled
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading && logs.length === 0 ? (
            <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              Streaming System Logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-20 text-center">
              <Shield className="w-12 h-12 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">No events recorded yet.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className="mt-1">
                  {log.action.includes('LISTING') ? (
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Home size={18} />
                    </div>
                  ) : log.action.includes('USER') ? (
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                      <User size={18} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                      <Activity size={18} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-slate-900 text-sm">{log.action}</span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                      <Clock size={10} />
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    Action by <span className="text-slate-900 font-bold">{log.user_email}</span>
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 overflow-x-auto">
                    <pre className="text-[10px] text-slate-600 font-mono">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
