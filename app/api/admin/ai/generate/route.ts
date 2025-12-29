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
    const imageCount = body.imageCount || 3;

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
          imageCount,
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
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في توليد المحتوى',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
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
