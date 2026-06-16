'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettings() {
  const [user, setUser] = useState<{ name: string; username: string; role: string; email?: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      // Since the API doesn't have a dedicated password change endpoint,
      // we show a message indicating the feature
      toast.info('Password change requires server-side configuration. Contact the developer to enable this feature.');
    } catch {
      toast.error('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Info */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-[#059669]/10 flex items-center justify-center">
              <User className="h-5 w-5 text-[#059669]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#111827]">Admin Profile</h2>
              <p className="text-xs text-gray-500">Your account information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Name</Label>
                <p className="text-sm font-medium text-[#111827] mt-1">{user?.name || 'Admin'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Username</Label>
                <p className="text-sm font-medium text-[#111827] mt-1">{user?.username || 'admin'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Role</Label>
                <p className="text-sm font-medium text-[#111827] mt-1 capitalize">{user?.role || 'admin'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Email</Label>
                <p className="text-sm font-medium text-[#111827] mt-1">{user?.email || 'admin@atherdealership.in'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#111827]">Change Password</h2>
              <p className="text-xs text-gray-500">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-xs text-gray-500">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 h-10 max-w-sm"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="text-xs text-gray-500">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 h-10 max-w-sm"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-xs text-gray-500">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 h-10 max-w-sm"
                placeholder="Confirm new password"
              />
            </div>
            <Separator />
            <Button type="submit" disabled={changingPassword} className="bg-[#059669] hover:bg-[#047857]">
              {changingPassword && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}