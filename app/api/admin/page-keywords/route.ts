import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/database';

interface PageKeywords {
  id: number;
  page_type: string;
  page_slug: string;
  page_title: string;
  keywords: string;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

// GET: جلب جميع الصفحات وكلماتها المفتاحية
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let sql = 'SELECT * FROM page_keywords';
    const params: string[] = [];

    if (type) {
      sql += ' WHERE page_type = ?';
      params.push(type);
    }

    sql += ' ORDER BY page_type, page_title';

    const results = await query<PageKeywords[]>(sql, params);

    // تحويل الكلمات المفتاحية إلى مصفوفات
    const formattedResults = results.map((row: any) => ({
      ...row,
      keywords_array: row.keywords
        ? row.keywords
            .split(',')
            .map((k: string) => k.trim())
            .filter((k: string) => k.length > 0)
        : [],
      keywords_count: row.keywords
        ? row.keywords.split(',').filter((k: string) => k.trim().length > 0)
            .length
        : 0,
    }));

    return NextResponse.json({
      data: formattedResults,
      total: formattedResults.length,
    });
  } catch (error) {
    console.error('Error fetching page keywords:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الكلمات المفتاحية' },
      { status: 500 }
    );
  }
}

// POST: إضافة كلمات مفتاحية لصفحة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_type, page_slug, page_title, keywords, meta_description } =
      body;

    // التحقق من البيانات المطلوبة
    if (!page_type || !page_slug || !page_title || !keywords) {
      return NextResponse.json(
        {
          error:
            'جميع الحقول مطلوبة: page_type, page_slug, page_title, keywords',
        },
        { status: 400 }
      );
    }

    // تحويل المصفوفة إلى نص إذا كانت مصفوفة
    const keywordsText = Array.isArray(keywords)
      ? keywords.join(', ')
      : keywords;

    const result = await execute(
      `INSERT INTO page_keywords (page_type, page_slug, page_title, keywords, meta_description)
       VALUES (?, ?, ?, ?, ?)`,
      [page_type, page_slug, page_title, keywordsText, meta_description || null]
    );

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'تم إضافة الكلمات المفتاحية بنجاح',
    });
  } catch (error: unknown) {
    console.error('Error adding page keywords:', error);

    // التحقق من خطأ التكرار
    if (
      error instanceof Error &&
      error.message.includes('UNIQUE constraint failed')
    ) {
      return NextResponse.json(
        { error: 'هذه الصفحة موجودة بالفعل' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'حدث خطأ في إضافة الكلمات المفتاحية' },
      { status: 500 }
    );
  }
}
