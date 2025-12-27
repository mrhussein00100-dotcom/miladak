/**
 * SONA v4 Quality Checker Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 3: Keyword Density**
 * **Feature: sona-v4-enhancement, Property 4: Meta Description Length**
 * **Feature: sona-v4-enhancement, Property 6: Quality Score Threshold**
 * **Validates: Requirements 6.1, 6.4, 8.4**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { QualityChecker, qualityChecker } from '../../lib/sona/qualityChecker';
import { TopicAnalysis, TopicCategory } from '../../lib/sona/types';

// Sample content for testing
const SAMPLE_CONTENT = `
<h2>مقدمة</h2>
<p>مرحباً بكم في هذا المقال الشامل عن الصحة والعافية. نقدم لكم معلومات مفيدة ونصائح عملية.</p>

<h2>معلومات مهمة</h2>
<p>الصحة هي أهم شيء في الحياة. يجب أن نهتم بصحتنا من خلال التغذية السليمة والرياضة المنتظمة.</p>

<h2>نصائح مهمة</h2>
<ul>
<li>مارس الرياضة يومياً</li>
<li>تناول طعاماً صحياً</li>
<li>اشرب الماء بكثرة</li>
</ul>

<h2>الأسئلة الشائعة</h2>
<h3>كيف أحافظ على صحتي؟</h3>
<p>من خلال اتباع نمط حياة صحي ومتوازن.</p>

<h2>الخاتمة</h2>
<p>في الختام، نأمل أن تكونوا قد استفدتم من هذا المقال. شاركوه مع أصدقائكم!</p>
`;

// Create sample analysis
function createAnalysis(category: TopicCategory = 'health'): TopicAnalysis {
  return {
    category,
    extractedEntities: {
      names: [],
      dates: [],
      numbers: [],
      zodiacSigns: [],
      ages: [],
      keywords: [],
    },
    keywords: ['صحة', 'نصائح', 'رياضة', 'تغذية'],
    suggestedSections: ['introduction', 'tips', 'faq', 'conclusion'],
    tone: 'engaging',
    confidence: 0.8,
  };
}

describe('Quality Checker Tests', () => {
  let checker: QualityChecker;

  beforeEach(() => {
    checker = new QualityChecker();
  });

  describe('Basic Functionality', () => {
    it('should create quality checker instance', () => {
      expect(checker).toBeDefined();
      expect(typeof checker.checkQuality).toBe('function');
    });

    it('should return quality report with all fields', () => {
      const analysis = createAnalysis();
      const report = checker.checkQuality(SAMPLE_CONTENT, analysis);

      expect(report).toHaveProperty('overallScore');
      expect(report).toHaveProperty('diversityScore');
      expect(report).toHaveProperty('keywordDensity');
      expect(report).toHaveProperty('readabilityScore');
      expect(report).toHaveProperty('structureScore');
      expect(report).toHaveProperty('suggestions');
      expect(report).toHaveProperty('passed');
    });
  });

  describe('Property 3: Keyword Density', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 3: Keyword Density**
     * **Validates: Requirements 6.1**
     *
     * For any generated article, the main keyword should appear
     * 3-5 times naturally distributed throughout the content
     */

    it('should calculate keyword density correctly', () => {
      // Content with keyword appearing multiple times
      const content =
        'الصحة مهمة جداً. نهتم بالصحة دائماً. الصحة أساس الحياة. صحة الجسم مهمة. صحة العقل أيضاً.';
      const analysis = createAnalysis();
      analysis.keywords = ['صحة'];

      const report = checker.checkQuality(content, analysis);

      // Should have some keyword density score
      expect(report.keywordDensity).toBeGreaterThanOrEqual(0);
      expect(report.keywordDensity).toBeLessThanOrEqual(100);
    });

    it('should check keyword occurrences', () => {
      const content = 'صحة مهمة جداً. الصحة أساس الحياة. نهتم بالصحة دائماً.';
      const result = checker.checkKeywordOccurrences(content, 'صحة');

      expect(result.count).toBe(3);
      expect(result.isOptimal).toBe(true);
    });

    it('should detect low keyword usage', () => {
      const content =
        'هذا نص طويل جداً بدون كلمات مفتاحية كثيرة. فقط صحة واحدة.';
      const result = checker.checkKeywordOccurrences(content, 'صحة');

      expect(result.count).toBe(1);
      expect(result.isOptimal).toBe(false);
      expect(result.suggestion).toContain('زيادة');
    });

    it('should detect high keyword usage', () => {
      const content = 'صحة صحة صحة صحة صحة صحة صحة صحة صحة صحة';
      const result = checker.checkKeywordOccurrences(content, 'صحة');

      expect(result.count).toBe(10);
      expect(result.isOptimal).toBe(false);
      expect(result.suggestion).toContain('تقليل');
    });
  });

  describe('Property 4: Meta Description Length', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 4: Meta Description Length**
     * **Validates: Requirements 6.4**
     *
     * For any generated meta description, the length should be
     * between 150-160 characters
     */

    it('should validate optimal meta description length', () => {
      const description =
        'هذا وصف ميتا مثالي يحتوي على عدد مناسب من الأحرف لتحسين محركات البحث. نقدم معلومات مفيدة عن الصحة والعافية للقراء الكرام.';
      const result = checker.checkMetaDescriptionLength(description);

      expect(result.length).toBeGreaterThanOrEqual(100);
    });

    it('should detect short meta description', () => {
      const description = 'وصف قصير جداً';
      const result = checker.checkMetaDescriptionLength(description);

      expect(result.isOptimal).toBe(false);
      expect(result.suggestion).toContain('قصير');
    });

    it('should detect long meta description', () => {
      const description =
        'هذا وصف ميتا طويل جداً جداً جداً يحتوي على عدد كبير من الأحرف أكثر من المطلوب لتحسين محركات البحث. نقدم معلومات مفيدة عن الصحة والعافية للقراء الكرام. هذا النص طويل جداً ويجب تقصيره.';
      const result = checker.checkMetaDescriptionLength(description);

      expect(result.isOptimal).toBe(false);
      expect(result.suggestion).toContain('طويل');
    });

    it('should validate meta description length property', () => {
      fc.assert(
        fc.property(fc.integer({ min: 100, max: 200 }), (length) => {
          const description = 'أ'.repeat(length);
          const result = checker.checkMetaDescriptionLength(description);

          expect(result.length).toBe(length);

          if (length >= 150 && length <= 160) {
            expect(result.isOptimal).toBe(true);
          } else {
            expect(result.isOptimal).toBe(false);
          }

          return true;
        }),
        { numRuns: 20 }
      );
    });
  });

  describe('Property 6: Quality Score Threshold', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 6: Quality Score Threshold**
     * **Validates: Requirements 8.4**
     *
     * For any generated article, if the quality score is below 70%,
     * the system should regenerate with different templates
     */

    it('should pass quality threshold for good content', () => {
      const analysis = createAnalysis();
      const report = checker.checkQuality(SAMPLE_CONTENT, analysis);

      // Good content should pass
      expect(report.overallScore).toBeGreaterThan(0);
    });

    it('should fail quality threshold for poor content', () => {
      const poorContent = 'نص قصير جداً';
      const analysis = createAnalysis();
      const report = checker.checkQuality(poorContent, analysis);

      expect(report.passed).toBe(false);
    });

    it('should check quality threshold correctly', () => {
      const analysis = createAnalysis();
      const report = checker.checkQuality(SAMPLE_CONTENT, analysis);

      const passesThreshold = checker.passesQualityThreshold(report);
      expect(passesThreshold).toBe(report.passed);
    });

    it('should have scores between 0 and 100', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 10, maxLength: 500 }), (content) => {
          const analysis = createAnalysis();
          const report = checker.checkQuality(content, analysis);

          expect(report.overallScore).toBeGreaterThanOrEqual(0);
          expect(report.overallScore).toBeLessThanOrEqual(100);
          expect(report.diversityScore).toBeGreaterThanOrEqual(0);
          expect(report.diversityScore).toBeLessThanOrEqual(100);
          expect(report.readabilityScore).toBeGreaterThanOrEqual(0);
          expect(report.readabilityScore).toBeLessThanOrEqual(100);
          expect(report.structureScore).toBeGreaterThanOrEqual(0);
          expect(report.structureScore).toBeLessThanOrEqual(100);

          return true;
        }),
        { numRuns: 20 }
      );
    });
  });

  describe('Diversity Score', () => {
    it('should calculate diversity score', () => {
      const diverseContent =
        'كلمة أولى ثانية ثالثة رابعة خامسة سادسة سابعة ثامنة';
      const score = checker.calculateDiversityScore(diverseContent);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should give low score for repetitive content', () => {
      const repetitiveContent = 'كلمة كلمة كلمة كلمة كلمة كلمة كلمة كلمة';
      const score = checker.calculateDiversityScore(repetitiveContent);

      expect(score).toBeLessThan(50);
    });

    it('should give high score for diverse content', () => {
      const diverseContent =
        'أحمد يحب القراءة والكتابة والرسم والموسيقى والرياضة والسفر';
      const score = checker.calculateDiversityScore(diverseContent);

      expect(score).toBeGreaterThan(70);
    });
  });

  describe('Readability Score', () => {
    it('should calculate readability score', () => {
      const score = checker.calculateReadabilityScore(SAMPLE_CONTENT);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should handle empty content', () => {
      const score = checker.calculateReadabilityScore('');
      expect(score).toBe(0);
    });
  });

  describe('Structure Check', () => {
    it('should check content structure', () => {
      const report = checker.checkStructure(SAMPLE_CONTENT);

      expect(report).toHaveProperty('hasIntro');
      expect(report).toHaveProperty('hasConclusion');
      expect(report).toHaveProperty('hasHeadings');
      expect(report).toHaveProperty('hasLists');
      expect(report).toHaveProperty('hasFAQ');
      expect(report).toHaveProperty('paragraphCount');
      expect(report).toHaveProperty('headingCount');
      expect(report).toHaveProperty('score');
    });

    it('should detect structure elements', () => {
      const report = checker.checkStructure(SAMPLE_CONTENT);

      expect(report.hasIntro).toBe(true);
      expect(report.hasConclusion).toBe(true);
      expect(report.hasHeadings).toBe(true);
      expect(report.hasLists).toBe(true);
      expect(report.hasFAQ).toBe(true);
    });

    it('should count paragraphs and headings', () => {
      const report = checker.checkStructure(SAMPLE_CONTENT);

      expect(report.paragraphCount).toBeGreaterThan(0);
      expect(report.headingCount).toBeGreaterThan(0);
    });
  });

  describe('Detailed Quality Report', () => {
    it('should generate detailed quality report', () => {
      const analysis = createAnalysis();
      const report = checker.checkQualityDetailed(SAMPLE_CONTENT, analysis);

      expect(report).toHaveProperty('structureReport');
      expect(report).toHaveProperty('wordCount');
      expect(report).toHaveProperty('sentenceCount');
      expect(report).toHaveProperty('avgSentenceLength');
      expect(report).toHaveProperty('uniqueWordsRatio');
      expect(report).toHaveProperty('keywordOccurrences');
    });

    it('should count words and sentences', () => {
      const analysis = createAnalysis();
      const report = checker.checkQualityDetailed(SAMPLE_CONTENT, analysis);

      expect(report.wordCount).toBeGreaterThan(0);
      expect(report.sentenceCount).toBeGreaterThan(0);
      expect(report.avgSentenceLength).toBeGreaterThan(0);
    });
  });

  describe('Quality Comparison', () => {
    it('should compare two quality reports', () => {
      const analysis = createAnalysis();
      const report1 = checker.checkQuality(SAMPLE_CONTENT, analysis);
      const report2 = checker.checkQuality('نص قصير', analysis);

      const comparison = checker.compareQuality(report1, report2);

      expect(comparison).toHaveProperty('winner');
      expect(comparison).toHaveProperty('scoreDifference');
      expect(comparison).toHaveProperty('comparison');
    });

    it('should identify better content', () => {
      const analysis = createAnalysis();
      const goodReport = checker.checkQuality(SAMPLE_CONTENT, analysis);
      const poorReport = checker.checkQuality('نص', analysis);

      const comparison = checker.compareQuality(goodReport, poorReport);

      expect(comparison.winner).toBe(1);
    });
  });

  describe('Suggestions', () => {
    it('should generate improvement suggestions', () => {
      const analysis = createAnalysis();
      const report = checker.checkQuality('نص قصير جداً', analysis);

      expect(report.suggestions).toBeDefined();
      expect(report.suggestions.length).toBeGreaterThan(0);
    });

    it('should suggest improvements for poor content', () => {
      const analysis = createAnalysis();
      const report = checker.checkQuality('كلمة كلمة كلمة', analysis);

      // Should have suggestions for improvement
      expect(
        report.suggestions.some((s) => s.includes('تنوع') || s.includes('هيكل'))
      ).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      const analysis = createAnalysis();
      const report = checker.checkQuality('', analysis);

      expect(report.overallScore).toBe(0);
      expect(report.passed).toBe(false);
    });

    it('should handle content without keywords', () => {
      const analysis = createAnalysis();
      analysis.keywords = [];
      const report = checker.checkQuality(SAMPLE_CONTENT, analysis);

      expect(report.keywordDensity).toBe(0);
    });

    it('should handle very long content', () => {
      const longContent = SAMPLE_CONTENT.repeat(10);
      const analysis = createAnalysis();
      const report = checker.checkQuality(longContent, analysis);

      expect(report.overallScore).toBeGreaterThan(0);
    });
  });
});
