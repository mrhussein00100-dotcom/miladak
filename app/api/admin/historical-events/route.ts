import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery, execute } from '@/lib/db/database';

interface HistoricalEvent {
  id?: number;
  day: number;
  month: number;
  year?: number;
  title: string;
  description: string;
  category: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const day = searchParams.get('day');

    // استخدام جدول daily_events (يحتوي على 698 سجل)
    let sqlQuery = `
      SELECT 
        id,
        day,
        month,
        year,
        title,
        description,
        COALESCE(category, 'عام') as category
      FROM daily_events
    `;
    const params: any[] = [];

    if (month && day) {
      sqlQuery += ` WHERE month = $1 AND day = $2`;
      params.push(parseInt(month), parseInt(day));
    } else if (month) {
      sqlQuery += ` WHERE month = $1`;
      params.push(parseInt(month));
    }

    sqlQuery += ' ORDER BY month, day, year';

    const events = await dbQuery<HistoricalEvent>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: events || [],
    });
  } catch (error) {
    console.error('Error fetching historical events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب الأحداث التاريخية',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const event: HistoricalEvent = await request.json();

    // التحقق من صحة البيانات
    if (!event.title || !event.day || !event.month) {
      return NextResponse.json(
        {
          success: false,
          error: 'البيانات المطلوبة مفقودة',
        },
        { status: 400 }
      );
    }

    const result = await execute(
      `INSERT INTO daily_events (day, month, year, title, description, category) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        event.day,
        event.month,
        event.year || null,
        event.title,
        event.description || '',
        event.category || 'عام',
      ]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid, ...event },
    });
  } catch (error) {
    console.error('Error creating historical event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في إضافة الحدث التاريخي',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const event: HistoricalEvent = await request.json();

    if (!event.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'معرف الحدث مطلوب للتحديث',
        },
        { status: 400 }
      );
    }

    await execute(
      `UPDATE daily_events 
       SET day = $1, month = $2, year = $3, title = $4, description = $5, category = $6 
       WHERE id = $7`,
      [
        event.day,
        event.month,
        event.year || null,
        event.title,
        event.description || '',
        event.category || 'عام',
        event.id,
      ]
    );

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Error updating historical event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في تحديث الحدث التاريخي',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'معرف الحدث مطلوب للحذف',
        },
        { status: 400 }
      );
    }

    await execute('DELETE FROM daily_events WHERE id = $1', [parseInt(id)]);

    return NextResponse.json({
      success: true,
      message: 'تم حذف الحدث بنجاح',
    });
  } catch (error) {
    console.error('Error deleting historical event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في حذف الحدث التاريخي',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
