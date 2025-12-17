import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

interface ToolRow {
  id: number;
  name: string;
  title: string;
  description: string | null;
  icon: string;
  category_id: number;
  category_name: string;
  category_title: string;
  category_icon: string | null;
  href: string;
  is_featured: number;
  is_active: number;
  sort_order: number;
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
        t.name,
        t.title,
        t.description,
        t.icon,
        t.category_id,
        tc.name as category_name,
        tc.title as category_title,
        tc.icon as category_icon,
        t.href,
        t.is_featured,
        t.is_active,
        t.sort_order
      FROM tools t
      JOIN tool_categories tc ON t.category_id = tc.id
      WHERE t.is_active = 1
    `;

    const params: unknown[] = [];

    // Filter by category name
    if (category) {
      sql += ' AND tc.name = ?';
      params.push(category);
    }

    // Filter featured only
    if (featured === 'true') {
      sql += ' AND t.is_featured = 1';
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
          featured: number;
          active: number;
        }[];
      }[] = [];
      const categoryMap = new Map<number, (typeof groupedTools)[0]>();

      for (const tool of tools) {
        if (!categoryMap.has(tool.category_id)) {
          const group = {
            category: {
              id: tool.category_id,
              name: tool.category_name,
              slug: tool.category_name,
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
          slug: tool.name,
          title: tool.title,
          description: tool.description,
          icon: tool.icon,
          category_id: tool.category_id,
          href: tool.href,
          featured: tool.is_featured,
          active: tool.is_active,
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
        slug: tool.name,
        title: tool.title,
        description: tool.description || '',
        icon: tool.icon,
        category_id: tool.category_id,
        category_name: tool.category_name,
        href: tool.href,
        featured: tool.is_featured,
        active: tool.is_active,
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
