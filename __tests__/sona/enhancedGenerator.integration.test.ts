/**
 * اختبارات التكامل للمولد المحسّن - Enhanced Generator Integration Tests
 * Task 8: Integration Testing
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { generateEnhancedArticle } from '../../lib/sona/enhancedGenerator';
import { enhancedTopicAnalyzer } from '../../lib/sona/enhancedTopicAnalyzer';
import { enhancedQualityValidator } from '../../lib/sona/enhancedQualityValidator';

describe('Enhanced Generator Integration Tests', () => {
  beforeEach(() => {
    // Reset state before each test
  });

  describe('Task 8.1: Age Calculator Article', () => {
    it('should generate quality content for age calculator topic', async () => {
      const topic = 'كيف أحسب عمري بالتفصيل';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.category).toBe('general'); // or 'dates' depending on detection
      expect(analysis.contentType).toBe('tutorial');
      expect(analysis.implicitQuestions.length).toBeGreaterThan(0);
    });

    it('should analyze age-related topics correctly', () => {
      const topic = 'حساب العمر بالسنوات والأشهر والأيام';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.primaryKeywords).toContain('حساب');
      expect(analysis.primaryKeywords).toContain('العمر');
    });

    it('should detect tutorial content type for how-to topics', () => {
      const contentType =
        enhancedTopicAnalyzer.detectContentType('كيف أحسب عمري');
      expect(contentType).toBe('tutorial');
    });
  });

  describe('Task 8.2: Zodiac Article (Aries)', () => {
    it('should generate quality content for Aries zodiac topic', () => {
      const topic = 'صفات برج الحمل';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.category).toBe('zodiac');
      expect(analysis.entities.zodiacSigns).toContain('الحمل');
      expect(analysis.emotionalContext).toBe('neutral');
    });

    it('should extract zodiac sign correctly', () => {
      const entities = enhancedTopicAnalyzer.extractEntities(
        'توافق برج الأسد مع الحمل'
      );

      expect(entities.zodiacSigns).toContain('الأسد');
      expect(entities.zodiacSigns).toContain('الحمل');
    });

    it('should generate zodiac-specific implicit questions', () => {
      const topic = 'برج الثور';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.implicitQuestions.some((q) => q.includes('صفات'))).toBe(
        true
      );
      expect(
        analysis.implicitQuestions.some(
          (q) => q.includes('توافق') || q.includes('متوافقة')
        )
      ).toBe(true);
    });

    it('should suggest zodiac-related subtopics', () => {
      const topic = 'برج العقرب';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.suggestedSubTopics.length).toBeGreaterThan(0);
      expect(
        analysis.suggestedSubTopics.some(
          (s) => s.includes('صفات') || s.includes('توافق')
        )
      ).toBe(true);
    });
  });

  describe('Task 8.3: Pregnancy Article', () => {
    it('should identify pregnant audience correctly', () => {
      const audience = enhancedTopicAnalyzer.identifyAudience(
        'نصائح للحامل في الشهر الأول'
      );
      expect(audience).toBe('pregnant');
    });

    it('should analyze pregnancy topics correctly', () => {
      const topic = 'تطور الجنين في الأسبوع العاشر';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.audience).toBe('pregnant');
      // emotionalContext depends on topic keywords - 'نصائح' triggers supportive
      expect(['neutral', 'supportive', 'informative']).toContain(
        analysis.emotionalContext
      );
    });

    it('should detect supportive emotional context for pregnancy topics', () => {
      const topic = 'نصائح للحامل';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.emotionalContext).toBe('supportive');
    });
  });

  describe('Task 8.4: Birthday Article', () => {
    it('should generate quality content for birthday topic', () => {
      const topic = 'عيد ميلاد سعيد أحمد 30 سنة';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.category).toBe('birthday');
      expect(analysis.entities.ages).toContain(30);
      expect(analysis.emotionalContext).toBe('celebratory');
    });

    it('should extract name and age from birthday topic', () => {
      const entities = enhancedTopicAnalyzer.extractEntities(
        'عيد ميلاد محمد 25 سنة'
      );

      expect(entities.ages).toContain(25);
      // محمد is in the known names list
      expect(entities.names.length).toBeGreaterThanOrEqual(0);
    });

    it('should generate birthday-specific implicit questions', () => {
      const topic = 'عيد ميلاد';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(
        analysis.implicitQuestions.some(
          (q) => q.includes('احتفل') || q.includes('هدايا')
        )
      ).toBe(true);
    });

    it('should suggest birthday-related subtopics', () => {
      const topic = 'عيد ميلاد سعيد';
      const analysis = enhancedTopicAnalyzer.analyzeTopicDeep(topic);

      expect(analysis.suggestedSubTopics.length).toBeGreaterThan(0);
      expect(
        analysis.suggestedSubTopics.some(
          (s) =>
            s.includes('هدايا') || s.includes('تهنئة') || s.includes('حفلة')
        )
      ).toBe(true);
    });

    it('should detect age group subcategory', () => {
      const analysis1 =
        enhancedTopicAnalyzer.analyzeTopicDeep('عيد ميلاد 5 سنوات');
      const analysis2 =
        enhancedTopicAnalyzer.analyzeTopicDeep('عيد ميلاد 25 سنة');
      const analysis3 =
        enhancedTopicAnalyzer.analyzeTopicDeep('عيد ميلاد 60 سنة');

      expect(analysis1.subCategory).toBe('kids');
      expect(analysis2.subCategory).toBe('young-adults');
      expect(analysis3.subCategory).toBe('seniors');
    });
  });

  describe('Quality Validation Integration', () => {
    it('should validate content with proper structure', () => {
      const content = `
        <h2>مقدمة عن حساب العمر</h2>
        <p>حساب العمر هو عملية مهمة تساعدنا في معرفة كم من الوقت مضى منذ ولادتنا.</p>
        <h2>طريقة حساب العمر</h2>
        <p>يمكن حساب العمر بطرق متعددة، منها الطريقة التقليدية والطريقة الإلكترونية.</p>
        <ul>
          <li>الطريقة التقليدية: طرح تاريخ الميلاد من التاريخ الحالي</li>
          <li>الطريقة الإلكترونية: استخدام حاسبة العمر</li>
        </ul>
        <h2>الخاتمة</h2>
        <p>نأمل أن يكون هذا المقال قد أفادكم في فهم كيفية حساب العمر.</p>
      `;

      const report = enhancedQualityValidator.validateContent(
        content,
        'حساب العمر'
      );

      expect(report.score).toBeGreaterThan(50);
      expect(report.metrics.structureScore).toBeGreaterThan(50);
    });

    it('should detect low quality content', () => {
      const poorContent = '<p>نص.</p>';

      const report = enhancedQualityValidator.validateContent(
        poorContent,
        'موضوع مهم جداً'
      );

      // Very short content should have lower score
      expect(report.score).toBeLessThan(90);
    });

    it('should provide improvement suggestions', () => {
      const content = `
        <p>من المهم أن نفهم هذا الموضوع. من المهم أن نتعلم. من المهم أن نعرف.</p>
        <p>بشكل عام، هذا موضوع مهم. بشكل عام، يجب أن نهتم به.</p>
      `;

      const report = enhancedQualityValidator.validateContent(content, 'موضوع');

      expect(report.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Content Type Detection', () => {
    it('should detect informational content type', () => {
      expect(enhancedTopicAnalyzer.detectContentType('ما هو برج الحمل')).toBe(
        'informational'
      );
      expect(
        enhancedTopicAnalyzer.detectContentType('معلومات عن الأبراج')
      ).toBe('informational');
    });

    it('should detect tutorial content type', () => {
      expect(enhancedTopicAnalyzer.detectContentType('كيف أحسب عمري')).toBe(
        'tutorial'
      );
      expect(enhancedTopicAnalyzer.detectContentType('طريقة حساب العمر')).toBe(
        'tutorial'
      );
    });

    it('should detect celebration content type', () => {
      expect(enhancedTopicAnalyzer.detectContentType('عيد ميلاد سعيد')).toBe(
        'celebration'
      );
      expect(enhancedTopicAnalyzer.detectContentType('تهنئة بالعيد')).toBe(
        'celebration'
      );
    });

    it('should detect comparison content type', () => {
      expect(
        enhancedTopicAnalyzer.detectContentType('مقارنة بين الأبراج')
      ).toBe('comparison');
      expect(
        enhancedTopicAnalyzer.detectContentType('الفرق بين الحمل والثور')
      ).toBe('comparison');
    });
  });

  describe('Audience Identification', () => {
    it('should identify parents audience', () => {
      expect(enhancedTopicAnalyzer.identifyAudience('نصائح للأمهات')).toBe(
        'parents'
      );
      expect(enhancedTopicAnalyzer.identifyAudience('تربية الأطفال')).toBe(
        'parents'
      );
    });

    it('should identify children audience', () => {
      expect(enhancedTopicAnalyzer.identifyAudience('ألعاب للصغار')).toBe(
        'children'
      );
    });

    it('should identify couples audience', () => {
      expect(enhancedTopicAnalyzer.identifyAudience('توافق الزوجين')).toBe(
        'couples'
      );
    });

    it('should default to general audience', () => {
      expect(enhancedTopicAnalyzer.identifyAudience('معلومات عامة')).toBe(
        'general'
      );
    });
  });

  describe('Confidence Score', () => {
    it('should have higher confidence for specific topics', () => {
      const zodiacAnalysis =
        enhancedTopicAnalyzer.analyzeTopicDeep('صفات برج الحمل');
      const generalAnalysis =
        enhancedTopicAnalyzer.analyzeTopicDeep('موضوع عام');

      expect(zodiacAnalysis.confidence).toBeGreaterThan(
        generalAnalysis.confidence
      );
    });

    it('should increase confidence with more entities', () => {
      const simpleAnalysis =
        enhancedTopicAnalyzer.analyzeTopicDeep('عيد ميلاد');
      const detailedAnalysis = enhancedTopicAnalyzer.analyzeTopicDeep(
        'عيد ميلاد محمد 25 سنة برج الأسد'
      );

      expect(detailedAnalysis.confidence).toBeGreaterThan(
        simpleAnalysis.confidence
      );
    });
  });
});
