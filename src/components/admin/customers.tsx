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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Users, Eye } from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  dealership: { name: string; city: string } | null;
  _count: {
    orders: number;
    serviceAppointments: number;
    leads: number;
  };
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers');
        const data = await res.json();
        setCustomers(data.customers || []);
      } catch (e) {
        console.error('Failed to fetch customers:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center text-[10px] font-bold text-deep-space shrink-0">
                {getInitials(c.name)}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => (
          <span className="font-mono text-sm text-muted-foreground">
            {row.original.phone || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'dealership',
        header: 'Dealership',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.dealership?.name || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'orders',
        header: 'Orders',
        cell: ({ row }) => (
          <span className="font-mono text-sm text-foreground">
            {row.original._count.orders}
          </span>
        ),
      },
      {
        accessorKey: 'services',
        header: 'Services',
        cell: ({ row }) => (
          <span className="font-mono text-sm text-foreground">
            {row.original._count.serviceAppointments}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {fmtDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => setSelected(row.original)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-neon-green transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">
          Customer <span className="gradient-text-green">Intelligence</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">360° customer relationship management</p>
      </div>

      {/* Count Card */}
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-neon-green/10 border border-neon-green/20">
          <Users className="h-6 w-6 text-neon-green" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Customers</p>
          <p className="text-3xl font-bold font-mono neon-text-green">{customers.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card-static rounded-2xl overflow-hidden">
        <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No customers found</div>
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

      {/* Customer Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-deep-space border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Customer Profile</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center text-lg font-bold text-deep-space">
                  {getInitials(selected.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{selected.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px]',
                      selected.isActive
                        ? 'border-green-500/50 text-green-400 bg-green-500/10'
                        : 'border-red-500/50 text-red-400 bg-red-500/10'
                    )}
                  >
                    {selected.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="glass-card-static p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <p className="text-foreground text-xs break-all">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                    <p className="font-mono text-foreground text-xs">{selected.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Dealership</p>
                    <p className="text-foreground text-xs">{selected.dealership?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Joined</p>
                    <p className="text-foreground text-xs">{fmtDate(selected.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Orders', value: selected._count.orders },
                  { label: 'Services', value: selected._count.serviceAppointments },
                  { label: 'Leads', value: selected._count.leads },
                ].map((s) => (
                  <div key={s.label} className="glass-card-static p-3 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold font-mono neon-text-green">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}