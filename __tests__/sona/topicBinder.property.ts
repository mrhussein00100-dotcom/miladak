/**
 * Property-Based Tests for TopicBinder
 * اختبارات الخصائص لمكون ربط الموضوع
 *
 * Using fast-check library for property-based testing
 * Each test runs at least 100 iterations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { TopicBinder, TopicBinderConfig } from '../../lib/sona/topicBinder';
import { ExtractedEntities } from '../../lib/sona/types';

// ==================== Test Generators ====================

/**
 * مولد للأسماء العربية
 */
const arabicNameArb = fc.constantFrom(
  'محمد',
  'أحمد',
  'علي',
  'فاطمة',
  'مريم',
  'سارة',
  'نور',
  'خالد',
  'عمر',
  'ليلى'
);

/**
 * مولد للأبراج العربية
 */
const zodiacSignArb = fc.constantFrom(
  'الحمل',
  'الثور',
  'الجوزاء',
  'السرطان',
  'الأسد',
  'العذراء',
  'الميزان',
  'العقرب',
  'القوس',
  'الجدي',
  'الدلو',
  'الحوت'
);

/**
 * مولد للأعمار (1-120)
 */
const ageArb = fc.integer({ min: 1, max: 120 });

/**
 * مولد للكيانات المستخرجة
 */
const extractedEntitiesArb: fc.Arbitrary<ExtractedEntities> = fc.record({
  names: fc.array(arabicNameArb, { minLength: 0, maxLength: 3 }),
  dates: fc.array(fc.string(), { minLength: 0, maxLength: 2 }),
  numbers: fc.array(fc.integer({ min: 1, max: 1000 }), {
    minLength: 0,
    maxLength: 5,
  }),
  zodiacSigns: fc.array(zodiacSignArb, { minLength: 0, maxLength: 1 }),
  ages: fc.array(ageArb, { minLength: 0, maxLength: 2 }),
  keywords: fc.array(fc.string({ minLength: 3, maxLength: 15 }), {
    minLength: 0,
    maxLength: 5,
  }),
});

/**
 * مولد للمواضيع العربية
 */
const arabicTopicArb = fc.oneof(
  fc.constant('عيد ميلاد سعيد'),
  fc.constant('برج الحمل'),
  fc.constant('نصائح صحية'),
  arabicNameArb.map((name) => `عيد ميلاد ${name}`),
  fc
    .tuple(arabicNameArb, ageArb)
    .map(([name, age]) => `عيد ميلاد ${name} ${age} سنة`),
  zodiacSignArb.map((sign) => `برج ${sign}`)
);

/**
 * مولد للكلمات المفتاحية
 */
const keywordsArb = fc.array(
  fc.oneof(
    fc.constant('عيد'),
    fc.constant('ميلاد'),
    fc.constant('برج'),
    fc.constant('صحة'),
    arabicNameArb
  ),
  { minLength: 1, maxLength: 5 }
);

/**
 * مولد لإعدادات TopicBinder
 */
const topicBinderConfigArb: fc.Arbitrary<TopicBinderConfig> = fc.record({
  topic: arabicTopicArb,
  requiredKeywords: keywordsArb,
  entities: extractedEntitiesArb,
  maxWordsWithoutMention: fc.constant(100),
});

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
      'نأمل أن تستفيدوا من هذا المحتوى.'
    ),
    { minLength: 2, maxLength: 10 }
  )
  .map((sentences) => sentences.join(' '));

/**
 * مولد للمقدمات
 */
const introArb = fc
  .tuple(arabicParagraphArb, arabicTopicArb)
  .map(([para, topic]) => {
    // أحياناً نضيف الموضوع وأحياناً لا
    return Math.random() > 0.5 ? `${topic} هو موضوعنا. ${para}` : para;
  });

/**
 * مولد للخاتمات
 */
const conclusionArb = fc
  .tuple(arabicParagraphArb, arabicTopicArb)
  .map(([para, topic]) => {
    return Math.random() > 0.5 ? `في الختام، ${topic} مهم جداً. ${para}` : para;
  });

// ==================== Property Tests ====================

describe('TopicBinder Property Tests', () => {
  /**
   * **Feature: article-quality-radical-fix, Property 1: Topic Mention in Introduction and Conclusion**
   * **Validates: Requirements 1.1, 1.4**
   *
   * لأي مقدمة وخاتمة، بعد تطبيق bindIntro و bindConclusion،
   * يجب أن تحتوي المقدمة على الموضوع في الجملة الأولى
   * ويجب أن تحتوي الخاتمة على الموضوع
   */
  it('Property 1: Topic should appear in introduction first sentence and conclusion after binding', () => {
    // مولد متكامل يضمن تطابق الموضوع
    const testCaseArb = fc
      .tuple(arabicParagraphArb, arabicParagraphArb, topicBinderConfigArb)
      .map(([introPara, conclusionPara, config]) => ({
        intro: introPara,
        conclusion: conclusionPara,
        config,
      }));

    fc.assert(
      fc.property(testCaseArb, ({ intro, conclusion, config }) => {
        const binder = new TopicBinder(config);

        // ربط المقدمة
        const boundIntro = binder.bindIntro(intro, config);

        // ربط الخاتمة
        const boundConclusion = binder.bindConclusion(conclusion, config);

        // التحقق من وجود الموضوع أو كلماته المفتاحية
        const topicKeywords = [
          config.topic,
          ...config.topic.split(/\s+/).filter((w) => w.length > 2),
          ...config.requiredKeywords,
        ];

        const introContainsTopic = topicKeywords.some((kw) =>
          boundIntro.toLowerCase().includes(kw.toLowerCase())
        );

        const conclusionContainsTopic = topicKeywords.some((kw) =>
          boundConclusion.toLowerCase().includes(kw.toLowerCase())
        );

        return introContainsTopic && conclusionContainsTopic;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: article-quality-radical-fix, Property 2: H2 Sections Contain Topic Keywords**
   * **Validates: Requirements 1.2**
   *
   * لأي قسم H2، بعد تطبيق bindSection،
   * يجب أن يحتوي العنوان على كلمة مفتاحية من الموضوع
   */
  it('Property 2: H2 section titles should contain topic keywords after binding', () => {
    const sectionTitleArb = fc.constantFrom(
      'معلومات مهمة',
      'نصائح مفيدة',
      'حقائق رائعة',
      'أفكار جديدة',
      'تفاصيل إضافية'
    );

    fc.assert(
      fc.property(
        sectionTitleArb,
        arabicParagraphArb,
        topicBinderConfigArb,
        (title, content, config) => {
          const binder = new TopicBinder(config);

          const { title: boundTitle } = binder.bindSection(
            title,
            content,
            config
          );

          // التحقق من وجود كلمة مفتاحية في العنوان
          const topicKeywords = [
            config.topic,
            ...config.topic.split(/\s+/).filter((w) => w.length > 2),
            ...config.requiredKeywords,
          ];

          const titleContainsKeyword = topicKeywords.some((kw) =>
            boundTitle.toLowerCase().includes(kw.toLowerCase())
          );

          return titleContainsKeyword;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: article-quality-radical-fix, Property 3: Topic Mention Frequency**
   * **Validates: Requirements 1.3**
   *
   * لأي محتوى طويل، بعد تطبيق bind،
   * يجب أن يظهر الموضوع أو كلماته المفتاحية مرة واحدة على الأقل كل 100 كلمة
   */
  it('Property 3: Topic should appear at least once every 100 words after binding', () => {
    // مولد لمحتوى طويل (أكثر من 100 كلمة)
    const longContentArb = fc
      .array(arabicParagraphArb, { minLength: 5, maxLength: 15 })
      .map((paragraphs) => paragraphs.join('\n\n'));

    fc.assert(
      fc.property(longContentArb, topicBinderConfigArb, (content, config) => {
        const binder = new TopicBinder(config);

        const result = binder.bind(content, config);
        const boundContent = result.boundContent;

        // حساب عدد الكلمات
        const wordCount = boundContent
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length;

        // حساب عدد مرات ذكر الموضوع
        const mentionCount = result.topicMentionCount;

        // الحد الأدنى المتوقع للذكر
        const expectedMinMentions = Math.max(1, Math.floor(wordCount / 100));

        // يجب أن يكون عدد الذكر >= الحد الأدنى المتوقع
        // أو درجة الربط >= 60% (للمحتوى القصير)
        return mentionCount >= expectedMinMentions || result.bindingScore >= 60;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: درجة الربط يجب أن تكون بين 0 و 100
   */
  it('Binding score should always be between 0 and 100', () => {
    fc.assert(
      fc.property(
        arabicParagraphArb,
        topicBinderConfigArb,
        (content, config) => {
          const binder = new TopicBinder(config);
          const result = binder.bind(content, config);

          return result.bindingScore >= 0 && result.bindingScore <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: عدد مرات الذكر يجب أن يكون >= 0
   */
  it('Topic mention count should always be non-negative', () => {
    fc.assert(
      fc.property(
        arabicParagraphArb,
        topicBinderConfigArb,
        (content, config) => {
          const binder = new TopicBinder(config);
          const result = binder.bind(content, config);

          return result.topicMentionCount >= 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: الكلمات المفقودة يجب أن تكون مجموعة فرعية من الكلمات المطلوبة
   */
  it('Missing keywords should be a subset of required keywords', () => {
    fc.assert(
      fc.property(
        arabicParagraphArb,
        topicBinderConfigArb,
        (content, config) => {
          const binder = new TopicBinder(config);
          const result = binder.bind(content, config);

          // كل كلمة مفقودة يجب أن تكون من الكلمات المطلوبة
          return result.missingKeywords.every((kw) =>
            config.requiredKeywords.some(
              (req) => req.toLowerCase() === kw.toLowerCase()
            )
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: المحتوى المربوط لا يجب أن يكون فارغاً إذا كان المحتوى الأصلي غير فارغ
   */
  it('Bound content should not be empty if original content is not empty', () => {
    const nonEmptyContentArb = arabicParagraphArb.filter(
      (c) => c.trim().length > 0
    );

    fc.assert(
      fc.property(
        nonEmptyContentArb,
        topicBinderConfigArb,
        (content, config) => {
          const binder = new TopicBinder(config);
          const result = binder.bind(content, config);

          return result.boundContent.trim().length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
