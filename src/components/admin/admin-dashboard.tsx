'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserCheck, UserX, MessageSquare, Mail, RefreshCw, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  approvedLeads: number;
  rejectedLeads: number;
  thisWeek: number;
  thisMonth: number;
  contactMessages: number;
  unreadMessages: number;
  newsletterSubscribers: number;
  conversionRate: string;
}

interface RecentLead {
  id: string;
  fullName: string;
  email: string;
  city: string;
  status: string;
  createdAt: string;
}

const STAT_CARDS = [
  { key: 'totalLeads' as const, label: 'Total Leads', icon: Users, color: 'bg-blue-50 text-blue-600', ring: 'ring-blue-100' },
  { key: 'newLeads' as const, label: 'New Leads', icon: UserPlus, color: 'bg-amber-50 text-amber-600', ring: 'ring-amber-100' },
  { key: 'approvedLeads' as const, label: 'Approved Leads', icon: UserCheck, color: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-100' },
  { key: 'rejectedLeads' as const, label: 'Rejected Leads', icon: UserX, color: 'bg-red-50 text-red-600', ring: 'ring-red-100' },
  { key: 'contactMessages' as const, label: 'Contact Messages', icon: MessageSquare, color: 'bg-purple-50 text-purple-600', ring: 'ring-purple-100' },
  { key: 'newsletterSubscribers' as const, label: 'Newsletter', icon: Mail, color: 'bg-teal-50 text-teal-600', ring: 'ring-teal-100' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    New: 'bg-blue-100 text-blue-700',
    Contacted: 'bg-amber-100 text-amber-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
  };
  return (
    <Badge variant="secondary" className={map[status] || 'bg-gray-100 text-gray-700'}>
      {status}
    </Badge>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  ring,
  index,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  ring: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-[#111827] mt-1">{value.toLocaleString()}</p>
            </div>
            <div className={`h-11 w-11 rounded-xl ring-4 ${ring} flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentLeads(data.recentLeads || []);
        setLastRefresh(new Date());
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-11 w-11 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map((card, i) => (
          <StatCard
            key={card.key}
            label={card.label}
            value={stats?.[card.key] ?? 0}
            icon={card.icon}
            color={card.color}
            ring={card.ring}
            index={i}
          />
        ))}
      </div>

      {/* Conversion rate banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <Card className="border-0 shadow-sm bg-gradient-to-r from-[#059669]/5 to-emerald-50/50">
          <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#059669]/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[#059669]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-xl font-bold text-[#111827]">{stats?.conversionRate ?? '0.0'}%</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span><strong className="text-[#111827]">{stats?.thisWeek ?? 0}</strong> this week</span>
              <span><strong className="text-[#111827]">{stats?.thisMonth ?? 0}</strong> this month</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent leads */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-base font-semibold text-[#111827]">Recent Leads</h2>
              <button
                onClick={fetchDashboard}
                className="text-xs text-gray-400 hover:text-[#059669] flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-t border-gray-100">
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">City</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-sm text-gray-400">
                        No leads yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentLeads.map((lead) => (
                      <TableRow key={lead.id} className="border-gray-50">
                        <TableCell className="font-medium text-[#111827]">{lead.fullName}</TableCell>
                        <TableCell className="text-gray-500 text-sm">{lead.email}</TableCell>
                        <TableCell className="text-gray-500 text-sm hidden sm:table-cell">{lead.city}</TableCell>
                        <TableCell><StatusBadge status={lead.status} /></TableCell>
                        <TableCell className="text-gray-400 text-sm hidden md:table-cell">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Auto-refresh indicator */}
      <p className="text-xs text-gray-400 text-right">
        Auto-refreshes every 30s · Last updated {lastRefresh.toLocaleTimeString()}
      </p>
    </div>
  );
}