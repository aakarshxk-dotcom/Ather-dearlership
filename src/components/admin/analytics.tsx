'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  Target,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Eye,
  MousePointerClick,
  Trophy,
  BarChart3,
  BrainCircuit,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
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
interface AnalyticsData {
  totalRevenue: { _sum: { finalAmount: number }; _count: number };
  ordersByStatus: Array<{ status: string; _count: { status: number }; _sum: { finalAmount: number } }>;
  leadsConversion: Array<{ status: string; count: number }>;
  topDealerships: Array<{
    id: string;
    name: string;
    city: string;
    _count: { orders: number; leads: number; vehicles: number };
  }>;
  revenueByCity: Array<{ city: string; total: number }>;
  modelPerformance: Array<{ model: string; sold: number; revenue: number }>;
  campaigns: Array<{
    id: string;
    name: string;
    type: string;
    budget: number;
    spent: number;
    reach: number;
    clicks: number;
    conversions: number;
    status: string;
  }>;
}

// ── Helpers ──────────────────────────────────────────────────────────
function formatCurrency(value: number): string {
  return '₹' + Math.round(value).toLocaleString('en-IN');
}

// ── Chart Configs ────────────────────────────────────────────────────
const cityRevenueConfig: ChartConfig = {
  Bangalore:  { label: 'Bangalore',  color: '#00FF88' },
  Chennai:    { label: 'Chennai',    color: '#00E5FF' },
  Hyderabad:  { label: 'Hyderabad',  color: '#FFD700' },
  Mumbai:     { label: 'Mumbai',     color: '#A855F7' },
  Pune:       { label: 'Pune',       color: '#FF6B6B' },
  Delhi:      { label: 'Delhi',      color: '#00FF88' },
  revenue:    { label: 'Revenue',    color: '#00FF88' },
};

const ordersStackedConfig: ChartConfig = {
  confirmed:   { label: 'Confirmed',   color: '#00FF88' },
  processing:  { label: 'Processing',  color: '#00E5FF' },
  ready:       { label: 'Ready',       color: '#FFD700' },
  delivered:   { label: 'Delivered',   color: '#A855F7' },
  pending:     { label: 'Pending',     color: '#8B8FA3' },
  cancelled:   { label: 'Cancelled',   color: '#FF6B6B' },
  completed:   { label: 'Completed',   color: '#00FF88' },
};

const modelBarConfig: ChartConfig = {
  sold:    { label: 'Units Sold', color: '#00FF88' },
  revenue: { label: 'Revenue',    color: '#00E5FF' },
};

// Model color mapping
const MODEL_COLORS: Record<string, string> = {
  '450X Gen 3': '#00FF88',
  '450S':       '#00E5FF',
  'Rizta':      '#FFD700',
};

// ── Animation ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

// ── Skeleton ─────────────────────────────────────────────────────────
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-7 w-64 bg-white/5 mb-2" />
        <Skeleton className="h-4 w-80 bg-white/5" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <Skeleton className="h-3 w-20 bg-white/5 mb-3" />
            <Skeleton className="h-8 w-28 bg-white/5" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card-static p-5">
          <Skeleton className="h-5 w-40 bg-white/5 mb-4" />
          <Skeleton className="h-[300px] w-full rounded-lg bg-white/5" />
        </div>
        <div className="glass-card-static p-5">
          <Skeleton className="h-5 w-40 bg-white/5 mb-4" />
          <Skeleton className="h-[300px] w-full rounded-lg bg-white/5" />
        </div>
      </div>
      <div className="glass-card-static p-5">
        <Skeleton className="h-5 w-40 bg-white/5 mb-4" />
        <Skeleton className="h-[240px] w-full rounded-lg bg-white/5" />
      </div>
      <div className="glass-card-static p-5">
        <Skeleton className="h-5 w-40 bg-white/5 mb-4" />
        <Skeleton className="h-[200px] w-full rounded-lg bg-white/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <Skeleton className="h-5 w-32 bg-white/5 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex justify-between">
                  <Skeleton className="h-3 w-16 bg-white/5" />
                  <Skeleton className="h-3 w-12 bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics');
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

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  if (loading) return <AnalyticsSkeleton />;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-[#8B8FA3]">Failed to load analytics data</p>
        <button onClick={fetchAnalytics} className="text-sm font-medium text-neon-green hover:underline">
          Retry
        </button>
      </div>
    );
  }

  const { totalRevenue, ordersByStatus, topDealerships, modelPerformance, campaigns, revenueByCity } = data;
  const totalOrders = totalRevenue._count;
  const revenue = totalRevenue._sum.finalAmount || 0;
  const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

  // Compute conversion rate
  const totalLeads = data.leadsConversion.reduce((s, d) => s + d.count, 0);
  const convertedLeads = data.leadsConversion.find(d => d.status === 'converted')?.count || 0;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // City revenue data
  const cityData = revenueByCity.map((item) => ({
    name: item.city,
    revenue: item.total,
  }));

  // Orders by status for stacked bar
  const statusData = ordersByStatus.map((item) => {
    const name = item.status.charAt(0).toUpperCase() + item.status.slice(1);
    return {
      name,
      [item.status]: item._count.status,
    };
  });

  // ── Summary cards ──
  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(revenue),
      change: '+12.5%',
      trend: 'up' as const,
      icon: IndianRupee,
      numberClass: 'gradient-text-green',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString('en-IN'),
      change: '+8.2%',
      trend: 'up' as const,
      icon: ShoppingCart,
      numberClass: 'text-neon-cyan',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(avgOrderValue),
      change: '+3.8%',
      trend: 'up' as const,
      icon: Target,
      numberClass: 'text-neon-gold',
    },
    {
      title: 'Conversion Rate',
      value: conversionRate.toFixed(1) + '%',
      change: '+1.2%',
      trend: 'up' as const,
      icon: Percent,
      numberClass: 'text-[#A855F7]',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6"
    >
      {/* ═══ HEADER ═══ */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-1">
          <BrainCircuit className="h-5 w-5 text-neon-cyan" />
          <h1 className="text-xl font-bold text-[#E8EAED]">Analytics & Intelligence</h1>
        </div>
        <p className="text-sm text-[#8B8FA3] ml-8">Real-time business intelligence across the dealer network</p>
      </motion.div>

      {/* ═══ SUMMARY CARDS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={itemVariants}>
              <div className="glass-card p-5 space-y-3">
                <span className="text-xs text-[#8B8FA3] uppercase tracking-wider font-medium">{card.title}</span>
                <div className="text-3xl font-bold font-mono leading-none">
                  <span className={card.numberClass}>{card.value}</span>
                </div>
                <div className={cn(
                  'inline-flex items-center gap-1 text-xs font-mono font-semibold',
                  card.trend === 'up' ? 'text-neon-green' : 'text-[#FF6B6B]'
                )}>
                  {card.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {card.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ REVENUE ANALYTICS ═══ */}
      {/* Row 1: Revenue by City + Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by City - Area Chart */}
        <motion.div variants={itemVariants}>
          <div className="glass-card-static p-5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 80px rgba(0,255,136,0.03)' }} />
            <h3 className="text-sm font-semibold text-[#E8EAED] mb-0.5">Revenue by City</h3>
            <p className="text-xs text-[#8B8FA3] mb-4">Revenue distribution across dealership locations</p>
            <ChartContainer config={cityRevenueConfig} className="h-[300px] w-full">
              <AreaChart data={cityData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  {cityData.map((city, i) => {
                    const color = MODEL_COLORS[city.name] || ['#00FF88','#00E5FF','#FFD700','#A855F7','#FF6B6B','#8B8FA3'][i % 6];
                    return (
                      <linearGradient key={city.name} id={`cityGrad-${city.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8B8FA3', fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  tick={{ fill: '#8B8FA3', fontSize: 11 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} className="!bg-[#0D1137] !border-[rgba(255,255,255,0.08)]" />}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00FF88"
                  strokeWidth={2.5}
                  fill="url(#cityGrad-Bangalore)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#00FF88', stroke: '#050816', strokeWidth: 2 }}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.4))' }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </motion.div>

        {/* Orders by Status - Stacked Bar */}
        <motion.div variants={itemVariants}>
          <div className="glass-card-static p-5">
            <h3 className="text-sm font-semibold text-[#E8EAED] mb-0.5">Orders by Status</h3>
            <p className="text-xs text-[#8B8FA3] mb-4">Order pipeline breakdown by current status</p>
            <ChartContainer config={ordersStackedConfig} className="h-[300px] w-full">
              <BarChart data={statusData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8B8FA3' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8B8FA3' }} />
                <ChartTooltip content={<ChartTooltipContent className="!bg-[#0D1137] !border-[rgba(255,255,255,0.08)]" />} />
                {ordersByStatus.map((item, i) => {
                  const key = item.status;
                  const isLast = i === ordersByStatus.length - 1;
                  return (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={`var(--color-${key})`}
                      radius={isLast ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                      maxBarSize={48}
                    />
                  );
                })}
              </BarChart>
            </ChartContainer>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {ordersByStatus.map((item, i) => {
                const colors = ['#00FF88','#00E5FF','#FFD700','#A855F7','#8B8FA3','#FF6B6B'];
                return (
                  <div key={item.status} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length], boxShadow: `0 0 4px ${colors[i % colors.length]}60` }} />
                    <span className="text-[#8B8FA3] capitalize">{item.status}</span>
                    <span className="font-mono font-semibold text-[#E8EAED]">{item._count.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ MODEL PERFORMANCE ═══ */}
      <motion.div variants={itemVariants}>
        <div className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-0.5">
            <BarChart3 className="h-4 w-4 text-neon-green" />
            <h3 className="text-sm font-semibold text-[#E8EAED]">Model Performance</h3>
          </div>
          <p className="text-xs text-[#8B8FA3] mb-4">Units sold and revenue generated by vehicle model</p>
          <ChartContainer config={modelBarConfig} className="h-[240px] w-full">
            <BarChart
              data={modelPerformance}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 100, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#8B8FA3' }} />
              <YAxis
                type="category"
                dataKey="model"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#E8EAED', fontSize: 12 }}
                width={90}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) =>
                      name === 'sold' ? `${value} units` : formatCurrency(Number(value))
                    }
                    className="!bg-[#0D1137] !border-[rgba(255,255,255,0.08)]"
                  />
                }
              />
              <Bar dataKey="sold" maxBarSize={24} radius={[0, 6, 6, 0]}>
                {modelPerformance.map((entry) => (
                  <Cell
                    key={entry.model}
                    fill={MODEL_COLORS[entry.model] || '#00FF88'}
                    style={{ filter: `drop-shadow(0 0 6px ${(MODEL_COLORS[entry.model] || '#00FF88')}40)` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </motion.div>

      {/* ═══ TOP DEALERSHIPS TABLE ═══ */}
      <motion.div variants={itemVariants}>
        <div className="glass-card-static p-5 overflow-hidden">
          <h3 className="text-sm font-semibold text-[#E8EAED] mb-0.5">Top Dealerships</h3>
          <p className="text-xs text-[#8B8FA3] mb-4">Performance metrics across the dealer network</p>
          <div className="overflow-x-auto">
            <table className="premium-table w-full">
              <thead>
                <tr>
                  <th>Dealership Name</th>
                  <th className="text-right">City</th>
                  <th className="text-right">Orders</th>
                  <th className="text-right">Leads</th>
                  <th className="text-right">Vehicles</th>
                </tr>
              </thead>
              <tbody>
                {topDealerships.map((dealer) => (
                  <tr key={dealer.id} className="transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.04)]">
                    <td className="font-medium text-[#E8EAED]">{dealer.name}</td>
                    <td className="text-right text-neon-cyan">{dealer.city}</td>
                    <td className="text-right font-mono text-neon-green">{dealer._count.orders}</td>
                    <td className="text-right font-mono text-neon-gold">{dealer._count.leads}</td>
                    <td className="text-right font-mono text-[#A855F7]">{dealer._count.vehicles}</td>
                  </tr>
                ))}
                {topDealerships.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-[#8B8FA3] py-8">No dealership data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ═══ CAMPAIGN PERFORMANCE ═══ */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-5 w-5 text-neon-cyan" />
          <h3 className="text-sm font-semibold text-[#E8EAED]">Campaign Performance</h3>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign, index) => {
          const budgetUsed = campaign.budget > 0 ? (campaign.spent / campaign.budget * 100) : 0;
          const ctr = campaign.reach > 0 ? (campaign.clicks / campaign.reach * 100) : 0;

          return (
            <motion.div key={campaign.id || index} variants={itemVariants}>
              <div className="glass-card p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#E8EAED]">{campaign.name}</h4>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                      {campaign.type}
                    </span>
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
                    campaign.status === 'active'
                      ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                      : 'bg-white/5 text-[#8B8FA3] border border-white/5'
                  )}>
                    {campaign.status}
                  </span>
                </div>

                {/* Budget Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#8B8FA3]">Budget Utilization</span>
                    <span className="font-mono text-[#E8EAED]">
                      {formatCurrency(campaign.spent)}{' '}
                      <span className="text-[#8B8FA3]">/ {formatCurrency(campaign.budget)}</span>
                    </span>
                  </div>
                  <div className="neon-progress h-2 w-full">
                    <div
                      className="neon-progress-bar h-full"
                      style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neon-green/10">
                      <Eye className="h-3.5 w-3.5 text-neon-green" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#8B8FA3] uppercase tracking-wider leading-none">Reach</p>
                      <p className="text-sm font-semibold font-mono text-[#E8EAED] mt-0.5">
                        {(campaign.reach || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neon-cyan/10">
                      <MousePointerClick className="h-3.5 w-3.5 text-neon-cyan" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#8B8FA3] uppercase tracking-wider leading-none">Clicks</p>
                      <p className="text-sm font-semibold font-mono text-[#E8EAED] mt-0.5">
                        {(campaign.clicks || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neon-gold/10">
                      <Trophy className="h-3.5 w-3.5 text-neon-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#8B8FA3] uppercase tracking-wider leading-none">Conversions</p>
                      <p className="text-sm font-semibold font-mono text-[#E8EAED] mt-0.5">
                        {(campaign.conversions || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#A855F7]/10">
                      <Percent className="h-3.5 w-3.5 text-[#A855F7]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#8B8FA3] uppercase tracking-wider leading-none">CTR</p>
                      <p className="text-sm font-semibold font-mono text-[#E8EAED] mt-0.5">
                        {ctr.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {campaigns.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#8B8FA3]">
            <Globe className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No campaign data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}