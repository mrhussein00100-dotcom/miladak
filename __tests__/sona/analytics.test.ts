/**
 * SONA v4 Analytics & Logging Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 19: Logging Completeness**
 * **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import {
  SONAAnalytics,
  SONALogger,
  sonaAnalytics,
  sonaLogger,
  DateRange,
  AnalyticsSummary,
} from '../../lib/sona/analytics';

// Mock the database functions
vi.mock('../../lib/sona/db', () => ({
  getTotalGenerations: vi.fn(async () => 150),
  getGenerationStats: vi.fn(async () => [
    {
      id: 1,
      date: new Date('2024-01-01'),
      total_generations: 50,
      successful_generations: 45,
      failed_generations: 5,
      avg_quality_score: 82.5,
      avg_generation_time: 1500,
      category_breakdown: { birthday: 20, zodiac: 15, health: 10, general: 5 },
      template_usage: { intro_1: 10, intro_2: 8, para_1: 15, para_2: 12 },
    },
    {
      id: 2,
      date: new Date('2024-01-02'),
      total_generations: 60,
      successful_generations: 55,
      failed_generations: 5,
      avg_quality_score: 85.0,
      avg_generation_time: 1400,
      category_breakdown: { birthday: 25, zodiac: 20, health: 10, general: 5 },
      template_usage: { intro_1: 12, intro_2: 10, para_1: 18, para_2: 15 },
    },
    {
      id: 3,
      date: new Date('2024-01-03'),
      total_generations: 40,
      successful_generations: 38,
      failed_generations: 2,
      avg_quality_score: 88.0,
      avg_generation_time: 1300,
      category_breakdown: { birthday: 15, zodiac: 12, health: 8, general: 5 },
      template_usage: { intro_1: 8, intro_3: 6, para_1: 12, para_3: 10 },
    },
  ]),
  getGenerationLogs: vi.fn(async () => [
    {
      id: 1,
      timestamp: new Date(),
      topic: 'عيد ميلاد أحمد',
      category: 'birthday',
      duration: 1500,
      quality_score: 85,
      word_count: 1000,
      success: true,
      retries: 0,
    },
    {
      id: 2,
      timestamp: new Date(),
      topic: 'برج الحمل',
      category: 'zodiac',
      duration: 1200,
      quality_score: 90,
      word_count: 1200,
      success: true,
      retries: 1,
    },
    {
      id: 3,
      timestamp: new Date(),
      topic: 'نصائح صحية',
      category: 'health',
      duration: 0,
      quality_score: 0,
      word_count: 0,
      success: false,
      retries: 3,
      error_message: 'Template not found',
    },
  ]),
  getErrorLogs: vi.fn(async () => [
    {
      id: 3,
      timestamp: new Date(),
      topic: 'نصائح صحية',
      category: 'health',
      duration: 0,
      quality_score: 0,
      word_count: 0,
      success: false,
      retries: 3,
      error_message: 'Template not found',
    },
  ]),
  logGeneration: vi.fn(async () => {}),
  getContentStats: vi.fn(async () => ({
    totalContent: 100,
    byCategory: { birthday: 40, zodiac: 30, health: 20, general: 10 },
    avgQualityScore: 85,
  })),
}));

describe('SONA Analytics Tests', () => {
  let analytics: SONAAnalytics;

  beforeEach(() => {
    analytics = new SONAAnalytics();
    analytics.clearCache();
  });

  describe('Basic Functionality - Requirements 18.3', () => {
    it('should create analytics instance', () => {
      expect(analytics).toBeDefined();
      expect(typeof analytics.getTotalGenerations).toBe('function');
      expect(typeof analytics.getAverageQualityScore).toBe('function');
      expect(typeof analytics.getCategoryDistribution).toBe('function');
    });

    it('should have singleton instance', () => {
      expect(sonaAnalytics).toBeDefined();
      expect(sonaAnalytics).toBeInstanceOf(SONAAnalytics);
    });
  });

  describe('Generation Statistics - Requirements 18.3', () => {
    it('should get total generations', async () => {
      const total = await analytics.getTotalGenerations();
      expect(total).toBeGreaterThanOrEqual(0);
    });

    it('should get total generations for period', async () => {
      const period: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const total = await analytics.getTotalGenerations(period);
      expect(total).toBeGreaterThanOrEqual(0);
    });

    it('should get average quality score', async () => {
      const avgScore = await analytics.getAverageQualityScore();
      expect(avgScore).toBeGreaterThanOrEqual(0);
      expect(avgScore).toBeLessThanOrEqual(100);
    });

    it('should get most used templates', async () => {
      const templates = await analytics.getMostUsedTemplates(5);
      expect(Array.isArray(templates)).toBe(true);

      for (const template of templates) {
        expect(template).toHaveProperty('templateId');
        expect(template).toHaveProperty('usageCount');
        expect(template).toHaveProperty('avgQualityScore');
      }
    });

    it('should get least used templates', async () => {
      const templates = await analytics.getLeastUsedTemplates(5);
      expect(Array.isArray(templates)).toBe(true);
    });

    it('should get category distribution', async () => {
      const distribution = await analytics.getCategoryDistribution();
      expect(Array.isArray(distribution)).toBe(true);

      for (const category of distribution) {
        expect(category).toHaveProperty('category');
        expect(category).toHaveProperty('count');
        expect(category).toHaveProperty('percentage');
        expect(category).toHaveProperty('avgQualityScore');
      }
    });
  });

  describe('Performance Statistics - Requirements 18.3', () => {
    it('should get average generation time', async () => {
      const avgTime = await analytics.getAverageGenerationTime();
      expect(avgTime).toBeGreaterThanOrEqual(0);
    });

    it('should get error rate', async () => {
      const errorRate = await analytics.getErrorRate();
      expect(errorRate).toBeGreaterThanOrEqual(0);
      expect(errorRate).toBeLessThanOrEqual(100);
    });

    it('should get retry rate', async () => {
      const retryRate = await analytics.getRetryRate();
      expect(retryRate).toBeGreaterThanOrEqual(0);
      expect(retryRate).toBeLessThanOrEqual(100);
    });
  });

  describe('Quality Analysis - Requirements 18.3, 18.4', () => {
    it('should get quality trend', async () => {
      const period: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const trend = await analytics.getQualityTrend(period);
      expect(Array.isArray(trend)).toBe(true);

      for (const point of trend) {
        expect(point).toHaveProperty('date');
        expect(point).toHaveProperty('avgQualityScore');
        expect(point).toHaveProperty('totalGenerations');
      }
    });

    it('should get low quality templates', async () => {
      const lowQuality = await analytics.getLowQualityTemplates();
      expect(Array.isArray(lowQuality)).toBe(true);

      for (const template of lowQuality) {
        expect(template).toHaveProperty('templateId');
        expect(template).toHaveProperty('avgQualityScore');
        expect(template).toHaveProperty('recommendation');
        expect(['keep', 'improve', 'remove']).toContain(
          template.recommendation
        );
      }
    });

    it('should get diversity score', async () => {
      const diversity = await analytics.getDiversityScore();
      expect(diversity).toBeGreaterThanOrEqual(0);
      expect(diversity).toBeLessThanOrEqual(100);
    });
  });

  describe('Summary & Reports - Requirements 18.3', () => {
    it('should get analytics summary', async () => {
      const summary = await analytics.getSummary();

      expect(summary).toHaveProperty('totalGenerations');
      expect(summary).toHaveProperty('successfulGenerations');
      expect(summary).toHaveProperty('failedGenerations');
      expect(summary).toHaveProperty('avgQualityScore');
      expect(summary).toHaveProperty('avgGenerationTime');
      expect(summary).toHaveProperty('topCategories');
      expect(summary).toHaveProperty('topTemplates');
      expect(summary).toHaveProperty('recentTrend');

      expect(['improving', 'stable', 'declining']).toContain(
        summary.recentTrend
      );
    });

    it('should get summary for specific period', async () => {
      const period: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const summary = await analytics.getSummary(period);

      expect(summary).toHaveProperty('totalGenerations');
      expect(summary.totalGenerations).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cache Management', () => {
    it('should cache results', async () => {
      // First call
      const total1 = await analytics.getTotalGenerations();
      // Second call should use cache
      const total2 = await analytics.getTotalGenerations();

      expect(total1).toBe(total2);
    });

    it('should clear cache', async () => {
      await analytics.getTotalGenerations();
      analytics.clearCache();
      // Should not throw
      const total = await analytics.getTotalGenerations();
      expect(total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Property-Based Tests', () => {
    it('should always return valid summary structure', async () => {
      const summary = await analytics.getSummary();

      expect(typeof summary.totalGenerations).toBe('number');
      expect(typeof summary.successfulGenerations).toBe('number');
      expect(typeof summary.failedGenerations).toBe('number');
      expect(typeof summary.avgQualityScore).toBe('number');
      expect(typeof summary.avgGenerationTime).toBe('number');
      expect(Array.isArray(summary.topCategories)).toBe(true);
      expect(Array.isArray(summary.topTemplates)).toBe(true);
      expect(typeof summary.recentTrend).toBe('string');
    });

    it('should handle any date range', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
          fc.date({ min: new Date('2020-01-02'), max: new Date('2025-12-31') }),
          async (date1, date2) => {
            const startDate = date1 < date2 ? date1 : date2;
            const endDate = date1 < date2 ? date2 : date1;

            const period: DateRange = {
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
            };

            const total = await analytics.getTotalGenerations(period);
            expect(typeof total).toBe('number');
            expect(total).toBeGreaterThanOrEqual(0);

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});

describe('SONA Logger Tests', () => {
  let logger: SONALogger;

  beforeEach(() => {
    logger = new SONALogger();
    logger.clearLogs();
  });

  describe('Basic Functionality - Requirements 18.1, 18.2', () => {
    it('should create logger instance', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.logGeneration).toBe('function');
      expect(typeof logger.logError).toBe('function');
    });

    it('should have singleton instance', () => {
      expect(sonaLogger).toBeDefined();
      expect(sonaLogger).toBeInstanceOf(SONALogger);
    });
  });

  describe('Property 19: Logging Completeness - Requirements 18.1', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 19: Logging Completeness**
     * **Validates: Requirements 18.1**
     *
     * For any generation operation, all relevant metadata
     * (duration, templates, quality) should be logged
     */

    it('should log generation with all metadata', async () => {
      await logger.logGeneration({
        topic: 'عيد ميلاد أحمد',
        category: 'birthday',
        duration: 1500,
        qualityScore: 85,
        templatesUsed: ['intro_1', 'para_1', 'conclusion_1'],
        wordCount: 1000,
        success: true,
      });

      const logs = await logger.getRecentLogs(1);
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe('info');
      expect(logs[0].message).toContain('عيد ميلاد أحمد');
    });

    it('should log failed generation', async () => {
      await logger.logGeneration({
        topic: 'موضوع فاشل',
        category: 'general',
        duration: 500,
        qualityScore: 0,
        templatesUsed: [],
        wordCount: 0,
        success: false,
        errorMessage: 'Template not found',
      });

      const logs = await logger.getRecentLogs(1);
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe('error');
    });

    it('should log errors with context', async () => {
      const error = new Error('Test error');
      await logger.logError(error, {
        topic: 'موضوع الخطأ',
        category: 'birthday',
        templateId: 'intro_1',
      });

      const logs = await logger.getRecentLogs(1);
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe('error');
      expect(logs[0].message).toBe('Test error');
    });

    it('should log template usage', async () => {
      await logger.logTemplateUsage('intro_birthday_1');

      const logs = await logger.getRecentLogs(1);
      expect(logs.length).toBe(1);
      expect(logs[0].message).toContain('intro_birthday_1');
    });
  });

  describe('Log Retrieval - Requirements 18.3', () => {
    it('should get recent logs', async () => {
      // Add some logs
      for (let i = 0; i < 5; i++) {
        await logger.logGeneration({
          topic: `موضوع ${i}`,
          category: 'general',
          duration: 1000,
          qualityScore: 80,
          templatesUsed: [],
          wordCount: 500,
          success: true,
        });
      }

      const logs = await logger.getRecentLogs(3);
      expect(logs.length).toBe(3);
    });

    it('should get database logs', async () => {
      const logs = await logger.getDatabaseLogs(10);
      expect(Array.isArray(logs)).toBe(true);
    });

    it('should get error logs', async () => {
      const logs = await logger.getErrorLogs(10);
      expect(Array.isArray(logs)).toBe(true);
    });
  });

  describe('Log Export - Requirements 18.5', () => {
    it('should export logs as JSON', async () => {
      const period: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const json = await logger.exportLogs(period, 'json');
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should export logs as CSV', async () => {
      const period: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const csv = await logger.exportLogs(period, 'csv');
      expect(typeof csv).toBe('string');
      // Should have header row
      expect(csv).toContain('التاريخ');
    });
  });

  describe('Log Management', () => {
    it('should clear logs', async () => {
      await logger.logGeneration({
        topic: 'موضوع',
        category: 'general',
        duration: 1000,
        qualityScore: 80,
        templatesUsed: [],
        wordCount: 500,
        success: true,
      });

      logger.clearLogs();
      const logs = await logger.getRecentLogs(10);
      expect(logs.length).toBe(0);
    });

    it('should limit log entries', async () => {
      // Add many logs
      for (let i = 0; i < 1100; i++) {
        await logger.logTemplateUsage(`template_${i}`);
      }

      const logs = await logger.getRecentLogs(2000);
      expect(logs.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Property-Based Tests', () => {
    it('should always create valid log entries', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.stringMatching(/^[a-zA-Z0-9\u0600-\u06FF]{1,50}$/),
          fc.integer({ min: 0, max: 10000 }),
          fc.integer({ min: 0, max: 100 }),
          async (topic, duration, qualityScore) => {
            logger.clearLogs();

            await logger.logGeneration({
              topic,
              category: 'general',
              duration,
              qualityScore,
              templatesUsed: [],
              wordCount: 500,
              success: true,
            });

            const logs = await logger.getRecentLogs(1);
            expect(logs.length).toBe(1);
            expect(logs[0]).toHaveProperty('id');
            expect(logs[0]).toHaveProperty('timestamp');
            expect(logs[0]).toHaveProperty('level');
            expect(logs[0]).toHaveProperty('message');

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle Arabic text in logs', async () => {
      await logger.logGeneration({
        topic: 'مقال عن الأبراج الفلكية والتنجيم',
        category: 'zodiac',
        duration: 1500,
        qualityScore: 90,
        templatesUsed: ['مقدمة_1', 'فقرة_2'],
        wordCount: 1200,
        success: true,
      });

      const logs = await logger.getRecentLogs(1);
      expect(logs[0].message).toContain('الأبراج');
    });

    it('should handle empty topic', async () => {
      await logger.logGeneration({
        topic: '',
        category: 'general',
        duration: 0,
        qualityScore: 0,
        templatesUsed: [],
        wordCount: 0,
        success: false,
      });

      const logs = await logger.getRecentLogs(1);
      expect(logs.length).toBe(1);
    });

    it('should handle very long topic', async () => {
      const longTopic = 'أ'.repeat(1000);
      await logger.logGeneration({
        topic: longTopic,
        category: 'general',
        duration: 1000,
        qualityScore: 80,
        templatesUsed: [],
        wordCount: 500,
        success: true,
      });

      const logs = await logger.getRecentLogs(1);
      expect(logs.length).toBe(1);
    });
  });
});
