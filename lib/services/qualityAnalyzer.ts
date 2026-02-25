/**
 * خدمة تحليل جودة المحتوى
 * تحسب درجات الجودة والقراءة والـ SEO
 */

import type { QualityMetrics } from '@/types/rewriter';

// كلمات التوقف العربية (لا تحسب في الكلمات المفتاحية)
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
  'اللذين',
  'اللتين',
  'هو',
  'هي',
  'هم',
  'هن',
  'أنا',
  'نحن',
  'أنت',
  'أنتم',
  'أنتن',
  'كان',
  'كانت',
  'كانوا',
  'يكون',
  'تكون',
  'أن',
  'إن',
  'لأن',
  'لكن',
  'بل',
  'أو',
  'و',
  'ف',
  'ثم',
  'قد',
  'لقد',
  'ما',
  'لا',
  'لم',
  'لن',
  'إذا',
  'إذ',
  'حيث',
  'كيف',
  'متى',
  'أين',
  'كل',
  'بعض',
  'غير',
  'سوى',
  'فقط',
  'أيضا',
  'كذلك',
]);

/**
 * تحليل جودة المحتوى الشامل
 */
export function analyzeQuality(
  content: string,
  originalContent?: string
): QualityMetrics {
  const readability = calculateReadability(content);
  const uniqueness = originalContent
    ? calculateUniqueness(originalContent, content)
    : 90;
  const seo = calculateSEOScore(content);

  // حساب الدرجة الإجمالية
  const overall = Math.round(readability * 0.3 + uniqueness * 0.4 + seo * 0.3);

  // توليد الاقتراحات
  const suggestions = generateSuggestions(content, {
    readability,
    uniqueness,
    seo,
  });

  return {
    overall,
    readability,
    uniqueness,
    seo,
    suggestions,
  };
}

/**
 * حساب قابلية القراءة للنص العربي
 * يعتمد على طول الجمل وتعقيد الكلمات
 */
export function calculateReadability(content: string): number {
  const cleanContent = cleanText(content);

  // تقسيم إلى جمل
  const sentences = cleanContent
    .split(/[.!؟،؛]/)
    .filter((s) => s.trim().length > 0);

  if (sentences.length === 0) return 50;

  // تقسيم إلى كلمات
  const words = cleanContent.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return 50;

  // حساب متوسط طول الجملة
  const avgSentenceLength = words.length / sentences.length;

  // حساب متوسط طول الكلمة
  const avgWordLength =
    words.reduce((sum, w) => sum + w.length, 0) / words.length;

  // حساب نسبة الكلمات الطويلة (أكثر من 6 أحرف)
  const longWords = words.filter((w) => w.length > 6).length;
  const longWordRatio = longWords / words.length;

  // حساب الدرجة
  let score = 100;

  // خصم للجمل الطويلة جداً
  if (avgSentenceLength > 30) {
    score -= 20;
  } else if (avgSentenceLength > 25) {
    score -= 10;
  } else if (avgSentenceLength > 20) {
    score -= 5;
  }

  // خصم للكلمات الطويلة
  if (longWordRatio > 0.4) {
    score -= 15;
  } else if (longWordRatio > 0.3) {
    score -= 10;
  } else if (longWordRatio > 0.2) {
    score -= 5;
  }

  // خصم للكلمات القصيرة جداً (متوسط)
  if (avgWordLength < 3) {
    score -= 10;
  }

  // مكافأة للتنوع في طول الجمل
  const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
  const variance = calculateVariance(sentenceLengths);
  if (variance > 10 && variance < 50) {
    score += 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * حساب نسبة التفرد بين النص الأصلي والمعاد صياغته
 */
export function calculateUniqueness(
  original: string,
  rewritten: string
): number {
  const originalWords = new Set(
    cleanText(original)
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  const rewrittenWords = cleanText(rewritten)
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (rewrittenWords.length === 0) return 0;

  // حساب الكلمات المشتركة
  let commonWords = 0;
  rewrittenWords.forEach((word) => {
    if (originalWords.has(word)) {
      commonWords++;
    }
  });

  // نسبة الكلمات الجديدة
  const uniqueRatio = 1 - commonWords / rewrittenWords.length;

  // تحويل إلى درجة من 100
  // نريد على الأقل 30% كلمات جديدة للحصول على درجة جيدة
  const score = Math.min(100, uniqueRatio * 120);

  return Math.round(score);
}

/**
 * حساب درجة SEO
 */
export function calculateSEOScore(content: string, title?: string): number {
  let score = 50; // درجة أساسية

  const cleanContent = cleanText(content);
  const words = cleanContent.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // طول المحتوى
  if (wordCount >= 300) score += 5;
  if (wordCount >= 500) score += 5;
  if (wordCount >= 800) score += 5;
  if (wordCount >= 1000) score += 5;
  if (wordCount >= 1500) score += 5;

  // وجود عناوين فرعية
  const h2Count = (content.match(/##[^#]|<h2/gi) || []).length;
  const h3Count = (content.match(/###|<h3/gi) || []).length;

  if (h2Count >= 1) score += 5;
  if (h2Count >= 2) score += 5;
  if (h3Count >= 1) score += 3;

  // وجود قوائم
  if (
    content.includes('- ') ||
    content.includes('* ') ||
    content.match(/^\d+\./m)
  ) {
    score += 5;
  }

  // وجود فقرات متعددة
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 50);
  if (paragraphs.length >= 3) score += 5;
  if (paragraphs.length >= 5) score += 3;

  // طول العنوان (إذا متوفر)
  if (title) {
    if (title.length >= 30 && title.length <= 60) {
      score += 5;
    } else if (title.length >= 20 && title.length <= 70) {
      score += 3;
    }
  }

  // كثافة الكلمات المفتاحية (تقدير)
  const keywords = extractTopKeywords(cleanContent, 5);
  const keywordDensity =
    keywords.reduce((sum, kw) => {
      const regex = new RegExp(kw, 'gi');
      const matches = cleanContent.match(regex) || [];
      return sum + matches.length;
    }, 0) / wordCount;

  if (keywordDensity >= 0.01 && keywordDensity <= 0.03) {
    score += 5;
  }

  return Math.min(100, Math.round(score));
}

/**
 * توليد اقتراحات لتحسين المحتوى
 */
function generateSuggestions(
  content: string,
  scores: { readability: number; uniqueness: number; seo: number }
): string[] {
  const suggestions: string[] = [];
  const cleanContent = cleanText(content);
  const words = cleanContent.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // اقتراحات قابلية القراءة
  if (scores.readability < 70) {
    const sentences = cleanContent.split(/[.!؟]/).filter((s) => s.trim());
    const avgLength = words.length / Math.max(sentences.length, 1);

    if (avgLength > 25) {
      suggestions.push('قسّم الجمل الطويلة إلى جمل أقصر لتحسين القراءة');
    }

    const longWords = words.filter((w) => w.length > 8).length;
    if (longWords / words.length > 0.2) {
      suggestions.push('استخدم كلمات أبسط وأقصر عند الإمكان');
    }
  }

  // اقتراحات التفرد
  if (scores.uniqueness < 70) {
    suggestions.push('أعد صياغة المزيد من الجمل لزيادة تفرد المحتوى');
    suggestions.push('استخدم مرادفات مختلفة للكلمات المتكررة');
  }

  // اقتراحات SEO
  if (scores.seo < 70) {
    if (wordCount < 500) {
      suggestions.push('أضف المزيد من المحتوى (يُفضل 500+ كلمة)');
    }

    const h2Count = (content.match(/##[^#]|<h2/gi) || []).length;
    if (h2Count < 2) {
      suggestions.push('أضف عناوين فرعية (H2) لتنظيم المحتوى');
    }

    if (!content.includes('- ') && !content.includes('* ')) {
      suggestions.push('أضف قوائم نقطية لتحسين قابلية المسح');
    }
  }

  // اقتراحات عامة
  if (
    suggestions.length === 0 &&
    scores.readability >= 80 &&
    scores.seo >= 80
  ) {
    suggestions.push(
      'المحتوى جيد! يمكنك إضافة صور أو روابط داخلية لتحسينه أكثر'
    );
  }

  return suggestions.slice(0, 5); // أقصى 5 اقتراحات
}

/**
 * استخراج أهم الكلمات المفتاحية
 */
export function extractTopKeywords(
  content: string,
  count: number = 10
): string[] {
  const words = cleanText(content)
    .split(/\s+/)
    .filter((w) => w.length > 3 && !ARABIC_STOP_WORDS.has(w));

  // حساب التكرار
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    const normalized = word.toLowerCase();
    frequency[normalized] = (frequency[normalized] || 0) + 1;
  });

  // ترتيب واختيار الأعلى
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}

/**
 * تنظيف النص
 */
function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // إزالة HTML
    .replace(/[#*_`]/g, '') // إزالة Markdown
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * حساب التباين
 */
function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
}

export default {
  analyzeQuality,
  calculateReadability,
  calculateUniqueness,
  calculateSEOScore,
  extractTopKeywords,
};
