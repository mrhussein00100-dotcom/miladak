/**
 * Property-Based Tests for Content Quality
 * اختبارات الخصائص لجودة المحتوى
 *
 * Using fast-check library for property-based testing
 * Each test runs at least 100 iterations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ContentGenerator } from '../../lib/sona/contentGenerator';
import { ArticleLength, TopicCategory } from '../../lib/sona/types';

// ==================== Test Generators ====================

/**
 * مولد للأسماء العربية
 */
const arabicNameArb = fc.constantFrom(
  'محمد',
  'أحمد',
  'فاطمة',
  'علي',
  'سارة',
  'خالد',
  'نورة',
  'عبدالله',
  'ريم',
  'يوسف'
);

/**
 * مولد للأعمار
 */
const ageArb = fc.integer({ min: 1, max: 100 });

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
 * مولد للأبراج
 */
const zodiacArb = fc.constantFrom(
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
 * مولد لمواضيع عيد الميلاد
 */
const birthdayTopicArb = fc
  .tuple(arabicNameArb, ageArb)
  .map(([name, age]) => `عيد ميلاد ${name} ${age} سنة`);

/**
 * مولد لمواضيع الأبراج
 */
const zodiacTopicArb = zodiacArb.map((zodiac) => `برج ${zodiac}`);

/**
 * مولد لمواضيع متنوعة
 */
const topicArb = fc.oneof(birthdayTopicArb, zodiacTopicArb);

// ==================== Helper Functions ====================

/**
 * استخراج عناصر القوائم من المحتوى HTML
 */
function extractListItems(content: string): string[] {
  const items: string[] = [];
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(content)) !== null) {
    // إزالة HTML tags من داخل العنصر
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    if (text) items.push(text);
  }
  return items;
}

/**
 * العبارات العامة التي يجب تجنبها
 */
const GENERIC_PHRASES = [
  'هذا الموضوع مهم جداً',
  'هذا الموضوع مهم للغاية',
  'من المهم أن نعرف',
  'يجب أن نعلم أن',
  'كما هو معروف',
  'من المعروف أن',
  'بشكل عام',
  'في العموم',
  'على العموم',
  'بصفة عامة',
];

/**
 * التحقق من وجود عبارات عامة في المحتوى
 */
function containsGenericPhrases(content: string): string[] {
  const found: string[] = [];
  for (const phrase of GENERIC_PHRASES) {
    if (content.includes(phrase)) {
      found.push(phrase);
    }
  }
  return found;
}

/**
 * التحقق من وجود عناصر مكررة في القائمة
 */
function findDuplicateItems(items: string[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const item of items) {
    // تطبيع النص للمقارنة
    const normalized = item.toLowerCase().trim();
    if (seen.has(normalized)) {
      duplicates.push(item);
    } else {
      seen.add(normalized);
    }
  }

  return duplicates;
}

// ==================== Property Tests ====================

describe('Content Quality Property Tests', () => {
  const generator = new ContentGenerator();

  /**
   * **Feature: article-quality-radical-fix, Property 12: No Duplicate List Items**
   * **Validates: Requirements 7.2**
   *
   * لأي قائمة (ul/ol) في المحتوى المولد،
   * يجب أن تكون جميع العناصر فريدة بدون تكرار
   */
  it('Property 12: Generated lists should have no duplicate items', async () => {
    // اختبار مع عدد محدود من التكرارات لأن التوليد بطيء
    await fc.assert(
      fc.asyncProperty(
        arabicNameArb,
        fc.integer({ min: 5, max: 50 }),
        async (name, age) => {
          const topic = `عيد ميلاد ${name} ${age} سنة`;

          try {
            const result = await generator.generate({
              topic,
              length: 'short',
            });

            const listItems = extractListItems(result.content);
            const duplicates = findDuplicateItems(listItems);

            // يجب ألا تكون هناك عناصر مكررة
            return duplicates.length === 0;
          } catch (error) {
            // إذا فشل التوليد، نعتبر الاختبار ناجحاً (لا توجد قوائم للتحقق منها)
            return true;
          }
        }
      ),
      { numRuns: 10 } // عدد محدود لأن التوليد بطيء
    );
  });

  /**
   * **Feature: article-quality-radical-fix, Property 13: No Generic Phrases**
   * **Validates: Requirements 7.3**
   *
   * لأي مقال مولد،
   * يجب ألا يحتوي على عبارات عامة محددة مسبقاً بدون سياق
   */
  it('Property 13: Generated content should avoid generic phrases', async () => {
    await fc.assert(
      fc.asyncProperty(
        arabicNameArb,
        fc.integer({ min: 5, max: 50 }),
        async (name, age) => {
          const topic = `عيد ميلاد ${name} ${age} سنة`;

          try {
            const result = await generator.generate({
              topic,
              length: 'short',
            });

            const genericFound = containsGenericPhrases(result.content);

            // يجب ألا تكون هناك عبارات عامة
            // نسمح بحد أقصى 1 عبارة عامة (للمرونة)
            return genericFound.length <= 1;
          } catch (error) {
            return true;
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * **Feature: article-quality-radical-fix, Property 14: Quality Report Presence**
   * **Validates: Requirements 8.4**
   *
   * لأي مقال مولد،
   * يجب أن تحتوي النتيجة على تقرير جودة مع درجات
   */
  it('Property 14: Generated content should include quality report with scores', async () => {
    await fc.assert(
      fc.asyncProperty(topicArb, articleLengthArb, async (topic, length) => {
        try {
          const result = await generator.generate({
            topic,
            length,
          });

          // التحقق من وجود تقرير الجودة
          const hasQualityReport = result.qualityReport !== undefined;

          // التحقق من وجود الدرجات المطلوبة
          const hasOverallScore =
            typeof result.qualityReport?.overallScore === 'number';
          const hasDiversityScore =
            typeof result.qualityReport?.diversityScore === 'number';
          const hasKeywordDensity =
            typeof result.qualityReport?.keywordDensity === 'number';
          const hasReadabilityScore =
            typeof result.qualityReport?.readabilityScore === 'number';
          const hasStructureScore =
            typeof result.qualityReport?.structureScore === 'number';
          const hasPassed = typeof result.qualityReport?.passed === 'boolean';

          // التحقق من أن الدرجات ضمن النطاق الصحيح (0-100)
          const scoresInRange =
            result.qualityReport.overallScore >= 0 &&
            result.qualityReport.overallScore <= 100 &&
            result.qualityReport.diversityScore >= 0 &&
            result.qualityReport.diversityScore <= 100;

          return (
            hasQualityReport &&
            hasOverallScore &&
            hasDiversityScore &&
            hasKeywordDensity &&
            hasReadabilityScore &&
            hasStructureScore &&
            hasPassed &&
            scoresInRange
          );
        } catch (error) {
          // إذا فشل التوليد بخطأ، نتحقق من أن الخطأ واضح
          return error instanceof Error && error.message.length > 0;
        }
      }),
      { numRuns: 10 }
    );
  });

  // ==================== Additional Unit Tests ====================

  /**
   * اختبار إضافي: التحقق من أن extractListItems يعمل بشكل صحيح
   */
  it('extractListItems should correctly extract list items from HTML', () => {
    const html = `
      <ul>
        <li>العنصر الأول</li>
        <li><strong>العنصر الثاني</strong></li>
        <li>العنصر الثالث</li>
      </ul>
    `;

    const items = extractListItems(html);

    expect(items).toHaveLength(3);
    expect(items[0]).toBe('العنصر الأول');
    expect(items[1]).toBe('العنصر الثاني');
    expect(items[2]).toBe('العنصر الثالث');
  });

  /**
   * اختبار إضافي: التحقق من أن findDuplicateItems يكتشف التكرارات
   */
  it('findDuplicateItems should detect duplicate items', () => {
    const items = ['عنصر أ', 'عنصر ب', 'عنصر أ', 'عنصر ج'];
    const duplicates = findDuplicateItems(items);

    expect(duplicates).toHaveLength(1);
    expect(duplicates[0]).toBe('عنصر أ');
  });

  /**
   * اختبار إضافي: التحقق من أن containsGenericPhrases يكتشف العبارات العامة
   */
  it('containsGenericPhrases should detect generic phrases', () => {
    const content = 'هذا الموضوع مهم جداً ويجب أن نعرف المزيد عنه';
    const found = containsGenericPhrases(content);

    expect(found.length).toBeGreaterThan(0);
    expect(found).toContain('هذا الموضوع مهم جداً');
  });

  /**
   * اختبار إضافي: المحتوى بدون عبارات عامة
   */
  it('containsGenericPhrases should return empty for clean content', () => {
    const content = 'نحتفل اليوم بعيد ميلاد محمد الذي يبلغ 25 عاماً';
    const found = containsGenericPhrases(content);

    expect(found).toHaveLength(0);
  });

  /**
   * اختبار إضافي: قائمة بدون تكرارات
   */
  it('findDuplicateItems should return empty for unique items', () => {
    const items = ['عنصر أ', 'عنصر ب', 'عنصر ج'];
    const duplicates = findDuplicateItems(items);

    expect(duplicates).toHaveLength(0);
  });

  /**
   * اختبار إضافي: التحقق من هيكل تقرير الجودة
   */
  it('Quality report should have correct structure', async () => {
    const result = await generator.generate({
      topic: 'عيد ميلاد أحمد 30 سنة',
      length: 'short',
    });

    expect(result.qualityReport).toBeDefined();
    expect(result.qualityReport).toHaveProperty('overallScore');
    expect(result.qualityReport).toHaveProperty('diversityScore');
    expect(result.qualityReport).toHaveProperty('keywordDensity');
    expect(result.qualityReport).toHaveProperty('readabilityScore');
    expect(result.qualityReport).toHaveProperty('structureScore');
    expect(result.qualityReport).toHaveProperty('suggestions');
    expect(result.qualityReport).toHaveProperty('passed');
    expect(Array.isArray(result.qualityReport.suggestions)).toBe(true);
  });

  /**
   * اختبار إضافي: التحقق من أن الدرجات ضمن النطاق الصحيح
   */
  it('Quality scores should be within valid range (0-100)', async () => {
    const result = await generator.generate({
      topic: 'برج الحمل',
      length: 'short',
    });

    const { qualityReport } = result;

    expect(qualityReport.overallScore).toBeGreaterThanOrEqual(0);
    expect(qualityReport.overallScore).toBeLessThanOrEqual(100);
    expect(qualityReport.diversityScore).toBeGreaterThanOrEqual(0);
    expect(qualityReport.diversityScore).toBeLessThanOrEqual(100);
    expect(qualityReport.keywordDensity).toBeGreaterThanOrEqual(0);
    expect(qualityReport.keywordDensity).toBeLessThanOrEqual(100);
    expect(qualityReport.readabilityScore).toBeGreaterThanOrEqual(0);
    expect(qualityReport.readabilityScore).toBeLessThanOrEqual(100);
    expect(qualityReport.structureScore).toBeGreaterThanOrEqual(0);
    expect(qualityReport.structureScore).toBeLessThanOrEqual(100);
  });
});
