import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  let dbStatus = 'unknown';
  let tables = { leadsTable: false, adminTable: false };
  let dbError: string | null = null;

  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'disconnected';
    dbError = e instanceof Error ? e.message : String(e);
  }

  if (dbStatus === 'connected') {
    try {
      const result = await db.$queryRaw<{ table_name: string }[]>`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name IN ('FranchiseLead', 'Admin')
      `;
      tables.leadsTable = result.some(r => r.table_name === 'FranchiseLead');
      tables.adminTable = result.some(r => r.table_name === 'Admin');
    } catch (e) {
      dbError = e instanceof Error ? e.message : String(e);
    }
  }

  const dbUrl = process.env.DATABASE_URL || '';
  const dbHost = dbUrl.includes('@') ? dbUrl.split('@')[1]?.split('/')[0] || 'unknown' : 'unknown';

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    database: dbStatus,
    dbError,
    dbHost,
    tables,
    note: tables.leadsTable
      ? 'ready'
      : 'run "npx prisma db push" to create database tables',
  });
}
