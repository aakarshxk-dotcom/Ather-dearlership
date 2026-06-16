'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  FileText,
  BarChart3,
  Image,
  LogOut,
  Eye,
  Trash2,
  Download,
  Search,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowUpDown,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

function safeData(data: unknown) {
  return JSON.parse(JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? Number(v) : v)));
}

type TabId = 'dashboard' | 'leads' | 'gallery' | 'settings';
type StatusFilter = 'all' | 'new' | 'reviewing' | 'shortlisted' | 'approved' | 'rejected' | 'on_hold';
type GalleryCategory = 'all' | 'Showroom' | 'Interior' | 'Exterior' | 'Events' | 'Team';

interface Lead {
  id: number;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  dob?: string;
  education?: string;
  occupation?: string;
  address?: string;
  city: string;
  state: string;
  pinCode?: string;
  businessExperience?: string;
  investmentCapacity: string;
  landSize?: string;
  preferredLocation?: string;
  timeline?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  approvedLeads: number;
  rejectedLeads: number;
  leadsThisWeek: number;
  conversionRate: string;
  avgInvestment: string;
}

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700' },
  reviewing: { label: 'Reviewing', className: 'bg-amber-100 text-amber-700' },
  shortlisted: { label: 'Shortlisted', className: 'bg-purple-100 text-purple-700' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  on_hold: { label: 'On Hold', className: 'bg-gray-100 text-gray-600' },
};

const TAB_CONFIG: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'leads', label: 'Leads', icon: <Users className="w-4 h-4" /> },
  { id: 'gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <FileText className="w-4 h-4" /> },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'on_hold', label: 'On Hold' },
];

const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Showroom', label: 'Showroom' },
  { value: 'Interior', label: 'Interior' },
  { value: 'Exterior', label: 'Exterior' },
  { value: 'Events', label: 'Events' },
  { value: 'Team', label: 'Team' },
];

const STATUS_CHANGE_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'on_hold', label: 'On Hold' },
];

// ─── LOGIN VIEW ────────────────────────────────────────────────────────────────

function LoginView() {
  const { setAdminAuthenticated, setViewMode } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminAuthenticated(true, data.name);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md w-full"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">AE</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Ather Energy Dealership Admin</h1>
        <p className="text-sm text-slate-500 text-center mb-8">Sign in to manage your Ather Energy Dealership</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setViewMode('home')}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition"
          >
            ← Back to site
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_BADGES[status] || { label: status, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

// ─── OVERVIEW TAB ──────────────────────────────────────────────────────────────

function OverviewTab({
  stats,
  leads,
  onViewLead,
  isLoading,
}: {
  stats: DashboardStats | null;
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  isLoading: boolean;
}) {
  const statCards = [
    {
      label: 'Total Leads',
      value: stats?.totalLeads ?? 0,
      icon: <Users className="w-6 h-6" />,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200',
    },
    {
      label: 'New Leads',
      value: stats?.newLeads ?? 0,
      icon: <Clock className="w-6 h-6" />,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'border-blue-200',
    },
    {
      label: 'Approved',
      value: stats?.approvedLeads ?? 0,
      icon: <UserCheck className="w-6 h-6" />,
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      border: 'border-green-200',
    },
    {
      label: 'Rejected',
      value: stats?.rejectedLeads ?? 0,
      icon: <UserX className="w-6 h-6" />,
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      border: 'border-red-200',
    },
  ];

  const recentLeads = leads.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`premium-card ${card.bg} ${card.border} border rounded-xl p-5 flex items-center gap-4`}
          >
            <div className={`${card.iconBg} ${card.iconColor} p-3 rounded-lg`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Leads this week</p>
              <p className="text-lg font-semibold text-slate-900">{stats.leadsThisWeek}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Conversion rate</p>
              <p className="text-lg font-semibold text-slate-900">{stats.conversionRate}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg investment capacity</p>
              <p className="text-lg font-semibold text-slate-900">{stats.avgInvestment}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Leads Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Leads</h3>
          <span className="text-xs text-slate-400">Last {recentLeads.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">City</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Investment</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{lead.fullName}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{lead.phone}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{lead.city}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{lead.investmentCapacity}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500">{lead.createdAt?.split('T')[0] ?? '—'}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => onViewLead(lead)}
                      className="text-emerald-600 hover:text-emerald-700 transition"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">
                    No leads yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── LEADS TAB ─────────────────────────────────────────────────────────────────

function LeadsTab({
  leads,
  onViewLead,
  onStatusChange,
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onStatusChange: (id: number, status: string) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (f: StatusFilter) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(20);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filteredLeads = leads
    .filter((l) => {
      const matchSearch =
        !searchQuery ||
        l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone.includes(searchQuery) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDir === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const displayedLeads = filteredLeads.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLeads.length;

  const handleExport = async () => {
    try {
      const res = await fetch('/api/leads/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export leads. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
            title="Toggle sort"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortDir === 'desc' ? 'Newest' : 'Oldest'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        Showing {displayedLeads.length} of {filteredLeads.length} leads
      </p>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider w-10">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">City</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">State</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Investment</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedLeads.map((lead, idx) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-sm text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{lead.fullName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.city}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.state}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.investmentCapacity}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{lead.createdAt?.split('T')[0] ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewLead(lead)}
                        className="text-emerald-600 hover:text-emerald-700 transition p-1 rounded hover:bg-emerald-50"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        className="text-xs border border-slate-300 rounded px-1.5 py-1 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        title="Change status"
                      >
                        {STATUS_CHANGE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedLeads.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">
                    {searchQuery || statusFilter !== 'all' ? 'No leads match your filters' : 'No leads yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show More */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + 20)}
            className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Show More ({filteredLeads.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── LEAD DETAIL VIEW ──────────────────────────────────────────────────────────

function LeadDetailView({
  lead,
  onBack,
}: {
  lead: Lead;
  onBack: () => void;
}) {
  const [status, setStatus] = useState(lead.status);
  const [adminNotes, setAdminNotes] = useState(lead.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes, status }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const infoRow = (label: string, value?: string | null, icon?: React.ReactNode) => (
    <div className="flex items-start gap-3 py-2">
      {icon && <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0">
        <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-900 mt-0.5 break-words">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Leads
      </button>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.fullName}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Applied on {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="premium-card bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Personal Information</h3>
          <div className="divide-y divide-slate-100">
            {infoRow('Full Name', lead.fullName, <Users className="w-4 h-4" />)}
            {infoRow('Phone', lead.phone, <Phone className="w-4 h-4" />)}
            {infoRow('WhatsApp', lead.whatsapp, <Phone className="w-4 h-4" />)}
            {infoRow('Email', lead.email, <Mail className="w-4 h-4" />)}
            {infoRow('Date of Birth', lead.dob, <Calendar className="w-4 h-4" />)}
            {infoRow('Education', lead.education)}
            {infoRow('Occupation', lead.occupation)}
          </div>
        </div>

        {/* Business Information */}
        <div className="premium-card bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Business Information</h3>
          <div className="divide-y divide-slate-100">
            {infoRow('Address', lead.address, <MapPin className="w-4 h-4" />)}
            {infoRow('City', lead.city)}
            {infoRow('State', lead.state)}
            {infoRow('PIN Code', lead.pinCode)}
            {infoRow('Business Experience', lead.businessExperience)}
            {infoRow('Investment Capacity', lead.investmentCapacity)}
            {infoRow('Land Size', lead.landSize)}
            {infoRow('Preferred Location', lead.preferredLocation)}
            {infoRow('Timeline', lead.timeline)}
          </div>
        </div>
      </div>

      {/* Admin Section */}
      <div className="premium-card bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Admin</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            >
              {STATUS_CHANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-y"
              placeholder="Add notes about this lead..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Created: {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-IN') : '—'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── GALLERY TAB ───────────────────────────────────────────────────────────────

function GalleryTab({ images, onDelete }: { images: GalleryImage[]; onDelete: (id: number) => void }) {
  const [categoryFilter, setCategoryFilter] = useState<GalleryCategory>('all');

  const filtered = categoryFilter === 'all' ? images : images.filter((img) => img.category === categoryFilter);

  const handleUpload = () => {
    alert('Gallery upload requires admin setup');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                categoryFilter === cat.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleUpload}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
        >
          <Image className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No images in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <div key={img.id} className="premium-card bg-white border border-slate-200 rounded-xl overflow-hidden group">
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {img.imageUrl ? (
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-slate-300" />
                  </div>
                )}
                <button
                  onClick={() => onDelete(img.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-slate-900 truncate">{img.title}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── SETTINGS TAB ──────────────────────────────────────────────────────────────

function SettingsTab() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl">
      {/* Admin Settings */}
      <div className="premium-card bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Admin Settings</h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">Manage your admin account settings and preferences.</p>
            <p className="text-xs text-slate-400 mt-1">Additional settings will be available in future updates.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm font-medium text-slate-700">Notification Preferences</p>
            <p className="text-xs text-slate-400 mt-1">Configure how and when you receive lead notifications.</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="premium-card bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h3>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg mb-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </motion.div>
        )}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Changing...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// ─── MAIN ADMIN PANEL ──────────────────────────────────────────────────────────

export function AdminPanel() {
  const { adminAuthenticated, adminName, setAdminAuthenticated } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leadsRes, dashRes, galleryRes] = await Promise.allSettled([
        fetch('/api/leads'),
        fetch('/api/admin/dashboard'),
        fetch('/api/gallery'),
      ]);

      if (leadsRes.status === 'fulfilled' && leadsRes.value.ok) {
        const data = safeData(await leadsRes.value.json());
        setLeads(Array.isArray(data) ? data : data.leads ?? []);
      }

      if (dashRes.status === 'fulfilled' && dashRes.value.ok) {
        setStats(safeData(await dashRes.value.json()));
      }

      if (galleryRes.status === 'fulfilled' && galleryRes.value.ok) {
        const data = safeData(await galleryRes.value.json());
        setGalleryImages(Array.isArray(data) ? data : data.images ?? []);
      }
    } catch {
      // Silently handle fetch errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminAuthenticated) {
      fetchDashboardData();
    }
  }, [adminAuthenticated, fetchDashboardData]);

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setSelectedLead(null);
    setActiveTab('dashboard');
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      alert('Failed to delete image');
    }
  };

  // ─── LOGIN VIEW
  if (!adminAuthenticated) {
    return <LoginView />;
  }

  // ─── LEAD DETAIL VIEW
  if (selectedLead) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <LeadDetailView
            lead={selectedLead}
            onBack={() => setSelectedLead(null)}
          />
        </div>
      </div>
    );
  }

  // ─── DASHBOARD VIEW
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AE</span>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">Ather Energy Dealership</p>
            <p className="text-xs text-slate-400 leading-tight">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 hidden sm:block">Welcome, {adminName || 'Admin'}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-emerald-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <OverviewTab
              key="overview"
              stats={stats}
              leads={leads}
              onViewLead={(lead) => {
                setSelectedLead(lead);
                setActiveTab('leads');
              }}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'leads' && (
            <LeadsTab
              key="leads"
              leads={leads}
              onViewLead={setSelectedLead}
              onStatusChange={handleStatusChange}
              isLoading={isLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          )}
          {activeTab === 'gallery' && (
            <GalleryTab key="gallery" images={galleryImages} onDelete={handleDeleteImage} />
          )}
          {activeTab === 'settings' && <SettingsTab key="settings" />}
        </AnimatePresence>
      </main>
    </div>
  );
}