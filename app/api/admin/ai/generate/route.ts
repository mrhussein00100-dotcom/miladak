/**
 * API توليد المقالات بالذكاء الاصطناعي
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateArticle,
  generateArticleWithImages,
  PROVIDERS_INFO,
  type AIProvider,
  type ContentLength,
  type ContentStyle,
} from '@/lib/ai/generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من الحقول المطلوبة
    if (!body.topic) {
      return NextResponse.json(
        { success: false, error: 'الموضوع مطلوب' },
        { status: 400 }
      );
    }

    const provider = (body.provider || 'groq') as AIProvider;
    const length = (body.length || 'medium') as ContentLength;
    const style = body.style as ContentStyle | undefined;

    // التحقق من توفر المزود
    if (!PROVIDERS_INFO[provider]?.available) {
      return NextResponse.json(
        { success: false, error: `المزود ${provider} غير متاح حالياً` },
        { status: 400 }
      );
    }

    // استخدام التوليد مع الصور إذا طُلب
    const includeImages = body.includeImages !== false;
    // إذا لم يُحدد عدد الصور، سيتم حسابه تلقائياً بناءً على حجم المقال
    const imageCount =
      body.imageCount === 'auto' || !body.imageCount
        ? undefined
        : body.imageCount;

    const result = includeImages
      ? await generateArticleWithImages({
          topic: body.topic,
          length,
          provider,
          style,
          includeKeywords: body.keywords,
          category: body.category,
          variables: body.variables,
          includeImages,
          imageCount, // undefined = حساب تلقائي
        })
      : await generateArticle({
          topic: body.topic,
          length,
          provider,
          style,
          includeKeywords: body.keywords,
          category: body.category,
          variables: body.variables,
        });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('AI generation error:', error);

    // استخراج رسالة الخطأ الحقيقية
    const errorMessage = error instanceof Error ? error.message : String(error);

    // تحديد نوع الخطأ وإرجاع رسالة مفيدة
    let userFriendlyError = 'فشل في توليد المحتوى';

    if (
      errorMessage.includes('API key not valid') ||
      errorMessage.includes('INVALID_KEY')
    ) {
      userFriendlyError = 'مفتاح API غير صالح. يرجى التحقق من إعدادات المفتاح.';
    } else if (
      errorMessage.includes('API_NOT_ENABLED') ||
      errorMessage.includes('403')
    ) {
      userFriendlyError =
        'خدمة Gemini API غير مفعّلة. يرجى تفعيلها من Google Cloud Console.';
    } else if (
      errorMessage.includes('quota') ||
      errorMessage.includes('429') ||
      errorMessage.includes('RESOURCE_EXHAUSTED')
    ) {
      userFriendlyError =
        'تم تجاوز حصة API. يرجى الانتظار أو استخدام مزود آخر.';
    } else if (
      errorMessage.includes('SAFETY') ||
      errorMessage.includes('blocked')
    ) {
      userFriendlyError =
        'تم حظر المحتوى بسبب سياسات الأمان. جرب موضوعاً مختلفاً.';
    } else if (
      errorMessage.includes('فشل') ||
      errorMessage.includes('failed')
    ) {
      userFriendlyError = errorMessage; // استخدم الرسالة الأصلية إذا كانت بالعربية
    }

    return NextResponse.json(
      {
        success: false,
        error: userFriendlyError,
        details: errorMessage, // دائماً أرجع التفاصيل للمساعدة في التشخيص
        provider: body?.provider || 'unknown',
      },
      { status: 500 }
    );
  }
}

// GET - الحصول على معلومات المزودين مع حالة التوفر الفعلية
export async function GET() {
  // التحقق من توفر المزودين بناءً على مفاتيح API
  const providersWithStatus = Object.entries(PROVIDERS_INFO).map(
    ([id, info]) => {
      let available = info.available;
      let keyStatus = '';

      // التحقق من وجود مفاتيح API
      switch (id) {
        case 'gemini':
          const geminiKey =
            process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
          available = !!geminiKey;
          keyStatus = geminiKey
            ? `configured (${geminiKey.length} chars)`
            : 'missing';
          break;
        case 'groq':
          available = !!process.env.GROQ_API_KEY;
          keyStatus = process.env.GROQ_API_KEY ? 'configured' : 'missing';
          break;
        case 'cohere':
          available = !!process.env.COHERE_API_KEY;
          keyStatus = process.env.COHERE_API_KEY ? 'configured' : 'missing';
          break;
        case 'huggingface':
          available = !!process.env.HUGGINGFACE_API_KEY;
          keyStatus = process.env.HUGGINGFACE_API_KEY
            ? 'configured'
            : 'missing';
          break;
        case 'local':
          available = true; // المحلي دائماً متاح
          keyStatus = 'not required';
          break;
        case 'sona':
          available = true; // SONA دائماً متاح
          keyStatus = 'not required';
          break;
        case 'sona-enhanced':
          available = true; // SONA 4.01 دائماً متاح
          keyStatus = 'not required';
          break;
        case 'sona-v5':
          available = true; // SONA 5.0 دائماً متاح
          keyStatus = 'not required';
          break;
        case 'sona-v6':
          available = true; // SONA 6.0 دائماً متاح
          keyStatus = 'not required';
          break;
      }

      return {
        id,
        ...info,
        available,
        keyStatus,
      };
    }
  );

  return NextResponse.json({
    success: true,
    data: {
      providers: providersWithStatus,
      lengths: [
        { id: 'short', name: 'قصير', words: '400-600' },
        { id: 'medium', name: 'متوسط', words: '1200-1800' },
        { id: 'long', name: 'طويل', words: '2500-3500' },
        { id: 'comprehensive', name: 'شامل', words: '4500-6000' },
      ],
      styles: [
        { id: 'formal', name: 'رسمي' },
        { id: 'casual', name: 'عامي' },
        { id: 'seo', name: 'محسن للسيو' },
        { id: 'academic', name: 'أكاديمي' },
      ],
    },
  });
}
