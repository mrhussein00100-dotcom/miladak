import { NextRequest, NextResponse } from 'next/server';
import { generateMeta } from '@/lib/ai/providers/gemini';

export async function POST(request: NextRequest) {
  try {
    const { title, content, provider = 'gemini' } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'العنوان والمحتوى مطلوبان',
      });
    }

    // توليد الميتا باستخدام Gemini
    const metaResult = await generateMeta(content);

    if (!metaResult) {
      return NextResponse.json({
        success: false,
        error: 'فشل في توليد الميتا',
      });
    }

    // إنشاء slug من العنوان
    const slug = title
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return NextResponse.json({
      success: true,
      metaTitle: metaResult.metaTitle,
      metaDescription: metaResult.metaDescription,
      keywords: metaResult.keywords,
      slug: slug,
    });
  } catch (error) {
    console.error('Meta generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
    });
  }
}
