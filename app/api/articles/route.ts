import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';
import type { ArticleCategory } from '@/types';

interface ArticleRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category_id: string;
  category_name: string;
  category_color: string | null;
  image: string | null;
  featured_image: string | null;
  author: string | null;
  read_time: number;
  views: number;
  featured: number;
  published: number;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
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

    let whereClause = "WHERE CAST(a.published AS TEXT) IN ('1', 'true')";
    const params: unknown[] = [];

    // Filter by category (support both name and slug)
    if (category) {
      // البحث بالاسم أو الـ slug
      whereClause +=
        " AND (ac.name = ? OR LOWER(ac.slug) = LOWER(?) OR LOWER(REPLACE(ac.name, ' ', '-')) = LOWER(?))";
      params.push(category, category, category);
    }

    // Filter featured only
    if (featured === 'true') {
      whereClause += ' AND a.featured = 1';
    }

    // Search in title, excerpt, and content
    if (search) {
      whereClause +=
        ' AND (LOWER(a.title) LIKE LOWER(?) OR LOWER(a.excerpt) LIKE LOWER(?) OR LOWER(a.content) LIKE LOWER(?))';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM articles a
      JOIN article_categories ac ON CAST(a.category_id AS INTEGER) = ac.id
      ${whereClause}
    `;

    const countResult = await query<{ total: number }>(countSql, params);
    const total = Number(countResult[0]?.total) || 0;

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
        ac.color as category_color,
        a.image,
        a.featured_image,
        a.author,
        a.read_time,
        a.views,
        a.featured,
        a.published,
        a.meta_description,
        a.meta_keywords,
        a.created_at,
        a.updated_at
      FROM articles a
      JOIN article_categories ac ON CAST(a.category_id AS INTEGER) = ac.id
      ${whereClause}
      ORDER BY a.featured DESC, a.${sortColumn} ${order}
      LIMIT ? OFFSET ?
    `;

    const finalLimit = limit ? parseInt(limit) : pageSize;
    const articlesParams = [...params, finalLimit, offset];

    const articles = await query<ArticleRow>(articlesSql, articlesParams);

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: {
        items: articles.map((article) => ({
          ...article,
          category_slug:
            article.category_name?.toLowerCase().replace(/\s+/g, '-') || '',
        })),
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
    const categories = await query<
      ArticleCategory & { articles_count: number }
    >(`
      SELECT 
        ac.id,
        ac.name,
        ac.description,
        ac.color,
        COUNT(a.id) as articles_count
      FROM article_categories ac
      LEFT JOIN articles a ON CAST(a.category_id AS INTEGER) = ac.id AND CAST(a.published AS TEXT) IN ('1', 'true')
      GROUP BY ac.id, ac.name, ac.description, ac.color
      ORDER BY ac.name ASC
    `);

    return NextResponse.json({
      success: true,
      data: categories.map((cat) => ({
        ...cat,
        slug: cat.name?.toLowerCase().replace(/\s+/g, '-') || '',
      })),
      meta: {
        total: categories.length,
        totalArticles: categories.reduce(
          (sum, cat) => sum + Number(cat.articles_count),
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
