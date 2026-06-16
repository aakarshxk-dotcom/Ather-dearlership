'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import { Trash2, Mail, MailOpen } from 'lucide-react';

export default function AdminContactPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      if (!authData.authenticated) { router.push('/admin/login'); return; }
      setAuthenticated(true);
      fetchMessages();
    }
    init();
  }, [router]);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setMessages(data.messages || []);
      setTotal(data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function toggleRead(id: string, isRead: boolean) {
    await fetch('/api/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isRead: !isRead }),
    });
    fetchMessages();
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
    fetchMessages();
  }

  if (authenticated === null) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500">{total} messages</p>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          {loading ? <div className="p-12 text-center"><Spinner /></div>
          : messages.length === 0 ? <div className="p-12 text-center text-gray-500">No messages</div>
          : <div className="divide-y">
              {messages.map((msg: any) => (
                <div key={msg.id} className={`p-4 ${!msg.isRead ? 'bg-emerald-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => toggleRead(msg.id, msg.isRead)} className="text-gray-400 hover:text-emerald-600">
                          {msg.isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                        </button>
                        <span className="font-medium text-sm">{msg.name}</span>
                        <span className="text-xs text-gray-500">{msg.email}</span>
                        {msg.phone && <span className="text-xs text-gray-400">{msg.phone}</span>}
                      </div>
                      <p className="text-xs font-medium text-emerald-600 mb-1">{msg.subject}</p>
                      <p className="text-sm text-gray-600">{msg.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => deleteMessage(msg.id)} className="text-red-400 hover:text-red-600 ml-4">
                      <Trash2 className="w-4 h-4" />
                    </button>
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

function LoadingSpinner() {
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Spinner /></div>;
}
function Spinner() {
  return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />;
}
