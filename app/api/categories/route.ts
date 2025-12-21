import { NextRequest, NextResponse } from 'next/server';
import {
  ensureCategoryColumns,
  getCategories,
  getCategoryBySlug,
} from '@/lib/db/categories';

export async function GET(request: NextRequest) {
  try {
    await ensureCategoryColumns();
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get('includeCount') === 'true';

    const categories = await getCategories({ includeCount });

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
    await ensureCategoryColumns();
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'مطلوب معرف التصنيف' },
        { status: 400 }
      );
    }

    const category = await getCategoryBySlug(slug);

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
