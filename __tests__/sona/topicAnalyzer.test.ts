/**
 * SONA v4 Topic Analyzer Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 10: Contextual Personalization**
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { TopicAnalyzer, topicAnalyzer } from '../../lib/sona/topicAnalyzer';
import { TopicCategory } from '../../lib/sona/types';

// Arabic zodiac signs for testing
const ZODIAC_SIGNS = [
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
  'الحوت',
];

// Sample Arabic names
const ARABIC_NAMES = [
  'محمد',
  'أحمد',
  'فاطمة',
  'عائشة',
  'علي',
  'خالد',
  'نورة',
  'سارة',
];

describe('Topic Analyzer Tests', () => {
  describe('Basic Functionality', () => {
    it('should create analyzer instance', () => {
      const analyzer = new TopicAnalyzer();
      expect(analyzer).toBeDefined();
      expect(typeof analyzer.analyze).toBe('function');
    });

    it('should return valid analysis structure', () => {
      const result = topicAnalyzer.analyze('موضوع عام للاختبار');

      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('extractedEntities');
      expect(result).toHaveProperty('keywords');
      expect(result).toHaveProperty('suggestedSections');
      expect(result).toHaveProperty('tone');
      expect(result).toHaveProperty('confidence');
    });
  });

  describe('Property 10: Contextual Personalization - Names', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 10: Contextual Personalization**
     * **Validates: Requirements 4.1**
     *
     * For any topic containing a person's name pattern,
     * the analyzer should extract that name
     */

    it('should extract names from birthday topics', () => {
      fc.assert(
        fc.property(fc.constantFrom(...ARABIC_NAMES), (name) => {
          const topic = `عيد ميلاد ${name} السعيد`;
          const result = topicAnalyzer.analyze(topic);

          // The name should be in extracted entities or keywords
          const hasName =
            result.extractedEntities.names.some((n) => n.includes(name)) ||
            result.extractedEntities.keywords.some((k) => k.includes(name));

          expect(hasName).toBe(true);
          return true;
        }),
        { numRuns: ARABIC_NAMES.length }
      );
    });
  });

  describe('Zodiac Sign Detection - Requirements 4.3', () => {
    /**
     * For any topic containing a zodiac sign,
     * the analyzer should detect it and categorize as 'zodiac'
     */

    it('should detect zodiac signs and categorize correctly', () => {
      fc.assert(
        fc.property(fc.constantFrom(...ZODIAC_SIGNS), (sign) => {
          const topic = `صفات برج ${sign} وتوافقه مع الأبراج الأخرى`;
          const result = topicAnalyzer.analyze(topic);

          expect(result.category).toBe('zodiac');
          expect(result.extractedEntities.zodiacSigns).toContain(sign);
          return true;
        }),
        { numRuns: ZODIAC_SIGNS.length }
      );
    });

    it('should include zodiac sign in keywords', () => {
      fc.assert(
        fc.property(fc.constantFrom(...ZODIAC_SIGNS), (sign) => {
          const topic = `توقعات برج ${sign} لهذا الشهر`;
          const result = topicAnalyzer.analyze(topic);

          // Keywords should include the zodiac sign or related terms
          const hasZodiacKeyword = result.keywords.some(
            (k) => k.includes(sign) || k.includes('برج')
          );
          expect(hasZodiacKeyword).toBe(true);
          return true;
        }),
        { numRuns: ZODIAC_SIGNS.length }
      );
    });
  });

  describe('Age Detection - Requirements 4.4', () => {
    /**
     * For any topic containing an age,
     * the analyzer should extract it correctly
     */

    it('should extract ages from topics', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (age) => {
          const topic = `عيد ميلاد ${age} سنة`;
          const result = topicAnalyzer.analyze(topic);

          expect(result.extractedEntities.ages).toContain(age);
          return true;
        }),
        { numRuns: 20 }
      );
    });

    it('should detect birthday category when age is present', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (age) => {
          const topic = `احتفال عيد ميلاد عمر ${age} سنة`;
          const result = topicAnalyzer.analyze(topic);

          expect(result.category).toBe('birthday');
          return true;
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('Date Detection - Requirements 4.2', () => {
    /**
     * For any topic containing a date,
     * the analyzer should extract it
     */

    it('should extract dates in various formats', () => {
      const dateTopics = [
        { topic: 'أحداث يوم 15 يناير 2024', expected: true },
        { topic: 'ماذا حدث في 1/1/2024', expected: true },
        { topic: 'تاريخ 25-12-2023', expected: true },
      ];

      dateTopics.forEach(({ topic, expected }) => {
        const result = topicAnalyzer.analyze(topic);
        expect(result.extractedEntities.dates.length > 0).toBe(expected);
      });
    });

    it('should categorize date-related topics correctly', () => {
      const topic = 'تحويل التاريخ من هجري إلى gregorian';
      const result = topicAnalyzer.analyze(topic);

      expect(result.category).toBe('dates');
    });
  });

  describe('Category Detection', () => {
    it('should detect birthday category', () => {
      const birthdayTopics = [
        'عيد ميلاد سعيد',
        'أفكار هدايا عيد الميلاد',
        'تهنئة بمناسبة الميلاد',
        'كيك عيد ميلاد',
      ];

      birthdayTopics.forEach((topic) => {
        const result = topicAnalyzer.analyze(topic);
        expect(result.category).toBe('birthday');
      });
    });

    it('should detect health category', () => {
      const healthTopics = [
        'نصائح صحية للحياة',
        'فوائد الرياضة للصحة',
        'التغذية السليمة',
        'علاج الأمراض الشائعة',
      ];

      healthTopics.forEach((topic) => {
        const result = topicAnalyzer.analyze(topic);
        expect(result.category).toBe('health');
      });
    });

    it('should default to general for unclear topics', () => {
      const generalTopics = ['موضوع عام', 'معلومات متنوعة', 'أفكار جديدة'];

      generalTopics.forEach((topic) => {
        const result = topicAnalyzer.analyze(topic);
        expect(result.category).toBe('general');
      });
    });
  });

  describe('Suggested Sections', () => {
    it('should suggest appropriate sections for each category', () => {
      const categories: TopicCategory[] = [
        'birthday',
        'zodiac',
        'health',
        'dates',
        'general',
      ];

      categories.forEach((category) => {
        let topic: string;
        switch (category) {
          case 'birthday':
            topic = 'عيد ميلاد سعيد';
            break;
          case 'zodiac':
            topic = 'برج الحمل';
            break;
          case 'health':
            topic = 'نصائح صحية';
            break;
          case 'dates':
            topic = 'تحويل التاريخ';
            break;
          default:
            topic = 'موضوع عام';
        }

        const result = topicAnalyzer.analyze(topic);

        expect(result.suggestedSections.length).toBeGreaterThan(0);
        expect(result.suggestedSections).toContain('introduction');
        expect(result.suggestedSections).toContain('conclusion');
      });
    });
  });

  describe('Confidence Score', () => {
    it('should return confidence between 0 and 1', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 5, maxLength: 100 }), (topic) => {
          const result = topicAnalyzer.analyze(topic);

          expect(result.confidence).toBeGreaterThanOrEqual(0);
          expect(result.confidence).toBeLessThanOrEqual(1);
          return true;
        }),
        { numRuns: 20 }
      );
    });

    it('should have higher confidence for specific topics', () => {
      const specificTopic = 'صفات برج الأسد وتوافقه مع برج الحمل';
      const generalTopic = 'موضوع عام';

      const specificResult = topicAnalyzer.analyze(specificTopic);
      const generalResult = topicAnalyzer.analyze(generalTopic);

      expect(specificResult.confidence).toBeGreaterThan(
        generalResult.confidence
      );
    });
  });

  describe('Tone Detection', () => {
    it('should detect appropriate tone', () => {
      const formalTopic = 'دراسة علمية عن الصحة';
      const friendlyTopic = 'احتفال عيد ميلاد ممتع';

      const formalResult = topicAnalyzer.analyze(formalTopic);
      const friendlyResult = topicAnalyzer.analyze(friendlyTopic);

      expect(formalResult.tone).toBe('formal');
      expect(friendlyResult.tone).toBe('friendly');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = topicAnalyzer.analyze('');

      expect(result.category).toBe('general');
      expect(result.extractedEntities.names).toHaveLength(0);
    });

    it('should handle very long topics', () => {
      const longTopic = 'عيد ميلاد '.repeat(100);
      const result = topicAnalyzer.analyze(longTopic);

      expect(result.category).toBe('birthday');
    });

    it('should handle mixed Arabic and English', () => {
      const mixedTopic = 'Happy Birthday عيد ميلاد سعيد';
      const result = topicAnalyzer.analyze(mixedTopic);

      expect(result.category).toBe('birthday');
    });
  });
});
