import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db/database';

interface PageKeywords {
  id: number;
  page_type: string;
  page_slug: string;
  page_title: string;
  keywords: string;
  meta_description: string | null;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: جلب كلمات صفحة محددة
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = queryOne<PageKeywords>(
      'SELECT * FROM page_keywords WHERE id = ?',
      [parseInt(id)]
    );

    if (!result) {
      return NextResponse.json({ error: 'الصفحة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json({
      ...result,
      keywords_array: result.keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    });
  } catch (error) {
    console.error('Error fetching page keywords:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الكلمات المفتاحية' },
      { status: 500 }
    );
  }
}

// PUT: تحديث كلمات صفحة
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { page_title, keywords, meta_description } = body;

    // التحقق من وجود الصفحة
    const existing = queryOne<PageKeywords>(
      'SELECT * FROM page_keywords WHERE id = ?',
      [parseInt(id)]
    );

    if (!existing) {
      return NextResponse.json({ error: 'الصفحة غير موجودة' }, { status: 404 });
    }

    // تحويل المصفوفة إلى نص إذا كانت مصفوفة
    const keywordsText = Array.isArray(keywords)
      ? keywords.join(', ')
      : keywords;

    execute(
      `UPDATE page_keywords 
       SET page_title = ?, keywords = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        page_title || existing.page_title,
        keywordsText || existing.keywords,
        meta_description !== undefined
          ? meta_description
          : existing.meta_description,
        parseInt(id),
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الكلمات المفتاحية بنجاح',
    });
  } catch (error) {
    console.error('Error updating page keywords:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الكلمات المفتاحية' },
      { status: 500 }
    );
  }
}

// DELETE: حذف كلمات صفحة
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = queryOne<PageKeywords>(
      'SELECT * FROM page_keywords WHERE id = ?',
      [parseInt(id)]
    );

    if (!existing) {
      return NextResponse.json({ error: 'الصفحة غير موجودة' }, { status: 404 });
    }

    execute('DELETE FROM page_keywords WHERE id = ?', [parseInt(id)]);

    return NextResponse.json({
      success: true,
      message: 'تم حذف الكلمات المفتاحية بنجاح',
    });
  } catch (error) {
    console.error('Error deleting page keywords:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الكلمات المفتاحية' },
      { status: 500 }
    );
  }
}
