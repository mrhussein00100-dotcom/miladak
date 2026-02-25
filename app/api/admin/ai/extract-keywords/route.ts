/**
 * API استخراج الكلمات المفتاحية
 * POST /api/admin/ai/extract-keywords
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractTopKeywords } from '@/lib/services/qualityAnalyzer';
import type {
  ExtractKeywordsRequest,
  ExtractKeywordsResponse,
  KeywordResult,
} from '@/types/rewriter';

// كلمات التوقف العربية
const ARABIC_STOP_WORDS = new Set([
  'في',
  'من',
  'إلى',
  'على',
  'عن',
  'مع',
  'هذا',
  'هذه',
  'ذلك',
  'تلك',
  'التي',
  'الذي',
  'الذين',
  'هو',
  'هي',
  'هم',
  'أنا',
  'نحن',
  'أنت',
  'كان',
  'كانت',
  'يكون',
  'تكون',
  'أن',
  'إن',
  'لأن',
  'لكن',
  'أو',
  'قد',
  'لقد',
  'ما',
  'لا',
  'لم',
  'لن',
  'إذا',
  'حيث',
  'كيف',
  'متى',
  'كل',
  'بعض',
  'غير',
  'فقط',
  'أيضا',
  'كذلك',
  'بين',
  'حول',
  'خلال',
]);

export async function POST(request: NextRequest) {
  try {
    const body: ExtractKeywordsRequest = await request.json();

    // التحقق من البيانات المطلوبة
    if (!body.content || body.content.length < 50) {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب (50 حرف على الأقل)' },
        { status: 400 }
      );
    }

    const maxKeywords = body.maxKeywords || 15;
    console.log(`🔑 استخراج ${maxKeywords} كلمة مفتاحية...`);

    // تنظيف المحتوى
    const cleanContent = body.content
      .replace(/<[^>]*>/g, '')
      .replace(/[^\u0621-\u064Aa-zA-Z\s]/g, ' ')
      .toLowerCase();

    // تقسيم إلى كلمات
    const words = cleanContent
      .split(/\s+/)
      .filter((w) => w.length > 3 && !ARABIC_STOP_WORDS.has(w));

    // حساب التكرار
    const frequency: Record<string, number> = {};
    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // حساب TF-IDF مبسط
    const totalWords = words.length;
    const keywords: KeywordResult[] = Object.entries(frequency)
      .map(([keyword, count]) => ({
        keyword,
        relevance: calculateRelevance(keyword, count, totalWords),
        frequency: count,
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxKeywords);

    const response: ExtractKeywordsResponse = {
      success: true,
      keywords,
    };

    console.log(`✅ تم استخراج ${keywords.length} كلمة مفتاحية`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ خطأ في استخراج الكلمات المفتاحية:', error);
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
 * حساب درجة الأهمية للكلمة المفتاحية
 */
function calculateRelevance(
  keyword: string,
  count: number,
  totalWords: number
): number {
  // TF (Term Frequency)
  const tf = count / totalWords;

  // طول الكلمة (الكلمات الأطول غالباً أكثر أهمية)
  const lengthBonus = Math.min(keyword.length / 10, 1);

  // حساب الدرجة النهائية
  const score = (tf * 1000 + lengthBonus * 20) * (1 + Math.log(count));

  // تحويل إلى نسبة مئوية
  return Math.min(100, Math.round(score));
}
