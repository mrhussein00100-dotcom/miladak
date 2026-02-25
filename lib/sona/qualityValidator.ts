/**
 * Quality Validator - مدقق جودة المحتوى
 * يتحقق من جودة المقالات المولدة قبل إرجاعها
 */

import { ArticleLength } from './types';

// ============================================
// Interfaces
// ============================================

export interface QualityIssue {
  type: 'topic_relevance' | 'completeness' | 'word_count' | 'repetition';
  severity: 'error' | 'warning';
  message: string;
  details?: any;
}

export interface QualityValidationResult {
  passed: boolean;
  overallScore: number;
  topicRelevanceScore: number;
  completenessScore: number;
  wordCountScore: number;
  repetitionScore: number;
  issues: QualityIssue[];
  suggestions: string[];
}

export interface ValidationConfig {
  requiredKeywords: string[];
  targetLength: ArticleLength;
  requireFaq: boolean;
  minH2Count: number;
}

// ============================================
// Word Count Limits
// ============================================

export const WORD_COUNT_LIMITS: Record<
  ArticleLength,
  { min: number; max: number }
> = {
  short: { min: 400, max: 600 },
  medium: { min: 800, max: 1200 },
  long: { min: 1500, max: 2500 },
  comprehensive: { min: 2500, max: 4000 },
};

// ============================================
// Required Sections Config
// ============================================

export const REQUIRED_SECTIONS: Record<
  ArticleLength,
  { minH2: number; requireFaq: boolean }
> = {
  short: { minH2: 2, requireFaq: false },
  medium: { minH2: 3, requireFaq: false },
  long: { minH2: 4, requireFaq: true },
  comprehensive: { minH2: 5, requireFaq: true },
};

// ============================================
// Quality Thresholds
// ============================================

export const QUALITY_THRESHOLDS = {
  minOverallScore: 70,
  minTopicRelevance: 60,
  minCompleteness: 80,
  minWordCountScore: 70,
  minRepetitionScore: 60,
};

// ============================================
// Quality Validator Class
// ============================================

export class QualityValidator {
  /**
   * التحقق الشامل من جودة المحتوى
   */
  validate(content: string, config: ValidationConfig): QualityValidationResult {
    const issues: QualityIssue[] = [];
    const suggestions: string[] = [];

    // 1. فحص ارتباط الموضوع
    const topicRelevanceScore = this.checkTopicRelevance(
      content,
      config.requiredKeywords
    );
    if (topicRelevanceScore < QUALITY_THRESHOLDS.minTopicRelevance) {
      issues.push({
        type: 'topic_relevance',
        severity: 'error',
        message: `درجة ارتباط الموضوع منخفضة: ${topicRelevanceScore}%`,
        details: {
          score: topicRelevanceScore,
          threshold: QUALITY_THRESHOLDS.minTopicRelevance,
        },
      });
      suggestions.push('أضف المزيد من الكلمات المفتاحية المرتبطة بالموضوع');
    }

    // 2. فحص اكتمال الأقسام
    const completenessScore = this.checkCompleteness(
      content,
      config.minH2Count,
      config.requireFaq
    );
    if (completenessScore < QUALITY_THRESHOLDS.minCompleteness) {
      issues.push({
        type: 'completeness',
        severity: 'error',
        message: `درجة اكتمال المقال منخفضة: ${completenessScore}%`,
        details: {
          score: completenessScore,
          threshold: QUALITY_THRESHOLDS.minCompleteness,
        },
      });
      suggestions.push('تأكد من وجود مقدمة وأقسام رئيسية وخاتمة');
    }

    // 3. فحص عدد الكلمات
    const wordCountScore = this.checkWordCount(content, config.targetLength);
    if (wordCountScore < QUALITY_THRESHOLDS.minWordCountScore) {
      const limits = WORD_COUNT_LIMITS[config.targetLength];
      const wordCount = this.countWords(content);
      issues.push({
        type: 'word_count',
        severity: wordCount < limits.min ? 'error' : 'warning',
        message: `عدد الكلمات (${wordCount}) خارج النطاق المطلوب (${limits.min}-${limits.max})`,
        details: { wordCount, min: limits.min, max: limits.max },
      });
      if (wordCount < limits.min) {
        suggestions.push('أضف المزيد من المحتوى للوصول للحد الأدنى');
      } else {
        suggestions.push('قلص المحتوى للوصول للحد الأقصى');
      }
    }

    // 4. فحص التكرار
    const repetitionScore = this.checkRepetition(content);
    if (repetitionScore < QUALITY_THRESHOLDS.minRepetitionScore) {
      issues.push({
        type: 'repetition',
        severity: 'warning',
        message: `نسبة التكرار عالية في المحتوى`,
        details: { score: repetitionScore },
      });
      suggestions.push('قلل من تكرار الجمل والأفكار');
    }

    // حساب الدرجة الإجمالية
    const overallScore = Math.round(
      topicRelevanceScore * 0.3 +
        completenessScore * 0.3 +
        wordCountScore * 0.25 +
        repetitionScore * 0.15
    );

    const passed = overallScore >= QUALITY_THRESHOLDS.minOverallScore;

    return {
      passed,
      overallScore,
      topicRelevanceScore,
      completenessScore,
      wordCountScore,
      repetitionScore,
      issues,
      suggestions,
    };
  }

  /**
   * فحص ارتباط المحتوى بالموضوع
   * يتحقق من وجود الكلمات المفتاحية في المحتوى
   */
  checkTopicRelevance(content: string, requiredKeywords: string[]): number {
    if (!requiredKeywords || requiredKeywords.length === 0) {
      return 100; // لا توجد كلمات مفتاحية للتحقق منها
    }

    const contentLower = content.toLowerCase();
    let foundCount = 0;

    for (const keyword of requiredKeywords) {
      if (contentLower.includes(keyword.toLowerCase())) {
        foundCount++;
      }
    }

    // حساب النسبة المئوية
    const percentage = (foundCount / requiredKeywords.length) * 100;
    return Math.round(percentage);
  }

  /**
   * فحص اكتمال أقسام المقال
   */
  checkCompleteness(
    content: string,
    minH2Count: number,
    requireFaq: boolean
  ): number {
    let score = 0;
    const maxScore = 100;

    // التحقق من وجود المقدمة (30 نقطة)
    const hasIntro = this.hasIntroduction(content);
    if (hasIntro) score += 30;

    // التحقق من عدد أقسام H2 (30 نقطة)
    const h2Count = this.countH2Sections(content);
    const h2Score = Math.min((h2Count / minH2Count) * 30, 30);
    score += h2Score;

    // التحقق من وجود الخاتمة (25 نقطة)
    const hasConclusion = this.hasConclusion(content);
    if (hasConclusion) score += 25;

    // التحقق من وجود FAQ إذا كان مطلوباً (15 نقطة)
    if (requireFaq) {
      const hasFaq = this.hasFaqSection(content);
      if (hasFaq) score += 15;
    } else {
      score += 15; // إذا لم يكن مطلوباً، نعطي النقاط كاملة
    }

    return Math.round(Math.min(score, maxScore));
  }

  /**
   * فحص عدد الكلمات
   */
  checkWordCount(content: string, targetLength: ArticleLength): number {
    const wordCount = this.countWords(content);
    const limits = WORD_COUNT_LIMITS[targetLength];

    if (wordCount >= limits.min && wordCount <= limits.max) {
      return 100; // ضمن النطاق المثالي
    }

    if (wordCount < limits.min) {
      // أقل من الحد الأدنى
      const ratio = wordCount / limits.min;
      return Math.round(ratio * 100);
    }

    // أكثر من الحد الأقصى
    const excess = wordCount - limits.max;
    const tolerance = limits.max * 0.2; // 20% تسامح
    if (excess <= tolerance) {
      return Math.round(100 - (excess / tolerance) * 30); // خصم حتى 30 نقطة
    }
    return 50; // تجاوز كبير
  }

  /**
   * فحص التكرار في المحتوى
   */
  checkRepetition(content: string): number {
    // إزالة HTML tags
    const textOnly = content.replace(/<[^>]*>/g, ' ').trim();

    // تقسيم إلى جمل
    const sentences = textOnly
      .split(/[.،؟!؛]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    if (sentences.length < 2) {
      return 100; // لا يوجد ما يكفي للمقارنة
    }

    // حساب التشابه بين الجمل
    let duplicateCount = 0;
    const seen = new Set<string>();

    for (const sentence of sentences) {
      const normalized = this.normalizeSentence(sentence);
      if (seen.has(normalized)) {
        duplicateCount++;
      } else {
        seen.add(normalized);
      }
    }

    // حساب نسبة عدم التكرار
    const uniqueRatio = (sentences.length - duplicateCount) / sentences.length;
    return Math.round(uniqueRatio * 100);
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * عد الكلمات في المحتوى
   */
  countWords(content: string): number {
    const textOnly = content.replace(/<[^>]*>/g, ' ');
    const words = textOnly.split(/\s+/).filter((w) => w.length > 0);
    return words.length;
  }

  /**
   * التحقق من وجود مقدمة
   */
  private hasIntroduction(content: string): boolean {
    const introPatterns = [
      /<h2[^>]*>.*?(مقدمة|تمهيد|نبذة|introduction).*?<\/h2>/i,
      /^<p>/i, // يبدأ بفقرة
      /<h2[^>]*>/i, // يحتوي على عنوان H2 على الأقل
    ];

    return introPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * عد أقسام H2
   */
  private countH2Sections(content: string): number {
    const h2Matches = content.match(/<h2[^>]*>/gi);
    return h2Matches ? h2Matches.length : 0;
  }

  /**
   * التحقق من وجود خاتمة
   */
  private hasConclusion(content: string): boolean {
    const conclusionPatterns = [
      /<h2[^>]*>.*?(خاتمة|الخاتمة|ختام|في الختام|خلاصة|conclusion).*?<\/h2>/i,
      /في الختام/i,
      /وفي النهاية/i,
      /نأمل أن/i,
      /شاركوا المقال/i,
    ];

    return conclusionPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * التحقق من وجود قسم FAQ
   */
  private hasFaqSection(content: string): boolean {
    const faqPatterns = [
      /<h2[^>]*>.*?(أسئلة شائعة|الأسئلة الشائعة|FAQ|أسئلة متكررة).*?<\/h2>/i,
      /<h3[^>]*>.*?\?.*?<\/h3>/i, // عناوين H3 تنتهي بعلامة استفهام
    ];

    return faqPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * تطبيع الجملة للمقارنة
   */
  private normalizeSentence(sentence: string): string {
    return sentence
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\u0600-\u06FFa-z0-9\s]/g, '')
      .trim();
  }
}

// Export singleton instance
export const qualityValidator = new QualityValidator();
