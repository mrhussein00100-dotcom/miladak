import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';
import type {
  ApiResponse,
  Article,
  ArticleCategory,
  PaginatedResponse,
} from '@/types';

interface ArticleWithCategory extends Article {
  category_slug: string;
  category_color: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = searchParams.get('limit');

    let whereClause = 'WHERE a.published = 1';
    const params: unknown[] = [];

    // Filter by category slug
    if (category) {
      whereClause += ' AND ac.slug = ?';
      params.push(category);
    }

    // Filter featured only
    if (featured === 'true') {
      whereClause += ' AND a.featured = 1';
    }

    // Search in title, excerpt, and content
    if (search) {
      whereClause +=
        ' AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM articles a
      JOIN categories ac ON a.category_id = ac.id
      ${whereClause}
    `;

    const countResult = query<{ total: number }>(countSql, params);
    const total = countResult[0]?.total || 0;

    // Validate sort column
    const validSortColumns = [
      'created_at',
      'updated_at',
      'views',
      'title',
      'read_time',
    ];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';
    const order = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Get articles
    const offset = (page - 1) * pageSize;
    const articlesSql = `
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.category_id,
        ac.name as category_name,
        ac.slug as category_slug,
        ac.color as category_color,
        a.image,
        a.author,
        a.read_time,
        a.views,
        a.featured,
        a.meta_description,
        a.meta_keywords,
        a.created_at,
        a.updated_at
      FROM articles a
      JOIN categories ac ON a.category_id = ac.id
      ${whereClause}
      ORDER BY a.featured DESC, a.${sortColumn} ${order}
      LIMIT ? OFFSET ?
    `;

    const finalLimit = limit ? parseInt(limit) : pageSize;
    const articles = query<ArticleWithCategory>(articlesSql, [
      ...params,
      finalLimit,
      offset,
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: {
        items: articles,
        total,
        page,
        pageSize,
        totalPages,
      },
      meta: {
        sortBy: sortColumn,
        sortOrder: order,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Articles fetch error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch articles',
          messageAr: 'فشل في جلب المقالات',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}

// Get article categories with counts
export async function OPTIONS() {
  try {
    const categories = query<ArticleCategory & { articles_count: number }>(`
      SELECT 
        ac.id,
        ac.name,
        ac.slug,
        ac.description,
        ac.color,
        COUNT(a.id) as articles_count
      FROM categories ac
      LEFT JOIN articles a ON ac.id = a.category_id AND a.published = 1
      GROUP BY ac.id, ac.name, ac.slug, ac.description, ac.color
      ORDER BY ac.name ASC
    `);

    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        total: categories.length,
        totalArticles: categories.reduce(
          (sum, cat) => sum + cat.articles_count,
          0
        ),
      },
    });
  } catch (error) {
    console.error('Article categories fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch article categories',
          messageAr: 'فشل في جلب فئات المقالات',
        },
      },
      { status: 500 }
    );
  }
}
