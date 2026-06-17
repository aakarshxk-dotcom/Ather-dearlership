import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.$queryRawUnsafe<Array<unknown>>('SELECT 1 AS connected');
    return NextResponse.json({
      success: true,
      database: 'connected',
      result,
      dbHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || null,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    return NextResponse.json({
      success: false,
      database: 'disconnected',
      errorName: err?.name || null,
      errorMessage: err?.message || null,
      errorCode: err?.code || null,
      stack: err?.stack || null,
      dbHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || null,
      nodeEnv: process.env.NODE_ENV,
    }, { status: 500 });
  }
}
