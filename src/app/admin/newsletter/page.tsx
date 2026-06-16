'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Download, Trash2 } from 'lucide-react';

export default function AdminNewsletterPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      if (!authData.authenticated) { router.push('/admin/login'); return; }
      setAuthenticated(true);
      fetchSubscribers();
    }
    init();
  }, [router]);

  async function fetchSubscribers() {
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setTotal(data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function deleteSubscriber(id: string) {
    if (!confirm('Remove this subscriber?')) return;
    await fetch(`/api/newsletter?id=${id}`, { method: 'DELETE' });
    fetchSubscribers();
  }

  function exportCSV() {
    const headers = 'Email,Status,Subscribed At';
    const rows = subscribers.map((s: any) => `${s.email},${s.isActive ? 'Active' : 'Inactive'},${s.createdAt}`);
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authenticated === null) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Newsletter</h1><p className="text-gray-500">{total} subscribers</p></div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          {loading ? <div className="p-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" /></div>
          : subscribers.length === 0 ? <div className="p-12 text-center text-gray-500">No subscribers yet</div>
          : <div className="divide-y">
              {subscribers.map((sub: any) => (
                <div key={sub.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{sub.email}</p>
                    <p className="text-xs text-gray-500">{new Date(sub.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {sub.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => deleteSubscriber(sub.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </AdminLayout>
  );
}
