import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  let dbConnected = false;
  let adminCount = -1;
  let prismaModels: string[] = [];
  let errors: string[] = [];

  // 1) Check Prisma models
  try {
    prismaModels = Object.keys(db).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  } catch (e) {
    errors.push('prisma models error: ' + String(e));
  }

  // 2) Check DB connection
  try {
    await db.$queryRawUnsafe('SELECT 1 AS connected');
    dbConnected = true;
  } catch (e) {
    errors.push('db connection error: ' + String(e));
  }

  // 3) Check admin user exists
  if (dbConnected) {
    try {
      adminCount = await (db.admin as any).count();
    } catch (e) {
      errors.push('admin count error: ' + String(e));
    }

    // 4) Try to find the exact admin user
    let adminUser: unknown = null;
    try {
      adminUser = await (db.admin as any).findFirst({ where: { username: 'admin' } });
    } catch (e) {
      errors.push('admin findFirst error: ' + String(e));
    }

    // 5) Also try adminSession model
    let adminSessionCount = -1;
    try {
      adminSessionCount = await (db.adminSession as any).count();
    } catch (e) {
      errors.push('adminSession count error: ' + String(e));
    }

    return NextResponse.json({
      success: true,
      database: 'connected',
      prismaModels,
      adminCount,
      adminUserFound: !!adminUser,
      adminSessionCount,
      adminUser: adminUser ? { id: (adminUser as any).id, username: (adminUser as any).username, name: (adminUser as any).name } : null,
      dbHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || null,
      nodeEnv: process.env.NODE_ENV,
      errors: errors.length > 0 ? errors : undefined,
    });
  }

  return NextResponse.json({
    success: false,
    database: 'disconnected',
    prismaModels,
    dbHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || null,
    nodeEnv: process.env.NODE_ENV,
    errors,
  }, { status: 500 });
}
