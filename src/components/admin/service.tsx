'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wrench,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  User,
  Banknote,
} from 'lucide-react';

const darkInput =
  'bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-neon-green/50';

type Appointment = {
  id: string;
  appointmentNumber: string;
  type: string;
  status: string;
  description: string;
  estimatedCost: number | null;
  actualCost: number | null;
  scheduledDate: string;
  customer: { name: string; phone: string } | null;
  dealership: { name: string; city: string };
};

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
  in_progress: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  completed: 'border-green-500/50 text-green-400 bg-green-500/10',
  cancelled: 'border-red-500/50 text-red-400 bg-red-500/10',
};

const TYPE_STYLES: Record<string, string> = {
  regular_service: 'border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10',
  repair: 'border-orange-500/30 text-orange-400 bg-orange-500/10',
  battery_check: 'border-neon-green/30 text-neon-green bg-neon-green/10',
  tire_change: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  warranty_claim: 'border-neon-gold/30 text-neon-gold bg-neon-gold/10',
  general: 'border-white/20 text-muted-foreground bg-white/5',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
const fmtPrice = (n: number) => '₹' + n.toLocaleString('en-IN');

const SERVICE_TYPES = ['regular_service', 'repair', 'battery_check', 'tire_change', 'warranty_claim', 'general'];

export default function ServiceManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusCounts, setStatusCounts] = useState<{ status: string; _count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'regular_service',
    description: '',
    estimatedCost: '',
    scheduledDate: '',
  });

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams();
      if (tab !== 'all') params.set('status', tab);
      const res = await fetch(`/api/service?${params}`);
      const data = await res.json();
      setAppointments(data.appointments || []);
      setStatusCounts(data.statusCounts || []);
    } catch (e) {
      console.error('Failed to fetch service:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [tab]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { scheduled: 0, in_progress: 0, completed: 0 };
    let revenue = 0;
    statusCounts.forEach((s) => {
      map[s.status] = s._count;
    });
    appointments.forEach((a) => {
      if (a.status === 'completed' && a.actualCost) revenue += a.actualCost;
    });
    return { ...map, revenue };
  }, [statusCounts, appointments]);

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch('/api/service', {
      method: 'PATCH',
      body: JSON.stringify({ id, status, completedDate: status === 'completed' ? new Date().toISOString() : undefined }),
    });
    fetchAppointments();
  };

  const handleBook = async () => {
    await fetch('/api/service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        estimatedCost: Number(form.estimatedCost) || null,
      }),
    });
    setDialogOpen(false);
    setForm({ type: 'regular_service', description: '', estimatedCost: '', scheduledDate: '' });
    fetchAppointments();
  };

  const filteredAppointments = appointments.filter((a) => {
    if (tab === 'all') return true;
    return a.status === tab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Service <span className="gradient-text-green">Hub</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">AI-powered service operations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-neon-green gap-2">
              <Plus className="h-4 w-4" /> Book Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-deep-space border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground">Book Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Service Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className={darkInput}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-deep-space border-white/10">
                    {SERVICE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{capitalize(t)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Description</Label>
                <textarea
                  className={cn('w-full rounded-lg px-3 py-2 text-sm resize-none', darkInput)}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Estimated Cost</Label>
                  <Input className={darkInput} type="number" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Scheduled Date</Label>
                  <Input className={darkInput} type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleBook} className="btn-neon-green w-full mt-2" disabled={!form.description || !form.scheduledDate}>
                Book Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled', value: counts.scheduled, color: 'text-cyan-400', icon: Calendar },
          { label: 'In Progress', value: counts.in_progress, color: 'text-amber-400', icon: Wrench },
          { label: 'Completed', value: counts.completed, color: 'text-green-400', icon: CheckCircle2 },
          { label: 'Revenue', value: fmtPrice(counts.revenue), color: 'text-neon-gold', icon: Banknote },
        ].map((item) => (
          <div key={item.label} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                <item.icon className={cn('h-5 w-5', item.color)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={cn('text-xl font-bold font-mono', item.color)}>{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => { setTab(v); setLoading(true); }}>
        <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1">
          {['all', 'scheduled', 'in_progress', 'completed'].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className={cn(
                'rounded-lg text-sm data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green data-[state=active]:shadow-none text-muted-foreground'
              )}
            >
              {capitalize(t)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No appointments found</div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredAppointments.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="glass-card-static p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-neon-cyan">{a.appointmentNumber}</span>
                        <Badge variant="outline" className={cn('text-[10px]', TYPE_STYLES[a.type] || TYPE_STYLES.general)}>
                          {capitalize(a.type)}
                        </Badge>
                        <Badge variant="outline" className={cn('text-[10px]', STATUS_STYLES[a.status] || STATUS_STYLES.scheduled)}>
                          {capitalize(a.status)}
                        </Badge>
                      </div>
                      {(a.status === 'scheduled' || a.status === 'in_progress') && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                            onClick={() => handleStatusUpdate(a.id, 'completed')}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleStatusUpdate(a.id, 'cancelled')}
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Cancel
                          </Button>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">{a.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {a.customer && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{a.customer.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{a.dealership.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(a.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex gap-6 text-xs pt-2 border-t border-white/5">
                      <div>
                        <span className="text-muted-foreground">Est. Cost: </span>
                        <span className="font-mono text-foreground">{a.estimatedCost ? fmtPrice(a.estimatedCost) : '—'}</span>
                      </div>
                      {a.actualCost !== null && a.actualCost !== undefined && (
                        <div>
                          <span className="text-muted-foreground">Actual: </span>
                          <span className="font-mono neon-text-green">{fmtPrice(a.actualCost)}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}