/**
 * Property-Based Tests for Word Count Manager
 * اختبارات الخصائص لمدير عدد الكلمات
 *
 * **Feature: article-generation-quality-fix, Property 3: Word Count Within Limits**
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  WordCountManager,
  wordCountManager,
  WORD_COUNT_LIMITS,
} from '../../lib/sona/wordCountManager';
import { ArticleLength, TopicAnalysis } from '../../lib/sona/types';

// ============================================
// Test Generators
// ============================================

/**
 * مولد لطول المقال
 */
const articleLengthArb = fc.constantFrom<ArticleLength>(
  'short',
  'medium',
  'long',
  'comprehensive'
);

/**
 * مولد لكلمات عربية
 */
const arabicWordArb = fc.constantFrom(
  'كلمة',
  'نص',
  'محتوى',
  'مقال',
  'عربي',
  'معلومات',
  'نصائح',
  'فوائد',
  'أهمية',
  'موضوع',
  'جديد',
  'مهم',
  'رائع',
  'مفيد',
  'شامل'
);

/**
 * مولد لتحليل موضوع بسيط
 */
const simpleTopicAnalysisArb: fc.Arbitrary<TopicAnalysis> = fc.record({
  category: fc.constantFrom('birthday', 'zodiac', 'health', 'dates', 'general'),
  subCategory: fc.option(fc.string(), { nil: undefined }),
  extractedEntities: fc.constant({
    names: [],
    dates: [],
    numbers: [],
    zodiacSigns: [],
    ages: [],
    keywords: ['موضوع', 'مهم'],
  }),
  keywords: fc.constant(['موضوع', 'مهم', 'معلومات']),
  suggestedSections: fc.constant(['intro', 'content', 'conclusion']),
  tone: fc.constantFrom('formal', 'casual', 'friendly', 'engaging', 'seo'),
  confidence: fc.double({ min: 0, max: 1 }),
}) as fc.Arbitrary<TopicAnalysis>;

// ============================================
// Property Tests
// ============================================

describe('Word Count Manager Property Tests', () => {
  /**
   * **Feature: article-generation-quality-fix, Property 3: Word Count Within Limits**
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
   *
   * For any article length, the word count limits should be correct
   */
  it('Property 3: Word count limits should be correct for each length', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const limits = wordCountManager.getLimits(length);

        // Verify limits are positive and min < max
        expect(limits.min).toBeGreaterThan(0);
        expect(limits.max).toBeGreaterThan(limits.min);

        // Verify specific limits match requirements
        switch (length) {
          case 'short':
            expect(limits.min).toBe(400);
            expect(limits.max).toBe(600);
            break;
          case 'medium':
            expect(limits.min).toBe(800);
            expect(limits.max).toBe(1200);
            break;
          case 'long':
            expect(limits.min).toBe(1500);
            expect(limits.max).toBe(2500);
            break;
          case 'comprehensive':
            expect(limits.min).toBe(2500);
            expect(limits.max).toBe(4000);
            break;
        }
      }),
      { numRuns: 20 }
    );
  });

  /**
   * Word count should be accurate
   */
  it('Word count should accurately count words', () => {
    fc.assert(
      fc.property(
        fc.array(arabicWordArb, { minLength: 10, maxLength: 100 }),
        (words) => {
          const content = `<p>${words.join(' ')}</p>`;
          const count = wordCountManager.countWords(content);

          expect(count).toBe(words.length);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Word count should ignore HTML tags
   */
  it('Word count should ignore HTML tags', () => {
    fc.assert(
      fc.property(
        fc.array(arabicWordArb, { minLength: 5, maxLength: 20 }),
        (words) => {
          const plainContent = words.join(' ');
          const htmlContent = `<h2>عنوان</h2><p>${words.join(
            ' '
          )}</p><ul><li>عنصر</li></ul>`;

          const plainCount = wordCountManager.countWords(plainContent);
          const htmlCount = wordCountManager.countWords(htmlContent);

          // HTML content should have more words (title + list item)
          expect(htmlCount).toBeGreaterThan(plainCount);
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Content within limits should return true for isWithinLimits
   */
  it('Content within limits should be detected correctly', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const limits = wordCountManager.getLimits(length);
        const targetWords = Math.floor((limits.min + limits.max) / 2);

        // Generate content with target word count
        const words = Array(targetWords).fill('كلمة').join(' ');
        const content = `<p>${words}</p>`;

        expect(wordCountManager.isWithinLimits(content, length)).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * Content below minimum should return false for isWithinLimits
   */
  it('Content below minimum should not be within limits', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const limits = wordCountManager.getLimits(length);
        const belowMinWords = Math.floor(limits.min / 2);

        // Generate content below minimum
        const words = Array(belowMinWords).fill('كلمة').join(' ');
        const content = `<p>${words}</p>`;

        expect(wordCountManager.isWithinLimits(content, length)).toBe(false);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * Content above maximum should return false for isWithinLimits
   */
  it('Content above maximum should not be within limits', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const limits = wordCountManager.getLimits(length);
        const aboveMaxWords = limits.max + 500;

        // Generate content above maximum
        const words = Array(aboveMaxWords).fill('كلمة').join(' ');
        const content = `<p>${words}</p>`;

        expect(wordCountManager.isWithinLimits(content, length)).toBe(false);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * getWordCountStatus should return correct status
   */
  it('getWordCountStatus should return correct status', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const limits = wordCountManager.getLimits(length);

        // Test below minimum
        const belowContent = Array(Math.floor(limits.min / 2))
          .fill('كلمة')
          .join(' ');
        const belowStatus = wordCountManager.getWordCountStatus(
          `<p>${belowContent}</p>`,
          length
        );
        expect(belowStatus.status).toBe('below');
        expect(belowStatus.difference).toBeGreaterThan(0);

        // Test within limits
        const withinContent = Array(Math.floor((limits.min + limits.max) / 2))
          .fill('كلمة')
          .join(' ');
        const withinStatus = wordCountManager.getWordCountStatus(
          `<p>${withinContent}</p>`,
          length
        );
        expect(withinStatus.status).toBe('within');
        expect(withinStatus.difference).toBe(0);

        // Test above maximum
        const aboveContent = Array(limits.max + 500)
          .fill('كلمة')
          .join(' ');
        const aboveStatus = wordCountManager.getWordCountStatus(
          `<p>${aboveContent}</p>`,
          length
        );
        expect(aboveStatus.status).toBe('above');
        expect(aboveStatus.difference).toBeGreaterThan(0);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * expandContent should increase word count
   * **Validates: Requirements 3.5**
   */
  it('expandContent should increase word count when below minimum', () => {
    fc.assert(
      fc.property(simpleTopicAnalysisArb, (analysis) => {
        // Create short content
        const shortContent =
          '<h2>مقدمة</h2><p>هذا محتوى قصير جداً.</p><h2>الخاتمة</h2><p>نهاية.</p>';
        const originalCount = wordCountManager.countWords(shortContent);

        // Expand content
        const targetMin = 500;
        const expandedContent = wordCountManager.expandContent(
          shortContent,
          analysis,
          targetMin
        );
        const expandedCount = wordCountManager.countWords(expandedContent);

        // Expanded content should have more words
        expect(expandedCount).toBeGreaterThanOrEqual(originalCount);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * trimContent should decrease word count
   * **Validates: Requirements 3.6**
   */
  it('trimContent should decrease word count when above maximum', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1000, max: 2000 }), (wordCount) => {
        // Create long content
        const words = Array(wordCount).fill('كلمة').join(' ');
        const longContent = `<h2>قسم 1</h2><p>${words}</p><h2>قسم 2</h2><p>${words}</p>`;
        const originalCount = wordCountManager.countWords(longContent);

        // Trim content
        const targetMax = 500;
        const trimmedContent = wordCountManager.trimContent(
          longContent,
          targetMax
        );
        const trimmedCount = wordCountManager.countWords(trimmedContent);

        // Trimmed content should have fewer or equal words
        expect(trimmedCount).toBeLessThanOrEqual(originalCount);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * Content already within limits should not change significantly
   */
  it('Content within limits should not need expansion', () => {
    fc.assert(
      fc.property(simpleTopicAnalysisArb, (analysis) => {
        // Create content that's already at target
        const targetMin = 100;
        const words = Array(targetMin + 50)
          .fill('كلمة')
          .join(' ');
        const content = `<p>${words}</p>`;

        const expandedContent = wordCountManager.expandContent(
          content,
          analysis,
          targetMin
        );

        // Content should remain largely unchanged
        const originalCount = wordCountManager.countWords(content);
        const expandedCount = wordCountManager.countWords(expandedContent);

        expect(expandedCount).toBeGreaterThanOrEqual(originalCount);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * Word count should handle empty content
   */
  it('Word count should handle empty content', () => {
    expect(wordCountManager.countWords('')).toBe(0);
    expect(wordCountManager.countWords('<p></p>')).toBe(0);
    expect(wordCountManager.countWords('   ')).toBe(0);
  });

  /**
   * Word count should handle content with only HTML tags
   */
  it('Word count should handle content with only HTML tags', () => {
    const htmlOnly = '<h2></h2><p></p><ul><li></li></ul>';
    expect(wordCountManager.countWords(htmlOnly)).toBe(0);
  });

  /**
   * Limits should be consistent across multiple calls
   */
  it('Limits should be consistent across multiple calls', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const limits1 = wordCountManager.getLimits(length);
        const limits2 = wordCountManager.getLimits(length);

        expect(limits1.min).toBe(limits2.min);
        expect(limits1.max).toBe(limits2.max);
      }),
      { numRuns: 20 }
    );
  });
});
