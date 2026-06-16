'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search, Download, FileSpreadsheet, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

/* ─── Types ─── */
interface Lead {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  feedbackMessage?: string;
  status: string;
  source?: string;
  adminNotes?: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

type StatusFilter = 'all' | 'New' | 'Contacted' | 'Approved' | 'Rejected';

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
};

/* ─── Component ─── */
export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter, search, page: String(page), limit: String(limit) });
      const res = await fetch(`/api/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      }
    } catch { toast.error('Failed to fetch leads'); }
    finally { setLoading(false); }
  }, [statusFilter, search, page, limit]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchLeads(); };

  const openView = (lead: Lead) => { setViewLead(lead); setNotes(lead.adminNotes || ''); };
  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setEditForm({ fullName: lead.fullName, email: lead.email, phone: lead.phone, whatsapp: lead.whatsapp, city: lead.city, state: lead.state, country: lead.country, pinCode: lead.pinCode, status: lead.status });
  };

  const saveEdit = async () => {
    if (!editLead) return;
    setSaving(true);
    try {
      const res = await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editLead.id, ...editForm }) });
      if (res.ok) { toast.success('Lead updated'); setEditLead(null); fetchLeads(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } catch { toast.error('Network error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Lead deleted'); setDeleteId(null); fetchLeads(); }
      else toast.error('Failed to delete');
    } catch { toast.error('Network error'); }
    finally { setDeleting(false); }
  };

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      const res = await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: leadId, status }) });
      if (res.ok) { toast.success('Status updated'); fetchLeads(); if (viewLead?.id === leadId) setViewLead({ ...viewLead, status }); }
    } catch { toast.error('Failed'); }
  };

  const saveNotes = async () => {
    if (!viewLead) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: viewLead.id, adminNotes: notes }) });
      if (res.ok) { toast.success('Notes saved'); setViewLead({ ...viewLead, adminNotes: notes }); }
    } catch { toast.error('Failed'); }
    finally { setSavingNotes(false); }
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    setExporting(true);
    try {
      const res = await fetch(`/api/leads/export?format=${format}&status=${statusFilter}`);
      if (!res.ok) { toast.error('Export failed'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch { toast.error('Export failed'); }
    finally { setExporting(false); }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  /* ─── Truncate ID ─── */
  const shortId = (id: string) => id.slice(0, 8).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search name, email, phone, city..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 bg-white" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as StatusFilter); setPage(1); }}>
            <SelectTrigger className="w-[150px] h-10 bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="outline" size="sm" className="h-10">Search</Button>
        </form>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-10" onClick={() => handleExport('csv')} disabled={exporting}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
          <Button variant="outline" size="sm" className="h-10" onClick={() => handleExport('excel')} disabled={exporting}>
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Card className="border-0 shadow-sm"><CardContent className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</CardContent></Card>
      ) : leads.length === 0 ? (
        <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400">No leads found</CardContent></Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-t">
                  {['ID', 'Name', 'Email', 'Mobile', 'City', 'State', 'Country', 'PIN', 'Status', 'Date', 'Actions'].map((h) => (
                    <TableHead key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono text-xs text-gray-500">{shortId(lead.id)}</TableCell>
                    <TableCell className="font-medium text-gray-900 whitespace-nowrap">{lead.fullName}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{lead.email}</TableCell>
                    <TableCell className="text-gray-500 text-sm whitespace-nowrap">{lead.phone}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{lead.city}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{lead.state}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{lead.country}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{lead.pinCode}</TableCell>
                    <TableCell><Badge variant="secondary" className={STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-700'}>{lead.status}</Badge></TableCell>
                    <TableCell className="text-gray-400 text-sm whitespace-nowrap">{fmtDate(lead.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openView(lead)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(lead)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => setDeleteId(lead.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {leads.length} of {total} leads</p>
            <div className="flex items-center gap-2">
              <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[80px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem><SelectItem value="100">100</SelectItem></SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm text-gray-500">{page} / {totalPages || 1}</span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      )}

      {/* ═══ VIEW DIALOG ═══ */}
      <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {viewLead && (
            <>
              <DialogHeader>
                <DialogTitle>Lead Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Lead ID', shortId(viewLead.id)],
                  ['Full Name', viewLead.fullName],
                  ['Email', viewLead.email],
                  ['Mobile', viewLead.phone],
                  ['WhatsApp', viewLead.whatsapp],
                  ['City', viewLead.city],
                  ['State', viewLead.state],
                  ['Country', viewLead.country],
                  ['PIN Code', viewLead.pinCode],
                  ['Status', viewLead.status],
                  ['Source', viewLead.source || 'website'],
                  ['Submitted', fmtDate(viewLead.createdAt)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-gray-400 text-xs font-medium uppercase">{label}</p>
                    <p className="text-gray-900 font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {viewLead.feedbackMessage && (
                <div className="mt-4">
                  <p className="text-gray-400 text-xs font-medium uppercase">Feedback / Message</p>
                  <p className="text-gray-700 mt-1 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">{viewLead.feedbackMessage}</p>
                </div>
              )}

              {/* Status change */}
              <div className="mt-4">
                <Label className="text-xs font-medium text-gray-400 uppercase">Change Status</Label>
                <Select value={viewLead.status} onValueChange={(v) => handleStatusChange(viewLead.id, v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin notes */}
              <div className="mt-4">
                <Label className="text-xs font-medium text-gray-400 uppercase">Admin Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1.5" placeholder="Add internal notes..." />
                <Button size="sm" className="mt-2" onClick={saveNotes} disabled={savingNotes}>
                  {savingNotes ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                  Save Notes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══ EDIT DIALOG ═══ */}
      <Dialog open={!!editLead} onOpenChange={() => setEditLead(null)}>
        <DialogContent className="max-w-lg">
          {editLead && (
            <>
              <DialogHeader><DialogTitle>Edit Lead</DialogTitle></DialogHeader>
              <div className="space-y-4">
                {['fullName', 'email', 'phone', 'whatsapp', 'city', 'state', 'country', 'pinCode'].map((field) => (
                  <div key={field}>
                    <Label className="text-sm">{field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</Label>
                    <Input value={editForm[field] || ''} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} className="mt-1" />
                  </div>
                ))}
                <div>
                  <Label className="text-sm">Status</Label>
                  <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditLead(null)}>Cancel</Button>
                <Button onClick={saveEdit} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══ DELETE DIALOG ═══ */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}