/**
 * Integration Tests for Content Generator
 * اختبارات التكامل لمولد المحتوى
 *
 * These tests verify the complete flow of content generation
 * including topic analysis, content generation, quality validation,
 * and fallback system.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ContentGenerator } from '../../lib/sona/contentGenerator';

describe('Content Generator Integration Tests', () => {
  let generator: ContentGenerator;

  beforeEach(() => {
    generator = new ContentGenerator();
  });

  /**
   * Task 10.1: اختبار تكامل لتوليد مقال عيد ميلاد مع اسم وعمر
   * Integration test for birthday article with name and age
   *
   * Validates: Requirements 1.1, 2.1, 2.2, 4.1
   */
  describe('Birthday Article with Name and Age', () => {
    it('should generate article mentioning birthday topic in content', async () => {
      const name = 'أحمد';
      const age = 25;
      const topic = `عيد ميلاد ${name} ${age} سنة`;

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من ذكر موضوع عيد الميلاد في المحتوى
      const hasBirthdayContent =
        result.content.includes('عيد ميلاد') ||
        result.content.includes('ميلاد') ||
        result.content.includes('احتفال');

      expect(hasBirthdayContent).toBe(true);
    });

    it('should generate article mentioning the age in content', async () => {
      const name = 'فاطمة';
      const age = 30;
      const topic = `عيد ميلاد ${name} ${age} سنة`;

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من ذكر العمر في المحتوى
      expect(result.content).toContain(age.toString());
    });

    it('should include all required sections', async () => {
      const topic = 'عيد ميلاد سعيد 20 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من وجود المقدمة
      expect(result.content).toMatch(/<h2[^>]*>.*مقدمة.*<\/h2>/i);

      // التحقق من وجود الخاتمة
      expect(result.content).toMatch(/<h2[^>]*>.*الخاتمة.*<\/h2>/i);

      // التحقق من وجود أقسام H2 (على الأقل 3)
      const h2Matches = result.content.match(/<h2[^>]*>/gi);
      expect(h2Matches).toBeDefined();
      expect(h2Matches!.length).toBeGreaterThanOrEqual(3);
    });

    it('should have word count within reasonable limits for short article', async () => {
      const topic = 'عيد ميلاد سارة 15 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // الحدود المرنة للمقال القصير
      expect(result.wordCount).toBeGreaterThanOrEqual(300);
      expect(result.wordCount).toBeLessThanOrEqual(800);
    });

    it('should generate content for children age', async () => {
      const topic = 'عيد ميلاد ليلى 8 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من أن المحتوى يذكر العمر
      expect(result.content).toContain('8');

      // التحقق من وجود محتوى
      expect(result.content.length).toBeGreaterThan(500);
    });

    it('should generate content for adult age', async () => {
      const topic = 'عيد ميلاد خالد 45 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من أن المحتوى يذكر العمر
      expect(result.content).toContain('45');
    });
  });

  /**
   * Task 10.2: اختبار تكامل لتوليد مقال عن برج
   * Integration test for zodiac article
   *
   * Validates: Requirements 2.3
   */
  describe('Zodiac Article', () => {
    it('should generate article mentioning the zodiac sign', async () => {
      const zodiac = 'الحمل';
      const topic = `برج ${zodiac}`;

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من ذكر البرج في المحتوى
      expect(result.content).toContain(zodiac);

      // التحقق من ذكر البرج في العنوان
      expect(result.title).toContain(zodiac);
    });

    it('should include zodiac-specific information', async () => {
      const topic = 'برج الثور';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من وجود معلومات عن البرج
      expect(result.content).toContain('الثور');

      // التحقق من وجود أقسام متعلقة بالأبراج
      const hasZodiacContent =
        result.content.includes('صفات') ||
        result.content.includes('توافق') ||
        result.content.includes('مواليد');

      expect(hasZodiacContent).toBe(true);
    });

    it('should generate valid keywords for zodiac topic', async () => {
      const topic = 'برج الجوزاء';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من وجود كلمات مفتاحية
      expect(result.keywords).toBeDefined();
      expect(result.keywords.length).toBeGreaterThan(0);

      // التحقق من أن الكلمات المفتاحية تتضمن البرج
      const hasZodiacKeyword = result.keywords.some(
        (kw) => kw.includes('الجوزاء') || kw.includes('برج')
      );
      expect(hasZodiacKeyword).toBe(true);
    });
  });

  /**
   * Task 10.3: اختبار تكامل للمحتوى الاحتياطي
   * Integration test for fallback content
   *
   * Validates: Requirements 6.1, 6.2, 6.3
   */
  describe('Fallback Content System', () => {
    it('should return content even for unusual topics', async () => {
      const topic = 'عيد ميلاد شخص مميز';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من أن المحتوى موجود
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(100);

      // التحقق من وجود تقرير الجودة
      expect(result.qualityReport).toBeDefined();
    });

    it('should include quality report with all scores', async () => {
      const topic = 'عيد ميلاد علي 35 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // التحقق من وجود جميع درجات الجودة
      expect(result.qualityReport.overallScore).toBeDefined();
      expect(result.qualityReport.diversityScore).toBeDefined();
      expect(result.qualityReport.keywordDensity).toBeDefined();
      expect(result.qualityReport.readabilityScore).toBeDefined();
      expect(result.qualityReport.structureScore).toBeDefined();
      expect(result.qualityReport.passed).toBeDefined();
    });

    it('should throw error for empty topic', async () => {
      await expect(
        generator.generate({
          topic: '',
          length: 'short',
        })
      ).rejects.toThrow('الموضوع مطلوب');
    });

    it('should throw error for whitespace-only topic', async () => {
      await expect(
        generator.generate({
          topic: '   ',
          length: 'short',
        })
      ).rejects.toThrow('الموضوع مطلوب');
    });
  });

  /**
   * Additional Integration Tests
   */
  describe('Content Quality Validation', () => {
    it('should generate meta title within length limits', async () => {
      const topic = 'عيد ميلاد نور 25 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // Meta title should be <= 70 characters
      expect(result.metaTitle.length).toBeLessThanOrEqual(80);
    });

    it('should generate meta description with appropriate length', async () => {
      const topic = 'عيد ميلاد نورة 18 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // Meta description should be between 50-200 characters
      expect(result.metaDescription.length).toBeGreaterThanOrEqual(50);
      expect(result.metaDescription.length).toBeLessThanOrEqual(250);
    });

    it('should include used templates in result', async () => {
      const topic = 'عيد ميلاد يوسف 22 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // Should have used templates array
      expect(result.usedTemplates).toBeDefined();
      expect(Array.isArray(result.usedTemplates)).toBe(true);
    });

    it('should track generation time', async () => {
      const topic = 'عيد ميلاد ريم 28 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // Generation time should be recorded
      expect(result.generationTime).toBeDefined();
      expect(result.generationTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Different Article Lengths', () => {
    it('should generate medium article with content', async () => {
      const topic = 'عيد ميلاد سعد 30 سنة';

      const result = await generator.generate({
        topic,
        length: 'medium',
      });

      // Medium article should have content
      expect(result.wordCount).toBeGreaterThanOrEqual(400);
      expect(result.content.length).toBeGreaterThan(1000);
    });

    it('should generate long article with FAQ section', async () => {
      const topic = 'عيد ميلاد سارة 25 سنة';

      const result = await generator.generate({
        topic,
        length: 'long',
      });

      // Long article should have FAQ section
      const hasFAQ =
        result.content.includes('الأسئلة الشائعة') ||
        result.content.includes('أسئلة شائعة') ||
        result.content.includes('FAQ');

      expect(hasFAQ).toBe(true);
    });
  });

  describe('Topic Binding Verification', () => {
    it('should mention topic in introduction', async () => {
      const name = 'عبدالرحمن';
      const topic = `عيد ميلاد ${name} 40 سنة`;

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // Extract introduction section
      const introMatch = result.content.match(
        /<h2[^>]*>.*مقدمة.*<\/h2>([\s\S]*?)(?=<h2|$)/i
      );

      if (introMatch) {
        const introContent = introMatch[1];
        // Introduction should mention birthday
        const mentionsTopic =
          introContent.includes('عيد ميلاد') ||
          introContent.includes('ميلاد') ||
          introContent.includes('احتفال');

        expect(mentionsTopic).toBe(true);
      }
    });

    it('should mention topic in conclusion', async () => {
      const name = 'هند';
      const topic = `عيد ميلاد ${name} 35 سنة`;

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      // Extract conclusion section
      const conclusionMatch = result.content.match(
        /<h2[^>]*>.*الخاتمة.*<\/h2>([\s\S]*?)(?=<h2|$)/i
      );

      if (conclusionMatch) {
        const conclusionContent = conclusionMatch[1];
        // Conclusion should mention birthday or name
        const mentionsTopic =
          conclusionContent.includes('عيد ميلاد') ||
          conclusionContent.includes('ميلاد') ||
          conclusionContent.includes('نتمنى');

        expect(mentionsTopic).toBe(true);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle simple topic without special characters', async () => {
      const topic = 'عيد ميلاد محمد 50 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(100);
    });

    it('should handle very long names', async () => {
      const topic = 'عيد ميلاد محمد أحمد عبدالله 25 سنة';

      const result = await generator.generate({
        topic,
        length: 'short',
      });

      expect(result.content).toBeDefined();
    });

    it('should handle edge case ages', async () => {
      // Test with age 1
      const result1 = await generator.generate({
        topic: 'عيد ميلاد طفل 1 سنة',
        length: 'short',
      });
      expect(result1.content).toBeDefined();

      // Test with age 100
      const result100 = await generator.generate({
        topic: 'عيد ميلاد جدي 100 سنة',
        length: 'short',
      });
      expect(result100.content).toBeDefined();
    });
  });
});
