'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  BarChart3,
  Search,
  Bell,
  Activity,
  MessageSquare
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { Toaster } from 'sonner';
import NotificationPanel from './components/NotificationPanel';
import { adminService } from '@/services/adminService';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const fetchUnreadCount = async () => {
    try {
      const data = await adminService.getNotifications();
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    } catch (err) {
      console.error('Failed to fetch count');
    }
  };

  React.useEffect(() => {
    if (isAdmin) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30s
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  React.useEffect(() => {
    async function checkAdmin() {
      // Don't check if we are on login or reset pages
      if (pathname === '/admin/login' || pathname === '/admin/reset-password') {
        setIsAdmin(true); 
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        router.push('/admin/login'); // Redirect to admin login if not authenticated
        return;
      }

      // Check the database role
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const isSuperAdmin = profile?.role === 'admin' || user.email === 'bridgesmwashighadi2@gmail.com';

        if (isSuperAdmin) {
          setIsAdmin(true);
        } else {
          // If they are logged in but NOT an admin, take them to the admin login page
          setIsAdmin(false);
          router.push('/admin/login?error=unauthorized');
        }
      } catch (err) {
        console.error('Security check failed', err);
        setIsAdmin(false);
        router.push('/admin/login');
      }
    }
    checkAdmin();
  }, [pathname, router]);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'All Listings', href: '/admin/listings', icon: Home },
    { label: 'Support Inbox', href: '/admin/messages', icon: MessageSquare },
    { label: 'Flagged Reports', href: '/admin/reports', icon: ShieldCheck },
    { label: 'System Audit', href: '/admin/audit', icon: Activity },
    { label: 'Agents & Users', href: '/admin/users', icon: Users },
    { label: 'Platform Stats', href: '/admin/stats', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (isAdmin === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAdmin === false) return null;

  // If on login or reset page, just show the content without the sidebar
  if (pathname === '/admin/login' || pathname === '/admin/reset-password') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-50">
          <AppLogo />
          <div className="mt-2 px-2 py-1 bg-slate-900 rounded text-[10px] font-bold text-white uppercase tracking-widest inline-block">
            Super Admin
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push('/admin/login');
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search listings, agents, or cities..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>
            <div className="h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-black shadow-xl border-4 border-slate-50">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
          <Toaster position="top-right" richColors />
        </main>
      </div>
    </div>
  );
}
