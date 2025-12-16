import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';
import type { ApiResponse, ArticleCategory } from '@/types';

interface CategoryWithCount extends ArticleCategory {
  articles_count: number;
}

export async function GET() {
  try {
    const categories = query<CategoryWithCount>(`
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
    } as ApiResponse<CategoryWithCount[]>);
  } catch (error) {
    console.error('Article categories fetch error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch article categories',
          messageAr: 'فشل في جلب فئات المقالات',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}
