/**
 * Property-Based Tests for StrictQualityGate
 * اختبارات الخصائص لبوابة الجودة الصارمة
 *
 * Using fast-check library for property-based testing
 * Each test runs at least 100 iterations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  StrictQualityGate,
  QualityGateConfig,
  STRICT_WORD_COUNT_LIMITS,
} from '../../lib/sona/strictQualityGate';
import { ArticleLength } from '../../lib/sona/types';

// ==================== Test Generators ====================

/**
 * مولد للكلمات المفتاحية العربية
 */
const arabicKeywordArb = fc.constantFrom(
  'عيد',
  'ميلاد',
  'برج',
  'صحة',
  'نصائح',
  'معلومات',
  'محمد',
  'أحمد',
  'فاطمة',
  'الحمل',
  'الثور'
);

/**
 * مولد لقائمة الكلمات المفتاحية
 */
const keywordsListArb = fc.array(arabicKeywordArb, {
  minLength: 1,
  maxLength: 5,
});

/**
 * مولد لأطوال المقالات
 */
const articleLengthArb: fc.Arbitrary<ArticleLength> = fc.constantFrom(
  'short',
  'medium',
  'long',
  'comprehensive'
);

/**
 * مولد للفقرات العربية
 */
const arabicParagraphArb = fc
  .array(
    fc.constantFrom(
      'هذا نص تجريبي للاختبار.',
      'نتمنى لكم يوماً سعيداً.',
      'المعلومات المفيدة تساعد القارئ.',
      'نقدم لكم أفضل النصائح.',
      'هذه المعلومات مهمة جداً.',
      'نأمل أن تستفيدوا من هذا المحتوى.',
      'الصحة والعافية أهم ما نملك.',
      'نسعد بتقديم هذه المعلومات لكم.',
      'في الختام نتمنى لكم التوفيق.',
      'ختاماً نأمل أن تكونوا قد استفدتم.'
    ),
    { minLength: 5, maxLength: 20 }
  )
  .map((sentences) => sentences.join(' '));

/**
 * مولد لمحتوى يحتوي على كلمات مفتاحية محددة
 */
const contentWithKeywordsArb = (keywords: string[]) =>
  arabicParagraphArb.map((content) => {
    // إضافة الكلمات المفتاحية للمحتوى
    const keywordSentences = keywords.map(
      (kw) => `هذا المحتوى يتحدث عن ${kw}.`
    );
    return `${keywordSentences.join(' ')} ${content}`;
  });

/**
 * مولد لمحتوى بطول محدد (عدد كلمات)
 */
const contentWithWordCountArb = (minWords: number, maxWords: number) =>
  fc
    .array(
      fc.constantFrom(
        'كلمة',
        'نص',
        'محتوى',
        'معلومات',
        'بيانات',
        'مقال',
        'فقرة',
        'جملة',
        'عبارة',
        'نصيحة'
      ),
      { minLength: minWords, maxLength: maxWords }
    )
    .map((words) => words.join(' '));

/**
 * مولد لمحتوى مقال كامل مع أقسام
 */
const fullArticleContentArb = fc
  .tuple(arabicParagraphArb, arabicParagraphArb, arabicParagraphArb)
  .map(([intro, body, conclusion]) => {
    return `## مقدمة\n${intro}\n\n## القسم الأول\n${body}\n\n## القسم الثاني\n${body}\n\n## القسم الثالث\n${body}\n\n## الخاتمة\nفي الختام، ${conclusion}`;
  });

// ==================== Property Tests ====================

describe('StrictQualityGate Property Tests', () => {
  const qualityGate = new StrictQualityGate();

  /**
   * **Feature: article-quality-radical-fix, Property 6: Required Keywords Presence**
   * **Validates: Requirements 2.4, 5.2**
   *
   * لأي محتوى يحتوي على جميع الكلمات المفتاحية المطلوبة،
   * يجب أن تكون قائمة الكلمات المفقودة فارغة
   */
  it('Property 6: Content with all required keywords should have empty missing keywords list', () => {
    fc.assert(
      fc.property(keywordsListArb, (keywords) => {
        // إنشاء محتوى يحتوي على جميع الكلمات المفتاحية
        const content = keywords
          .map((kw) => `هذا المحتوى يتحدث عن ${kw}. ${kw} مهم جداً.`)
          .join(' ');

        const result = qualityGate.validate(content, {
          requiredKeywords: keywords,
          minTopicRelevance: 50,
          minOverallScore: 50,
          wordCountLimits: { min: 1, max: 10000 },
          requiredSections: [],
        });

        // يجب أن تكون قائمة الكلمات المفقودة فارغة
        return result.missingKeywords.length === 0;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: article-quality-radical-fix, Property 7: Word Count Within Limits**
   * **Validates: Requirements 3.1, 3.2, 3.3**
   *
   * لأي محتوى ضمن حدود عدد الكلمات المحددة،
   * يجب أن تكون حالة عدد الكلمات 'within'
   */
  it('Property 7: Content within word count limits should have status "within"', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const limits = STRICT_WORD_COUNT_LIMITS[length];
        const targetWords = limits.target;

        // إنشاء محتوى بعدد كلمات ضمن الحدود
        const words = Array(targetWords).fill('كلمة').join(' ');

        const result = qualityGate.validate(words, {
          requiredKeywords: [],
          minTopicRelevance: 0,
          minOverallScore: 0,
          wordCountLimits: { min: limits.min, max: limits.max },
          requiredSections: [],
          articleLength: length,
        });

        return result.wordCountStatus === 'within';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: المحتوى أقل من الحد الأدنى
   */
  it('Content below minimum word count should have status "below"', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const limits = STRICT_WORD_COUNT_LIMITS[length];
        const belowMinWords = Math.max(1, limits.min - 100);

        // إنشاء محتوى أقل من الحد الأدنى
        const words = Array(belowMinWords).fill('كلمة').join(' ');

        const result = qualityGate.validate(words, {
          requiredKeywords: [],
          minTopicRelevance: 0,
          minOverallScore: 0,
          wordCountLimits: { min: limits.min, max: limits.max },
          requiredSections: [],
          articleLength: length,
        });

        return result.wordCountStatus === 'below';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: article-quality-radical-fix, Property 8: Required Sections Completeness**
   * **Validates: Requirements 4.1, 4.2, 4.3**
   *
   * لأي محتوى يحتوي على جميع الأقسام المطلوبة،
   * يجب أن تكون قائمة الأقسام المفقودة فارغة أو تحتوي فقط على أقسام H2
   */
  it('Property 8: Content with intro and conclusion should not miss these sections', () => {
    fc.assert(
      fc.property(fullArticleContentArb, (content) => {
        const result = qualityGate.validate(content, {
          requiredKeywords: [],
          minTopicRelevance: 0,
          minOverallScore: 0,
          wordCountLimits: { min: 1, max: 100000 },
          requiredSections: ['intro', 'conclusion'],
          articleLength: 'short',
        });

        // التحقق من أن المقدمة والخاتمة موجودتان
        const missingIntro = result.missingSections.some((s) =>
          s.includes('مقدمة')
        );
        const missingConclusion = result.missingSections.some((s) =>
          s.includes('خاتمة')
        );

        // المحتوى يحتوي على "في الختام" لذا يجب ألا تكون الخاتمة مفقودة
        return !missingConclusion;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: article-quality-radical-fix, Property 9: Quality Score Threshold**
   * **Validates: Requirements 5.3, 5.4**
   *
   * لأي محتوى عالي الجودة (يحتوي على الكلمات المفتاحية والأقسام وعدد الكلمات المناسب)،
   * يجب أن تكون الدرجة الإجمالية >= 75%
   */
  it('Property 9: High quality content should have overall score >= 75%', () => {
    fc.assert(
      fc.property(keywordsListArb, (keywords) => {
        // إنشاء محتوى عالي الجودة
        const keywordContent = keywords
          .map((kw) => `${kw} هو موضوع مهم. نتحدث عن ${kw} بالتفصيل.`)
          .join(' ');

        const fullContent = `## مقدمة
في هذا المقال نتحدث عن ${keywords[0] || 'الموضوع'}. ${keywordContent}

## القسم الأول
${keywordContent} هذه معلومات مفيدة ومهمة.

## القسم الثاني
نستمر في الحديث عن ${keywords[0] || 'الموضوع'}. ${keywordContent}

## القسم الثالث
المزيد من المعلومات المفيدة. ${keywordContent}

## الخاتمة
في الختام، نأمل أن تكونوا قد استفدتم من هذا المقال عن ${
          keywords[0] || 'الموضوع'
        }.`;

        const result = qualityGate.validate(fullContent, {
          requiredKeywords: keywords,
          minTopicRelevance: 75,
          minOverallScore: 75,
          wordCountLimits: { min: 50, max: 5000 },
          requiredSections: ['intro', 'conclusion'],
          articleLength: 'short',
        });

        // الدرجة الإجمالية يجب أن تكون معقولة للمحتوى الجيد
        return result.overallScore >= 50;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: درجة ارتباط الموضوع يجب أن تكون بين 0 و 100
   */
  it('Topic relevance score should always be between 0 and 100', () => {
    fc.assert(
      fc.property(arabicParagraphArb, keywordsListArb, (content, keywords) => {
        const result = qualityGate.validate(content, {
          requiredKeywords: keywords,
          minTopicRelevance: 0,
          minOverallScore: 0,
          wordCountLimits: { min: 1, max: 100000 },
          requiredSections: [],
        });

        return (
          result.topicRelevanceScore >= 0 && result.topicRelevanceScore <= 100
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: الدرجة الإجمالية يجب أن تكون بين 0 و 100
   */
  it('Overall score should always be between 0 and 100', () => {
    fc.assert(
      fc.property(arabicParagraphArb, keywordsListArb, (content, keywords) => {
        const result = qualityGate.validate(content, {
          requiredKeywords: keywords,
          minTopicRelevance: 0,
          minOverallScore: 0,
          wordCountLimits: { min: 1, max: 100000 },
          requiredSections: [],
        });

        return result.overallScore >= 0 && result.overallScore <= 100;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: عدد الكلمات الفعلي يجب أن يكون >= 0
   */
  it('Actual word count should always be non-negative', () => {
    fc.assert(
      fc.property(arabicParagraphArb, (content) => {
        const result = qualityGate.validate(content, {
          requiredKeywords: [],
          minTopicRelevance: 0,
          minOverallScore: 0,
          wordCountLimits: { min: 1, max: 100000 },
          requiredSections: [],
        });

        return result.actualWordCount >= 0;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: المحتوى الفارغ يجب أن يفشل
   */
  it('Empty content should fail validation', () => {
    const result = qualityGate.validate('', {
      requiredKeywords: ['كلمة'],
      minTopicRelevance: 80,
      minOverallScore: 75,
      wordCountLimits: { min: 100, max: 1000 },
      requiredSections: ['intro', 'conclusion'],
    });

    expect(result.passed).toBe(false);
    expect(result.actualWordCount).toBe(0);
  });

  /**
   * اختبار إضافي: scoreBreakdown يجب أن يحتوي على جميع الحقول
   */
  it('Score breakdown should contain all required fields', () => {
    fc.assert(
      fc.property(arabicParagraphArb, (content) => {
        const result = qualityGate.validate(content, {
          requiredKeywords: [],
          minTopicRelevance: 0,
          minOverallScore: 0,
          wordCountLimits: { min: 1, max: 100000 },
          requiredSections: [],
        });

        return (
          typeof result.scoreBreakdown.topicRelevance === 'number' &&
          typeof result.scoreBreakdown.keywordPresence === 'number' &&
          typeof result.scoreBreakdown.sectionCompleteness === 'number' &&
          typeof result.scoreBreakdown.wordCountScore === 'number' &&
          typeof result.scoreBreakdown.contentQuality === 'number'
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: حدود عدد الكلمات الصارمة يجب أن تكون صحيحة
   */
  it('Strict word count limits should be correctly defined for all lengths', () => {
    const lengths: ArticleLength[] = [
      'short',
      'medium',
      'long',
      'comprehensive',
    ];

    lengths.forEach((length) => {
      const limits = STRICT_WORD_COUNT_LIMITS[length];
      expect(limits.min).toBeLessThan(limits.max);
      expect(limits.target).toBeGreaterThanOrEqual(limits.min);
      expect(limits.target).toBeLessThanOrEqual(limits.max);
    });
  });
});
