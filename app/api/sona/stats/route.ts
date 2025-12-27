/**
 * SONA v4 Stats API
 * GET /api/sona/stats
 *
 * Requirements: 19.4
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sonaAnalytics,
  AnalyticsSummary,
  DateRange,
} from '@/lib/sona/analytics';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

/**
 * GET /api/sona/stats
 * الحصول على إحصائيات SONA
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let period: DateRange | undefined;
    if (startDate && endDate) {
      period = { startDate, endDate };
    }

    const summary = await sonaAnalytics.getSummary(period);

    return NextResponse.json<APIResponse<AnalyticsSummary>>({
      success: true,
      data: summary,
      meta: {
        timestamp: new Date().toISOString(),
        version: '4.0.0',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'خطأ غير معروف';

    return NextResponse.json<APIResponse<null>>(
      {
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
