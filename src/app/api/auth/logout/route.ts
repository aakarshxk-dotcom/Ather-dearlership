import { NextResponse } from 'next/server';
import { deleteSession, createLogoutCookie } from '@/lib/auth';

export async function POST() {
  try {
    await deleteSession();
  } catch {}

  const response = NextResponse.json({ success: true });
  response.cookies.set(createLogoutCookie());
  return response;
}
