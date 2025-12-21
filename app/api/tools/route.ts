import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

interface ToolRow {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  icon: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  category_title: string;
  category_icon: string | null;
  href: string;
  featured: boolean | number;
  active: boolean | number;
  sort_order: number;
}

function toBoolean(value: unknown): boolean {
  return (
    value === true ||
    value === 1 ||
    value === '1' ||
    value === 'true' ||
    value === 't'
  );
}

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
        tc.title as category_title,
        tc.icon as category_icon,
        t.href,
        t.featured,
        t.active,
        t.sort_order
      FROM tools t
      JOIN tool_categories tc ON t.category_id = tc.id
      WHERE t.active::text IN ('true', '1', 't')
    `;

    const params: unknown[] = [];

    // Filter by category name
    if (category) {
      const categoryId = Number(category);
      if (!Number.isNaN(categoryId) && category.trim() !== '') {
        sql += ' AND t.category_id = ?';
        params.push(categoryId);
      } else {
        sql += ' AND (tc.slug = ? OR tc.name = ?)';
        params.push(category, category);
      }
    }

    // Filter featured only
    if (featured === 'true') {
      sql += " AND t.featured::text IN ('true', '1', 't')";
    }

    // Search in title and description
    if (search) {
      sql +=
        " AND (LOWER(COALESCE(t.title, '')) LIKE LOWER(?) OR LOWER(COALESCE(t.description, '')) LIKE LOWER(?))";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY tc.sort_order ASC, t.sort_order ASC, t.title ASC';

    // Limit results
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!Number.isNaN(limitNum)) {
        sql += ' LIMIT ?';
        params.push(limitNum);
      }
    }

    const tools = await query<ToolRow>(sql, params);

    // Return grouped by category if requested
    if (grouped === 'true') {
      const groupedTools: {
        category: {
          id: number;
          name: string;
          slug: string;
          icon: string | null;
          title: string;
        };
        tools: {
          id: number;
          slug: string;
          title: string;
          description: string | null;
          icon: string;
          category_id: number;
          href: string;
          featured: boolean;
          active: boolean;
        }[];
      }[] = [];
      const categoryMap = new Map<number, (typeof groupedTools)[0]>();

      for (const tool of tools) {
        if (!categoryMap.has(tool.category_id)) {
          const group = {
            category: {
              id: tool.category_id,
              name: tool.category_name,
              slug: tool.category_slug,
              icon: tool.category_icon,
              title: tool.category_title,
            },
            tools: [] as (typeof groupedTools)[0]['tools'],
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
          featured: toBoolean(tool.featured),
          active: toBoolean(tool.active),
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
        description: tool.description || '',
        icon: tool.icon,
        category_id: tool.category_id,
        category_name: tool.category_name,
        href: tool.href,
        featured: toBoolean(tool.featured),
        active: toBoolean(tool.active),
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
