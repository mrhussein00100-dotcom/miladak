/**
 * SONA v4 Content Tracker Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 1: Content Diversity**
 * **Feature: sona-v4-enhancement, Property 7: Content Hash Uniqueness**
 * **Validates: Requirements 2.5, 12.1, 12.2**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { ContentTracker } from '../../lib/sona/contentTracker';

describe('Content Tracker Tests', () => {
  let tracker: ContentTracker;

  beforeEach(() => {
    tracker = new ContentTracker();
    tracker.clearCache();
  });

  describe('Basic Functionality', () => {
    it('should create content tracker instance', () => {
      expect(tracker).toBeDefined();
      expect(typeof tracker.generateHash).toBe('function');
      expect(typeof tracker.calculateSimilarity).toBe('function');
    });

    it('should generate consistent hashes for same content', () => {
      const content = 'هذا محتوى تجريبي للاختبار';
      const hash1 = tracker.generateHash(content);
      const hash2 = tracker.generateHash(content);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produces 64 hex characters
    });

    it('should generate different hashes for different content', () => {
      const content1 = 'المحتوى الأول';
      const content2 = 'المحتوى الثاني';

      const hash1 = tracker.generateHash(content1);
      const hash2 = tracker.generateHash(content2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Property 7: Content Hash Uniqueness', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 7: Content Hash Uniqueness**
     * **Validates: Requirements 12.1, 12.2**
     *
     * For any generated article, its hash should be unique
     * and deterministic based on content
     */

    it('should generate unique hashes for different content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 500 }),
          fc.string({ minLength: 10, maxLength: 500 }),
          (content1, content2) => {
            // Skip if contents are the same
            if (content1 === content2) return true;

            const hash1 = tracker.generateHash(content1);
            const hash2 = tracker.generateHash(content2);

            // Different content should produce different hashes
            // (with extremely high probability for SHA-256)
            expect(hash1).not.toBe(hash2);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should produce deterministic hashes', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 5, maxLength: 200 }), (content) => {
          const hash1 = tracker.generateHash(content);
          const hash2 = tracker.generateHash(content);
          const hash3 = tracker.generateHash(content);

          expect(hash1).toBe(hash2);
          expect(hash2).toBe(hash3);
          return true;
        }),
        { numRuns: 30 }
      );
    });

    it('should normalize content before hashing', () => {
      // Same content with different whitespace should produce same hash
      const content1 = 'هذا   محتوى   للاختبار';
      const content2 = 'هذا محتوى للاختبار';

      const hash1 = tracker.generateHash(content1);
      const hash2 = tracker.generateHash(content2);

      expect(hash1).toBe(hash2);
    });

    it('should be case-insensitive for English text', () => {
      const content1 = 'Hello World Test';
      const content2 = 'hello world test';

      const hash1 = tracker.generateHash(content1);
      const hash2 = tracker.generateHash(content2);

      expect(hash1).toBe(hash2);
    });
  });

  describe('Property 1: Content Diversity - Similarity Calculation', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 1: Content Diversity**
     * **Validates: Requirements 2.5**
     *
     * For any two articles generated about the same topic,
     * the similarity between them should be less than 50%
     */

    it('should calculate similarity correctly for identical content', () => {
      const content = 'هذا محتوى تجريبي للاختبار';
      const similarity = tracker.calculateSimilarity(content, content);

      expect(similarity).toBe(1.0);
    });

    it('should calculate similarity correctly for completely different content', () => {
      const content1 = 'الشمس مشرقة اليوم';
      const content2 = 'القمر ساطع الليلة';

      const similarity = tracker.calculateSimilarity(content1, content2);

      // Should be low similarity (no common words)
      expect(similarity).toBeLessThan(0.5);
    });

    it('should calculate similarity correctly for partially similar content', () => {
      const content1 = 'عيد ميلاد سعيد يا صديقي العزيز';
      const content2 = 'عيد ميلاد مبارك يا صديقي الغالي';

      const similarity = tracker.calculateSimilarity(content1, content2);

      // Should have some similarity (shared words: عيد, ميلاد, يا, صديقي)
      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThan(1);
    });

    it('should handle empty strings gracefully', () => {
      const similarity = tracker.calculateSimilarity('', '');
      // Empty strings after normalization result in empty sets
      // Jaccard similarity of two empty sets is defined as 1 (identical)
      // or could be 0 depending on implementation
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should be symmetric', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 5, maxLength: 100 }),
          fc.string({ minLength: 5, maxLength: 100 }),
          (content1, content2) => {
            const sim1 = tracker.calculateSimilarity(content1, content2);
            const sim2 = tracker.calculateSimilarity(content2, content1);

            expect(sim1).toBeCloseTo(sim2, 10);
            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should return value between 0 and 1', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.string({ minLength: 1, maxLength: 200 }),
          (content1, content2) => {
            const similarity = tracker.calculateSimilarity(content1, content2);

            expect(similarity).toBeGreaterThanOrEqual(0);
            expect(similarity).toBeLessThanOrEqual(1);
            return true;
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Cache Management', () => {
    it('should start with empty cache', () => {
      expect(tracker.getCacheSize()).toBe(0);
    });

    it('should clear cache correctly', () => {
      // Add some items to cache by generating hashes
      tracker.generateHash('content1');
      tracker.generateHash('content2');

      tracker.clearCache();

      expect(tracker.getCacheSize()).toBe(0);
    });
  });

  describe('Content Metadata', () => {
    it('should accept valid metadata structure', () => {
      const metadata = {
        topic: 'عيد ميلاد سعيد',
        category: 'birthday' as const,
        generatedAt: new Date(),
        usedTemplates: ['intro_1', 'para_1', 'conclusion_1'],
        wordCount: 500,
        qualityScore: 85,
      };

      expect(metadata.topic).toBeDefined();
      expect(metadata.category).toBe('birthday');
      expect(metadata.usedTemplates.length).toBeGreaterThan(0);
      expect(metadata.wordCount).toBeGreaterThan(0);
      expect(metadata.qualityScore).toBeGreaterThanOrEqual(0);
      expect(metadata.qualityScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle Arabic text correctly', () => {
      const arabicContent = 'مرحباً بكم في موقع ميلادك لحساب العمر والأبراج';
      const hash = tracker.generateHash(arabicContent);

      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it('should handle mixed Arabic and English text', () => {
      const mixedContent = 'Happy Birthday عيد ميلاد سعيد 2024';
      const hash = tracker.generateHash(mixedContent);

      expect(hash).toHaveLength(64);
    });

    it('should handle special characters', () => {
      const specialContent = 'محتوى مع رموز: !@#$%^&*()';
      const hash = tracker.generateHash(specialContent);

      expect(hash).toHaveLength(64);
    });

    it('should handle very long content', () => {
      const longContent = 'كلمة '.repeat(1000);
      const hash = tracker.generateHash(longContent);

      expect(hash).toHaveLength(64);
    });

    it('should handle content with numbers', () => {
      const numberedContent = 'عيد ميلاد 25 سنة في تاريخ 15/1/2024';
      const hash = tracker.generateHash(numberedContent);

      expect(hash).toHaveLength(64);
    });
  });

  describe('Similarity Threshold', () => {
    it('should correctly identify content below 50% similarity threshold', () => {
      // Two very different articles
      const article1 = `
        برج الحمل هو أول الأبراج الفلكية ويتميز بالشجاعة والحماس.
        مواليد هذا البرج يحبون المغامرة والتحديات الجديدة.
      `;

      const article2 = `
        عيد الميلاد مناسبة سعيدة للاحتفال مع العائلة والأصدقاء.
        يمكنك تحضير كيكة لذيذة وتزيين المنزل بالبالونات.
      `;

      const similarity = tracker.calculateSimilarity(article1, article2);

      // These should be very different
      expect(similarity).toBeLessThan(0.5);
    });

    it('should correctly identify content above 50% similarity threshold', () => {
      // Two similar articles about the same topic
      const article1 = `
        برج الحمل يتميز بالشجاعة والحماس والقيادة.
        مواليد برج الحمل يحبون المغامرة والتحديات.
      `;

      const article2 = `
        برج الحمل معروف بالشجاعة والحماس والقيادة.
        مواليد برج الحمل يعشقون المغامرة والتحديات.
      `;

      const similarity = tracker.calculateSimilarity(article1, article2);

      // These should be quite similar
      expect(similarity).toBeGreaterThan(0.5);
    });
  });
});
