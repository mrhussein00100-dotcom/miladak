import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';
import type { ToolWithCategory, GroupedTools } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const grouped = searchParams.get('grouped');
    const limit = searchParams.get('limit');

    let sql = `
      SELECT 
        t.id,
        t.slug,
        t.title,
        t.description,
        t.icon,
        t.category_id,
        tc.name as category_name,
        tc.slug as category_slug,
        tc.icon as category_icon,
        tc.title as category_title,
        t.href,
        t.featured,
        t.active,
        t.sort_order
      FROM tools t
      JOIN tool_categories tc ON t.category_id = tc.id
      WHERE t.active = 1
    `;

    const params: unknown[] = [];

    // Filter by category slug
    if (category) {
      sql += ' AND tc.slug = ?';
      params.push(category);
    }

    // Filter featured only
    if (featured === 'true') {
      sql += ' AND t.featured = 1';
    }

    // Search in title and description
    if (search) {
      sql += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY tc.sort_order ASC, t.sort_order ASC, t.title ASC';

    // Limit results
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const tools = query<ToolWithCategory>(sql, params);

    // Return grouped by category if requested
    if (grouped === 'true') {
      const groupedTools: GroupedTools[] = [];
      const categoryMap = new Map<number, GroupedTools>();

      for (const tool of tools) {
        if (!categoryMap.has(tool.category_id)) {
          const group: GroupedTools = {
            category: {
              id: tool.category_id,
              name: tool.category_name,
              slug: tool.category_slug,
              icon: tool.category_icon,
              title: tool.category_title,
            },
            tools: [],
          };
          categoryMap.set(tool.category_id, group);
          groupedTools.push(group);
        }

        categoryMap.get(tool.category_id)!.tools.push({
          id: tool.id,
          slug: tool.slug,
          title: tool.title,
          description: tool.description,
          icon: tool.icon,
          category_id: tool.category_id,
          href: tool.href,
          featured: tool.featured,
          active: tool.active,
        });
      }

      return NextResponse.json({
        success: true,
        data: groupedTools,
        meta: {
          total: tools.length,
          categories: groupedTools.length,
        },
      });
    }

    // Return flat list
    return NextResponse.json({
      success: true,
      data: tools.map((tool) => ({
        id: tool.id,
        slug: tool.slug,
        title: tool.title,
        description: tool.description,
        icon: tool.icon,
        category_id: tool.category_id,
        category_name: tool.category_name,
        href: tool.href,
        featured: tool.featured,
        active: tool.active,
      })),
      meta: {
        total: tools.length,
      },
    });
  } catch (error) {
    console.error('Tools fetch error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch tools',
          messageAr: 'فشل في جلب الأدوات',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}
