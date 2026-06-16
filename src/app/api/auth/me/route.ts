import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false });
    }

    const [admin, sessionRecord] = await Promise.all([
      db.admin.findUnique({
        where: { id: payload.id },
        select: { activeSessionId: true, activeSessionExpires: true, isActive: true },
      }),
      db.adminSession.findFirst({
        where: { sessionId: payload.sessionId, adminId: payload.id, isValid: true },
      }),
    ]);

    if (!admin || !admin.isActive) {
      return NextResponse.json({ authenticated: false });
    }

    if (!payload.sessionId || admin.activeSessionId !== payload.sessionId) {
      return NextResponse.json({ authenticated: false });
    }

    if (admin.activeSessionExpires && new Date() > admin.activeSessionExpires) {
      await Promise.all([
        db.admin.update({
          where: { id: payload.id },
          data: { activeSessionId: null, activeSessionExpires: null },
        }),
        db.adminSession.updateMany({
          where: { adminId: payload.id, isValid: true },
          data: { isValid: false },
        }),
      ]);
      return NextResponse.json({ authenticated: false });
    }

    if (sessionRecord) {
      await db.adminSession.update({
        where: { id: sessionRecord.id },
        data: { lastActive: new Date() },
      });
    }

    return NextResponse.json({ authenticated: true, user: payload });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
