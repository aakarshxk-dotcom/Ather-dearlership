import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { sendNewLeadEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Leads API] POST request body:', JSON.stringify(body));

    const required = ['fullName', 'phone', 'email', 'city', 'state', 'pinCode'];
    for (const field of required) {
      if (!body[field]) {
        console.warn('[Leads API] Missing required field:', field);
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const lead = await db.franchiseLead.create({
      data: {
        fullName: body.fullName,
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone,
        email: body.email,
        city: body.city,
        state: body.state,
        country: body.country || 'India',
        pinCode: body.pinCode,
        feedbackMessage: body.feedbackMessage || null,
        status: 'New',
        source: 'website',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      },
    });

    console.log('[Leads API] Lead created successfully:', lead.id);

    sendNewLeadEmail(lead).catch((err) => {
      console.warn('[Leads API] Email send skipped or failed:', err);
    });

    return NextResponse.json(
      { success: true, id: lead.id, message: 'Application submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : '';
    console.error('[Leads API] POST error:', errMsg);
    console.error('[Leads API] Stack:', errStack);

    const dbUrl = process.env.DATABASE_URL || '';
    const dbHost = dbUrl.includes('@') ? dbUrl.split('@')[1]?.split('/')[0] || 'unknown' : 'unknown';

    console.error('[Leads API] Active DB endpoint:', dbHost);

    const isDbError = errMsg.toLowerCase().includes('connect') ||
                      errMsg.toLowerCase().includes('timeout') ||
                      errMsg.toLowerCase().includes('does not exist') ||
                      errMsg.toLowerCase().includes('relation');

    return NextResponse.json(
      {
        success: false,
        error: isDbError
          ? `Database connection error. Target: ${dbHost}`
          : `Failed to submit application: ${errMsg}`,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '50', 10));

    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      db.franchiseLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.franchiseLead.count({ where }),
    ]);

    return NextResponse.json({ leads, total, page, limit });
  } catch (error) {
    console.error('Leads GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    if (updateData.status === 'Contacted') {
      updateData.lastContactedAt = new Date();
    }

    const updatedLead = await db.franchiseLead.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Leads PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    await db.franchiseLead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leads DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
