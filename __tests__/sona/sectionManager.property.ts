/**
 * Property-Based Tests for Section Manager
 * اختبارات الخصائص لمدير الأقسام
 *
 * **Feature: article-generation-quality-fix, Property 2: Article Completeness**
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.5, 2.6**
 *
 * **Feature: article-generation-quality-fix, Property 7: FAQ for Long Articles**
 * **Validates: Requirements 2.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  SectionManager,
  sectionManager,
  REQUIRED_SECTIONS_CONFIG,
} from '../../lib/sona/sectionManager';
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

/**
 * مولد لمحتوى HTML مع أقسام
 */
const htmlContentWithSectionsArb = (
  hasIntro: boolean,
  h2Count: number,
  hasFaq: boolean,
  hasTips: boolean,
  hasConclusion: boolean
) => {
  let content = '';

  if (hasIntro) {
    content += '<h2>مقدمة</h2>\n<p>هذه مقدمة المقال.</p>\n';
  }

  for (let i = 0; i < h2Count; i++) {
    content += `<h2>القسم ${i + 1}</h2>\n<p>محتوى القسم ${i + 1}.</p>\n`;
  }

  if (hasTips) {
    content += '<h2>نصائح مهمة</h2>\n<p>إليكم بعض النصائح.</p>\n';
  }

  if (hasFaq) {
    content +=
      '<h2>الأسئلة الشائعة</h2>\n<h3>سؤال 1؟</h3>\n<p>إجابة 1.</p>\n<h3>سؤال 2؟</h3>\n<p>إجابة 2.</p>\n<h3>سؤال 3؟</h3>\n<p>إجابة 3.</p>\n';
  }

  if (hasConclusion) {
    content +=
      '<h2>الخاتمة</h2>\n<p>في الختام، نأمل أن يكون المقال مفيداً.</p>\n';
  }

  return content;
};

// ============================================
// Property Tests
// ============================================

describe('Section Manager Property Tests', () => {
  /**
   * **Feature: article-generation-quality-fix, Property 2: Article Completeness**
   * **Validates: Requirements 2.1, 2.2, 2.3, 2.5, 2.6**
   *
   * For any article length, required sections should be defined
   */
  it('Property 2: Required sections should be defined for each length', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const required = sectionManager.getRequiredSections(length);

        // All lengths require intro and conclusion
        expect(required.intro).toBe(true);
        expect(required.conclusion).toBe(true);

        // Main sections should be positive
        expect(required.mainSections).toBeGreaterThan(0);

        // Verify specific requirements
        switch (length) {
          case 'short':
            expect(required.mainSections).toBe(2);
            expect(required.faq).toBe(false);
            expect(required.tips).toBe(false);
            break;
          case 'medium':
            expect(required.mainSections).toBe(3);
            expect(required.faq).toBe(false);
            expect(required.tips).toBe(true);
            break;
          case 'long':
            expect(required.mainSections).toBe(4);
            expect(required.faq).toBe(true);
            expect(required.tips).toBe(true);
            break;
          case 'comprehensive':
            expect(required.mainSections).toBe(5);
            expect(required.faq).toBe(true);
            expect(required.tips).toBe(true);
            break;
        }
      }),
      { numRuns: 20 }
    );
  });

  /**
   * checkSections should correctly identify present sections
   */
  it('checkSections should correctly identify present sections', () => {
    // Test with complete content
    const completeContent = htmlContentWithSectionsArb(
      true,
      3,
      true,
      true,
      true
    );
    const completeResult = sectionManager.checkSections(completeContent);

    expect(completeResult.hasIntro).toBe(true);
    expect(completeResult.hasConclusion).toBe(true);
    expect(completeResult.hasFaq).toBe(true);
    expect(completeResult.hasTips).toBe(true);
    expect(completeResult.h2Count).toBeGreaterThan(0);

    // Test with minimal content
    const minimalContent = '<h2>القسم 1</h2><p>محتوى.</p>';
    const minimalResult = sectionManager.checkSections(minimalContent);

    expect(minimalResult.hasFaq).toBe(false);
    expect(minimalResult.hasTips).toBe(false);
    expect(minimalResult.hasConclusion).toBe(false);
  });

  /**
   * isComplete should return true for complete articles
   */
  it('isComplete should return true for articles with all required sections', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const required = sectionManager.getRequiredSections(length);

        // Create complete content
        const content = htmlContentWithSectionsArb(
          true, // intro
          required.mainSections,
          required.faq,
          required.tips,
          true // conclusion
        );

        expect(sectionManager.isComplete(content, length)).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * isComplete should return false for incomplete articles
   */
  it('isComplete should return false for articles missing required sections', () => {
    // Create content without conclusion (should fail for all lengths)
    const contentNoConclusion =
      '<h2>مقدمة</h2><p>مقدمة.</p><h2>القسم 1</h2><p>محتوى.</p><h2>القسم 2</h2><p>محتوى.</p><h2>القسم 3</h2><p>محتوى.</p>';

    expect(sectionManager.isComplete(contentNoConclusion, 'short')).toBe(false);
    expect(sectionManager.isComplete(contentNoConclusion, 'medium')).toBe(
      false
    );
    expect(sectionManager.isComplete(contentNoConclusion, 'long')).toBe(false);
    expect(
      sectionManager.isComplete(contentNoConclusion, 'comprehensive')
    ).toBe(false);
  });

  /**
   * **Feature: article-generation-quality-fix, Property 7: FAQ for Long Articles**
   * **Validates: Requirements 2.4**
   *
   * Long and comprehensive articles should require FAQ
   */
  it('Property 7: Long and comprehensive articles should require FAQ', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<ArticleLength>('long', 'comprehensive'),
        (length) => {
          const required = sectionManager.getRequiredSections(length);
          expect(required.faq).toBe(true);

          // Content without FAQ should be incomplete
          const contentNoFaq = htmlContentWithSectionsArb(
            true,
            required.mainSections,
            false, // no FAQ
            required.tips,
            true
          );
          expect(sectionManager.isComplete(contentNoFaq, length)).toBe(false);

          // Content with FAQ should be complete
          const contentWithFaq = htmlContentWithSectionsArb(
            true,
            required.mainSections,
            true, // with FAQ
            required.tips,
            true
          );
          expect(sectionManager.isComplete(contentWithFaq, length)).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Short and medium articles should not require FAQ
   */
  it('Short and medium articles should not require FAQ', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<ArticleLength>('short', 'medium'),
        (length) => {
          const required = sectionManager.getRequiredSections(length);
          expect(required.faq).toBe(false);
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * addMissingSections should add missing intro
   * **Validates: Requirements 2.5, 2.6**
   */
  it('addMissingSections should add missing intro', () => {
    fc.assert(
      fc.property(
        simpleTopicAnalysisArb,
        articleLengthArb,
        (analysis, length) => {
          // Create content without intro
          const contentNoIntro =
            '<h2>القسم 1</h2><p>محتوى.</p><h2>الخاتمة</h2><p>نهاية.</p>';

          const result = sectionManager.addMissingSections(
            contentNoIntro,
            analysis,
            length
          );

          // Result should have intro
          const checkResult = sectionManager.checkSections(result);
          expect(checkResult.hasIntro).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * addMissingSections should add missing conclusion
   */
  it('addMissingSections should add missing conclusion', () => {
    fc.assert(
      fc.property(
        simpleTopicAnalysisArb,
        articleLengthArb,
        (analysis, length) => {
          // Create content without conclusion
          const contentNoConclusion =
            '<h2>مقدمة</h2><p>مقدمة.</p><h2>القسم 1</h2><p>محتوى.</p>';

          const result = sectionManager.addMissingSections(
            contentNoConclusion,
            analysis,
            length
          );

          // Result should have conclusion
          const checkResult = sectionManager.checkSections(result);
          expect(checkResult.hasConclusion).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * addMissingSections should add FAQ for long articles
   */
  it('addMissingSections should add FAQ for long articles', () => {
    fc.assert(
      fc.property(
        simpleTopicAnalysisArb,
        fc.constantFrom<ArticleLength>('long', 'comprehensive'),
        (analysis, length) => {
          // Create content without FAQ
          const contentNoFaq =
            '<h2>مقدمة</h2><p>مقدمة.</p><h2>القسم 1</h2><p>محتوى.</p><h2>الخاتمة</h2><p>نهاية.</p>';

          const result = sectionManager.addMissingSections(
            contentNoFaq,
            analysis,
            length
          );

          // Result should have FAQ
          const checkResult = sectionManager.checkSections(result);
          expect(checkResult.hasFaq).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * addSection should add specific section types
   */
  it('addSection should add specific section types', () => {
    fc.assert(
      fc.property(simpleTopicAnalysisArb, (analysis) => {
        const baseContent = '<h2>القسم 1</h2><p>محتوى.</p>';

        // Add intro
        const withIntro = sectionManager.addSection(
          baseContent,
          'intro',
          analysis
        );
        expect(sectionManager.checkSections(withIntro).hasIntro).toBe(true);

        // Add conclusion
        const withConclusion = sectionManager.addSection(
          baseContent,
          'conclusion',
          analysis
        );
        expect(sectionManager.checkSections(withConclusion).hasConclusion).toBe(
          true
        );

        // Add FAQ
        const withFaq = sectionManager.addSection(baseContent, 'faq', analysis);
        expect(sectionManager.checkSections(withFaq).hasFaq).toBe(true);

        // Add tips
        const withTips = sectionManager.addSection(
          baseContent,
          'tips',
          analysis
        );
        expect(sectionManager.checkSections(withTips).hasTips).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * checkSections should handle empty content
   */
  it('checkSections should handle empty content', () => {
    const result = sectionManager.checkSections('');

    expect(result.hasIntro).toBe(false);
    expect(result.h2Count).toBe(0);
    expect(result.hasFaq).toBe(false);
    expect(result.hasTips).toBe(false);
    expect(result.hasConclusion).toBe(false);
    expect(result.missingSections).toContain('intro');
    expect(result.missingSections).toContain('conclusion');
  });

  /**
   * Required sections config should be consistent
   */
  it('Required sections config should be consistent', () => {
    fc.assert(
      fc.property(articleLengthArb, (length) => {
        const required1 = sectionManager.getRequiredSections(length);
        const required2 = sectionManager.getRequiredSections(length);

        expect(required1.intro).toBe(required2.intro);
        expect(required1.conclusion).toBe(required2.conclusion);
        expect(required1.mainSections).toBe(required2.mainSections);
        expect(required1.faq).toBe(required2.faq);
        expect(required1.tips).toBe(required2.tips);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * Main sections requirement should increase with article length
   */
  it('Main sections requirement should increase with article length', () => {
    const shortReq = sectionManager.getRequiredSections('short');
    const mediumReq = sectionManager.getRequiredSections('medium');
    const longReq = sectionManager.getRequiredSections('long');
    const compReq = sectionManager.getRequiredSections('comprehensive');

    expect(shortReq.mainSections).toBeLessThan(mediumReq.mainSections);
    expect(mediumReq.mainSections).toBeLessThan(longReq.mainSections);
    expect(longReq.mainSections).toBeLessThan(compReq.mainSections);
  });
});
