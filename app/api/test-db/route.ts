import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

export async function GET() {
  try {
    // اختبار الاستعلام الأصلي
    let toolsQuery = null;
    let toolsError = null;
    try {
      const sql = `
        SELECT 
          t.id,
          t.slug,
          t.title,
          t.description,
          t.icon,
          t.category_id,
          tc.name as category_name,
          tc.slug as category_slug,
          tc.title as category_title,
          tc.icon as category_icon,
          t.href,
          t.featured,
          t.active,
          t.sort_order
        FROM tools t
        JOIN tool_categories tc ON t.category_id = tc.id
        LIMIT 5
      `;
      toolsQuery = await query(sql);
    } catch (e: any) {
      toolsError = e.message;
    }

    return NextResponse.json({
      success: true,
      toolsQuery,
      toolsError,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
