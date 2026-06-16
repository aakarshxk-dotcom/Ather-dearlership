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
import {
  Building2,
  MapPin,
  User,
  Car,
  Users,
  Target,
  ShoppingCart,
  Plus,
  Check,
  X,
  Pause,
  Loader2,
} from 'lucide-react';

const darkInput =
  'bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-neon-green/50';

type Dealership = {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string | null;
  managerPhone: string | null;
  status: string;
  type: string;
  _count: {
    vehicles: number;
    users: number;
    leads: number;
    orders: number;
    serviceAppointments: number;
  };
};

const STATUS_STYLES: Record<string, string> = {
  active: 'border-green-500/50 text-green-400 bg-green-500/10',
  pending: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  approved: 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10',
  suspended: 'border-red-500/50 text-red-400 bg-red-500/10',
  rejected: 'border-red-500/50 text-red-400 bg-red-500/10',
};

const TYPE_STYLES: Record<string, string> = {
  premium: 'border-neon-gold/50 text-neon-gold bg-neon-gold/10',
  flagship: 'border-neon-gold/50 text-neon-gold bg-neon-gold/10',
  standard: 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

const STEPS = ['Basic Info', 'Address', 'Contact', 'Documents'];

export function DealershipsManager() {
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [statusCounts, setStatusCounts] = useState<{ status: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', code: '', type: 'standard', territory: '',
    address: '', city: '', state: '', pincode: '',
    phone: '', email: '', managerName: '', managerPhone: '',
    gstNumber: '', panNumber: '',
  });

  const fetchDealerships = async () => {
    try {
      const res = await fetch('/api/dealerships');
      const data = await res.json();
      setDealerships(data.dealerships || []);
      setStatusCounts(data.statusCounts || []);
    } catch (e) {
      console.error('Failed to fetch dealerships:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealerships();
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { total: 0, active: 0, pending: 0, flagship: 0 };
    statusCounts.forEach((s) => {
      map[s.status] = s.count;
      map.total += s.count;
    });
    dealerships.forEach((d) => {
      if (d.type === 'flagship') map.flagship++;
    });
    return map;
  }, [statusCounts, dealerships]);

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch('/api/dealerships', { method: 'PATCH', body: JSON.stringify({ id, status }) });
    fetchDealerships();
  };

  const handleAdd = async () => {
    await fetch('/api/dealerships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setDialogOpen(false);
    setStep(0);
    setForm({
      name: '', code: '', type: 'standard', territory: '',
      address: '', city: '', state: '', pincode: '',
      phone: '', email: '', managerName: '', managerPhone: '',
      gstNumber: '', panNumber: '',
    });
    fetchDealerships();
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed = () => {
    if (step === 0) return form.name && form.code;
    if (step === 1) return form.address && form.city && form.state;
    if (step === 2) return form.phone && form.email;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Dealer <span className="gradient-text-green">Network</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Nationwide dealership ecosystem</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setStep(0); }}>
          <DialogTrigger asChild>
            <Button className="btn-neon-green gap-2">
              <Plus className="h-4 w-4" /> New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-deep-space border-white/10 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">New Dealer Application</DialogTitle>
            </DialogHeader>
            {/* Progress Bar */}
            <div className="flex gap-1 mt-2 mb-6">
              {STEPS.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full neon-progress-bar"
                      initial={{ width: '0%' }}
                      animate={{ width: i <= step ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span className={cn('text-[10px]', i === step ? 'text-neon-green' : 'text-muted-foreground')}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Dealership Name</Label>
                      <Input className={darkInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Code</Label>
                      <Input className={darkInput} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Type</Label>
                      <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                        <SelectTrigger className={darkInput}><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-deep-space border-white/10">
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="flagship">Flagship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Territory</Label>
                      <Input className={darkInput} value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Address</Label>
                    <Input className={darkInput} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">City</Label>
                      <Input className={darkInput} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">State</Label>
                      <Input className={darkInput} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Pincode</Label>
                      <Input className={darkInput} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Phone</Label>
                      <Input className={darkInput} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Email</Label>
                      <Input className={darkInput} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Manager Name</Label>
                      <Input className={darkInput} value={form.managerName} onChange={(e) => setForm({ ...form, managerName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Manager Phone</Label>
                      <Input className={darkInput} value={form.managerPhone} onChange={(e) => setForm({ ...form, managerPhone: e.target.value })} />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">GST Number</Label>
                      <Input className={darkInput} value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">PAN Number</Label>
                      <Input className={darkInput} value={form.panNumber} onChange={(e) => setForm({ ...form, panNumber: e.target.value })} />
                    </div>
                  </div>
                  <div className="glass-card-static p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-2">Review application details before submitting.</p>
                    <p className="text-sm font-medium text-foreground">{form.name} ({form.code})</p>
                    <p className="text-xs text-muted-foreground">{form.city}, {form.state}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Navigation */}
            <div className="flex justify-between mt-4">
              <Button variant="ghost" onClick={prevStep} disabled={step === 0} className="text-muted-foreground hover:text-foreground">
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={nextStep} disabled={!canProceed()} className="btn-glass">
                  Next
                </Button>
              ) : (
                <Button onClick={handleAdd} disabled={!canProceed()} className="btn-neon-green">
                  Submit Application
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Dealers', value: counts.total, color: 'text-foreground', icon: Building2 },
          { label: 'Active', value: counts.active, color: 'text-green-400', icon: Check },
          { label: 'Pending', value: counts.pending, color: 'text-amber-400', icon: Loader2 },
          { label: 'Flagship', value: counts.flagship, color: 'text-neon-gold', icon: Building2 },
        ].map((item) => (
          <div key={item.label} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                <item.icon className={cn('h-5 w-5', item.color)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={cn('text-2xl font-bold font-mono', item.color)}>{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dealer Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {dealerships.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{d.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10 text-[10px] font-mono">
                        {d.code}
                      </Badge>
                      <Badge variant="outline" className={cn('text-[10px]', TYPE_STYLES[d.type] || TYPE_STYLES.standard)}>
                        {capitalize(d.type)}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px]', STATUS_STYLES[d.status] || STATUS_STYLES.pending)}>
                    {capitalize(d.status)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-neon-cyan shrink-0" />
                  <span className="truncate">{d.city}, {d.state}</span>
                </div>

                {d.managerName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5 text-neon-green shrink-0" />
                    <span>{d.managerName}</span>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
                  {[
                    { icon: Car, val: d._count.vehicles },
                    { icon: Users, val: d._count.users },
                    { icon: Target, val: d._count.leads },
                    { icon: ShoppingCart, val: d._count.orders },
                  ].map((s) => (
                    <div key={s.icon.name} className="text-center">
                      <s.icon className="h-3.5 w-3.5 text-muted-foreground mx-auto mb-1" />
                      <p className="font-mono text-sm text-foreground">{s.val}</p>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                {d.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                      onClick={() => handleStatusUpdate(d.id, 'active')}
                    >
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleStatusUpdate(d.id, 'rejected')}
                    >
                      <X className="h-3 w-3 mr-1" /> Reject
                    </Button>
                  </div>
                )}
                {d.status === 'active' && (
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-8 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                      onClick={() => handleStatusUpdate(d.id, 'suspended')}
                    >
                      <Pause className="h-3 w-3 mr-1" /> Suspend
                    </Button>
                  </div>
                )}
                {d.status === 'suspended' && (
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                      onClick={() => handleStatusUpdate(d.id, 'active')}
                    >
                      <Check className="h-3 w-3 mr-1" /> Reactivate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleStatusUpdate(d.id, 'rejected')}
                    >
                      <X className="h-3 w-3 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}