'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function init() {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      if (!authData.authenticated) { router.push('/admin/login'); return; }
      setAuthenticated(true);
      setUser(authData.user);
    }
    init();
  }, [router]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(data.error || 'Failed to update password');
      }
    } catch {
      setMessage('Network error');
    }
  }

  if (authenticated === null) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>;

  return (
    <AdminLayout>
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your admin account</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Profile</h2>
          {user && (
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500">Name</label><p className="text-sm font-medium">{user.name}</p></div>
              <div><label className="text-xs text-gray-500">Username</label><p className="text-sm font-medium">{user.username}</p></div>
              <div><label className="text-xs text-gray-500">Role</label><p className="text-sm font-medium capitalize">{user.role}</p></div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          {message && (
            <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Update Password</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
