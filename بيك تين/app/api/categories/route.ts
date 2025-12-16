import { NextRequest, NextResponse } from 'next/server';
import { queryAll, queryOne } from '@/lib/db/unified-database';
import { ensureCategoryColumns } from '@/lib/db/categories';

// التأكد من وجود التصنيفات الافتراضية
ensureCategoryColumns();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get('includeCount') === 'true';

    let query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.slug,
        c.icon,
        c.color,
        c.created_at,
        c.updated_at
    `;

    if (includeCount) {
      query += `, COUNT(a.id) as article_count`;
    }

    query += ` FROM categories c`;

    if (includeCount) {
      query += ` LEFT JOIN articles a ON c.id = a.category_id`;
    }

    if (includeCount) {
      query += ` GROUP BY c.id`;
    }

    query += ` ORDER BY c.name ASC`;

    const categories = queryAll(query);

    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        total: categories.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب التصنيفات',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// GET single category by slug
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'مطلوب معرف التصنيف' },
        { status: 400 }
      );
    }

    const category = queryOne(
      `
      SELECT 
        c.*,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id
      WHERE c.slug = ?
      GROUP BY c.id
    `,
      [slug]
    );

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'التصنيف غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب التصنيف',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
