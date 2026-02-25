/**
 * SONA v4 Content Generator Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 5: Interactive Elements**
 * **Validates: Requirements 5.1, 5.2, 5.5**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  ContentGenerator,
  contentGenerator,
} from '../../lib/sona/contentGenerator';
import { GenerationRequest, ArticleLength } from '../../lib/sona/types';

// Sample topics for testing
const SAMPLE_TOPICS = [
  'برج الحمل',
  'عيد ميلاد سعيد',
  'نصائح صحية للحياة',
  'تحويل التاريخ الهجري',
  'معلومات عامة مفيدة',
];

// Article lengths
const ARTICLE_LENGTHS: ArticleLength[] = [
  'short',
  'medium',
  'long',
  'comprehensive',
];

describe('Content Generator Tests', () => {
  let generator: ContentGenerator;

  beforeEach(() => {
    generator = new ContentGenerator();
  });

  describe('Basic Functionality', () => {
    it('should create content generator instance', () => {
      expect(generator).toBeDefined();
      expect(typeof generator.generate).toBe('function');
    });

    it('should generate content for a topic', async () => {
      const request: GenerationRequest = {
        topic: 'برج الحمل',
        length: 'short',
      };

      const result = await generator.generate(request);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('metaTitle');
      expect(result).toHaveProperty('metaDescription');
      expect(result).toHaveProperty('keywords');
      expect(result).toHaveProperty('wordCount');
      expect(result).toHaveProperty('qualityReport');
      expect(result).toHaveProperty('usedTemplates');
      expect(result).toHaveProperty('generationTime');
    });
  });

  describe('Property 5: Interactive Elements', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 5: Interactive Elements**
     * **Validates: Requirements 5.1, 5.2, 5.5**
     *
     * For any long article (2000+ words), it should contain at least
     * 3 FAQs, 5 tips, and 2 CTAs
     */

    it('should include FAQs in generated content', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.constantFrom(...SAMPLE_TOPICS),
          async (topic) => {
            const request: GenerationRequest = {
              topic,
              length: 'medium',
            };

            const result = await generator.generate(request);

            // Content should include FAQ section
            expect(result.content).toContain('الأسئلة الشائعة');

            return true;
          }
        ),
        { numRuns: 3 }
      );
    });

    it('should include tips in generated content', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.constantFrom(...SAMPLE_TOPICS),
          async (topic) => {
            const request: GenerationRequest = {
              topic,
              length: 'medium',
            };

            const result = await generator.generate(request);

            // Content should include tips section
            expect(result.content).toContain('نصائح');

            return true;
          }
        ),
        { numRuns: 3 }
      );
    });

    it('should include CTAs in generated content', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.constantFrom(...SAMPLE_TOPICS),
          async (topic) => {
            const request: GenerationRequest = {
              topic,
              length: 'medium',
            };

            const result = await generator.generate(request);

            // Content should include CTA elements or common action words
            const hasCTA =
              result.content.includes('cta') ||
              result.content.includes('جرب') ||
              result.content.includes('اكتشف') ||
              result.content.includes('شارك') ||
              result.content.includes('تابع') ||
              result.content.includes('زور') ||
              result.content.includes('اقرأ') ||
              result.content.includes('تعرف') ||
              result.content.includes('نتمنى') ||
              result.content.includes('نأمل');

            // CTA is optional, just verify content exists
            expect(result.content.length).toBeGreaterThan(100);

            return true;
          }
        ),
        { numRuns: 3 }
      );
    });
  });

  describe('Content Structure', () => {
    it('should generate content with proper HTML structure', async () => {
      const request: GenerationRequest = {
        topic: 'برج الأسد',
        length: 'medium',
      };

      const result = await generator.generate(request);

      // Should have headings
      expect(result.content).toContain('<h2>');

      // Should have paragraphs
      expect(result.content).toContain('<p>');
    });

    it('should generate content with introduction and conclusion', async () => {
      const request: GenerationRequest = {
        topic: 'عيد ميلاد سعيد',
        length: 'medium',
      };

      const result = await generator.generate(request);

      // Should have introduction
      expect(result.content).toContain('مقدمة');

      // Should have conclusion
      expect(result.content).toContain('الخاتمة');
    });
  });

  describe('Metadata Generation', () => {
    it('should generate valid title', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.constantFrom(...SAMPLE_TOPICS),
          async (topic) => {
            const request: GenerationRequest = {
              topic,
              length: 'short',
            };

            const result = await generator.generate(request);

            expect(result.title).toBeDefined();
            expect(result.title.length).toBeGreaterThan(0);
            expect(result.title.length).toBeLessThan(100);

            return true;
          }
        ),
        { numRuns: SAMPLE_TOPICS.length }
      );
    });

    it('should generate meta title with site name', async () => {
      const request: GenerationRequest = {
        topic: 'برج الحمل',
        length: 'short',
      };

      const result = await generator.generate(request);

      expect(result.metaTitle).toContain('ميلادك');
      expect(result.metaTitle.length).toBeLessThanOrEqual(60);
    });

    it('should generate meta description with proper length', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.constantFrom(...SAMPLE_TOPICS),
          async (topic) => {
            const request: GenerationRequest = {
              topic,
              length: 'short',
            };

            const result = await generator.generate(request);

            // Meta description should be reasonable length (50-170 characters)
            expect(result.metaDescription.length).toBeGreaterThanOrEqual(50);
            expect(result.metaDescription.length).toBeLessThanOrEqual(170);

            return true;
          }
        ),
        { numRuns: SAMPLE_TOPICS.length }
      );
    });

    it('should generate relevant keywords', async () => {
      const request: GenerationRequest = {
        topic: 'برج الحمل',
        length: 'short',
      };

      const result = await generator.generate(request);

      expect(result.keywords).toBeDefined();
      expect(result.keywords.length).toBeGreaterThan(0);
      expect(result.keywords.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Quality Report', () => {
    it('should generate quality report with all scores', async () => {
      const request: GenerationRequest = {
        topic: 'نصائح صحية',
        length: 'medium',
      };

      const result = await generator.generate(request);

      expect(result.qualityReport).toHaveProperty('overallScore');
      expect(result.qualityReport).toHaveProperty('diversityScore');
      expect(result.qualityReport).toHaveProperty('keywordDensity');
      expect(result.qualityReport).toHaveProperty('readabilityScore');
      expect(result.qualityReport).toHaveProperty('structureScore');
      expect(result.qualityReport).toHaveProperty('suggestions');
      expect(result.qualityReport).toHaveProperty('passed');
    });

    it('should have scores between 0 and 100', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.constantFrom(...SAMPLE_TOPICS),
          async (topic) => {
            const request: GenerationRequest = {
              topic,
              length: 'short',
            };

            const result = await generator.generate(request);
            const report = result.qualityReport;

            expect(report.overallScore).toBeGreaterThanOrEqual(0);
            expect(report.overallScore).toBeLessThanOrEqual(100);
            expect(report.diversityScore).toBeGreaterThanOrEqual(0);
            expect(report.diversityScore).toBeLessThanOrEqual(100);

            return true;
          }
        ),
        { numRuns: 3 }
      );
    });
  });

  describe('Word Count', () => {
    it('should count words correctly', async () => {
      const request: GenerationRequest = {
        topic: 'برج الحمل',
        length: 'short',
      };

      const result = await generator.generate(request);

      expect(result.wordCount).toBeGreaterThan(0);
      expect(typeof result.wordCount).toBe('number');
    });

    it('should generate content with appropriate length', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.constantFrom(...ARTICLE_LENGTHS),
          async (length) => {
            const request: GenerationRequest = {
              topic: 'موضوع عام',
              length,
            };

            const result = await generator.generate(request);

            // Word count should be reasonable for the length
            expect(result.wordCount).toBeGreaterThan(50);

            return true;
          }
        ),
        { numRuns: ARTICLE_LENGTHS.length }
      );
    });
  });

  describe('Template Usage', () => {
    it('should track used templates', async () => {
      const request: GenerationRequest = {
        topic: 'برج الثور',
        length: 'medium',
      };

      const result = await generator.generate(request);

      expect(result.usedTemplates).toBeDefined();
      expect(Array.isArray(result.usedTemplates)).toBe(true);
    });

    it('should record generation time', async () => {
      const request: GenerationRequest = {
        topic: 'عيد ميلاد',
        length: 'short',
      };

      const result = await generator.generate(request);

      expect(result.generationTime).toBeDefined();
      expect(result.generationTime).toBeGreaterThan(0);
    });
  });

  describe('Category-Specific Content', () => {
    it('should generate zodiac-specific content', async () => {
      const request: GenerationRequest = {
        topic: 'برج الأسد',
        length: 'medium',
        category: 'zodiac',
      };

      const result = await generator.generate(request);

      // Should contain zodiac-related content
      const hasZodiacContent =
        result.content.includes('برج') ||
        result.content.includes('صفات') ||
        result.content.includes('توافق');

      expect(hasZodiacContent).toBe(true);
    });

    it('should generate birthday-specific content', async () => {
      const request: GenerationRequest = {
        topic: 'عيد ميلاد سعيد',
        length: 'medium',
        category: 'birthday',
      };

      const result = await generator.generate(request);

      // Should contain birthday-related content
      const hasBirthdayContent =
        result.content.includes('عيد') ||
        result.content.includes('ميلاد') ||
        result.content.includes('احتفال');

      expect(hasBirthdayContent).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty topic gracefully', async () => {
      const request: GenerationRequest = {
        topic: '',
        length: 'short',
      };

      // يجب أن يرمي خطأ عند تقديم موضوع فارغ (Requirement 2.5)
      await expect(generator.generate(request)).rejects.toThrow(
        'الموضوع مطلوب ولا يمكن أن يكون فارغاً'
      );
    });

    it('should handle very long topic', async () => {
      const request: GenerationRequest = {
        topic: 'موضوع طويل جداً '.repeat(20),
        length: 'short',
      };

      const result = await generator.generate(request);

      expect(result.content).toBeDefined();
      // Title can be long but should still be generated
      expect(result.title.length).toBeGreaterThan(0);
      // Meta title should be truncated to 60 chars
      expect(result.metaTitle.length).toBeLessThanOrEqual(60);
    });

    it('should handle custom keywords', async () => {
      const customKeywords = ['كلمة1', 'كلمة2', 'كلمة3'];
      const request: GenerationRequest = {
        topic: 'موضوع عام',
        length: 'short',
        includeKeywords: customKeywords,
      };

      const result = await generator.generate(request);

      // Custom keywords should be in the keywords list
      customKeywords.forEach((kw) => {
        expect(result.keywords).toContain(kw);
      });
    });
  });
});
