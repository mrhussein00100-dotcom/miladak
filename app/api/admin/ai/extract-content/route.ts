/**
 * API استخلاص المحتوى من الروابط
 * POST /api/admin/ai/extract-content
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractFromUrl } from '@/lib/services/contentExtractor';
import type { ExtractContentRequest } from '@/types/rewriter';

export async function POST(request: NextRequest) {
  try {
    const body: ExtractContentRequest = await request.json();

    // التحقق من وجود الرابط
    if (!body.url || typeof body.url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'الرابط مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من صحة الرابط
    try {
      new URL(body.url.startsWith('http') ? body.url : `https://${body.url}`);
    } catch {
      return NextResponse.json(
        { success: false, error: 'رابط غير صالح' },
        { status: 400 }
      );
    }

    console.log(`📥 استخلاص المحتوى من: ${body.url}`);

    // استخلاص المحتوى
    const result = await extractFromUrl(body.url);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'فشل في استخلاص المحتوى' },
        { status: 400 }
      );
    }

    console.log(
      `✅ تم استخلاص: ${result.title} (${result.metadata.wordCount} كلمة)`
    );

    // إزالة success من result لتجنب التكرار
    const { success: _, ...resultData } = result;
    return NextResponse.json({
      success: true,
      ...resultData,
    });
  } catch (error) {
    console.error('❌ خطأ في استخلاص المحتوى:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الخادم',
      },
      { status: 500 }
    );
  }
}
