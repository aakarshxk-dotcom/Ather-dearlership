import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const status = searchParams.get('status') || undefined;

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const leads = await db.franchiseLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const data = leads.map((l) => ({
      'Lead ID': l.id,
      'Full Name': l.fullName,
      'Email': l.email,
      'Mobile': l.phone,
      'WhatsApp': l.whatsapp,
      'City': l.city,
      'State': l.state,
      'Country': l.country,
      'PIN Code': l.pinCode,
      'Feedback': l.feedbackMessage || '',
      'Status': l.status,
      'Source': l.source,
      'Admin Notes': l.adminNotes || '',
      'Date Submitted': l.createdAt.toISOString(),
    }));

    if (format === 'excel') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Leads');
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buf, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    }

    if (data.length === 0) {
      return new NextResponse('', {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((h) => {
          const val = String(row[h as keyof typeof row] || '');
          return val.includes(',') || val.includes('"') || val.includes('\n')
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        }).join(',')
      ),
    ];

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Leads export error:', error);
    return NextResponse.json({ error: 'Failed to export leads' }, { status: 500 });
  }
}
