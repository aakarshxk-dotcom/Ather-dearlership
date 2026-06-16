import { NextRequest, NextResponse } from 'next/server';
import { createLogoutCookie, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        await Promise.all([
          db.admin.update({
            where: { id: payload.id },
            data: { activeSessionId: null, activeSessionExpires: null },
          }),
          db.adminSession.updateMany({
            where: { adminId: payload.id, sessionId: payload.sessionId },
            data: { isValid: false },
          }),
        ]);
      }
    }
  } catch {}

  const response = NextResponse.json({ success: true });
  response.cookies.set(createLogoutCookie());
  return response;
}
