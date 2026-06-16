import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createToken, createAuthCookie } from '@/lib/auth';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const admin = await db.admin.findFirst({
      where: { username, password: hashedPassword, isActive: true },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    const token = await createToken({
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: admin.id, name: admin.name, username: admin.username, role: admin.role },
    });

    response.cookies.set(createAuthCookie(token));
    return response;
  } catch (error) {
    console.error('Auth login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
