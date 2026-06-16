'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push('/admin/login');
          return;
        }
        setAuthenticated(true);

        const dashRes = await fetch('/api/dashboard');
        const dashData = await dashRes.json();
        setData(dashData);
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of your dealership leads and activity</p>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Applications" value={data.stats.totalLeads} color="bg-blue-500" />
              <StatCard label="New Applications" value={data.stats.newLeads} color="bg-emerald-500" />
              <StatCard label="Approved" value={data.stats.approvedLeads} color="bg-green-500" />
              <StatCard label="Rejected" value={data.stats.rejectedLeads} color="bg-red-500" />
              <StatCard label="Contact Messages" value={data.stats.contactMessages} color="bg-purple-500" />
              <StatCard label="Unread Messages" value={data.stats.unreadMessages} color="bg-amber-500" />
              <StatCard label="Newsletter Subs" value={data.stats.newsletterSubscribers} color="bg-indigo-500" />
              <StatCard label="Conversion Rate" value={`${data.stats.conversionRate}%`} color="bg-teal-500" />
              <StatCard label="This Week" value={data.stats.thisWeek} color="bg-pink-500" />
              <StatCard label="This Month" value={data.stats.thisMonth} color="bg-cyan-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
                {data.recentLeads.length === 0 ? (
                  <p className="text-gray-500 text-sm">No applications yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.recentLeads.map((lead: any) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{lead.fullName}</p>
                          <p className="text-xs text-gray-500">{lead.city}, {lead.state}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                          lead.status === 'Contacted' ? 'bg-amber-100 text-amber-700' :
                          lead.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Applications by Status</h2>
                {data.leadsByStatus.length === 0 ? (
                  <p className="text-gray-500 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.leadsByStatus.map((item: any) => {
                      const total = data.stats.totalLeads || 1;
                      const pct = Math.round((item.count / total) * 100);
                      return (
                        <div key={item.status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{item.status}</span>
                            <span className="font-medium">{item.count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
