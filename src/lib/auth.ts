import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import { db } from '@/lib/db';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export async function createSession(adminId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.adminSession.create({
    data: { adminId, token, expiresAt },
  });

  return token;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;

    const session = await db.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });

    if (!session) return null;
    if (new Date() > session.expiresAt) {
      await db.adminSession.delete({ where: { id: session.id } });
      return null;
    }

    return {
      id: session.admin.id,
      username: session.admin.username,
      name: session.admin.name,
      role: session.admin.role,
    };
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (token) {
      await db.adminSession.deleteMany({ where: { token } });
    }
  } catch {}
}

export function createAuthCookie(token: string) {
  return {
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24,
  };
}

export function createLogoutCookie() {
  return {
    name: 'auth-token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}
