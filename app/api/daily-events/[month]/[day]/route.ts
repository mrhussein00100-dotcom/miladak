import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

interface DailyEvent {
  id: number;
  day: number;
  month: number;
  year: number | null;
  title: string;
  description: string | null;
  category: string;
}

/**
 * Daily Events API
 * Feature: frontend-database-integration
 * Requirements: 4.1, 4.2, 10.2
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ month: string; day: string }> }
) {
  try {
    const { month: monthParam, day: dayParam } = await params;
    const month = parseInt(monthParam, 10);
    const day = parseInt(dayParam, 10);

    // Validate month
    if (isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_MONTH',
            message: 'الشهر يجب أن يكون بين 1 و 12',
            details: `Received month: ${monthParam}`,
          },
        },
        { status: 400 }
      );
    }

    // Validate day
    if (isNaN(day) || day < 1 || day > 31) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_DAY',
            message: 'اليوم يجب أن يكون بين 1 و 31',
            details: `Received day: ${dayParam}`,
          },
        },
        { status: 400 }
      );
    }

    // Query events for this date, sorted by year
    const events = await queryDailyEvent>(
      `SELECT id, day, month, year, title, description, category 
       FROM daily_events 
       WHERE month = ? AND day = ? 
       ORDER BY year ASC`,
      [month, day]
    );

    return NextResponse.json({
      success: true,
      data: {
        month,
        day,
        events,
        total: events.length,
      },
    });
  } catch (error) {
    console.error('Daily Events API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'حدث خطأ في جلب الأحداث التاريخية',
        },
      },
      { status: 500 }
    );
  }
}
