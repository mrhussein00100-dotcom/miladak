/**
 * API سجل إعادة الصياغة
 * GET /api/admin/ai/rewrite-history
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRewriteHistory, getRewriteStats } from '@/lib/db/rewriter';
import type { SourceType } from '@/types/rewriter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const sourceType = searchParams.get('sourceType') as SourceType | null;
    const search = searchParams.get('search') || undefined;

    const { records, total } = getRewriteHistory({
      page,
      pageSize,
      sourceType: sourceType || undefined,
      search,
    });

    const stats = getRewriteStats();

    return NextResponse.json({
      success: true,
      records,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats,
    });
  } catch (error) {
    console.error('❌ خطأ في جلب السجل:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الخادم',
      },
      { status: 500 }
    );
  }
}
