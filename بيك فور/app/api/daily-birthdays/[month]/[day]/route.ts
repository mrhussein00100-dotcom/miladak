import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

interface DailyBirthday {
  id: number;
  day: number;
  month: number;
  birth_year: number;
  name: string;
  profession: string;
}

/**
 * Daily Birthdays API
 * Feature: frontend-database-integration
 * Requirements: 5.1, 5.2, 10.3
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

    // Query celebrities for this date, sorted by birth year
    const celebrities = query<DailyBirthday>(
      `SELECT id, day, month, birth_year, name, profession 
       FROM daily_birthdays 
       WHERE month = ? AND day = ? 
       ORDER BY birth_year ASC`,
      [month, day]
    );

    return NextResponse.json({
      success: true,
      data: {
        month,
        day,
        celebrities,
        total: celebrities.length,
      },
    });
  } catch (error) {
    console.error('Daily Birthdays API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'حدث خطأ في جلب مواليد المشاهير',
        },
      },
      { status: 500 }
    );
  }
}
