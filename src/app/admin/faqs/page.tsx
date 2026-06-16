'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminFAQsPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: 'general', order: 0 });

  useEffect(() => {
    async function init() {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      if (!authData.authenticated) { router.push('/admin/login'); return; }
      setAuthenticated(true);
      fetchFAQs();
    }
    init();
  }, [router]);

  async function fetchFAQs() {
    setLoading(true);
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function saveFAQ() {
    if (!form.question || !form.answer) return;
    await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ question: '', answer: '', category: 'general', order: 0 });
    setShowForm(false);
    fetchFAQs();
  }

  async function deleteFAQ(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
    fetchFAQs();
  }

  if (authenticated === null) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">FAQs</h1><p className="text-gray-500">{faqs.length} questions</p></div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer" className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]" rows={4} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="general">General</option>
              <option value="dealership">Dealership</option>
              <option value="investment">Investment</option>
              <option value="support">Support</option>
            </select>
            <div className="flex gap-2">
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" className="w-24 px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <button onClick={saveFAQ} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Save</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {faqs.map((faq: any) => (
            <div key={faq.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{faq.question}</p>
                  <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{faq.category}</span>
                    <span className="text-xs text-gray-400">Order: {faq.order}</span>
                  </div>
                </div>
                <button onClick={() => deleteFAQ(faq.id)} className="text-red-400 hover:text-red-600 ml-4"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
