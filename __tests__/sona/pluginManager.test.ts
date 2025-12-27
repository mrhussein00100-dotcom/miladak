/**
 * SONA v4 Plugin Manager Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 14: Plugin Isolation**
 * **Feature: sona-v4-enhancement, Property 20: Category Extension**
 * **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  PluginManager,
  SONAPlugin,
  HookName,
} from '../../lib/sona/pluginManager';
import { TopicAnalysis, GeneratedContent } from '../../lib/sona/types';

// Mock plugin for testing
const createMockPlugin = (
  name: string,
  enabled: boolean = true
): SONAPlugin => ({
  name,
  version: '1.0.0',
  category: `category-${name}`,
  enabled,
  description: `Test plugin ${name}`,

  async onInit() {
    // Mock init
  },

  async onDestroy() {
    // Mock destroy
  },

  afterAnalyze(analysis: TopicAnalysis): TopicAnalysis {
    // Add plugin-specific keyword
    analysis.keywords.push(`keyword-from-${name}`);
    return analysis;
  },

  afterGenerate(content: GeneratedContent): GeneratedContent {
    // Add plugin-specific content
    content.content += `\n<!-- Plugin: ${name} -->`;
    return content;
  },
});

// Failing plugin for isolation testing
const createFailingPlugin = (name: string): SONAPlugin => ({
  name,
  version: '1.0.0',
  category: `failing-${name}`,
  enabled: true,

  afterAnalyze(): TopicAnalysis {
    throw new Error(`Plugin ${name} intentionally failed`);
  },

  afterGenerate(): GeneratedContent {
    throw new Error(`Plugin ${name} intentionally failed`);
  },
});

describe('Plugin Manager Tests', () => {
  let manager: PluginManager;

  beforeEach(() => {
    manager = new PluginManager();
    manager.clearAll();
  });

  describe('Basic Functionality - Requirements 14.1, 14.2', () => {
    it('should create plugin manager instance', () => {
      expect(manager).toBeDefined();
      expect(typeof manager.register).toBe('function');
      expect(typeof manager.unregister).toBe('function');
      expect(typeof manager.enable).toBe('function');
      expect(typeof manager.disable).toBe('function');
    });

    it('should register a plugin', async () => {
      const plugin = createMockPlugin('test-plugin');
      await manager.register(plugin);

      expect(manager.getPlugin('test-plugin')).toBeDefined();
      expect(manager.getAllPlugins()).toHaveLength(1);
    });

    it('should unregister a plugin', async () => {
      const plugin = createMockPlugin('test-plugin');
      await manager.register(plugin);
      await manager.unregister('test-plugin');

      expect(manager.getPlugin('test-plugin')).toBeUndefined();
      expect(manager.getAllPlugins()).toHaveLength(0);
    });

    it('should handle unregistering non-existent plugin gracefully', async () => {
      // Should not throw
      await manager.unregister('non-existent');
      expect(manager.getAllPlugins()).toHaveLength(0);
    });
  });

  describe('Plugin Enable/Disable - Requirements 14.3', () => {
    it('should enable a plugin', async () => {
      const plugin = createMockPlugin('test-plugin', false);
      await manager.register(plugin);

      expect(manager.getPlugin('test-plugin')?.enabled).toBe(false);

      await manager.enable('test-plugin');

      expect(manager.getPlugin('test-plugin')?.enabled).toBe(true);
    });

    it('should disable a plugin', async () => {
      const plugin = createMockPlugin('test-plugin', true);
      await manager.register(plugin);

      expect(manager.getPlugin('test-plugin')?.enabled).toBe(true);

      await manager.disable('test-plugin');

      expect(manager.getPlugin('test-plugin')?.enabled).toBe(false);
    });

    it('should only return enabled plugins from getEnabledPlugins', async () => {
      await manager.register(createMockPlugin('enabled-1', true));
      await manager.register(createMockPlugin('disabled-1', false));
      await manager.register(createMockPlugin('enabled-2', true));

      const enabledPlugins = manager.getEnabledPlugins();

      expect(enabledPlugins).toHaveLength(2);
      expect(enabledPlugins.every((p) => p.enabled)).toBe(true);
    });
  });

  describe('Property 14: Plugin Isolation - Requirements 14.4', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 14: Plugin Isolation**
     * **Validates: Requirements 14.4**
     *
     * For any plugin that fails during execution,
     * the main generation process should continue without interruption
     */

    it('should continue execution when a plugin fails', async () => {
      // Register a working plugin and a failing plugin
      await manager.register(createMockPlugin('working-plugin'));
      await manager.register(createFailingPlugin('failing-plugin'));

      const mockAnalysis: TopicAnalysis = {
        category: 'general',
        extractedEntities: {
          names: [],
          dates: [],
          numbers: [],
          zodiacSigns: [],
          ages: [],
        },
        keywords: ['test'],
        suggestedSections: [],
        tone: 'formal',
        confidence: 0.8,
      };

      // Execute hook - should not throw
      const result = await manager.executeHook('afterAnalyze', mockAnalysis);

      // Should have errors from failing plugin
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.plugin === 'failing-plugin')).toBe(
        true
      );

      // But should still have data from working plugin
      expect(result.data.keywords).toContain('keyword-from-working-plugin');
    });

    it('should record errors from failing plugins', async () => {
      await manager.register(createFailingPlugin('fail-1'));
      await manager.register(createFailingPlugin('fail-2'));

      const mockAnalysis: TopicAnalysis = {
        category: 'general',
        extractedEntities: {
          names: [],
          dates: [],
          numbers: [],
          zodiacSigns: [],
          ages: [],
        },
        keywords: [],
        suggestedSections: [],
        tone: 'formal',
        confidence: 0.8,
      };

      const result = await manager.executeHook('afterAnalyze', mockAnalysis);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it('should return success when all plugins succeed', async () => {
      await manager.register(createMockPlugin('plugin-1'));
      await manager.register(createMockPlugin('plugin-2'));

      const mockAnalysis: TopicAnalysis = {
        category: 'general',
        extractedEntities: {
          names: [],
          dates: [],
          numbers: [],
          zodiacSigns: [],
          ages: [],
        },
        keywords: [],
        suggestedSections: [],
        tone: 'formal',
        confidence: 0.8,
      };

      const result = await manager.executeHook('afterAnalyze', mockAnalysis);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Property 20: Category Extension - Requirements 14.5', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 20: Category Extension**
     * **Validates: Requirements 14.5**
     *
     * For any new category added via plugin,
     * it should be automatically available for content generation
     */

    it('should detect plugin for category', async () => {
      const plugin = createMockPlugin('birthday-plugin');
      plugin.category = 'أعياد الميلاد';
      await manager.register(plugin);

      expect(manager.hasPluginForCategory('أعياد الميلاد')).toBe(true);
      expect(manager.hasPluginForCategory('non-existent')).toBe(false);
    });

    it('should get plugin for specific category', async () => {
      const plugin = createMockPlugin('zodiac-plugin');
      plugin.category = 'الأبراج';
      await manager.register(plugin);

      const foundPlugin = manager.getPluginForCategory('الأبراج');

      expect(foundPlugin).toBeDefined();
      expect(foundPlugin?.name).toBe('zodiac-plugin');
    });

    it('should support multiple categories via multiple plugins', async () => {
      const categories = ['أعياد الميلاد', 'الأبراج', 'الصحة', 'التواريخ'];

      for (const category of categories) {
        const plugin = createMockPlugin(`plugin-${category}`);
        plugin.category = category;
        await manager.register(plugin);
      }

      for (const category of categories) {
        expect(manager.hasPluginForCategory(category)).toBe(true);
      }
    });

    it('should not find disabled plugin for category', async () => {
      const plugin = createMockPlugin('disabled-plugin', false);
      plugin.category = 'disabled-category';
      await manager.register(plugin);

      expect(manager.hasPluginForCategory('disabled-category')).toBe(false);
    });
  });

  describe('Hook Execution', () => {
    it('should execute hooks in order', async () => {
      const executionOrder: string[] = [];

      const plugin1: SONAPlugin = {
        name: 'plugin-1',
        version: '1.0.0',
        category: 'test-1',
        enabled: true,
        afterAnalyze(analysis: TopicAnalysis): TopicAnalysis {
          executionOrder.push('plugin-1');
          return analysis;
        },
      };

      const plugin2: SONAPlugin = {
        name: 'plugin-2',
        version: '1.0.0',
        category: 'test-2',
        enabled: true,
        afterAnalyze(analysis: TopicAnalysis): TopicAnalysis {
          executionOrder.push('plugin-2');
          return analysis;
        },
      };

      await manager.register(plugin1);
      await manager.register(plugin2);

      const mockAnalysis: TopicAnalysis = {
        category: 'general',
        extractedEntities: {
          names: [],
          dates: [],
          numbers: [],
          zodiacSigns: [],
          ages: [],
        },
        keywords: [],
        suggestedSections: [],
        tone: 'formal',
        confidence: 0.8,
      };

      await manager.executeHook('afterAnalyze', mockAnalysis);

      expect(executionOrder).toEqual(['plugin-1', 'plugin-2']);
    });

    it('should pass modified data between plugins', async () => {
      const plugin1: SONAPlugin = {
        name: 'plugin-1',
        version: '1.0.0',
        category: 'test-1',
        enabled: true,
        afterAnalyze(analysis: TopicAnalysis): TopicAnalysis {
          analysis.keywords.push('from-plugin-1');
          return analysis;
        },
      };

      const plugin2: SONAPlugin = {
        name: 'plugin-2',
        version: '1.0.0',
        category: 'test-2',
        enabled: true,
        afterAnalyze(analysis: TopicAnalysis): TopicAnalysis {
          // Should see keyword from plugin-1
          if (analysis.keywords.includes('from-plugin-1')) {
            analysis.keywords.push('from-plugin-2-saw-plugin-1');
          }
          return analysis;
        },
      };

      await manager.register(plugin1);
      await manager.register(plugin2);

      const mockAnalysis: TopicAnalysis = {
        category: 'general',
        extractedEntities: {
          names: [],
          dates: [],
          numbers: [],
          zodiacSigns: [],
          ages: [],
        },
        keywords: [],
        suggestedSections: [],
        tone: 'formal',
        confidence: 0.8,
      };

      const result = await manager.executeHook('afterAnalyze', mockAnalysis);

      expect(result.data.keywords).toContain('from-plugin-1');
      expect(result.data.keywords).toContain('from-plugin-2-saw-plugin-1');
    });
  });

  describe('Data Providers', () => {
    it('should collect knowledge from all enabled plugins', async () => {
      const plugin1: SONAPlugin = {
        name: 'plugin-1',
        version: '1.0.0',
        category: 'category-1',
        enabled: true,
        async getKnowledge() {
          return { facts: ['fact-1'], tips: ['tip-1'] };
        },
      };

      const plugin2: SONAPlugin = {
        name: 'plugin-2',
        version: '1.0.0',
        category: 'category-2',
        enabled: true,
        async getKnowledge() {
          return { facts: ['fact-2'], tips: ['tip-2'] };
        },
      };

      await manager.register(plugin1);
      await manager.register(plugin2);

      const knowledge = await manager.getKnowledgeFromPlugins();

      expect(knowledge['category-1']).toBeDefined();
      expect(knowledge['category-2']).toBeDefined();
      expect(knowledge['category-1'].facts).toContain('fact-1');
      expect(knowledge['category-2'].facts).toContain('fact-2');
    });

    it('should collect synonyms from all enabled plugins', async () => {
      const plugin1: SONAPlugin = {
        name: 'plugin-1',
        version: '1.0.0',
        category: 'category-1',
        enabled: true,
        async getSynonyms() {
          return { word1: ['syn1', 'syn2'] };
        },
      };

      const plugin2: SONAPlugin = {
        name: 'plugin-2',
        version: '1.0.0',
        category: 'category-2',
        enabled: true,
        async getSynonyms() {
          return { word2: ['syn3', 'syn4'] };
        },
      };

      await manager.register(plugin1);
      await manager.register(plugin2);

      const synonyms = await manager.getSynonymsFromPlugins();

      expect(synonyms['word1']).toEqual(['syn1', 'syn2']);
      expect(synonyms['word2']).toEqual(['syn3', 'syn4']);
    });
  });

  describe('Property-Based Tests', () => {
    it('should handle any number of plugins', async () => {
      // Test with different numbers of plugins
      const testCases = [0, 1, 5, 10, 15];

      for (const numPlugins of testCases) {
        const testManager = new PluginManager();

        for (let i = 0; i < numPlugins; i++) {
          await testManager.register(createMockPlugin(`plugin-${i}`));
        }

        expect(testManager.getAllPlugins()).toHaveLength(numPlugins);
      }
    });

    it('should always return valid execution result structure', async () => {
      const mockAnalysis: TopicAnalysis = {
        category: 'general',
        extractedEntities: {
          names: [],
          dates: [],
          numbers: [],
          zodiacSigns: [],
          ages: [],
        },
        keywords: [],
        suggestedSections: [],
        tone: 'formal',
        confidence: 0.8,
      };

      const hooks: HookName[] = [
        'beforeAnalyze',
        'afterAnalyze',
        'beforeGenerate',
        'afterGenerate',
      ];

      for (const hook of hooks) {
        const result = await manager.executeHook(hook, mockAnalysis);

        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('errors');
        expect(typeof result.success).toBe('boolean');
        expect(Array.isArray(result.errors)).toBe(true);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle plugin with no hooks', async () => {
      const minimalPlugin: SONAPlugin = {
        name: 'minimal',
        version: '1.0.0',
        category: 'minimal',
        enabled: true,
      };

      await manager.register(minimalPlugin);

      const mockAnalysis: TopicAnalysis = {
        category: 'general',
        extractedEntities: {
          names: [],
          dates: [],
          numbers: [],
          zodiacSigns: [],
          ages: [],
        },
        keywords: ['original'],
        suggestedSections: [],
        tone: 'formal',
        confidence: 0.8,
      };

      const result = await manager.executeHook('afterAnalyze', mockAnalysis);

      // Should pass through unchanged
      expect(result.data.keywords).toEqual(['original']);
      expect(result.success).toBe(true);
    });

    it('should handle empty plugin list', async () => {
      const mockAnalysis: TopicAnalysis = {
        category: 'general',
        extractedEntities: {
          names: [],
          dates: [],
          numbers: [],
          zodiacSigns: [],
          ages: [],
        },
        keywords: ['test'],
        suggestedSections: [],
        tone: 'formal',
        confidence: 0.8,
      };

      const result = await manager.executeHook('afterAnalyze', mockAnalysis);

      expect(result.success).toBe(true);
      expect(result.data.keywords).toEqual(['test']);
    });

    it('should handle duplicate plugin registration', async () => {
      const plugin = createMockPlugin('duplicate');

      await manager.register(plugin);
      await manager.register(plugin); // Register again

      // Should only have one instance
      expect(manager.getAllPlugins()).toHaveLength(1);
    });
  });
});
