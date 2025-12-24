import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

export async function GET() {
  try {
    // Fix the date-converter href
    await query(
      `UPDATE tools SET href = '/tools/date-converter' WHERE name = 'date-converter' OR name = 'محول التاريخ'`
    );

    // Verify the fix
    const tools = await query<{
      id: number;
      name: string;
      title: string;
      href: string;
    }>(
      `SELECT id, name, title, href FROM tools WHERE name LIKE '%date%' OR title LIKE '%تاريخ%' OR title LIKE '%تحويل%'`
    );

    return NextResponse.json({
      success: true,
      message: 'Fixed date-converter href',
      tools,
    });
  } catch (error) {
    console.error('Fix tools href error:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
