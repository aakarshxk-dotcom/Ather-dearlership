'use client';

import React, { useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore, type Section } from '@/store/app';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sectionTitles: Record<Section, string> = {
  dashboard: 'Dashboard',
  leads: 'Lead Management',
  dealerships: 'Dealership Network',
  inventory: 'Vehicle Inventory',
  service: 'Service Center',
  customers: 'Customer Portal',
  finance: 'Finance & Billing',
  analytics: 'Analytics & Reports',
  admin: 'Admin Settings',
  'ai-chat': 'AI Assistant',
};

export function Header() {
  const {
    activeSection,
    notifications,
    setNotifications,
    currentUserName,
    currentUserRole,
    setSidebarOpen,
  } = useAppStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.unreadCount || 0);
        }
      } catch {
      }
    }
    fetchNotifications();
  }, [setNotifications]);

  const title = sectionTitles[activeSection];
  const initials = currentUserName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 w-full h-16 glass-panel border-b border-white/[0.06]">
      <div className="flex h-full items-center gap-3 px-4 md:px-5">
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation</span>
          </button>
        )}

        <nav className="hidden sm:flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          <span className="text-muted-foreground">Home</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="font-medium text-premium-silver">{title}</span>
        </nav>

        {isMobile && (
          <h1 className="flex-1 text-sm font-semibold text-premium-silver truncate">
            {title}
          </h1>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search the ecosystem..."
              className={cn(
                'h-9 w-64 lg:w-72 rounded-full pl-9 pr-4 text-sm',
                'bg-white/5 border border-white/10 text-premium-silver placeholder:text-muted-foreground/60',
                'focus:outline-none focus:border-neon-green/30 focus:bg-white/[0.07]',
                'transition-all duration-200'
              )}
            />
          </div>

          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <Bell className="h-4.5 w-4.5" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            )}
            <span className="sr-only">Notifications</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon-green to-neon-cyan p-[1.5px] transition-transform hover:scale-105 focus:outline-none">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-midnight">
                  <span className="text-[10px] font-bold text-premium-silver">
                    {initials}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 glass-panel border-white/[0.08] bg-deep-space/95 backdrop-blur-xl"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-premium-silver">
                    {currentUserName}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {currentUserRole} · admin@atherenergy.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-premium-silver/80 focus:text-premium-silver focus:bg-white/[0.05] cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-premium-silver/80 focus:text-premium-silver focus:bg-white/[0.05] cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem className="text-red-400/80 focus:text-red-400 focus:bg-red-500/5 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
