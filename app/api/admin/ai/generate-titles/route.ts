/**
 * API توليد عناوين بديلة
 * POST /api/admin/ai/generate-titles
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateTitles } from '@/lib/ai/generator';
import type {
  GenerateTitlesRequest,
  GenerateTitlesResponse,
  TitleSuggestion,
} from '@/types/rewriter';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTitlesRequest = await request.json();

    // التحقق من البيانات المطلوبة
    if (!body.content || body.content.length < 50) {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب (50 حرف على الأقل)' },
        { status: 400 }
      );
    }

    const count = body.count || 5;
    console.log(`📝 توليد ${count} عناوين بديلة...`);

    // استخراج الموضوع من المحتوى
    const topic = body.currentTitle || extractTopic(body.content);

    // توليد العناوين
    const rawTitles = await generateTitles(topic, count, 'gemini');

    // تحويل إلى التنسيق المطلوب مع تقييم
    const titles: TitleSuggestion[] = rawTitles.map((title) => ({
      title,
      clickPotential: calculateClickPotential(title),
      seoScore: calculateTitleSEO(title),
    }));

    // ترتيب حسب إمكانية النقر
    titles.sort((a, b) => b.clickPotential - a.clickPotential);

    const response: GenerateTitlesResponse = {
      success: true,
      titles,
    };

    console.log(`✅ تم توليد ${titles.length} عناوين`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ خطأ في توليد العناوين:', error);
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
 * استخراج الموضوع من المحتوى
 */
function extractTopic(content: string): string {
  // أخذ أول 200 حرف كموضوع
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanContent.substring(0, 200);
}

/**
 * حساب إمكانية النقر على العنوان
 */
function calculateClickPotential(title: string): number {
  let score = 50;

  // طول العنوان المثالي (40-60 حرف)
  if (title.length >= 40 && title.length <= 60) {
    score += 15;
  } else if (title.length >= 30 && title.length <= 70) {
    score += 10;
  }

  // وجود أرقام
  if (/\d/.test(title)) {
    score += 10;
  }

  // وجود كلمات قوية
  const powerWords = [
    'أفضل',
    'دليل',
    'كيف',
    'لماذا',
    'أسرار',
    'طريقة',
    'خطوات',
    'نصائح',
    'مهم',
    'جديد',
  ];
  powerWords.forEach((word) => {
    if (title.includes(word)) {
      score += 5;
    }
  });

  // وجود علامة استفهام
  if (title.includes('؟')) {
    score += 5;
  }

  return Math.min(100, score);
}

/**
 * حساب درجة SEO للعنوان
 */
function calculateTitleSEO(title: string): number {
  let score = 50;

  // طول العنوان (30-60 حرف مثالي)
  if (title.length >= 30 && title.length <= 60) {
    score += 20;
  } else if (title.length >= 20 && title.length <= 70) {
    score += 10;
  } else if (title.length > 70) {
    score -= 10;
  }

  // عدد الكلمات (5-10 مثالي)
  const wordCount = title.split(/\s+/).length;
  if (wordCount >= 5 && wordCount <= 10) {
    score += 15;
  } else if (wordCount >= 3 && wordCount <= 12) {
    score += 10;
  }

  // لا يبدأ بكلمة توقف
  const stopStarts = ['في', 'من', 'إلى', 'على', 'عن'];
  if (!stopStarts.some((word) => title.startsWith(word + ' '))) {
    score += 10;
  }

  return Math.min(100, score);
}
