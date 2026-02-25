/**
 * SONA v4 Strict Quality Gate - بوابة الجودة الصارمة
 * ترفض المحتوى الرديء وتضمن جودة عالية للمقالات المولدة
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3
 */

import { ArticleLength } from './types';

/**
 * إعدادات بوابة الجودة
 */
export interface QualityGateConfig {
  /** الحد الأدنى لارتباط الموضوع (80%) */
  minTopicRelevance: number;
  /** الحد الأدنى للدرجة الإجمالية (75%) */
  minOverallScore: number;
  /** الكلمات المفتاحية الإجبارية */
  requiredKeywords: string[];
  /** الأقسام المطلوبة */
  requiredSections: string[];
  /** حدود عدد الكلمات */
  wordCountLimits: { min: number; max: number };
  /** طول المقال */
  articleLength?: ArticleLength;
}

/**
 * نتيجة فحص الجودة
 */
export interface QualityGateResult {
  /** هل نجح الفحص */
  passed: boolean;
  /** درجة ارتباط الموضوع (0-100) */
  topicRelevanceScore: number;
  /** الدرجة الإجمالية (0-100) */
  overallScore: number;
  /** الكلمات المفتاحية المفقودة */
  missingKeywords: string[];
  /** الأقسام المفقودة */
  missingSections: string[];
  /** حالة عدد الكلمات */
  wordCountStatus: 'below' | 'within' | 'above';
  /** عدد الكلمات الفعلي */
  actualWordCount: number;
  /** أسباب الرفض */
  rejectionReasons: string[];
  /** تفاصيل الدرجات */
  scoreBreakdown: {
    topicRelevance: number;
    keywordPresence: number;
    sectionCompleteness: number;
    wordCountScore: number;
    contentQuality: number;
  };
}

/**
 * حدود عدد الكلمات الصارمة
 */
export const STRICT_WORD_COUNT_LIMITS: Record<
  ArticleLength,
  { min: number; max: number; target: number }
> = {
  short: { min: 450, max: 550, target: 500 },
  medium: { min: 900, max: 1100, target: 1000 },
  long: { min: 1800, max: 2200, target: 2000 },
  comprehensive: { min: 2800, max: 3500, target: 3000 },
};

/**
 * الأقسام المطلوبة حسب الطول
 */
export const STRICT_REQUIRED_SECTIONS: Record<
  ArticleLength,
  {
    intro: boolean;
    minH2Sections: number;
    faq: boolean;
    tips: boolean;
    conclusion: boolean;
  }
> = {
  short: {
    intro: true,
    minH2Sections: 3,
    faq: false,
    tips: false,
    conclusion: true,
  },
  medium: {
    intro: true,
    minH2Sections: 4,
    faq: false,
    tips: true,
    conclusion: true,
  },
  long: {
    intro: true,
    minH2Sections: 5,
    faq: true,
    tips: true,
    conclusion: true,
  },
  comprehensive: {
    intro: true,
    minH2Sections: 6,
    faq: true,
    tips: true,
    conclusion: true,
  },
};

/**
 * العبارات العامة التي يجب تجنبها
 */
const GENERIC_PHRASES = [
  'هذا الموضوع مهم جداً',
  'من المهم أن نعرف',
  'يجب علينا أن نفهم',
  'في هذا المقال سنتحدث',
  'كما نعلم جميعاً',
  'من المعروف أن',
  'لا شك أن',
  'بلا شك',
  'من الواضح أن',
  'كما هو معروف',
];

/**
 * الإعدادات الافتراضية
 */
const DEFAULT_CONFIG: QualityGateConfig = {
  minTopicRelevance: 80,
  minOverallScore: 75,
  requiredKeywords: [],
  requiredSections: ['intro', 'conclusion'],
  wordCountLimits: { min: 800, max: 1200 },
  articleLength: 'medium',
};

/**
 * Strict Quality Gate Class
 * بوابة جودة صارمة للتحقق من جودة المحتوى المولد
 */
export class StrictQualityGate {
  private config: QualityGateConfig;

  constructor(config?: Partial<QualityGateConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * التحقق من جودة المحتوى
   * Requirements: 5.1 - تشغيل فحص جودة شامل
   */
  validate(
    content: string,
    config?: Partial<QualityGateConfig>
  ): QualityGateResult {
    const mergedConfig = { ...this.config, ...config };
    const rejectionReasons: string[] = [];

    // 1. حساب درجة ارتباط الموضوع
    const topicRelevanceScore = this.checkTopicRelevance(
      content,
      mergedConfig.requiredKeywords
    );

    // 2. التحقق من الكلمات المفتاحية
    const missingKeywords = this.findMissingKeywords(
      content,
      mergedConfig.requiredKeywords
    );
    const keywordPresenceScore = this.calculateKeywordPresenceScore(
      mergedConfig.requiredKeywords.length,
      missingKeywords.length
    );

    // 3. التحقق من الأقسام
    const missingSections = this.checkRequiredSections(
      content,
      mergedConfig.requiredSections,
      mergedConfig.articleLength
    );
    const sectionCompletenessScore = this.calculateSectionCompletenessScore(
      content,
      mergedConfig.articleLength
    );

    // 4. التحقق من عدد الكلمات
    const wordCountStatus = this.checkWordCount(
      content,
      mergedConfig.wordCountLimits
    );
    const actualWordCount = this.countWords(content);
    const wordCountScore = this.calculateWordCountScore(
      actualWordCount,
      mergedConfig.wordCountLimits
    );

    // 5. التحقق من جودة المحتوى
    const contentQualityScore = this.checkContentQuality(content);

    // حساب الدرجة الإجمالية
    const overallScore = this.calculateOverallScore({
      topicRelevance: topicRelevanceScore,
      keywordPresence: keywordPresenceScore,
      sectionCompleteness: sectionCompletenessScore,
      wordCountScore: wordCountScore,
      contentQuality: contentQualityScore,
    });

    // تحديد أسباب الرفض
    if (topicRelevanceScore < mergedConfig.minTopicRelevance) {
      rejectionReasons.push(
        `درجة ارتباط الموضوع (${topicRelevanceScore}%) أقل من الحد الأدنى (${mergedConfig.minTopicRelevance}%)`
      );
    }

    if (missingKeywords.length > 0) {
      rejectionReasons.push(
        `كلمات مفتاحية مفقودة: ${missingKeywords.join(', ')}`
      );
    }

    if (missingSections.length > 0) {
      rejectionReasons.push(`أقسام مفقودة: ${missingSections.join(', ')}`);
    }

    if (wordCountStatus === 'below') {
      rejectionReasons.push(
        `عدد الكلمات (${actualWordCount}) أقل من الحد الأدنى (${mergedConfig.wordCountLimits.min})`
      );
    } else if (wordCountStatus === 'above') {
      rejectionReasons.push(
        `عدد الكلمات (${actualWordCount}) أكثر من الحد الأقصى (${mergedConfig.wordCountLimits.max})`
      );
    }

    if (overallScore < mergedConfig.minOverallScore) {
      rejectionReasons.push(
        `الدرجة الإجمالية (${overallScore}%) أقل من الحد الأدنى (${mergedConfig.minOverallScore}%)`
      );
    }

    // تحديد نتيجة الفحص
    const passed =
      topicRelevanceScore >= mergedConfig.minTopicRelevance &&
      overallScore >= mergedConfig.minOverallScore &&
      missingSections.length === 0 &&
      wordCountStatus === 'within';

    return {
      passed,
      topicRelevanceScore,
      overallScore,
      missingKeywords,
      missingSections,
      wordCountStatus,
      actualWordCount,
      rejectionReasons,
      scoreBreakdown: {
        topicRelevance: topicRelevanceScore,
        keywordPresence: keywordPresenceScore,
        sectionCompleteness: sectionCompletenessScore,
        wordCountScore: wordCountScore,
        contentQuality: contentQualityScore,
      },
    };
  }

  /**
   * التحقق من ارتباط الموضوع
   * Requirements: 5.3 - درجة ارتباط الموضوع >= 80%
   */
  checkTopicRelevance(content: string, keywords: string[]): number {
    if (keywords.length === 0) return 100;

    const lowerContent = content.toLowerCase();
    let totalScore = 0;
    let maxScore = 0;

    keywords.forEach((keyword) => {
      const lowerKeyword = keyword.toLowerCase();
      const occurrences = this.countOccurrences(lowerContent, lowerKeyword);

      // كل كلمة مفتاحية لها وزن
      maxScore += 100;

      if (occurrences === 0) {
        // الكلمة غير موجودة
        totalScore += 0;
      } else if (occurrences === 1) {
        // موجودة مرة واحدة
        totalScore += 50;
      } else if (occurrences >= 2 && occurrences <= 5) {
        // موجودة 2-5 مرات (مثالي)
        totalScore += 100;
      } else {
        // موجودة أكثر من 5 مرات (قد يكون حشو)
        totalScore += 80;
      }
    });

    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;
  }

  /**
   * التحقق من الأقسام المطلوبة
   * Requirements: 4.1, 4.2, 4.3
   */
  checkRequiredSections(
    content: string,
    requiredSections: string[],
    articleLength?: ArticleLength
  ): string[] {
    const missing: string[] = [];
    const lowerContent = content.toLowerCase();

    // التحقق من المقدمة
    if (requiredSections.includes('intro')) {
      const hasIntro =
        lowerContent.includes('مقدمة') ||
        lowerContent.includes('في هذا المقال') ||
        lowerContent.includes('نتحدث عن') ||
        lowerContent.includes('نستعرض') ||
        content.trim().length > 0; // أي محتوى يعتبر له مقدمة

      if (!hasIntro) {
        missing.push('مقدمة');
      }
    }

    // التحقق من الخاتمة
    if (requiredSections.includes('conclusion')) {
      const hasConclusion =
        lowerContent.includes('خاتمة') ||
        lowerContent.includes('في الختام') ||
        lowerContent.includes('ختاماً') ||
        lowerContent.includes('في النهاية') ||
        lowerContent.includes('نأمل');

      if (!hasConclusion) {
        missing.push('خاتمة');
      }
    }

    // التحقق من عدد أقسام H2
    if (articleLength) {
      const requiredH2Count =
        STRICT_REQUIRED_SECTIONS[articleLength].minH2Sections;
      const h2Count = (content.match(/<h2|## /gi) || []).length;

      if (h2Count < requiredH2Count) {
        missing.push(
          `${requiredH2Count} أقسام H2 على الأقل (موجود: ${h2Count})`
        );
      }
    }

    // التحقق من FAQ للمقالات الطويلة
    if (
      requiredSections.includes('faq') ||
      articleLength === 'long' ||
      articleLength === 'comprehensive'
    ) {
      const hasFaq =
        lowerContent.includes('أسئلة شائعة') ||
        lowerContent.includes('الأسئلة المتكررة') ||
        lowerContent.includes('faq') ||
        lowerContent.includes('سؤال وجواب');

      if (
        !hasFaq &&
        (articleLength === 'long' || articleLength === 'comprehensive')
      ) {
        missing.push('قسم الأسئلة الشائعة');
      }
    }

    return missing;
  }

  /**
   * التحقق من عدد الكلمات
   * Requirements: 3.1, 3.2, 3.3
   */
  checkWordCount(
    content: string,
    limits: { min: number; max: number }
  ): 'below' | 'within' | 'above' {
    const wordCount = this.countWords(content);

    if (wordCount < limits.min) {
      return 'below';
    } else if (wordCount > limits.max) {
      return 'above';
    }
    return 'within';
  }

  /**
   * التحقق من جودة المحتوى
   * Requirements: 7.1, 7.2, 7.3
   */
  checkContentQuality(content: string): number {
    let score = 100;
    const lowerContent = content.toLowerCase();

    // 1. التحقق من العبارات العامة (-5 لكل عبارة)
    GENERIC_PHRASES.forEach((phrase) => {
      if (lowerContent.includes(phrase.toLowerCase())) {
        score -= 5;
      }
    });

    // 2. التحقق من تكرار الجمل (-10 لكل تكرار)
    const sentences = this.extractSentences(content);
    const uniqueSentences = new Set(
      sentences.map((s) => s.toLowerCase().trim())
    );
    const duplicateCount = sentences.length - uniqueSentences.size;
    score -= duplicateCount * 10;

    // 3. التحقق من طول الجمل (جمل قصيرة جداً أو طويلة جداً)
    sentences.forEach((sentence) => {
      const wordCount = sentence.split(/\s+/).length;
      if (wordCount < 3 || wordCount > 50) {
        score -= 2;
      }
    });

    // 4. التحقق من تنوع الكلمات
    const words = content.split(/\s+/).filter((w) => w.length > 2);
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const diversityRatio = uniqueWords.size / words.length;
    if (diversityRatio < 0.3) {
      score -= 20; // تكرار كثير
    }

    return Math.max(0, Math.min(100, score));
  }

  // ==================== Private Methods ====================

  /**
   * البحث عن الكلمات المفتاحية المفقودة
   */
  private findMissingKeywords(content: string, keywords: string[]): string[] {
    const lowerContent = content.toLowerCase();
    return keywords.filter((kw) => !lowerContent.includes(kw.toLowerCase()));
  }

  /**
   * حساب درجة وجود الكلمات المفتاحية
   */
  private calculateKeywordPresenceScore(
    totalKeywords: number,
    missingCount: number
  ): number {
    if (totalKeywords === 0) return 100;
    const presentCount = totalKeywords - missingCount;
    return Math.round((presentCount / totalKeywords) * 100);
  }

  /**
   * حساب درجة اكتمال الأقسام
   */
  private calculateSectionCompletenessScore(
    content: string,
    articleLength?: ArticleLength
  ): number {
    let score = 100;
    const lowerContent = content.toLowerCase();

    // التحقق من المقدمة
    const hasIntro =
      lowerContent.includes('مقدمة') ||
      lowerContent.includes('في هذا المقال') ||
      content.trim().length > 100;
    if (!hasIntro) score -= 20;

    // التحقق من الخاتمة
    const hasConclusion =
      lowerContent.includes('خاتمة') ||
      lowerContent.includes('في الختام') ||
      lowerContent.includes('ختاماً');
    if (!hasConclusion) score -= 20;

    // التحقق من أقسام H2
    if (articleLength) {
      const requiredH2 = STRICT_REQUIRED_SECTIONS[articleLength].minH2Sections;
      const actualH2 = (content.match(/<h2|## /gi) || []).length;
      const h2Ratio = Math.min(actualH2 / requiredH2, 1);
      score = score * (0.6 + 0.4 * h2Ratio);
    }

    return Math.round(Math.max(0, score));
  }

  /**
   * حساب درجة عدد الكلمات
   */
  private calculateWordCountScore(
    actualCount: number,
    limits: { min: number; max: number }
  ): number {
    if (actualCount >= limits.min && actualCount <= limits.max) {
      return 100;
    }

    if (actualCount < limits.min) {
      const ratio = actualCount / limits.min;
      return Math.round(ratio * 100);
    }

    // أكثر من الحد الأقصى
    const excess = actualCount - limits.max;
    const penalty = Math.min(excess / 100, 0.5); // حد أقصى 50% خصم
    return Math.round((1 - penalty) * 100);
  }

  /**
   * حساب الدرجة الإجمالية
   */
  private calculateOverallScore(scores: {
    topicRelevance: number;
    keywordPresence: number;
    sectionCompleteness: number;
    wordCountScore: number;
    contentQuality: number;
  }): number {
    // الأوزان
    const weights = {
      topicRelevance: 0.3, // 30%
      keywordPresence: 0.2, // 20%
      sectionCompleteness: 0.2, // 20%
      wordCountScore: 0.15, // 15%
      contentQuality: 0.15, // 15%
    };

    const weightedScore =
      scores.topicRelevance * weights.topicRelevance +
      scores.keywordPresence * weights.keywordPresence +
      scores.sectionCompleteness * weights.sectionCompleteness +
      scores.wordCountScore * weights.wordCountScore +
      scores.contentQuality * weights.contentQuality;

    return Math.round(weightedScore);
  }

  /**
   * عد الكلمات
   */
  private countWords(text: string): number {
    // إزالة HTML tags
    const cleanText = text.replace(/<[^>]*>/g, ' ');
    return cleanText
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }

  /**
   * عد تكرار كلمة في النص
   */
  private countOccurrences(text: string, word: string): number {
    const regex = new RegExp(word, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  /**
   * استخراج الجمل من النص
   */
  private extractSentences(text: string): string[] {
    return text
      .split(/[.!?؟،]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
  }

  /**
   * الحصول على حدود عدد الكلمات لطول معين
   */
  static getWordCountLimits(length: ArticleLength): {
    min: number;
    max: number;
  } {
    return {
      min: STRICT_WORD_COUNT_LIMITS[length].min,
      max: STRICT_WORD_COUNT_LIMITS[length].max,
    };
  }

  /**
   * الحصول على الأقسام المطلوبة لطول معين
   */
  static getRequiredSections(length: ArticleLength): string[] {
    const config = STRICT_REQUIRED_SECTIONS[length];
    const sections: string[] = [];

    if (config.intro) sections.push('intro');
    if (config.conclusion) sections.push('conclusion');
    if (config.faq) sections.push('faq');
    if (config.tips) sections.push('tips');

    return sections;
  }
}

// Export singleton instance
export const strictQualityGate = new StrictQualityGate();
