import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createToken, createAuthCookie, generateSessionId } from '@/lib/auth';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    console.log("LOGIN HIT");
    console.log("DB URL EXISTS:", !!process.env.DATABASE_URL);
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    let admin;
    try {
      admin = await db.admin.findFirst({
        where: { username, password: hashedPassword, isActive: true },
      });
      console.log("ADMIN FOUND:", !!admin);
    } catch (err) {
      console.log("PRISMA ERROR:", err);
      throw err;
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log("DB KEYS:", Object.keys(db));
    console.log("TYPE adminSession:", typeof db.adminSession);
    console.log("TYPE admin:", typeof db.admin);
    console.log("HAS adminSession:", db && typeof db === 'object' && 'adminSession' in db);

    const sessionId = generateSessionId();
    const deviceId = request.headers.get('x-device-id') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (admin.activeSessionId) {
      await db.adminSession.updateMany({
        where: { adminId: admin.id, isValid: true },
        data: { isValid: false },
      });
    }

    await db.adminSession.create({
      data: {
        adminId: admin.id,
        sessionId,
        deviceId,
        userAgent,
        ipAddress,
        expiresAt,
        lastActive: new Date(),
        isValid: true,
      },
    });

    await db.admin.update({
      where: { id: admin.id },
      data: {
        activeSessionId: sessionId,
        activeSessionExpires: expiresAt,
        lastLogin: new Date(),
      },
    });

    const token = await createToken({
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      sessionId,
      deviceId,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: admin.id, name: admin.name, username: admin.username, role: admin.role },
    });

    response.cookies.set(createAuthCookie(token));
    return response;
  } catch (error) {
    console.error("🚨 LOGIN ERROR FULL DUMP:", error);

    return Response.json({
      success: false,
      errorName: error?.name || null,
      errorMessage: error?.message || null,
      errorCode: error?.code || null,
      stack: error?.stack || null
    }, { status: 500 });
  }
}
