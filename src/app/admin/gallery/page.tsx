'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminGalleryPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'showroom', imageUrl: '', altText: '' });

  useEffect(() => {
    async function init() {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      if (!authData.authenticated) { router.push('/admin/login'); return; }
      setAuthenticated(true);
      fetchImages();
    }
    init();
  }, [router]);

  async function fetchImages() {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery/admin');
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function addImage() {
    if (!form.title || !form.category || !form.imageUrl) return;
    await fetch('/api/gallery/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', category: 'showroom', imageUrl: '', altText: '' });
    setShowForm(false);
    fetchImages();
  }

  async function deleteImage(id: string) {
    if (!confirm('Delete this image?')) return;
    await fetch(`/api/gallery/admin?id=${id}`, { method: 'DELETE' });
    fetchImages();
  }

  if (authenticated === null) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
            <p className="text-gray-500">{images.length} images</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="showroom">Showroom</option>
              <option value="interior">Interior</option>
              <option value="exterior">Exterior</option>
              <option value="launch_event">Launch Event</option>
              <option value="team">Team</option>
            </select>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL" className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            <input value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} placeholder="Alt text" className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            <button onClick={addImage} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Save</button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img: any) => (
            <div key={img.id} className="bg-white rounded-xl border overflow-hidden group relative">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {img.imageUrl ? (
                  <img src={img.imageUrl} alt={img.altText || img.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">No image</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{img.title}</p>
                <p className="text-xs text-gray-500">{img.category}</p>
              </div>
              <button onClick={() => deleteImage(img.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
