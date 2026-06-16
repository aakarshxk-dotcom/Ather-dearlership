'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Filter,
  Loader2,
  UserPlus,
} from 'lucide-react';

const darkInput =
  'bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-neon-green/50';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  priority: string;
  interest: string | null;
  notes: string | null;
  createdAt: string;
  assignedTo: { name: string; role: string } | null;
  dealership: { name: string; city: string };
};

const PIPELINE_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

const STATUS_STYLES: Record<string, string> = {
  new: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
  contacted: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
  qualified: 'border-green-500/50 text-green-400 bg-green-500/10',
  proposal: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  negotiation: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
  won: 'border-emerald-400/50 text-emerald-400 bg-emerald-400/10',
  lost: 'border-red-500/50 text-red-400 bg-red-500/10',
};

const PRIORITY_STYLES: Record<string, string> = {
  hot: 'border-red-500/50 text-red-400 bg-red-500/10 animate-pulse',
  high: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
  medium: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10',
  low: 'border-gray-500/50 text-gray-400 bg-gray-500/10',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pipeline, setPipeline] = useState<{ status: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website',
    interest: '',
    priority: 'medium',
    notes: '',
  });

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (priorityFilter !== 'all') params.set('priority', priorityFilter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      const apiLeads = (data.leads || []).map((l: Record<string, unknown>) => ({
        ...l,
        assignedTo: (l.assignedTo as Record<string, string>)?.name || 'Unassigned',
        dealership: (l.dealership as Record<string, string>)?.name || '',
      }));
      setLeads(apiLeads);
      setPipeline((data.pipeline || []).map((p: Record<string, unknown>) => ({
        status: p.status as string,
        count: typeof p._count === 'number' ? p._count : Number((p._count as Record<string, unknown>)?.status || 0),
      })));
    } catch (e) {
      console.error('Failed to fetch leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, priorityFilter]);

  const pipelineCounts = useMemo(() => {
    const map: Record<string, number> = {};
    PIPELINE_STATUSES.forEach((s) => (map[s] = 0));
    pipeline.forEach((p) => {
      map[p.status] = p.count;
    });
    return map;
  }, [pipeline]);

  const handleSearch = () => {
    setLoading(true);
    fetchLeads();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch('/api/leads', { method: 'PATCH', body: JSON.stringify({ id, status }) });
    fetchLeads();
  };

  const handleAddLead = async () => {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setDialogOpen(false);
    setForm({ name: '', email: '', phone: '', source: 'website', interest: '', priority: 'medium', notes: '' });
    fetchLeads();
  };

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.email}</span>,
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.phone}</span>,
      },
      {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => (
          <Badge variant="outline" className="border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10 text-xs">
            {capitalize(row.original.source)}
          </Badge>
        ),
      },
      {
        accessorKey: 'interest',
        header: 'Interest',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.interest ? capitalize(row.original.interest) : '—'}</span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => {
          const p = row.original.priority.toLowerCase();
          return (
            <Badge variant="outline" className={cn('text-xs', PRIORITY_STYLES[p] || PRIORITY_STYLES.medium)}>
              {capitalize(p)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = row.original.status.toLowerCase();
          return (
            <Badge variant="outline" className={cn('text-xs', STATUS_STYLES[s] || STATUS_STYLES.new)}>
              {capitalize(s)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.assignedTo?.name || 'Unassigned'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-deep-space border-white/10 text-foreground">
              {PIPELINE_STATUSES.filter((s) => s !== row.original.status).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => handleStatusChange(row.original.id, s)}
                  className="hover:bg-white/5 focus:bg-white/5"
                >
                  Move to {capitalize(s)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">
          Lead <span className="gradient-text-green">Pipeline</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Intelligent lead tracking with AI scoring</p>
      </div>

      {/* Pipeline Bar */}
      <div className="flex flex-wrap gap-2">
        {PIPELINE_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(statusFilter === status ? 'all' : status);
              setLoading(true);
            }}
            className={cn(
              'glass-card-static px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer',
              statusFilter === status
                ? 'neon-border-green border-neon-green/50'
                : 'hover:border-white/20'
            )}
          >
            <span className={statusFilter === status ? 'neon-text-green' : 'text-muted-foreground'}>
              {capitalize(status)}
            </span>
            <span className={cn('ml-2 font-mono text-xs', statusFilter === status ? 'text-neon-green' : 'text-muted-foreground')}>
              {pipelineCounts[status] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={cn('pl-9', darkInput)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setLoading(true); }}>
          <SelectTrigger className={cn('w-[150px]', darkInput)}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-deep-space border-white/10">
            <SelectItem value="all">All Status</SelectItem>
            {PIPELINE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{capitalize(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setLoading(true); }}>
          <SelectTrigger className={cn('w-[140px]', darkInput)}>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-deep-space border-white/10">
            <SelectItem value="all">All Priority</SelectItem>
            {['hot', 'high', 'medium', 'low'].map((p) => (
              <SelectItem key={p} value={p}>{capitalize(p)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className={cn('w-[150px]', darkInput)}>
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="bg-deep-space border-white/10">
            <SelectItem value="all">All Sources</SelectItem>
            {['website', 'referral', 'walk_in', 'social_media', 'campaign'].map((s) => (
              <SelectItem key={s} value={s}>{capitalize(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-neon-green gap-2">
              <UserPlus className="h-4 w-4" /> Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-deep-space border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground">New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Name</Label>
                  <Input className={darkInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Email</Label>
                  <Input className={darkInput} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Phone</Label>
                  <Input className={darkInput} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Interest</Label>
                  <Select value={form.interest} onValueChange={(v) => setForm({ ...form, interest: v })}>
                    <SelectTrigger className={darkInput}>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-deep-space border-white/10">
                      <SelectItem value="450X">450X</SelectItem>
                      <SelectItem value="450S">450S</SelectItem>
                      <SelectItem value="Rizta">Rizta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Source</Label>
                  <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                    <SelectTrigger className={darkInput}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-deep-space border-white/10">
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="walk_in">Walk-in</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="campaign">Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger className={darkInput}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-deep-space border-white/10">
                      {['hot', 'high', 'medium', 'low'].map((p) => (
                        <SelectItem key={p} value={p}>{capitalize(p)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Notes</Label>
                <textarea
                  className={cn('w-full rounded-lg px-3 py-2 text-sm resize-none', darkInput)}
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleAddLead} className="btn-neon-green w-full mt-2" disabled={!form.name || !form.email}>
                Create Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <div className="glass-card-static rounded-2xl overflow-hidden">
        <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No leads found</div>
          ) : (
            <table className="premium-table">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <AnimatePresence>
                <tbody>
                  {table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.original.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </AnimatePresence>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}