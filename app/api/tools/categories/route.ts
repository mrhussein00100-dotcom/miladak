import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';
import type { ApiResponse, ToolCategory } from '@/types';

interface CategoryWithCount extends ToolCategory {
  tools_count: number;
}

export async function GET() {
  try {
    const categories = await queryCategoryWithCount>(`
      SELECT 
        tc.id,
        tc.name,
        tc.slug,
        tc.title,
        tc.icon,
        tc.sort_order,
        COUNT(t.id) as tools_count
      FROM tool_categories tc
      LEFT JOIN tools t ON tc.id = t.category_id AND t.active = 1
      GROUP BY tc.id, tc.name, tc.slug, tc.title, tc.icon, tc.sort_order
      ORDER BY tc.sort_order ASC, tc.name ASC
    `);

    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        total: categories.length,
        totalTools: categories.reduce((sum, cat) => sum + cat.tools_count, 0),
      },
    } as ApiResponse<CategoryWithCount[]>);
  } catch (error) {
    console.error('Tool categories fetch error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch tool categories',
          messageAr: 'فشل في جلب فئات الأدوات',
          status: 500,
        },
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
