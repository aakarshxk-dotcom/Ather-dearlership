import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalLeads, newLeads, contactedLeads, approvedLeads, rejectedLeads, thisWeek, thisMonth, contactMessages, unreadMessages, newsletterSubscribers, recentLeads, leadsByStatus] =
      await Promise.all([
        db.franchiseLead.count(),
        db.franchiseLead.count({ where: { status: 'New' } }),
        db.franchiseLead.count({ where: { status: 'Contacted' } }),
        db.franchiseLead.count({ where: { status: 'Approved' } }),
        db.franchiseLead.count({ where: { status: 'Rejected' } }),
        db.franchiseLead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        db.franchiseLead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        db.contactSubmission.count(),
        db.contactSubmission.count({ where: { isRead: false } }),
        db.newsletter.count({ where: { isActive: true } }),
        db.franchiseLead.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        db.franchiseLead.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
      ]);

    const conversionRate = totalLeads > 0
      ? ((approvedLeads / totalLeads) * 100).toFixed(1)
      : '0.0';

    return NextResponse.json({
      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        approvedLeads,
        rejectedLeads,
        thisWeek,
        thisMonth,
        contactMessages,
        unreadMessages,
        newsletterSubscribers,
        conversionRate,
      },
      recentLeads,
      leadsByStatus: leadsByStatus.map((l) => ({ status: l.status, count: l._count.status })),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
