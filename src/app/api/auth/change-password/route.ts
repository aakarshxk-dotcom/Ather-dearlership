import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const admin = await db.admin.findUnique({ where: { id: user.id } });
    if (!admin || admin.password !== hashPassword(currentPassword)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    await db.admin.update({
      where: { id: user.id },
      data: { password: hashPassword(newPassword) },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
