import { NextResponse } from 'next/server';
import { getRawDatabase, query, queryOne, execute } from '@/lib/db/database';

// GET - جلب إعدادات الموبايل
export async function GET() {
  try {
    const db = getRawDatabase();

    // إنشاء جدول الإعدادات إذا لم يكن موجوداً
    db.exec(`
      CREATE TABLE IF NOT EXISTS mobile_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        settings TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const row = await queryOne<{ settings: string }>(
      'SELECT settings FROM mobile_settings WHERE id = 1'
    );

    if (row) {
      return NextResponse.json({
        success: true,
        settings: JSON.parse(row.settings),
      });
    }

    return NextResponse.json({ success: true, settings: null });
  } catch (error) {
    console.error('Error fetching mobile settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - حفظ إعدادات الموبايل
export async function POST(request: Request) {
  try {
    const settings = await request.json();
    const db = getRawDatabase();

    // إنشاء جدول الإعدادات إذا لم يكن موجوداً
    db.exec(`
      CREATE TABLE IF NOT EXISTS mobile_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        settings TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // حفظ أو تحديث الإعدادات
    const existing = await queryOne<{ id: number }>(
      'SELECT id FROM mobile_settings WHERE id = 1'
    );

    if (existing) {
      await execute(
        'UPDATE mobile_settings SET settings = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
        [JSON.stringify(settings)]
      );
    } else {
      await execute(
        'INSERT INTO mobile_settings (id, settings) VALUES (1, ?)',
        [JSON.stringify(settings)]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving mobile settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
