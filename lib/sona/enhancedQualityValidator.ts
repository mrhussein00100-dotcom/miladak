/**
 * SONA Enhanced Quality Validator - مدقق الجودة المحسّن
 * يتحقق من جودة المحتوى ويكتشف المشاكل ويقترح التحسينات
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { TopicCategory, ArticleLength } from './types';

// ============================================
// أنواع البيانات
// ============================================

export interface QualityIssue {
  type:
    | 'repetition'
    | 'generic'
    | 'short'
    | 'disconnected'
    | 'low_vocabulary'
    | 'weak_structure';
  severity: 'error' | 'warning' | 'info';
  location?: string;
  suggestion: string;
  details?: string;
}

export interface EnhancedQualityReport {
  score: number; // 0-100
  passed: boolean;
  issues: QualityIssue[];
  suggestions: string[];
  metrics: {
    repetitionScore: number;
    vocabularyDiversity: number;
    genericPhrasesRatio: number;
    coherenceScore: number;
    structureScore: number;
    topicRelevance: number;
  };
}

export interface ValidationConfig {
  minScore?: number;
  maxRepetitionRatio?: number;
  minVocabularyDiversity?: number;
  maxGenericPhrasesRatio?: number;
  requiredKeywords?: string[];
  targetLength?: ArticleLength;
}

// ============================================
// ثوابت
// ============================================

const DEFAULT_CONFIG: ValidationConfig = {
  minScore: 70,
  maxRepetitionRatio: 0.15,
  minVocabularyDiversity: 0.4,
  maxGenericPhrasesRatio: 0.2,
};

const GENERIC_PHRASES = [
  'من المهم',
  'يجب أن',
  'بشكل عام',
  'في الواقع',
  'كما هو معروف',
  'من المعروف أن',
  'لا شك أن',
  'بالتأكيد',
  'طبعاً',
  'أكيد',
  'يعني',
  'الحقيقة',
  'بصراحة',
  'كما تعلمون',
  'كما ذكرنا',
  'كما قلنا',
  'وهكذا',
  'إلى آخره',
  'وما إلى ذلك',
  'وغير ذلك',
];

const STOP_WORDS = [
  'في',
  'من',
  'إلى',
  'على',
  'عن',
  'مع',
  'هذا',
  'هذه',
  'التي',
  'الذي',
  'كان',
  'هو',
  'هي',
  'أن',
  'ما',
  'لا',
  'قد',
  'كل',
  'بعد',
  'قبل',
  'بين',
  'حتى',
  'لم',
  'لن',
  'إذا',
  'أو',
  'و',
  'ثم',
  'أي',
  'كيف',
];

// ============================================
// فئة مدقق الجودة المحسّن
// ============================================

export class EnhancedQualityValidator {
  private config: ValidationConfig;

  constructor(config: ValidationConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * التحقق الشامل من جودة المحتوى
   * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
   */
  validateContent(
    content: string,
    topic: string,
    config?: ValidationConfig
  ): EnhancedQualityReport {
    const mergedConfig = { ...this.config, ...config };
    const issues: QualityIssue[] = [];
    const suggestions: string[] = [];

    // 1. فحص التكرار
    const repetitionIssues = this.checkRepetition(content);
    issues.push(...repetitionIssues);

    // 2. فحص تنوع المفردات
    const vocabularyDiversity = this.checkVocabularyDiversity(content);
    if (vocabularyDiversity < (mergedConfig.minVocabularyDiversity || 0.4)) {
      issues.push({
        type: 'low_vocabulary',
        severity: 'warning',
        suggestion: 'استخدم مفردات أكثر تنوعاً لتحسين جودة المحتوى',
        details: `نسبة تنوع المفردات: ${(vocabularyDiversity * 100).toFixed(
          1
        )}%`,
      });
      suggestions.push('حاول استخدام مرادفات مختلفة للكلمات المتكررة');
    }

    // 3. فحص العبارات العامة
    const genericIssues = this.checkGenericPhrases(content);
    issues.push(...genericIssues);

    // 4. فحص الترابط
    const coherenceScore = this.checkCoherence(content, topic);
    if (coherenceScore < 70) {
      issues.push({
        type: 'disconnected',
        severity: coherenceScore < 50 ? 'error' : 'warning',
        suggestion: 'تأكد من ترابط الأقسام وعلاقتها بالموضوع الرئيسي',
        details: `درجة الترابط: ${coherenceScore}%`,
      });
      suggestions.push('أضف جمل انتقالية بين الأقسام');
    }

    // 5. فحص البنية
    const structureScore = this.checkStructure(content);
    if (structureScore < 70) {
      issues.push({
        type: 'weak_structure',
        severity: 'warning',
        suggestion: 'حسّن بنية المقال بإضافة عناوين فرعية وقوائم',
        details: `درجة البنية: ${structureScore}%`,
      });
    }

    // 6. فحص صلة الموضوع
    const topicRelevance = this.checkTopicRelevance(
      content,
      topic,
      mergedConfig.requiredKeywords
    );

    // حساب الدرجة الإجمالية
    const repetitionScore = 100 - repetitionIssues.length * 10;
    const genericPhrasesRatio = this.calculateGenericPhrasesRatio(content);
    const genericScore = 100 - genericPhrasesRatio * 200;

    const metrics = {
      repetitionScore: Math.max(0, repetitionScore),
      vocabularyDiversity: vocabularyDiversity * 100,
      genericPhrasesRatio: genericPhrasesRatio * 100,
      coherenceScore,
      structureScore,
      topicRelevance,
    };

    const score = Math.round(
      metrics.repetitionScore * 0.2 +
        metrics.vocabularyDiversity * 0.2 +
        (100 - metrics.genericPhrasesRatio) * 0.15 +
        metrics.coherenceScore * 0.2 +
        metrics.structureScore * 0.1 +
        metrics.topicRelevance * 0.15
    );

    // إضافة اقتراحات بناءً على المشاكل
    if (issues.filter((i) => i.type === 'repetition').length > 0) {
      suggestions.push('أعد صياغة الجمل المتكررة باستخدام مرادفات');
    }
    if (issues.filter((i) => i.type === 'generic').length > 0) {
      suggestions.push('استبدل العبارات العامة بعبارات أكثر تحديداً');
    }

    return {
      score,
      passed: score >= (mergedConfig.minScore || 70),
      issues,
      suggestions,
      metrics,
    };
  }

  /**
   * فحص التكرار في المحتوى
   * Requirements: 6.1
   */
  checkRepetition(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const cleanContent = this.stripHtml(content);
    const sentences = this.splitIntoSentences(cleanContent);
    const sentenceMap = new Map<string, number>();

    // فحص تكرار الجمل
    sentences.forEach((sentence, index) => {
      const normalized = this.normalizeSentence(sentence);
      if (normalized.length > 20) {
        // تجاهل الجمل القصيرة جداً
        const count = sentenceMap.get(normalized) || 0;
        sentenceMap.set(normalized, count + 1);

        if (count > 0) {
          issues.push({
            type: 'repetition',
            severity: count > 1 ? 'error' : 'warning',
            location: `الجملة ${index + 1}`,
            suggestion: 'أعد صياغة هذه الجملة لتجنب التكرار',
            details: sentence.substring(0, 50) + '...',
          });
        }
      }
    });

    // فحص تكرار العبارات
    const phrases = this.extractPhrases(cleanContent, 3);
    const phraseMap = new Map<string, number>();

    phrases.forEach((phrase) => {
      const count = phraseMap.get(phrase) || 0;
      phraseMap.set(phrase, count + 1);
    });

    phraseMap.forEach((count, phrase) => {
      if (count > 3 && !this.isCommonPhrase(phrase)) {
        issues.push({
          type: 'repetition',
          severity: 'warning',
          suggestion: `العبارة "${phrase}" متكررة ${count} مرات`,
          details: 'استخدم مرادفات أو أعد الصياغة',
        });
      }
    });

    return issues;
  }

  /**
   * فحص تنوع المفردات
   * Requirements: 6.2
   */
  checkVocabularyDiversity(content: string): number {
    const cleanContent = this.stripHtml(content);
    const words = this.extractWords(cleanContent);

    if (words.length === 0) return 0;

    // استبعاد كلمات التوقف
    const meaningfulWords = words.filter(
      (w) => !STOP_WORDS.includes(w) && w.length > 2
    );

    if (meaningfulWords.length === 0) return 0;

    const uniqueWords = new Set(meaningfulWords);
    return uniqueWords.size / meaningfulWords.length;
  }

  /**
   * فحص العبارات العامة
   * Requirements: 6.5
   */
  checkGenericPhrases(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const cleanContent = this.stripHtml(content).toLowerCase();

    GENERIC_PHRASES.forEach((phrase) => {
      const regex = new RegExp(phrase, 'gi');
      const matches = cleanContent.match(regex);

      if (matches && matches.length > 2) {
        issues.push({
          type: 'generic',
          severity: 'warning',
          suggestion: `العبارة "${phrase}" عامة جداً ومتكررة`,
          details: `وردت ${matches.length} مرات - استبدلها بعبارات أكثر تحديداً`,
        });
      }
    });

    return issues;
  }

  /**
   * فحص الترابط
   * Requirements: 6.3
   */
  checkCoherence(content: string, topic: string): number {
    const cleanContent = this.stripHtml(content);
    const paragraphs = cleanContent.split(/\n\n+/);

    if (paragraphs.length < 2) return 100;

    let coherenceScore = 100;
    const topicWords = this.extractWords(topic);

    // فحص وجود كلمات الموضوع في كل فقرة
    paragraphs.forEach((para, index) => {
      const paraWords = this.extractWords(para);
      const hasTopicWord = topicWords.some((tw) =>
        paraWords.some((pw) => pw.includes(tw) || tw.includes(pw))
      );

      if (!hasTopicWord && para.length > 100) {
        coherenceScore -= 10;
      }
    });

    // فحص وجود انتقالات بين الفقرات
    const transitionWords = [
      'بالإضافة',
      'علاوة',
      'كما',
      'أيضاً',
      'ومن',
      'وفي',
      'لذلك',
      'وبالتالي',
      'من ناحية',
      'وأخيراً',
      'ختاماً',
      'في الختام',
    ];

    let transitionCount = 0;
    paragraphs.forEach((para) => {
      if (transitionWords.some((tw) => para.includes(tw))) {
        transitionCount++;
      }
    });

    const transitionRatio = transitionCount / paragraphs.length;
    if (transitionRatio < 0.3) {
      coherenceScore -= 15;
    }

    return Math.max(0, Math.min(100, coherenceScore));
  }

  /**
   * فحص البنية
   * Requirements: 6.4
   */
  checkStructure(content: string): number {
    let score = 0;

    // فحص وجود عناوين H2
    const h2Count = (content.match(/<h2>/gi) || []).length;
    if (h2Count >= 3) score += 30;
    else if (h2Count >= 2) score += 20;
    else if (h2Count >= 1) score += 10;

    // فحص وجود عناوين H3
    const h3Count = (content.match(/<h3>/gi) || []).length;
    if (h3Count >= 2) score += 15;
    else if (h3Count >= 1) score += 10;

    // فحص وجود قوائم
    const listCount = (content.match(/<ul>|<ol>/gi) || []).length;
    if (listCount >= 2) score += 20;
    else if (listCount >= 1) score += 10;

    // فحص وجود فقرات كافية
    const pCount = (content.match(/<p>/gi) || []).length;
    if (pCount >= 5) score += 20;
    else if (pCount >= 3) score += 10;

    // فحص وجود مقدمة وخاتمة
    if (content.includes('مقدمة') || content.includes('تمهيد')) score += 10;
    if (
      content.includes('الخاتمة') ||
      content.includes('ختاماً') ||
      content.includes('في الختام')
    )
      score += 5;

    return Math.min(100, score);
  }

  /**
   * فحص صلة المحتوى بالموضوع
   */
  checkTopicRelevance(
    content: string,
    topic: string,
    requiredKeywords?: string[]
  ): number {
    const cleanContent = this.stripHtml(content).toLowerCase();
    const words = this.extractWords(cleanContent);
    const totalWords = words.length;

    if (totalWords === 0) return 0;

    let relevanceScore = 0;

    // فحص وجود كلمات الموضوع
    const topicWords = this.extractWords(topic.toLowerCase());
    let topicWordCount = 0;

    topicWords.forEach((tw) => {
      const regex = new RegExp(tw, 'gi');
      const matches = cleanContent.match(regex);
      if (matches) {
        topicWordCount += matches.length;
      }
    });

    const topicDensity = topicWordCount / totalWords;
    if (topicDensity >= 0.02) relevanceScore += 50;
    else if (topicDensity >= 0.01) relevanceScore += 30;
    else relevanceScore += 10;

    // فحص الكلمات المفتاحية المطلوبة
    if (requiredKeywords && requiredKeywords.length > 0) {
      let foundKeywords = 0;
      requiredKeywords.forEach((kw) => {
        if (cleanContent.includes(kw.toLowerCase())) {
          foundKeywords++;
        }
      });
      const keywordRatio = foundKeywords / requiredKeywords.length;
      relevanceScore += keywordRatio * 50;
    } else {
      relevanceScore += 25;
    }

    return Math.min(100, relevanceScore);
  }

  /**
   * إعادة توليد الأجزاء الضعيفة
   * Requirements: 6.4
   */
  regenerateWeakSections(
    content: string,
    issues: QualityIssue[]
  ): { content: string; regenerated: string[] } {
    let improvedContent = content;
    const regenerated: string[] = [];

    // معالجة مشاكل التكرار
    const repetitionIssues = issues.filter((i) => i.type === 'repetition');
    if (repetitionIssues.length > 0) {
      improvedContent = this.reduceRepetition(improvedContent);
      regenerated.push('تم تقليل التكرار');
    }

    // معالجة العبارات العامة
    const genericIssues = issues.filter((i) => i.type === 'generic');
    if (genericIssues.length > 0) {
      improvedContent = this.replaceGenericPhrases(improvedContent);
      regenerated.push('تم استبدال العبارات العامة');
    }

    // معالجة ضعف البنية
    const structureIssues = issues.filter((i) => i.type === 'weak_structure');
    if (structureIssues.length > 0) {
      improvedContent = this.improveStructure(improvedContent);
      regenerated.push('تم تحسين البنية');
    }

    return { content: improvedContent, regenerated };
  }

  // ============================================
  // دوال مساعدة خاصة
  // ============================================

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractWords(text: string): string[] {
    return text
      .replace(/[^\u0600-\u06FFa-zA-Z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 0);
  }

  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.،؟!]/g)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  private normalizeSentence(sentence: string): string {
    return sentence.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private extractPhrases(text: string, wordCount: number): string[] {
    const words = this.extractWords(text);
    const phrases: string[] = [];

    for (let i = 0; i <= words.length - wordCount; i++) {
      const phrase = words.slice(i, i + wordCount).join(' ');
      phrases.push(phrase);
    }

    return phrases;
  }

  private isCommonPhrase(phrase: string): boolean {
    const commonPhrases = [
      'من أجل',
      'على سبيل',
      'في هذا',
      'من خلال',
      'بشكل عام',
      'في ما يلي',
      'على الرغم',
      'من ناحية',
      'في حين',
    ];
    return commonPhrases.some((cp) => phrase.includes(cp));
  }

  private calculateGenericPhrasesRatio(content: string): number {
    const cleanContent = this.stripHtml(content).toLowerCase();
    const sentences = this.splitIntoSentences(cleanContent);

    if (sentences.length === 0) return 0;

    let genericCount = 0;
    sentences.forEach((sentence) => {
      if (GENERIC_PHRASES.some((gp) => sentence.includes(gp))) {
        genericCount++;
      }
    });

    return genericCount / sentences.length;
  }

  private reduceRepetition(content: string): string {
    // تنفيذ بسيط - يمكن تحسينه لاحقاً
    const sentences = content.split(/(?<=[.،؟!])\s+/);
    const seen = new Set<string>();
    const unique: string[] = [];

    sentences.forEach((sentence) => {
      const normalized = this.normalizeSentence(this.stripHtml(sentence));
      if (!seen.has(normalized) || normalized.length < 20) {
        unique.push(sentence);
        seen.add(normalized);
      }
    });

    return unique.join(' ');
  }

  private replaceGenericPhrases(content: string): string {
    let result = content;

    const replacements: Record<string, string[]> = {
      'من المهم': ['من الضروري', 'من الأساسي', 'يجب'],
      'بشكل عام': ['عموماً', 'في الغالب', 'عادةً'],
      'في الواقع': ['حقيقةً', 'فعلياً', 'بالفعل'],
      'كما هو معروف': ['كما يتضح', 'كما نلاحظ', 'كما يتبين'],
    };

    for (const [generic, alternatives] of Object.entries(replacements)) {
      const regex = new RegExp(generic, 'gi');
      let match;
      let lastIndex = 0;
      let newContent = '';

      while ((match = regex.exec(result)) !== null) {
        const alternative =
          alternatives[Math.floor(Math.random() * alternatives.length)];
        newContent += result.substring(lastIndex, match.index) + alternative;
        lastIndex = match.index + generic.length;
      }
      newContent += result.substring(lastIndex);
      result = newContent || result;
    }

    return result;
  }

  private improveStructure(content: string): string {
    // إضافة عناوين فرعية إذا كانت مفقودة
    if (!content.includes('<h2>')) {
      const paragraphs = content.split('</p>');
      if (paragraphs.length > 3) {
        // إضافة عنوان بعد الفقرة الأولى
        paragraphs.splice(1, 0, '\n<h2>معلومات مهمة</h2>\n');
      }
      return paragraphs.join('</p>');
    }
    return content;
  }
}

// تصدير نسخة واحدة
export const enhancedQualityValidator = new EnhancedQualityValidator();
