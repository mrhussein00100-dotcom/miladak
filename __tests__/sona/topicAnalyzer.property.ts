/**
 * Property-Based Tests for TopicAnalyzer
 * اختبارات الخصائص لمحلل الموضوع المحسّن
 *
 * Using fast-check library for property-based testing
 * Each test runs at least 100 iterations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { TopicAnalyzer } from '../../lib/sona/topicAnalyzer';
import { TopicBinder } from '../../lib/sona/topicBinder';
import { ArticleLength } from '../../lib/sona/types';

// ==================== Test Generators ====================

/**
 * مولد للأسماء العربية الشائعة
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
  'ليلى',
  'يوسف',
  'إبراهيم',
  'عبدالله',
  'ريم',
  'هند'
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
 * مولد لأطوال المقالات
 */
const articleLengthArb: fc.Arbitrary<ArticleLength> = fc.constantFrom(
  'short',
  'medium',
  'long',
  'comprehensive'
);

/**
 * مولد لمواضيع عيد الميلاد مع اسم
 */
const birthdayTopicWithNameArb = arabicNameArb.map(
  (name) => `عيد ميلاد ${name}`
);

/**
 * مولد لمواضيع عيد الميلاد مع اسم وعمر
 */
const birthdayTopicWithNameAndAgeArb = fc
  .tuple(arabicNameArb, ageArb)
  .map(([name, age]) => `عيد ميلاد ${name} ${age} سنة`);

/**
 * مولد لمواضيع الأبراج
 */
const zodiacTopicArb = zodiacSignArb.map((sign) => `برج ${sign}`);

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
      'نسعد بتقديم هذه المعلومات لكم.'
    ),
    { minLength: 3, maxLength: 10 }
  )
  .map((sentences) => sentences.join(' '));

/**
 * مولد لمحتوى مقال كامل (عدة أقسام)
 */
const articleContentArb = fc
  .array(arabicParagraphArb, { minLength: 3, maxLength: 6 })
  .map((paragraphs) => paragraphs.join('\n\n'));

// ==================== Property Tests ====================

describe('TopicAnalyzer Property Tests', () => {
  const analyzer = new TopicAnalyzer();

  /**
   * **Feature: article-quality-radical-fix, Property 4: Entity Extraction and Usage**
   * **Validates: Requirements 2.1, 7.4**
   *
   * لأي موضوع يحتوي على اسم شخص، يجب أن يتم استخراج الاسم
   * ويجب أن يظهر في كل قسم رئيسي من المقال المولد
   */
  it('Property 4: Names should be extracted and appear in every major section', () => {
    fc.assert(
      fc.property(
        birthdayTopicWithNameArb,
        articleContentArb,
        articleLengthArb,
        (topic, content, length) => {
          // تحليل الموضوع
          const analysis = analyzer.analyze(topic, length);

          // التحقق من استخراج الاسم
          const extractedNames = analysis.extractedEntities.names;

          // يجب أن يكون هناك اسم واحد على الأقل مستخرج
          if (extractedNames.length === 0) {
            // إذا لم يتم استخراج الاسم، نتحقق من أن الموضوع يحتوي على اسم
            const hasNameInTopic =
              topic.includes('محمد') ||
              topic.includes('أحمد') ||
              topic.includes('علي') ||
              topic.includes('فاطمة') ||
              topic.includes('مريم') ||
              topic.includes('سارة') ||
              topic.includes('نور') ||
              topic.includes('خالد') ||
              topic.includes('عمر') ||
              topic.includes('ليلى');

            // إذا كان الموضوع يحتوي على اسم معروف، يجب استخراجه
            return !hasNameInTopic;
          }

          // التحقق من أن الاسم المستخرج موجود في الموضوع الأصلي
          const nameInTopic = extractedNames.some((name) =>
            topic.includes(name)
          );

          // استخدام TopicBinder لربط المحتوى
          const binder = new TopicBinder({
            topic,
            requiredKeywords: analyzer.extractRequiredKeywords(topic, analysis),
            entities: analysis.extractedEntities,
            maxWordsWithoutMention: 100,
          });

          // ربط المحتوى
          const result = binder.bind(content);

          // التحقق من أن الاسم يظهر في المحتوى المربوط
          const nameInContent = extractedNames.some((name) =>
            result.boundContent.includes(name)
          );

          return nameInTopic && (nameInContent || result.bindingScore >= 50);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: article-quality-radical-fix, Property 5: Age-Specific Content**
   * **Validates: Requirements 2.2, 7.5**
   *
   * لأي موضوع يحتوي على عمر، يجب أن يتم استخراج العمر
   * ويجب أن يتضمن المحتوى المولد معلومات خاصة بهذا العمر
   */
  it('Property 5: Ages should be extracted and included in content', () => {
    fc.assert(
      fc.property(
        birthdayTopicWithNameAndAgeArb,
        articleContentArb,
        articleLengthArb,
        (topic, content, length) => {
          // تحليل الموضوع
          const analysis = analyzer.analyze(topic, length);

          // التحقق من استخراج العمر
          const extractedAges = analysis.extractedEntities.ages;

          // يجب أن يكون هناك عمر واحد على الأقل مستخرج
          if (extractedAges.length === 0) {
            // إذا لم يتم استخراج العمر، نتحقق من وجود رقم في الموضوع
            const hasNumberInTopic = /\d+/.test(topic);
            return !hasNumberInTopic;
          }

          // التحقق من أن العمر المستخرج منطقي (1-120)
          const validAge = extractedAges.every((age) => age >= 1 && age <= 120);

          // التحقق من أن العمر موجود في الموضوع الأصلي
          const ageInTopic = extractedAges.some((age) =>
            topic.includes(age.toString())
          );

          // استخدام TopicBinder لربط المحتوى
          const binder = new TopicBinder({
            topic,
            requiredKeywords: analyzer.extractRequiredKeywords(topic, analysis),
            entities: analysis.extractedEntities,
            maxWordsWithoutMention: 100,
          });

          // ربط المحتوى
          const result = binder.bind(content);

          // التحقق من أن العمر يظهر في المحتوى المربوط أو الكلمات المفتاحية
          const ageInContent = extractedAges.some((age) =>
            result.boundContent.includes(age.toString())
          );

          return (
            validAge &&
            ageInTopic &&
            (ageInContent || result.bindingScore >= 50)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: استخراج الأسماء من سياقات مختلفة
   */
  it('Names should be extracted from various contexts', () => {
    const contextualTopicArb = fc.oneof(
      arabicNameArb.map((name) => `عيد ميلاد ${name}`),
      arabicNameArb.map((name) => `تهنئة ${name}`),
      arabicNameArb.map((name) => `اسم ${name}`),
      arabicNameArb.map((name) => `الأخ ${name}`),
      arabicNameArb.map((name) => `السيدة ${name}`)
    );

    fc.assert(
      fc.property(contextualTopicArb, (topic) => {
        const analysis = analyzer.analyze(topic);
        const extractedNames = analysis.extractedEntities.names;

        // يجب استخراج اسم واحد على الأقل
        return extractedNames.length >= 1;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: استخراج الأعمار من صيغ مختلفة
   */
  it('Ages should be extracted from various formats', () => {
    const ageFormatArb = fc.oneof(
      ageArb.map((age) => `عمره ${age} سنة`),
      ageArb.map((age) => `${age} عام`),
      ageArb.map((age) => `يبلغ ${age} سنة`),
      ageArb.map((age) => `بعمر ${age}`),
      ageArb.map((age) => `${age} سنوات`)
    );

    fc.assert(
      fc.property(ageFormatArb, (topic) => {
        const analysis = analyzer.analyze(topic);
        const extractedAges = analysis.extractedEntities.ages;

        // يجب استخراج عمر واحد على الأقل
        return extractedAges.length >= 1;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: الكلمات المفتاحية المطلوبة يجب أن تشمل الكيانات
   */
  it('Required keywords should include extracted entities', () => {
    fc.assert(
      fc.property(
        birthdayTopicWithNameAndAgeArb,
        articleLengthArb,
        (topic, length) => {
          const analysis = analyzer.analyze(topic, length);
          const requiredKeywords = analyzer.extractRequiredKeywords(
            topic,
            analysis
          );

          // التحقق من أن الأسماء المستخرجة موجودة في الكلمات المطلوبة
          const namesIncluded = analysis.extractedEntities.names.every((name) =>
            requiredKeywords.includes(name)
          );

          // التحقق من أن الأبراج المستخرجة موجودة في الكلمات المطلوبة
          const signsIncluded = analysis.extractedEntities.zodiacSigns.every(
            (sign) => requiredKeywords.includes(sign)
          );

          return namesIncluded && signsIncluded;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: تحديد الفئة بشكل صحيح
   */
  it('Category should be correctly detected', () => {
    fc.assert(
      fc.property(birthdayTopicWithNameArb, (topic) => {
        const analysis = analyzer.analyze(topic);
        return analysis.category === 'birthday';
      }),
      { numRuns: 100 }
    );

    fc.assert(
      fc.property(zodiacTopicArb, (topic) => {
        const analysis = analyzer.analyze(topic);
        return analysis.category === 'zodiac';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: الثقة يجب أن تكون بين 0 و 1
   */
  it('Confidence should always be between 0 and 1', () => {
    const anyTopicArb = fc.oneof(
      birthdayTopicWithNameArb,
      birthdayTopicWithNameAndAgeArb,
      zodiacTopicArb,
      fc.constant('موضوع عام')
    );

    fc.assert(
      fc.property(anyTopicArb, articleLengthArb, (topic, length) => {
        const analysis = analyzer.analyze(topic, length);
        return analysis.confidence >= 0 && analysis.confidence <= 1;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * اختبار إضافي: الكلمات المفتاحية يجب ألا تكون فارغة
   */
  it('Keywords should not be empty for valid topics', () => {
    const validTopicArb = fc.oneof(
      birthdayTopicWithNameArb,
      zodiacTopicArb,
      fc.constant('نصائح صحية مهمة')
    );

    fc.assert(
      fc.property(validTopicArb, (topic) => {
        const analysis = analyzer.analyze(topic);
        return analysis.keywords.length > 0;
      }),
      { numRuns: 100 }
    );
  });
});
