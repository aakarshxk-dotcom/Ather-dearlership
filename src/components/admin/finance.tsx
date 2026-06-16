'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, IndianRupee, TrendingUp, Clock, CheckCircle2, PieChart, BarChart3 } from 'lucide-react';

const fmtPrice = (n: number) => '₹' + Number(n).toLocaleString('en-IN');
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

type Order = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentStatus: string;
  paymentMethod: string | null;
  createdAt: string;
  customer: { name: string } | null;
  dealership: { name: string } | null;
  vehicle: { model: string; variant: string; color: string } | null;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  type: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  dealership: { name: string; city: string };
  order: { orderNumber: string } | null;
};

const ORDER_PAYMENT_STYLES: Record<string, string> = {
  pending: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  partial: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
  paid: 'border-green-500/50 text-green-400 bg-green-500/10',
  financed: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
};

const INVOICE_STATUS_STYLES: Record<string, string> = {
  pending: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  paid: 'border-green-500/50 text-green-400 bg-green-500/10',
  overdue: 'border-red-500/50 text-red-400 bg-red-500/10',
  cancelled: 'border-gray-500/50 text-gray-400 bg-gray-500/10',
};

const INVOICE_TYPE_STYLES: Record<string, string> = {
  sale: 'border-neon-green/30 text-neon-green bg-neon-green/10',
  service: 'border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10',
  accessory: 'border-neon-gold/30 text-neon-gold bg-neon-gold/10',
  insurance: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
};

export default function Finance() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totals, setTotals] = useState({ totalAmount: 0, amount: 0, tax: 0, _count: 0 });
  const [statusCounts, setStatusCounts] = useState<{ status: string; _count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const res = await fetch('/api/finance');
        const data = await res.json();
        setOrders(data.orders || []);
        setInvoices(data.invoices || []);
        setTotals(data.totals || { totalAmount: 0, amount: 0, tax: 0, _count: 0 });
        setStatusCounts(data.statusCounts || []);
      } catch (e) {
        console.error('Failed to fetch finance:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFinance();
  }, []);

  const summary = useMemo(() => {
    const paidAmt = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0);
    const pendingAmt = invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.totalAmount, 0);
    return {
      totalRevenue: totals.totalAmount || 0,
      totalTax: totals.tax || 0,
      pending: pendingAmt,
      paid: paidAmt,
    };
  }, [invoices, totals]);

  // Chart data: revenue by invoice type
  const revenueByType = useMemo(() => {
    const map: Record<string, number> = {};
    invoices.forEach((inv) => {
      map[inv.type] = (map[inv.type] || 0) + inv.totalAmount;
    });
    return Object.entries(map).map(([type, amount]) => ({ type: capitalize(type), amount }));
  }, [invoices]);

  const maxRevenueType = useMemo(
    () => Math.max(...revenueByType.map((r) => r.amount), 1),
    [revenueByType]
  );

  // Chart data: payment status donut
  const paymentStatusData = useMemo(() => {
    const map: Record<string, number> = {};
    statusCounts.forEach((s) => {
      map[s.status] = s._count;
    });
    return Object.entries(map).map(([status, count]) => ({ status: capitalize(status), count }));
  }, [statusCounts]);

  const totalPayments = useMemo(
    () => paymentStatusData.reduce((s, p) => s + p.count, 0) || 1,
    [paymentStatusData]
  );

  const DONUT_COLORS: Record<string, string> = {
    Paid: '#00FF88',
    Pending: '#FBBF24',
    Overdue: '#EF4444',
    Cancelled: '#6B7280',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">
          Finance & <span className="gradient-text-green">Revenue</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Enterprise financial management</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmtPrice(summary.totalRevenue), color: 'text-green-400', icon: TrendingUp },
          { label: 'Total Tax', value: fmtPrice(summary.totalTax), color: 'text-cyan-400', icon: IndianRupee },
          { label: 'Pending', value: fmtPrice(summary.pending), color: 'text-amber-400', icon: Clock },
          { label: 'Paid', value: fmtPrice(summary.paid), color: 'text-green-400', icon: CheckCircle2 },
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

      {/* Tabs: Orders / Invoices */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1">
            <TabsTrigger
              value="orders"
              className="rounded-lg text-sm data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green data-[state=active]:shadow-none text-muted-foreground"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="rounded-lg text-sm data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green data-[state=active]:shadow-none text-muted-foreground"
            >
              Invoices
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Orders Table */}
        <TabsContent value="orders" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
          ) : (
            <div className="glass-card-static rounded-2xl overflow-hidden">
              <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Order#</th>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Total</th>
                      <th>Discount</th>
                      <th>Final</th>
                      <th>Payment</th>
                      <th>Method</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <AnimatePresence>
                    <tbody>
                      {orders.map((o, i) => (
                        <motion.tr
                          key={o.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: i * 0.03 }}
                        >
                          <td className="font-mono text-neon-cyan text-xs">{o.orderNumber}</td>
                          <td className="text-sm">{o.customer?.name || '—'}</td>
                          <td className="text-sm text-muted-foreground">
                            {o.vehicle ? `${o.vehicle.model} ${o.vehicle.color}` : '—'}
                          </td>
                          <td className="font-mono text-sm">{fmtPrice(o.totalAmount)}</td>
                          <td className="font-mono text-sm text-muted-foreground">
                            {o.discount > 0 ? fmtPrice(o.discount) : '—'}
                          </td>
                          <td className="font-mono text-sm neon-text-green font-bold">{fmtPrice(o.finalAmount)}</td>
                          <td>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px]',
                                ORDER_PAYMENT_STYLES[o.paymentStatus] || ORDER_PAYMENT_STYLES.pending
                              )}
                            >
                              {capitalize(o.paymentStatus)}
                            </Badge>
                          </td>
                          <td className="text-xs text-muted-foreground">
                            {o.paymentMethod ? capitalize(o.paymentMethod) : '—'}
                          </td>
                          <td className="text-xs text-muted-foreground">{fmtDate(o.createdAt)}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </AnimatePresence>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Invoices Table */}
        <TabsContent value="invoices" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
          ) : (
            <div className="glass-card-static rounded-2xl overflow-hidden">
              <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Invoice#</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Tax</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Dealership</th>
                    </tr>
                  </thead>
                  <AnimatePresence>
                    <tbody>
                      {invoices.map((inv, i) => (
                        <motion.tr
                          key={inv.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: i * 0.03 }}
                        >
                          <td className="font-mono text-neon-cyan text-xs">{inv.invoiceNumber}</td>
                          <td>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px]',
                                INVOICE_TYPE_STYLES[inv.type] || INVOICE_TYPE_STYLES.sale
                              )}
                            >
                              {capitalize(inv.type)}
                            </Badge>
                          </td>
                          <td className="font-mono text-sm">{fmtPrice(inv.amount)}</td>
                          <td className="font-mono text-sm text-muted-foreground">{inv.tax}%</td>
                          <td className="font-mono text-sm neon-text-green font-bold">{fmtPrice(inv.totalAmount)}</td>
                          <td>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px]',
                                INVOICE_STATUS_STYLES[inv.status] || INVOICE_STATUS_STYLES.pending
                              )}
                            >
                              {capitalize(inv.status)}
                            </Badge>
                          </td>
                          <td className="text-xs text-muted-foreground">{fmtDate(inv.dueDate)}</td>
                          <td className="text-xs text-muted-foreground">{inv.dealership?.name || '—'}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </AnimatePresence>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Breakdown - Horizontal Bars */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-neon-green" />
            <h3 className="text-sm font-semibold text-foreground">Revenue Breakdown</h3>
          </div>
          <div className="space-y-3">
            {revenueByType.map((item) => (
              <div key={item.type} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.type}</span>
                  <span className="font-mono text-foreground">{fmtPrice(item.amount)}</span>
                </div>
                <div className="neon-progress h-2">
                  <motion.div
                    className="h-full rounded-full neon-progress-bar"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(item.amount / maxRevenueType) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status Donut */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-neon-cyan" />
            <h3 className="text-sm font-semibold text-foreground">Payment Status</h3>
          </div>
          <div className="flex items-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {paymentStatusData.map((item, i) => {
                  const pct = (item.count / totalPayments) * 100;
                  const offset = paymentStatusData
                    .slice(0, i)
                    .reduce((sum, p) => sum + (p.count / totalPayments) * 100, 0);
                  return (
                    <motion.circle
                      key={item.status}
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke={DONUT_COLORS[item.status] || '#666'}
                      strokeWidth="3"
                      strokeDasharray={`${pct} ${100 - pct}`}
                      strokeDashoffset={`${-offset}`}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.15 }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-mono text-lg font-bold text-foreground">{totals._count || 0}</p>
                  <p className="text-[10px] text-muted-foreground">Invoices</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-2 flex-1">
              {paymentStatusData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: DONUT_COLORS[item.status] || '#666' }}
                    />
                    <span className="text-xs text-muted-foreground">{item.status}</span>
                  </div>
                  <span className="font-mono text-sm text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}