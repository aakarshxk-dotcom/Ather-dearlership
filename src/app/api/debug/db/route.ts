import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  let dbConnected = false;
  let adminCount = -1;
  let adminUser: unknown = null;
  let sessionCount = -1;
  let errors: string[] = [];

  try {
    await db.$queryRawUnsafe('SELECT 1 AS connected');
    dbConnected = true;
  } catch (e) {
    errors.push('db connection: ' + String(e));
  }

  if (dbConnected) {
    try { adminCount = await db.admin.count(); } catch (e) { errors.push('admin count: ' + String(e)); }
    try { adminUser = await db.admin.findFirst({ where: { username: 'admin' } }); } catch (e) { errors.push('admin find: ' + String(e)); }
    try { sessionCount = await db.adminSession.count(); } catch (e) { errors.push('session count: ' + String(e)); }
  }

  return NextResponse.json({
    success: dbConnected,
    database: dbConnected ? 'connected' : 'disconnected',
    adminCount,
    adminUserFound: !!adminUser,
    adminUser: adminUser ? { id: (adminUser as any).id, username: (adminUser as any).username } : null,
    sessionCount,
    dbHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || null,
    nodeEnv: process.env.NODE_ENV,
    errors: errors.length > 0 ? errors : undefined,
  });
}
