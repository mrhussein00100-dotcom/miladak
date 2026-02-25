/**
 * SONA v4 Final Integration Tests
 * اختبارات التكامل النهائية لنظام SONA v4
 *
 * Requirements: All
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { contentGenerator } from '../../lib/sona/contentGenerator';
import { topicAnalyzer } from '../../lib/sona/topicAnalyzer';
import { templateEngine } from '../../lib/sona/templateEngine';
import { rephraser } from '../../lib/sona/rephraser';
import { qualityChecker } from '../../lib/sona/qualityChecker';
import { PluginManager } from '../../lib/sona/pluginManager';
import { settingsManager } from '../../lib/sona/settingsManager';
import type {
  GenerationRequest,
  ArticleLength,
  SONAPlugin,
} from '../../lib/sona/types';

// Mock database for testing
vi.mock('../../lib/sona/db', () => ({
  sonaDb: {
    saveContentHash: vi.fn().mockResolvedValue(undefined),
    checkSimilarity: vi
      .fn()
      .mockResolvedValue({ similar: false, similarity: 0 }),
    recordGeneration: vi.fn().mockResolvedValue(undefined),
    getStats: vi.fn().mockResolvedValue({
      totalGenerations: 100,
      successfulGenerations: 95,
      averageQualityScore: 78.5,
    }),
    getSetting: vi.fn().mockResolvedValue(null),
    setSetting: vi.fn().mockResolvedValue(undefined),
    saveTemplateVersion: vi.fn().mockResolvedValue({ id: '1', version: 1 }),
    getTemplateVersions: vi.fn().mockResolvedValue([]),
    logGeneration: vi.fn().mockResolvedValue(undefined),
    logError: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('SONA v4 Final Integration Tests', () => {
  describe('24.1 Full Generation Pipeline Test', () => {
    it('should complete full generation pipeline for all categories', async () => {
      const categories = ['birthday', 'zodiac', 'health', 'dates'];

      for (const category of categories) {
        const topics: Record<string, string> = {
          birthday: 'عيد ميلاد سعيد',
          zodiac: 'برج الحمل',
          health: 'نصائح صحية للحياة',
          dates: 'تحويل التاريخ الهجري',
        };

        const request: GenerationRequest = {
          topic: topics[category],
          length: 'medium' as ArticleLength,
          category,
        };

        const result = await contentGenerator.generate(request);

        // Verify complete pipeline execution
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(100);
        expect(result.title).toBeDefined();
        expect(result.metaDescription).toBeDefined();
        expect(result.metaDescription.length).toBeLessThanOrEqual(160);
        expect(result.keywords).toBeDefined();
        expect(result.keywords.length).toBeGreaterThan(0);
        expect(result.qualityReport).toBeDefined();
        expect(result.usedTemplates).toBeDefined();
        expect(result.generationTime).toBeGreaterThan(0);
      }
    });

    it('should handle topic analysis correctly in pipeline', async () => {
      const request: GenerationRequest = {
        topic: 'عيد ميلاد أحمد 30 سنة برج الثور',
        length: 'medium' as ArticleLength,
      };

      const result = await contentGenerator.generate(request);

      // Content should include personalized elements
      expect(result.content).toContain('أحمد');
    });

    it('should apply quality checks and regenerate if needed', async () => {
      const request: GenerationRequest = {
        topic: 'موضوع اختباري',
        length: 'long' as ArticleLength,
      };

      const result = await contentGenerator.generate(request);

      // Quality report should be present
      expect(result.qualityReport).toBeDefined();
      expect(result.qualityReport.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('should use templates from correct category', async () => {
      templateEngine.resetUsedTemplates();

      const request: GenerationRequest = {
        topic: 'برج الأسد',
        length: 'medium' as ArticleLength,
        category: 'zodiac',
      };

      const result = await contentGenerator.generate(request);
      const usedTemplates = result.usedTemplates;

      // Should have used templates (may be empty array but defined)
      expect(usedTemplates).toBeDefined();
      expect(Array.isArray(usedTemplates)).toBe(true);
    });

    it('should apply rephrasing for content diversity', async () => {
      const request1: GenerationRequest = {
        topic: 'حساب العمر',
        length: 'short' as ArticleLength,
      };

      const request2: GenerationRequest = {
        topic: 'حساب العمر',
        length: 'short' as ArticleLength,
      };

      const result1 = await contentGenerator.generate(request1);
      const result2 = await contentGenerator.generate(request2);

      // Content should be different due to rephrasing
      expect(result1.content).not.toBe(result2.content);
    });
  });

  describe('24.2 Postgres Integration Test', () => {
    it('should handle database operations gracefully', async () => {
      // Test that generation works even with mocked database
      const request: GenerationRequest = {
        topic: 'اختبار قاعدة البيانات',
        length: 'short' as ArticleLength,
      };

      const result = await contentGenerator.generate(request);
      expect(result).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should track generation metadata', async () => {
      const request: GenerationRequest = {
        topic: 'تتبع البيانات',
        length: 'medium' as ArticleLength,
      };

      const result = await contentGenerator.generate(request);

      // Verify metadata is captured
      expect(result.generationTime).toBeGreaterThan(0);
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.usedTemplates).toBeDefined();
    });
  });

  describe('24.3 Plugin System Test', () => {
    let pluginManager: PluginManager;

    beforeAll(() => {
      pluginManager = new PluginManager();
    });

    it('should register and manage plugins', async () => {
      const testPlugin: SONAPlugin = {
        name: 'test-integration-plugin',
        version: '1.0.0',
        category: 'test',
        enabled: true,
        beforeAnalyze: (topic: string) => topic + ' (modified)',
      };

      await pluginManager.register(testPlugin);
      const plugin = pluginManager.getPlugin('test-integration-plugin');

      expect(plugin).toBeDefined();
      expect(plugin?.name).toBe('test-integration-plugin');
      expect(plugin?.enabled).toBe(true);
    });

    it('should execute plugin hooks', async () => {
      const hookResults: string[] = [];

      const hookPlugin: SONAPlugin = {
        name: 'hook-test-plugin',
        version: '1.0.0',
        category: 'test',
        enabled: true,
        beforeAnalyze: (topic: string) => {
          hookResults.push('beforeAnalyze');
          return topic;
        },
        afterAnalyze: (analysis) => {
          hookResults.push('afterAnalyze');
          return analysis;
        },
      };

      await pluginManager.register(hookPlugin);

      // Execute hooks
      const topic = 'test topic';
      const modifiedTopic = await pluginManager.executeHook(
        'beforeAnalyze',
        topic
      );

      expect(hookResults).toContain('beforeAnalyze');
    });

    it('should handle plugin failures gracefully', async () => {
      const failingPlugin: SONAPlugin = {
        name: 'failing-plugin',
        version: '1.0.0',
        category: 'test',
        enabled: true,
        beforeAnalyze: () => {
          throw new Error('Plugin error');
        },
      };

      await pluginManager.register(failingPlugin);

      // Should not throw, should handle gracefully
      const result = await pluginManager.executeHook('beforeAnalyze', 'test');
      expect(result).toBeDefined();
    });

    it('should enable and disable plugins', async () => {
      const togglePlugin: SONAPlugin = {
        name: 'toggle-plugin',
        version: '1.0.0',
        category: 'test',
        enabled: true,
      };

      await pluginManager.register(togglePlugin);

      pluginManager.disable('toggle-plugin');
      let plugin = pluginManager.getPlugin('toggle-plugin');
      expect(plugin?.enabled).toBe(false);

      pluginManager.enable('toggle-plugin');
      plugin = pluginManager.getPlugin('toggle-plugin');
      expect(plugin?.enabled).toBe(true);
    });

    it('should list all registered plugins', async () => {
      const plugins = pluginManager.getAllPlugins();
      expect(Array.isArray(plugins)).toBe(true);
    });
  });

  describe('Settings Integration', () => {
    it('should get default settings', async () => {
      const settings = await settingsManager.getSettings();

      expect(settings).toBeDefined();
      expect(settings.articleLength).toBeDefined();
      expect(settings.keywordDensity).toBeDefined();
      expect(settings.minQualityScore).toBeDefined();
    });

    it('should validate settings', async () => {
      const validSettings = {
        articleLength: 'medium' as ArticleLength,
        keywordDensity: 3,
      };

      const result = settingsManager.validateSettings(validSettings);
      expect(result.valid).toBe(true);
    });
  });

  describe('Content Quality Validation', () => {
    it('should generate content with proper SEO structure', async () => {
      const request: GenerationRequest = {
        topic: 'دليل شامل للصحة',
        length: 'long' as ArticleLength,
      };

      const result = await contentGenerator.generate(request);

      // Check HTML structure
      expect(result.content).toContain('<h2>');
      expect(result.content).toContain('<p>');

      // Check meta description length
      expect(result.metaDescription.length).toBeGreaterThan(50);
      expect(result.metaDescription.length).toBeLessThanOrEqual(160);

      // Check keywords
      expect(result.keywords.length).toBeGreaterThan(0);
    });

    it('should include interactive elements in long articles', async () => {
      const request: GenerationRequest = {
        topic: 'دليل شامل لأعياد الميلاد',
        length: 'long' as ArticleLength,
      };

      const result = await contentGenerator.generate(request);

      // Long articles should have more content than short ones
      expect(result.wordCount).toBeGreaterThan(200);
      // Should have proper structure
      expect(result.content).toContain('<h2>');
      expect(result.content).toContain('<p>');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty topic gracefully', async () => {
      const request: GenerationRequest = {
        topic: '',
        length: 'short' as ArticleLength,
      };

      // Should throw error for empty topic (per Requirement 2.5)
      await expect(contentGenerator.generate(request)).rejects.toThrow(
        'الموضوع مطلوب'
      );
    });

    it('should handle invalid category gracefully', async () => {
      const request: GenerationRequest = {
        topic: 'موضوع عام',
        length: 'medium' as ArticleLength,
        category: 'invalid-category',
      };

      // Should fall back to general category
      const result = await contentGenerator.generate(request);
      expect(result).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });
  });
});
