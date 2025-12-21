/**
 * API سجلات النشر التلقائي
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublishLogs } from '@/lib/db/auto-publish';

// GET - جلب السجلات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const status = searchParams.get('status') as
      | 'success'
      | 'failed'
      | 'retry'
      | undefined;

    const logs = await getPublishLogs({ limit, status: status || undefined });

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error('Error fetching publish logs:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب السجلات' },
      { status: 500 }
    );
  }
}
