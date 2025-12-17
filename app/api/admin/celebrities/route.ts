import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery, execute } from '@/lib/db/database';

interface Celebrity {
  id?: number;
  day: number;
  month: number;
  birth_year: number;
  name: string;
  profession: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const day = searchParams.get('day');

    let sqlQuery = 'SELECT * FROM daily_birthdays';
    const params: any[] = [];

    if (month && day) {
      sqlQuery += ' WHERE month = ? AND day = ?';
      params.push(parseInt(month), parseInt(day));
    } else if (month) {
      sqlQuery += ' WHERE month = ?';
      params.push(parseInt(month));
    }

    sqlQuery += ' ORDER BY month, day, birth_year DESC';

    const celebrities = dbQuery<Celebrity>(sqlQuery, params);

    return NextResponse.json({
      success: true,
      data: celebrities,
    });
  } catch (error) {
    console.error('Error fetching celebrities:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب المشاهير',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const celebrity: Celebrity = await request.json();

    // التحقق من صحة البيانات
    if (
      !celebrity.name ||
      !celebrity.day ||
      !celebrity.month ||
      !celebrity.birth_year
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'البيانات المطلوبة مفقودة',
        },
        { status: 400 }
      );
    }

    const result = await execute(
      'INSERT INTO daily_birthdays (day, month, birth_year, name, profession) VALUES (?, ?, ?, ?, ?)',
      [
        celebrity.day,
        celebrity.month,
        celebrity.birth_year,
        celebrity.name,
        celebrity.profession || '',
      ]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid, ...celebrity },
    });
  } catch (error) {
    console.error('Error creating celebrity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في إضافة المشهور',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const celebrity: Celebrity = await request.json();

    if (!celebrity.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'معرف المشهور مطلوب للتحديث',
        },
        { status: 400 }
      );
    }

    await execute(
      'UPDATE daily_birthdays SET day = ?, month = ?, birth_year = ?, name = ?, profession = ? WHERE id = ?',
      [
        celebrity.day,
        celebrity.month,
        celebrity.birth_year,
        celebrity.name,
        celebrity.profession || '',
        celebrity.id,
      ]
    );

    return NextResponse.json({
      success: true,
      data: celebrity,
    });
  } catch (error) {
    console.error('Error updating celebrity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في تحديث المشهور',
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
          error: 'معرف المشهور مطلوب للحذف',
        },
        { status: 400 }
      );
    }

    await execute('DELETE FROM daily_birthdays WHERE id = ?', [parseInt(id)]);

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشهور بنجاح',
    });
  } catch (error) {
    console.error('Error deleting celebrity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في حذف المشهور',
      },
      { status: 500 }
    );
  }
}
