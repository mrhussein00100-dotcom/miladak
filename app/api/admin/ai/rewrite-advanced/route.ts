/**
 * API إعادة الصياغة المتقدمة
 * POST /api/admin/ai/rewrite-advanced
 */

import { NextRequest, NextResponse } from 'next/server';
import { rewriteWithModels } from '@/lib/services/multiModelRewriter';
import { analyzeQuality } from '@/lib/services/qualityAnalyzer';
import { createRewriteHistory } from '@/lib/db/rewriter';
import type {
  RewriteRequest,
  RewriteResponse,
  OriginalAnalysis,
} from '@/types/rewriter';

export async function POST(request: NextRequest) {
  try {
    const body: RewriteRequest = await request.json();

    // التحقق من البيانات المطلوبة
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'العنوان والمحتوى مطلوبان' },
        { status: 400 }
      );
    }

    if (!body.models || body.models.length === 0) {
      return NextResponse.json(
        { success: false, error: 'يجب اختيار نموذج واحد على الأقل' },
        { status: 400 }
      );
    }

    // التحقق من طول المحتوى
    if (body.content.length > 50000) {
      return NextResponse.json(
        { success: false, error: 'المحتوى طويل جداً (الحد الأقصى 50,000 حرف)' },
        { status: 400 }
      );
    }

    console.log(`🔄 بدء إعادة الصياغة: "${body.title.substring(0, 50)}..."`);
    console.log(`📊 النماذج: ${body.models.join(', ')}`);

    // تحليل المحتوى الأصلي
    const originalAnalysis: OriginalAnalysis = {
      wordCount: body.content.split(/\s+/).filter((w) => w.length > 0).length,
      readability: analyzeQuality(body.content).readability,
      topics: extractTopics(body.content),
      language: detectLanguage(body.content),
    };

    // إعادة الصياغة مع النماذج المختارة
    const results = await rewriteWithModels(
      body.title,
      body.content,
      body.models,
      {
        wordCount: body.wordCount || 1000,
        style: body.style || 'formal',
        audience: body.audience || 'general',
      }
    );

    // التحقق من وجود نتائج ناجحة
    const successfulResults = results.filter((r) => !r.error && r.content);

    if (successfulResults.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'فشلت جميع النماذج في إعادة الصياغة',
          results: results, // إرجاع الأخطاء للتشخيص
        },
        { status: 500 }
      );
    }

    // حفظ في السجل
    let historyId: number | undefined;
    try {
      historyId = createRewriteHistory({
        sourceType: 'text',
        originalTitle: body.title,
        originalContent: body.content,
        settings: {
          models: body.models,
          wordCount: body.wordCount || 1000,
          style: body.style || 'formal',
          audience: body.audience || 'general',
          generateImages: body.generateImages || false,
          imageCount: body.imageCount || 0,
          imageStyle: body.imageStyle || 'realistic',
        },
        results: successfulResults,
      });
      console.log(`💾 تم حفظ السجل: ${historyId}`);
    } catch (error) {
      console.error('⚠️ فشل حفظ السجل:', error);
    }

    const response: RewriteResponse = {
      success: true,
      results: successfulResults,
      originalAnalysis,
      historyId,
    };

    console.log(
      `✅ تم إعادة الصياغة بنجاح (${successfulResults.length} نتيجة)`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ خطأ في إعادة الصياغة:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الخادم',
      },
      { status: 500 }
    );
  }
}

/**
 * استخراج المواضيع الرئيسية من المحتوى
 */
function extractTopics(content: string): string[] {
  // تنظيف المحتوى
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/[^\u0621-\u064Aa-zA-Z\s]/g, ' ');

  // استخراج الكلمات الأكثر تكراراً
  const words = cleanContent.split(/\s+/).filter((w) => w.length > 4);
  const frequency: Record<string, number> = {};

  words.forEach((word) => {
    const normalized = word.toLowerCase();
    frequency[normalized] = (frequency[normalized] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

/**
 * اكتشاف لغة المحتوى
 */
function detectLanguage(content: string): string {
  const arabicChars = (content.match(/[\u0621-\u064A]/g) || []).length;
  const englishChars = (content.match(/[a-zA-Z]/g) || []).length;

  if (arabicChars > englishChars) {
    return 'ar';
  } else if (englishChars > arabicChars) {
    return 'en';
  }
  return 'mixed';
}
