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
  Car,
  Plus,
  Search,
  Loader2,
  Zap,
  Gauge,
} from 'lucide-react';

const darkInput =
  'bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-neon-green/50';

const COLOR_HEX: Record<string, string> = {
  'Cosmic Black': '#1a1a2e',
  'Lunar White': '#f5f5f0',
  'Green Warp': '#4a7c59',
  'Salt Green': '#a8b5a0',
  'Still Blue': '#4a6fa5',
  'Coral Amber': '#e8734a',
};

const VARIANTS = ['Plus', 'Pro', 'Standard', 'S'];

const MODELS = ['450X', '450S', 'Rizta', '450X Gen 3'];

type Vehicle = {
  id: string;
  model: string;
  variant: string;
  color: string;
  vin: string;
  status: string;
  price: number;
  mrp: number;
  batteryHealth: number | null;
  testRideAvailable: boolean;
  dealership: { name: string; city: string } | null;
};

const STATUS_STYLES: Record<string, string> = {
  available: 'border-green-500/50 text-green-400 bg-green-500/10',
  reserved: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  sold: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
  in_transit: 'border-purple-500/50 text-purple-400 bg-purple-500/10',
  service: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
};

const STATUS_SUMMARY_STYLES: Record<string, string> = {
  total: 'text-foreground',
  available: 'text-green-400',
  reserved: 'text-amber-400',
  sold: 'text-blue-400',
  in_transit: 'text-purple-400',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

const fmtPrice = (n: number) => '₹' + n.toLocaleString('en-IN');

export function InventoryManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [summary, setSummary] = useState<{ status: string; _count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    model: '450X', variant: 'Plus', color: 'Cosmic Black', vin: '',
    price: '', mrp: '', status: 'available',
  });

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (modelFilter !== 'all') params.set('model', modelFilter);
      const res = await fetch(`/api/inventory?${params}`);
      const data = await res.json();
      setVehicles(data.vehicles || []);
      setSummary(data.summary || []);
    } catch (e) {
      console.error('Failed to fetch inventory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter, modelFilter]);

  const summaryCounts = useMemo(() => {
    const map: Record<string, number> = { total: vehicles.length };
    summary.forEach((s) => {
      map[s.status] = s._count;
    });
    return map;
  }, [summary, vehicles]);

  const handleAdd = async () => {
    await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp),
      }),
    });
    setDialogOpen(false);
    setForm({ model: '450X', variant: 'Plus', color: 'Cosmic Black', vin: '', price: '', mrp: '', status: 'available' });
    fetchInventory();
  };

  const getBatteryColor = (health: number) => {
    if (health > 90) return 'bg-green-500';
    if (health > 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Vehicle <span className="gradient-text-green">Fleet</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time inventory across all dealerships</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-neon-green gap-2">
              <Plus className="h-4 w-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-deep-space border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Model</Label>
                  <Select value={form.model} onValueChange={(v) => setForm({ ...form, model: v })}>
                    <SelectTrigger className={darkInput}><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-deep-space border-white/10">
                      {MODELS.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Variant</Label>
                  <Select value={form.variant} onValueChange={(v) => setForm({ ...form, variant: v })}>
                    <SelectTrigger className={darkInput}><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-deep-space border-white/10">
                      {VARIANTS.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Color</Label>
                  <Select value={form.color} onValueChange={(v) => setForm({ ...form, color: v })}>
                    <SelectTrigger className={darkInput}><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-deep-space border-white/10">
                      {Object.keys(COLOR_HEX).map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">VIN</Label>
                  <Input className={darkInput} value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Price</Label>
                  <Input className={darkInput} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">MRP</Label>
                  <Input className={darkInput} type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className={darkInput}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-deep-space border-white/10">
                    {['available', 'reserved', 'sold', 'in_transit', 'service'].map((s) => (
                      <SelectItem key={s} value={s}>{capitalize(s)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="btn-neon-green w-full mt-2" disabled={!form.vin || !form.price}>
                Add Vehicle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Summary Pills */}
      <div className="flex flex-wrap gap-2">
        {['total', 'available', 'reserved', 'sold', 'in_transit'].map((s) => (
          <div key={s} className="glass-card-static px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{capitalize(s)}</span>
            <span className={cn('font-mono text-sm font-bold', STATUS_SUMMARY_STYLES[s])}>
              {summaryCounts[s] || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn('pl-9', darkInput)}
          />
        </div>
        <Select value={modelFilter} onValueChange={(v) => { setModelFilter(v); setLoading(true); }}>
          <SelectTrigger className={cn('w-[150px]', darkInput)}>
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent className="bg-deep-space border-white/10">
            <SelectItem value="all">All Models</SelectItem>
            {MODELS.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setLoading(true); }}>
          <SelectTrigger className={cn('w-[150px]', darkInput)}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-deep-space border-white/10">
            <SelectItem value="all">All Status</SelectItem>
            {['available', 'reserved', 'sold', 'in_transit', 'service'].map((s) => (
              <SelectItem key={s} value={s}>{capitalize(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {vehicles
              .filter((v) => {
                if (!search) return true;
                const q = search.toLowerCase();
                return (
                  v.model.toLowerCase().includes(q) ||
                  v.variant.toLowerCase().includes(q) ||
                  v.color.toLowerCase().includes(q) ||
                  v.vin.toLowerCase().includes(q)
                );
              })
              .map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="glass-card p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{v.model}</h3>
                      <Badge
                        variant="outline"
                        className="border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10 text-[10px] mt-1"
                      >
                        {v.variant}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={cn('text-[10px]', STATUS_STYLES[v.status] || STATUS_STYLES.available)}>
                      {capitalize(v.status)}
                    </Badge>
                  </div>

                  {/* Color indicator */}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: COLOR_HEX[v.color] || '#888' }}
                    />
                    <span className="text-sm text-muted-foreground">{v.color}</span>
                  </div>

                  {/* Price */}
                  <div className="space-y-0.5">
                    <p className="font-mono text-lg font-bold neon-text-green">{fmtPrice(v.price)}</p>
                    {v.mrp && v.mrp !== v.price && (
                      <p className="font-mono text-xs text-muted-foreground line-through">{fmtPrice(v.mrp)}</p>
                    )}
                  </div>

                  {/* VIN */}
                  <p className="text-xs font-mono text-muted-foreground truncate">{v.vin}</p>

                  {/* Battery Health */}
                  {v.batteryHealth !== null && v.batteryHealth !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Zap className="h-3 w-3" /> Battery
                        </span>
                        <span className="font-mono text-foreground">{v.batteryHealth}%</span>
                      </div>
                      <div className="neon-progress h-1.5">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', getBatteryColor(v.batteryHealth))}
                          style={{ width: `${v.batteryHealth}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Dealership & Test Ride */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs text-muted-foreground truncate max-w-[60%]">
                      {v.dealership?.name || 'Unassigned'}
                    </span>
                    {v.testRideAvailable && (
                      <Badge variant="outline" className="border-neon-green/30 text-neon-green bg-neon-green/10 text-[10px]">
                        <Gauge className="h-2.5 w-2.5 mr-1" /> Test Ride
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}