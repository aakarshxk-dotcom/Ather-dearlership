'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, ImageOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const CATEGORIES = ['showroom', 'interior', 'exterior', 'launch_event', 'team'];

const EMPTY_FORM = {
  title: '',
  category: 'showroom',
  imageUrl: '',
  altText: '',
  order: 0,
  isActive: true,
};

export function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) setImages(await res.json());
    } catch {
      toast.error('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (img: GalleryImage) => {
    setEditing(img);
    setForm({
      title: img.title,
      category: img.category,
      imageUrl: img.imageUrl,
      altText: img.altText || '',
      order: img.order,
      isActive: img.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.imageUrl) {
      toast.error('Title, category, and image URL are required');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? '/api/admin/gallery' : '/api/admin/gallery';
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(editing ? 'Image updated' : 'Image added');
        setDialogOpen(false);
        fetchImages();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to save');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (img: GalleryImage) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: img.id, isActive: !img.isActive }),
      });
      if (res.ok) {
        setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, isActive: !img.isActive } : i));
      }
    } catch { /* ignore */ }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Image deleted');
        setDeleteId(null);
        fetchImages();
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatCategory = (c: string) => c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="h-9 bg-[#059669] hover:bg-[#047857]" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Image
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm"><CardContent className="p-0">
              <Skeleton className="h-40 w-full rounded-t-xl" />
              <div className="p-3 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
            </CardContent></Card>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16">
          <ImageOff className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No gallery images yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="border-0 shadow-sm overflow-hidden group">
              <div className="relative h-40 bg-gray-100">
                <img
                  src={img.imageUrl}
                  alt={img.altText || img.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {!img.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{img.title}</p>
                    <p className="text-xs text-gray-400">{formatCategory(img.category)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Switch checked={img.isActive} onCheckedChange={() => toggleActive(img)} className="scale-75" />
                    <button onClick={() => openEdit(img)} className="h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(img.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Image' : 'Add Image'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 h-9" placeholder="Image title" />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{formatCategory(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Image URL</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="mt-1 h-9" placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs">Alt Text</Label>
              <Input value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} className="mt-1 h-9" placeholder="Description for accessibility" />
            </div>
            <div>
              <Label className="text-xs">Order (0 = first)</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="mt-1 h-9" />
            </div>
            {form.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-gray-200 h-32">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#059669] hover:bg-[#047857]" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editing ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>This image will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}