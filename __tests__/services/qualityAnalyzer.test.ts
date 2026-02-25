/**
 * اختبارات خدمة تحليل الجودة
 */

import {
  analyzeQuality,
  calculateReadability,
  calculateUniqueness,
  calculateSEOScore,
  extractTopKeywords,
} from '@/lib/services/qualityAnalyzer';

describe('QualityAnalyzer', () => {
  describe('calculateReadability', () => {
    it('should return score between 0 and 100', () => {
      const content =
        'هذا نص تجريبي للاختبار. يحتوي على عدة جمل. كل جملة قصيرة.';
      const score = calculateReadability(content);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should give higher score for shorter sentences', () => {
      const shortSentences = 'جملة قصيرة. جملة أخرى. وجملة ثالثة.';
      const longSentences =
        'هذه جملة طويلة جداً تحتوي على الكثير من الكلمات والعبارات المتعددة التي تجعل القراءة صعبة ومعقدة للغاية.';

      const shortScore = calculateReadability(shortSentences);
      const longScore = calculateReadability(longSentences);

      expect(shortScore).toBeGreaterThan(longScore);
    });

    it('should return 50 for empty content', () => {
      const score = calculateReadability('');
      expect(score).toBe(50);
    });
  });

  describe('calculateUniqueness', () => {
    it('should return 0 for identical content', () => {
      const content = 'هذا نص متطابق تماماً';
      const score = calculateUniqueness(content, content);
      expect(score).toBeLessThan(20); // قريب من 0
    });

    it('should return high score for completely different content', () => {
      const original = 'النص الأصلي يحتوي على كلمات مختلفة';
      const rewritten = 'محتوى جديد بعبارات متنوعة ومتباينة';
      const score = calculateUniqueness(original, rewritten);
      expect(score).toBeGreaterThan(50);
    });
  });

  describe('calculateSEOScore', () => {
    it('should give higher score for longer content', () => {
      const shortContent = 'محتوى قصير جداً';
      const longContent =
        'محتوى طويل يحتوي على الكثير من الكلمات والفقرات المتعددة. '.repeat(50);

      const shortScore = calculateSEOScore(shortContent);
      const longScore = calculateSEOScore(longContent);

      expect(longScore).toBeGreaterThan(shortScore);
    });

    it('should give bonus for headings', () => {
      const withHeadings =
        '## عنوان فرعي\nمحتوى الفقرة\n## عنوان آخر\nمحتوى آخر';
      const withoutHeadings = 'محتوى بدون عناوين فرعية. فقط نص عادي.';

      const withScore = calculateSEOScore(withHeadings);
      const withoutScore = calculateSEOScore(withoutHeadings);

      expect(withScore).toBeGreaterThan(withoutScore);
    });
  });

  describe('extractTopKeywords', () => {
    it('should extract keywords from content', () => {
      const content =
        'البرمجة مهمة جداً. تعلم البرمجة يساعد في التطوير. البرمجة والتطوير مترابطان.';
      const keywords = extractTopKeywords(content, 5);

      expect(keywords.length).toBeLessThanOrEqual(5);
      expect(keywords).toContain('البرمجة');
    });

    it('should filter out stop words', () => {
      const content = 'هذا هو النص الذي يحتوي على كلمات توقف كثيرة';
      const keywords = extractTopKeywords(content, 10);

      // كلمات التوقف مثل "هذا" و "هو" يجب ألا تظهر
      expect(keywords).not.toContain('هذا');
      expect(keywords).not.toContain('هو');
    });
  });

  describe('analyzeQuality', () => {
    it('should return all metrics', () => {
      const content = 'هذا محتوى تجريبي للاختبار. يحتوي على عدة جمل وفقرات.';
      const metrics = analyzeQuality(content);

      expect(metrics).toHaveProperty('overall');
      expect(metrics).toHaveProperty('readability');
      expect(metrics).toHaveProperty('uniqueness');
      expect(metrics).toHaveProperty('seo');
      expect(metrics).toHaveProperty('suggestions');
    });

    it('should calculate overall score correctly', () => {
      const content = 'محتوى للاختبار';
      const metrics = analyzeQuality(content);

      // الدرجة الإجمالية يجب أن تكون متوسط مرجح
      expect(metrics.overall).toBeGreaterThanOrEqual(0);
      expect(metrics.overall).toBeLessThanOrEqual(100);
    });
  });
});
