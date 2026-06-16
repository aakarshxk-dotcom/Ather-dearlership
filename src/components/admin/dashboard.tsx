'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingCart,
  UserPlus,
  Car,
  Building2,
  Users,
  Flame,
  Wrench,
  Phone,
  Mail,
  CreditCard,
  FileText,
  MessageSquare,
  Activity,
  Clock,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

// ── Types ────────────────────────────────────────────────────────────
interface KPIs {
  totalDealerships: number;
  activeDealerships: number;
  totalVehicles: number;
  availableVehicles: number;
  totalLeads: number;
  hotLeads: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingServices: number;
  monthlyOrders: number;
}

interface Charts {
  leadByStatus: Array<{ name: string; value: number }>;
  leadBySource: Array<{ name: string; value: number }>;
  ordersByMonth: Array<{ month: string; orders: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  vehicleByModel: Array<{ name: string; value: number }>;
  serviceByType: Array<{ name: string; value: number }>;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  user: { name: string } | null;
  lead: { name: string } | null;
  createdAt: string;
}

interface DashboardData {
  kpis: KPIs;
  charts: Charts;
  recentActivities: Activity[];
}

// ── Helpers ──────────────────────────────────────────────────────────
function formatCurrency(value: number): string {
  return '₹' + Math.round(value).toLocaleString('en-IN');
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getActivityIcon(type: string) {
  const icons: Record<string, React.ElementType> = {
    call: Phone,
    email: Mail,
    test_ride: Car,
    order: CreditCard,
    payment: IndianRupee,
    follow_up: Clock,
    lead_created: UserPlus,
    document: FileText,
    message: MessageSquare,
  };
  return icons[type] || Activity;
}

function getActivityColor(type: string): { border: string; bg: string; icon: string } {
  const map: Record<string, { border: string; bg: string; icon: string }> = {
    call:           { border: 'border-l-neon-cyan',  bg: 'bg-neon-cyan/10',   icon: 'text-neon-cyan' },
    email:          { border: 'border-l-[#A855F7]',  bg: 'bg-[#A855F7]/10',  icon: 'text-[#A855F7]' },
    test_ride:      { border: 'border-l-neon-green',  bg: 'bg-neon-green/10',  icon: 'text-neon-green' },
    order:          { border: 'border-l-neon-gold',   bg: 'bg-neon-gold/10',   icon: 'text-neon-gold' },
    payment:        { border: 'border-l-neon-green',  bg: 'bg-neon-green/10',  icon: 'text-neon-green' },
    follow_up:      { border: 'border-l-neon-cyan',  bg: 'bg-neon-cyan/10',   icon: 'text-neon-cyan' },
    lead_created:   { border: 'border-l-neon-cyan',  bg: 'bg-neon-cyan/10',   icon: 'text-neon-cyan' },
    document:       { border: 'border-l-[#8B8FA3]',  bg: 'bg-[#8B8FA3]/10',  icon: 'text-[#8B8FA3]' },
    message:        { border: 'border-l-neon-cyan',  bg: 'bg-neon-cyan/10',   icon: 'text-neon-cyan' },
  };
  return map[type] || { border: 'border-l-[#8B8FA3]', bg: 'bg-[#8B8FA3]/10', icon: 'text-[#8B8FA3]' };
}

// Sparkline SVG generator
function Sparkline({ data, color = '#00FF88', className }: { data: number[]; color?: string; className?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 40;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h * 0.8 - h * 0.1;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn('w-full', className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{ filter: `drop-shadow(0 0 4px ${color}50)` }}
      />
    </svg>
  );
}

// ── Chart Configs ────────────────────────────────────────────────────
const revenueChartConfig: ChartConfig = {
  revenue:      { label: 'Revenue',     color: '#00FF88' },
  comparison:   { label: 'Comparison',  color: '#00E5FF' },
};

const ordersChartConfig: ChartConfig = {
  orders: { label: 'Orders', color: '#00E5FF' },
};

const leadSourceConfig: ChartConfig = {
  website:     { label: 'Website',     color: '#00FF88' },
  walkin:      { label: 'Walk-in',     color: '#00E5FF' },
  referral:    { label: 'Referral',    color: '#FFD700' },
  social_media:{ label: 'Social Media', color: '#A855F7' },
  campaign:    { label: 'Campaign',    color: '#FF6B6B' },
  other:       { label: 'Other',       color: '#8B8FA3' },
};

const vehicleChartConfig: ChartConfig = {
  value: { label: 'Vehicles', color: '#00FF88' },
};

const PIE_COLORS = ['#00FF88', '#00E5FF', '#FFD700', '#A855F7', '#FF6B6B', '#8B8FA3'];

// ── Animation ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// ── Skeleton States ──────────────────────────────────────────────────
function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-20 bg-white/5" />
            <Skeleton className="h-10 w-10 rounded-lg bg-white/5" />
          </div>
          <Skeleton className="h-8 w-28 bg-white/5" />
          <Skeleton className="mt-2 h-3 w-16 bg-white/5" />
          <Skeleton className="mt-3 h-10 w-full bg-white/5" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="glass-card-static p-5">
      <Skeleton className="h-5 w-36 bg-white/5 mb-1" />
      <Skeleton className="h-3 w-48 bg-white/5 mb-4" />
      <Skeleton className="h-[260px] w-full rounded-lg bg-white/5" />
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40 bg-white/5" />
          <Skeleton className="h-6 w-16 bg-white/5 rounded-full" />
        </div>
        <KPISkeleton />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card-static p-4 flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg bg-white/5 shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-3 w-12 bg-white/5" />
                <Skeleton className="mt-1 h-5 w-16 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="glass-card-static p-5">
          <Skeleton className="h-5 w-36 bg-white/5 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-white/5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-full bg-white/5" />
                  <Skeleton className="h-2 w-28 bg-white/5" />
                </div>
                <Skeleton className="h-3 w-12 bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-[#8B8FA3]">Failed to load command center data</p>
        <button onClick={fetchDashboard} className="text-sm font-medium text-neon-green hover:underline">
          Retry
        </button>
      </div>
    );
  }

  const { kpis, charts, recentActivities } = data;

  // Sparkline data from revenue trend
  const revenueSparkData = charts.revenueByMonth.map((d) => d.revenue);
  const ordersSparkData = charts.ordersByMonth.map((d) => d.orders);
  const leadsSparkData = charts.leadBySource.map((d) => d.value);
  const vehiclesSparkData = charts.vehicleByModel.map((d) => d.value);

  // ── KPI Card definitions ──
  const mainKPIs = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      change: '+12.5%',
      trend: 'up' as const,
      icon: IndianRupee,
      iconBg: 'bg-neon-green/10',
      iconColor: 'text-neon-green',
      numberClass: 'gradient-text-green',
      sparkData: revenueSparkData,
      sparkColor: '#00FF88',
    },
    {
      title: 'Total Orders',
      value: kpis.totalOrders.toLocaleString('en-IN'),
      change: '+8.2%',
      trend: 'up' as const,
      icon: ShoppingCart,
      iconBg: 'bg-neon-cyan/10',
      iconColor: 'text-neon-cyan',
      numberClass: 'text-neon-cyan',
      sparkData: ordersSparkData,
      sparkColor: '#00E5FF',
    },
    {
      title: 'Active Leads',
      value: kpis.totalLeads.toLocaleString('en-IN'),
      change: '+15.3%',
      trend: 'up' as const,
      icon: UserPlus,
      iconBg: 'bg-neon-gold/10',
      iconColor: 'text-neon-gold',
      numberClass: 'text-neon-gold',
      sparkData: leadsSparkData,
      sparkColor: '#FFD700',
    },
    {
      title: 'Available Vehicles',
      value: kpis.availableVehicles.toLocaleString('en-IN'),
      change: '-3.1%',
      trend: 'down' as const,
      icon: Car,
      iconBg: 'bg-[#A855F7]/10',
      iconColor: 'text-[#A855F7]',
      numberClass: 'text-[#A855F7]',
      sparkData: vehiclesSparkData,
      sparkColor: '#A855F7',
    },
  ];

  const secondaryStats = [
    { title: 'Dealerships', value: kpis.activeDealerships, subtitle: `${kpis.totalDealerships} total`, icon: Building2, iconColor: 'text-neon-green' },
    { title: 'Customers', value: kpis.totalCustomers.toLocaleString('en-IN'), subtitle: 'Active', icon: Users, iconColor: 'text-neon-cyan' },
    { title: 'Hot Leads', value: kpis.hotLeads.toLocaleString('en-IN'), subtitle: 'Priority', icon: Flame, iconColor: 'text-neon-gold' },
    { title: 'Services', value: kpis.pendingServices.toLocaleString('en-IN'), subtitle: 'Pending', icon: Wrench, iconColor: 'text-[#A855F7]' },
  ];

  // Revenue trend with comparison overlay
  const revenueTrendData = charts.revenueByMonth.map((d) => ({
    month: d.month,
    revenue: d.revenue,
    comparison: d.revenue * 0.75, // synthetic comparison
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6"
    >
      {/* ═══ TOP BAR ═══ */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-neon-green" />
          <h1 className="text-xl font-bold text-[#E8EAED]">Command Center</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/5 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
          </span>
          <span className="text-xs font-semibold tracking-widest text-neon-green">LIVE</span>
        </div>
      </motion.div>

      {/* ═══ KPI GRID ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainKPIs.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.title} variants={itemVariants}>
              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8B8FA3] uppercase tracking-wider font-medium">{kpi.title}</span>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', kpi.iconBg)}>
                    <Icon className={cn('h-5 w-5', kpi.iconColor)} />
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono leading-none">
                  <span className={kpi.numberClass}>{kpi.value}</span>
                </div>
                <div className={cn(
                  'inline-flex items-center gap-1 text-xs font-mono font-semibold',
                  kpi.trend === 'up' ? 'text-neon-green' : 'text-[#FF6B6B]'
                )}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.change}
                </div>
                <Sparkline data={kpi.sparkData} color={kpi.sparkColor} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ SECONDARY STATS ROW ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {secondaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <div className="glass-card-static p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className={cn('h-4.5 w-4.5', stat.iconColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-[#8B8FA3] uppercase tracking-wider font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold font-mono text-[#E8EAED] leading-tight">{stat.value}</p>
                </div>
                <span className="text-[11px] text-[#8B8FA3]">{stat.subtitle}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ CHARTS SECTION ═══ */}
      {/* Row 1: Revenue Trend + Orders by Month */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <motion.div variants={itemVariants}>
          <div className="glass-card-static p-5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 80px rgba(0,255,136,0.03)' }} />
            <h3 className="text-sm font-semibold text-[#E8EAED] mb-0.5">Revenue Trend</h3>
            <p className="text-xs text-[#8B8FA3] mb-4">Monthly revenue with prior period comparison</p>
            <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
              <AreaChart data={revenueTrendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FF88" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.split('-')[1]}
                  className="text-[10px]"
                  tick={{ fill: '#8B8FA3' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  className="text-[10px]"
                  tick={{ fill: '#8B8FA3' }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                      labelFormatter={(label) => {
                        const [y, m] = String(label).split('-');
                        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        return months[parseInt(m, 10) - 1] + ' ' + y;
                      }}
                      className="!bg-[#0D1137] !border-[rgba(255,255,255,0.08)]"
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00FF88"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#00FF88', stroke: '#050816', strokeWidth: 2 }}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.4))' }}
                />
                <Area
                  type="monotone"
                  dataKey="comparison"
                  stroke="#00E5FF"
                  strokeWidth={1.5}
                  fill="none"
                  dot={false}
                  strokeDasharray="4 4"
                  opacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </motion.div>

        {/* Orders by Month */}
        <motion.div variants={itemVariants}>
          <div className="glass-card-static p-5">
            <h3 className="text-sm font-semibold text-[#E8EAED] mb-0.5">Orders by Month</h3>
            <p className="text-xs text-[#8B8FA3] mb-4">Monthly order volume across all dealerships</p>
            <ChartContainer config={ordersChartConfig} className="h-[280px] w-full">
              <BarChart data={charts.ordersByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.split('-')[1]}
                  tick={{ fill: '#8B8FA3' }}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8B8FA3' }} />
                <ChartTooltip
                  content={<ChartTooltipContent className="!bg-[#0D1137] !border-[rgba(255,255,255,0.08)]" />}
                />
                <Bar
                  dataKey="orders"
                  fill="var(--color-orders)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.3))' }}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Lead Sources (Donut) + Vehicle Distribution (Horizontal Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lead Sources Donut */}
        <motion.div variants={itemVariants}>
          <div className="glass-card-static p-5">
            <h3 className="text-sm font-semibold text-[#E8EAED] mb-0.5">Lead Sources</h3>
            <p className="text-xs text-[#8B8FA3] mb-4">Distribution by source channel</p>
            <ChartContainer config={leadSourceConfig} className="h-[240px] w-full">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" className="!bg-[#0D1137] !border-[rgba(255,255,255,0.08)]" />}
                />
                <Pie
                  data={charts.leadBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {charts.leadBySource.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      style={{ filter: `drop-shadow(0 0 6px ${PIE_COLORS[index % PIE_COLORS.length]}40)` }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            {/* Center total + Legend */}
            <div className="relative -mt-[190px] mb-[130px] flex flex-col items-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-[#E8EAED]">
                {charts.leadBySource.reduce((s, d) => s + d.value, 0)}
              </span>
              <span className="text-[10px] text-[#8B8FA3] uppercase tracking-wider">Total Leads</span>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {charts.leadBySource.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length], boxShadow: `0 0 6px ${PIE_COLORS[i % PIE_COLORS.length]}60` }}
                  />
                  <span className="text-[#8B8FA3] capitalize">{item.name.replace(/_/g, ' ')}</span>
                  <span className="font-mono font-semibold text-[#E8EAED]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Vehicle Distribution */}
        <motion.div variants={itemVariants}>
          <div className="glass-card-static p-5">
            <h3 className="text-sm font-semibold text-[#E8EAED] mb-0.5">Vehicle Distribution</h3>
            <p className="text-xs text-[#8B8FA3] mb-4">Available inventory by model</p>
            <ChartContainer config={vehicleChartConfig} className="h-[280px] w-full">
              <BarChart
                data={charts.vehicleByModel}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 60, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#8B8FA3' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#E8EAED', fontSize: 12 }}
                  width={55}
                />
                <ChartTooltip
                  content={<ChartTooltipContent className="!bg-[#0D1137] !border-[rgba(255,255,255,0.08)]" />}
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={24}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.3))' }}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </motion.div>
      </div>

      {/* ═══ RECENT ACTIVITY FEED ═══ */}
      <motion.div variants={itemVariants}>
        <div className="glass-card-static p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E8EAED]">Recent Activity</h3>
              <p className="text-xs text-[#8B8FA3]">Latest actions across the platform</p>
            </div>
            <span className="text-[11px] font-mono text-[#8B8FA3] bg-white/5 px-2.5 py-1 rounded-full">
              {recentActivities.length} events
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-1">
            {recentActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colors = getActivityColor(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg p-3 border-l-2 transition-colors hover:bg-white/[0.02]',
                    colors.border
                  )}
                >
                  <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', colors.bg)}>
                    <Icon className={cn('h-3.5 w-3.5', colors.icon)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E8EAED] truncate">{activity.description}</p>
                    <p className="text-xs text-[#8B8FA3]">
                      {activity.user?.name || 'System'}
                      {activity.lead?.name && (
                        <> · <span className="text-neon-cyan">{activity.lead.name}</span></>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-mono text-[#8B8FA3]">
                    {relativeTime(activity.createdAt)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}