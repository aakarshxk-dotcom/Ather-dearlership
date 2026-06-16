import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalNew, recentLeads] = await Promise.all([
      db.franchiseLead.count({ where: { status: 'New' } }),
      db.franchiseLead.findMany({
        where: { createdAt: { gte: twentyFourHoursAgo } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          fullName: true,
          city: true,
          state: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalNew,
      recentLeads,
      unreadCount: totalNew,
    });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ totalNew: 0, recentLeads: [], unreadCount: 0 });
  }
}
