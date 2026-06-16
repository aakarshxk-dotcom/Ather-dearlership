'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Shield, UserCog, Users, UserCheck, Wrench, Plus,
  Loader2, MoreHorizontal, Pencil, Trash2, Power, UserCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ── Types ──────────────────────────────────────────────
type Role = 'admin' | 'dealer' | 'customer' | 'sales_manager' | 'service_manager';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  dealershipId: string | null;
  createdAt: string;
  dealership: { name: string } | null;
}

interface DealershipOption { id: string; name: string }
interface RoleCount { role: string; count: number }

const ROLE_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgGlow: string;
  badgeText: string;
  avatarGrad: string;
}> = {
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgGlow: 'bg-red-500/10',
    badgeText: 'text-red-400',
    avatarGrad: 'from-red-500 to-rose-600',
  },
  dealer: {
    label: 'Dealer',
    icon: UserCog,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    bgGlow: 'bg-orange-500/10',
    badgeText: 'text-orange-400',
    avatarGrad: 'from-orange-500 to-amber-600',
  },
  customer: {
    label: 'Customer',
    icon: Users,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgGlow: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    avatarGrad: 'from-cyan-500 to-blue-600',
  },
  sales_manager: {
    label: 'Sales Manager',
    icon: UserCheck,
    color: 'text-neon-green',
    borderColor: 'border-neon-green/30',
    bgGlow: 'bg-neon-green/10',
    badgeText: 'text-neon-green',
    avatarGrad: 'from-neon-green to-emerald-600',
  },
  service_manager: {
    label: 'Service Manager',
    icon: Wrench,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgGlow: 'bg-purple-500/10',
    badgeText: 'text-purple-400',
    avatarGrad: 'from-purple-500 to-violet-600',
  },
};

const ROLE_ORDER: Role[] = ['admin', 'dealer', 'customer', 'sales_manager', 'service_manager'];

// ── Component ──────────────────────────────────────────
export default function Admin() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [dealerships, setDealerships] = useState<DealershipOption[]>([]);
  const [roles, setRoles] = useState<RoleCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Add form
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRole, setAddRole] = useState<string>('customer');
  const [addDealership, setAddDealership] = useState('');

  // Edit form
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<string>('customer');
  const [editDealership, setEditDealership] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      setUsers(data.users || []);
      setDealerships(data.dealerships || []);
      setRoles(data.roles || []);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getRoleCount = (role: string) =>
    roles.find(r => r.role === role)?.count || 0;

  const resetAddForm = () => {
    setAddName(''); setAddEmail(''); setAddPhone('');
    setAddRole('customer'); setAddDealership('');
  };

  const openEdit = (user: UserRecord) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
    setEditDealership(user.dealershipId || '');
    setEditOpen(true);
  };

  const openDelete = (user: UserRecord) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  };

  const handleAdd = async () => {
    if (!addName || !addEmail) {
      toast.error('Name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addName,
          email: addEmail,
          phone: addPhone || null,
          role: addRole,
          dealershipId: addDealership || null,
          isActive: true,
        }),
      });
      toast.success('User created successfully');
      setAddOpen(false);
      resetAddForm();
      fetchData();
    } catch {
      toast.error('Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editUser || !editName || !editEmail) return;
    setSubmitting(true);
    try {
      await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editUser.id,
          name: editName,
          email: editEmail,
          phone: editPhone || null,
          role: editRole,
          dealershipId: editDealership || null,
        }),
      });
      toast.success('User updated successfully');
      setEditOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user: UserRecord) => {
    try {
      await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
      });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchData();
    } catch {
      toast.error('Failed to toggle user status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin?id=${deleteTarget.id}`, { method: 'DELETE' });
      toast.success('User deleted successfully');
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleChangeRole = async (user: UserRecord, newRole: string) => {
    try {
      await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, role: newRole }),
      });
      toast.success(`Role changed to ${ROLE_CONFIG[newRole]?.label || newRole}`);
      fetchData();
    } catch {
      toast.error('Failed to change role');
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const getAvatarGrad = (role: string) =>
    ROLE_CONFIG[role]?.avatarGrad || 'from-gray-500 to-gray-600';

  // Table columns
  const columns = useMemo<ColumnDef<UserRecord>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const name = row.original.name;
        const role = row.original.role;
        return (
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center justify-center rounded-full size-8 shrink-0 text-white text-xs font-bold bg-gradient-to-br',
              getAvatarGrad(role)
            )}>
              {getInitials(name)}
            </div>
            <span className="font-medium text-sm text-white">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.phone || '—'}</span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.role;
        const cfg = ROLE_CONFIG[role];
        return (
          <Badge
            variant="outline"
            className={cn(
              'border text-xs font-medium bg-white/5',
              cfg?.borderColor,
              cfg?.badgeText
            )}
          >
            {cfg?.label || role}
          </Badge>
        );
      },
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
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => handleToggleActive(row.original)}
          className="data-[state=checked]:bg-neon-green"
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[#0D1137] border-white/10 text-white"
            >
              <DropdownMenuItem
                onClick={() => openEdit(user)}
                className="text-sm focus:bg-white/5 focus:text-white cursor-pointer"
              >
                <Pencil className="mr-2 size-4 text-neon-cyan" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => handleChangeRole(user, 'admin')}
                className="text-sm focus:bg-white/5 focus:text-white cursor-pointer"
              >
                <UserCircle className="mr-2 size-4 text-red-400" />
                Set as Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeRole(user, 'dealer')}
                className="text-sm focus:bg-white/5 focus:text-white cursor-pointer"
              >
                <UserCircle className="mr-2 size-4 text-orange-400" />
                Set as Dealer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeRole(user, 'sales_manager')}
                className="text-sm focus:bg-white/5 focus:text-white cursor-pointer"
              >
                <UserCircle className="mr-2 size-4 text-neon-green" />
                Set as Sales Mgr
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeRole(user, 'service_manager')}
                className="text-sm focus:bg-white/5 focus:text-white cursor-pointer"
              >
                <UserCircle className="mr-2 size-4 text-purple-400" />
                Set as Service Mgr
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => handleToggleActive(user)}
                className="text-sm focus:bg-white/5 focus:text-white cursor-pointer"
              >
                <Power className="mr-2 size-4 text-yellow-400" />
                {user.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => openDelete(user)}
                className="text-sm text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight gradient-text-green">
            System Control
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise administration and access management
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={(v) => { setAddOpen(v); if (!v) resetAddForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-neon-green text-sm">
              <Plus className="size-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-[#0D1137] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Add New User</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a new user account with role assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Name *</Label>
                <Input
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Full name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Email *</Label>
                <Input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Phone</Label>
                <Input
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Role *</Label>
                <Select value={addRole} onValueChange={setAddRole}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D1137] border-white/10">
                    {ROLE_ORDER.map((role) => (
                      <SelectItem key={role} value={role} className="text-white focus:bg-white/5 focus:text-white">
                        {ROLE_CONFIG[role].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Dealership</Label>
                <Select value={addDealership} onValueChange={setAddDealership}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select dealership" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D1137] border-white/10">
                    {dealerships.map((d) => (
                      <SelectItem key={d.id} value={d.id} className="text-white focus:bg-white/5 focus:text-white">
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => { setAddOpen(false); resetAddForm(); }}
                className="border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                className="btn-neon-green text-sm"
                onClick={handleAdd}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Distribution Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {ROLE_ORDER.map((role) => {
          const cfg = ROLE_CONFIG[role];
          const Icon = cfg.icon;
          const count = loading ? null : getRoleCount(role);
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: ROLE_ORDER.indexOf(role) * 0.05 }}
              className={cn(
                'glass-card p-4 flex flex-col items-center justify-center gap-2 cursor-default',
                cfg.borderColor
              )}
            >
              <div className={cn('flex items-center justify-center rounded-lg p-2.5', cfg.bgGlow, cfg.color)}>
                <Icon className="size-5" />
              </div>
              <div className="text-center">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{cfg.label}</p>
                <p className="text-2xl font-bold font-mono text-white mt-0.5">
                  {loading ? <Skeleton className="h-7 w-8 inline-block bg-white/10" /> : count}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Users Table */}
      <div className="glass-card-static p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">All Users</h3>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Dealership
                  </th>
                  <th className="text-center px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Active
                  </th>
                  <th className="text-right px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <motion.tr
                      key={row.original.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md bg-[#0D1137] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update user information and role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Name *</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Email *</Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Phone</Label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Role *</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1137] border-white/10">
                  {ROLE_ORDER.map((role) => (
                    <SelectItem key={role} value={role} className="text-white focus:bg-white/5 focus:text-white">
                      {ROLE_CONFIG[role].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Dealership</Label>
              <Select value={editDealership} onValueChange={setEditDealership}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select dealership" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1137] border-white/10">
                  {dealerships.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="text-white focus:bg-white/5 focus:text-white">
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              className="btn-neon-green text-sm"
              onClick={handleEdit}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#0D1137] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="text-white font-medium">{deleteTarget?.name}</span>?
              This action cannot be undone and will permanently remove the user
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteOpen(false)}
              className="border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}