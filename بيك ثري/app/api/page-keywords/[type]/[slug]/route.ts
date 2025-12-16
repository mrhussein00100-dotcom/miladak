import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/database';

interface PageKeywords {
  id: number;
  page_type: string;
  page_slug: string;
  page_title: string;
  keywords: string;
  meta_description: string | null;
}

interface RouteParams {
  params: Promise<{
    type: string;
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { type, slug } = await params;

    const result = queryOne<PageKeywords>(
      `SELECT * FROM page_keywords WHERE page_type = ? AND page_slug = ?`,
      [type, slug]
    );

    if (!result) {
      return NextResponse.json(
        {
          error: 'الكلمات المفتاحية غير موجودة',
          keywords: [],
          meta_description: '',
        },
        { status: 404 }
      );
    }

    // تحويل الكلمات المفتاحية إلى مصفوفة
    const keywordsArray = result.keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    return NextResponse.json({
      id: result.id,
      page_type: result.page_type,
      page_slug: result.page_slug,
      page_title: result.page_title,
      keywords: keywordsArray,
      meta_description: result.meta_description || '',
    });
  } catch (error) {
    console.error('Error fetching page keywords:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الكلمات المفتاحية' },
      { status: 500 }
    );
  }
}
