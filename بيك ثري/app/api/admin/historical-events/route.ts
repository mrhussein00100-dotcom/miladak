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

    let sqlQuery = 'SELECT * FROM daily_events';
    const params: any[] = [];

    if (month && day) {
      sqlQuery += ' WHERE month = ? AND day = ?';
      params.push(parseInt(month), parseInt(day));
    } else if (month) {
      sqlQuery += ' WHERE month = ?';
      params.push(parseInt(month));
    }

    sqlQuery += ' ORDER BY month, day';

    const events = dbQuery<HistoricalEvent>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching historical events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب الأحداث التاريخية',
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

    const result = execute(
      'INSERT INTO daily_events (day, month, year, title, description, category) VALUES (?, ?, ?, ?, ?, ?)',
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

    execute(
      'UPDATE daily_events SET day = ?, month = ?, year = ?, title = ?, description = ?, category = ? WHERE id = ?',
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

    execute('DELETE FROM daily_events WHERE id = ?', [parseInt(id)]);

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
      },
      { status: 500 }
    );
  }
}
