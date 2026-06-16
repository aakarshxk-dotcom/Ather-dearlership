'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, MessageSquare, Image, FileText, HelpCircle, Star, Mail, Settings, LogOut, Menu, Bell, X } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/contact', label: 'Contact', icon: MessageSquare },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Admin');
  const [newLeadCount, setNewLeadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.authenticated && d.user) setUserName(d.user.name);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/leads/notifications').then(r => r.json()).then(d => {
      if (d.totalNew !== undefined) {
        setNewLeadCount(d.totalNew);
        setNotifications(d.recentLeads || []);
      }
    }).catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AE</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Ather Energy</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            const showBadge = item.label === 'Leads' && newLeadCount > 0;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
                {showBadge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {newLeadCount > 99 ? '99+' : newLeadCount}
                  </span>
                )}
              </a>
            );
          })}
          <hr className="my-2 border-gray-100" />
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {newLeadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                    {newLeadCount > 9 ? '9+' : newLeadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border z-50">
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold">Notifications</p>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((n: any) => (
                        <a
                          key={n.id}
                          href="/admin/leads"
                          onClick={() => setShowNotifications(false)}
                          className="block p-3 hover:bg-gray-50 border-b last:border-0"
                        >
                          <p className="text-sm font-medium">New Lead: {n.fullName}</p>
                          <p className="text-xs text-gray-500">{n.city}, {n.state}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <a href="/" target="_blank" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">View Site</a>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
