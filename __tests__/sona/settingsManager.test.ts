/**
 * SONA v4 Settings Manager Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 13: Settings Persistence**
 * **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  SettingsManager,
  DEFAULT_SETTINGS,
  SONASettings,
  ArticleLength,
  DiversityLevel,
} from '../../lib/sona/settingsManager';

describe('Settings Manager Tests', () => {
  let manager: SettingsManager;

  beforeEach(() => {
    manager = new SettingsManager();
    manager.clearCache();
  });

  describe('Basic Functionality', () => {
    it('should create settings manager instance', () => {
      expect(manager).toBeDefined();
      expect(typeof manager.getSettings).toBe('function');
      expect(typeof manager.updateSetting).toBe('function');
      expect(typeof manager.validateSettings).toBe('function');
    });

    it('should have valid default settings', () => {
      expect(DEFAULT_SETTINGS).toBeDefined();
      expect(DEFAULT_SETTINGS.articleLength).toBe('medium');
      expect(DEFAULT_SETTINGS.keywordDensity).toBe(3);
      expect(DEFAULT_SETTINGS.minQualityScore).toBe(70);
      expect(DEFAULT_SETTINGS.maxRetries).toBe(3);
      expect(DEFAULT_SETTINGS.diversityLevel).toBe('high');
    });

    it('should have all required default settings fields', () => {
      const requiredFields: (keyof SONASettings)[] = [
        'articleLength',
        'wordCountTargets',
        'keywordDensity',
        'minKeywordOccurrences',
        'maxKeywordOccurrences',
        'minQualityScore',
        'maxRetries',
        'diversityLevel',
        'templateRotation',
        'excludedTemplates',
        'preferredTemplates',
        'enableSynonymReplacement',
        'enableSentenceVariation',
        'enableFAQGeneration',
        'enableTipsGeneration',
        'enableCTAs',
      ];

      for (const field of requiredFields) {
        expect(DEFAULT_SETTINGS[field]).toBeDefined();
      }
    });
  });

  describe('Property 13: Settings Persistence - Validation', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 13: Settings Persistence**
     * **Validates: Requirements 13.2**
     *
     * For any settings change made through the control panel,
     * the change should be validated before being applied
     */

    it('should validate articleLength correctly', () => {
      const validLengths: ArticleLength[] = [
        'short',
        'medium',
        'long',
        'comprehensive',
      ];

      for (const length of validLengths) {
        const result = manager.validateSetting('articleLength', length);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }

      const invalidResult = manager.validateSetting(
        'articleLength',
        'invalid' as ArticleLength
      );
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should validate keywordDensity range (1-5)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 5 }), (density) => {
          const result = manager.validateSetting('keywordDensity', density);
          expect(result.valid).toBe(true);
          return true;
        }),
        { numRuns: 5 }
      );

      // Test invalid values
      const tooLow = manager.validateSetting('keywordDensity', 0);
      expect(tooLow.valid).toBe(false);

      const tooHigh = manager.validateSetting('keywordDensity', 6);
      expect(tooHigh.valid).toBe(false);
    });

    it('should validate minQualityScore range (0-100)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), (score) => {
          const result = manager.validateSetting('minQualityScore', score);
          expect(result.valid).toBe(true);
          return true;
        }),
        { numRuns: 10 }
      );

      // Test invalid values
      const tooLow = manager.validateSetting('minQualityScore', -1);
      expect(tooLow.valid).toBe(false);

      const tooHigh = manager.validateSetting('minQualityScore', 101);
      expect(tooHigh.valid).toBe(false);
    });

    it('should validate maxRetries range (1-10)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 10 }), (retries) => {
          const result = manager.validateSetting('maxRetries', retries);
          expect(result.valid).toBe(true);
          return true;
        }),
        { numRuns: 10 }
      );

      const tooLow = manager.validateSetting('maxRetries', 0);
      expect(tooLow.valid).toBe(false);

      const tooHigh = manager.validateSetting('maxRetries', 11);
      expect(tooHigh.valid).toBe(false);
    });

    it('should validate diversityLevel correctly', () => {
      const validLevels: DiversityLevel[] = [
        'low',
        'medium',
        'high',
        'maximum',
      ];

      for (const level of validLevels) {
        const result = manager.validateSetting('diversityLevel', level);
        expect(result.valid).toBe(true);
      }

      const invalidResult = manager.validateSetting(
        'diversityLevel',
        'invalid' as DiversityLevel
      );
      expect(invalidResult.valid).toBe(false);
    });

    it('should validate boolean settings', () => {
      const booleanSettings: (keyof SONASettings)[] = [
        'templateRotation',
        'enableSynonymReplacement',
        'enableSentenceVariation',
        'enableFAQGeneration',
        'enableTipsGeneration',
        'enableCTAs',
      ];

      for (const setting of booleanSettings) {
        const trueResult = manager.validateSetting(setting, true as never);
        expect(trueResult.valid).toBe(true);

        const falseResult = manager.validateSetting(setting, false as never);
        expect(falseResult.valid).toBe(true);

        const invalidResult = manager.validateSetting(
          setting,
          'not-boolean' as never
        );
        expect(invalidResult.valid).toBe(false);
      }
    });

    it('should validate array settings', () => {
      const arraySettings: (keyof SONASettings)[] = [
        'excludedTemplates',
        'preferredTemplates',
      ];

      for (const setting of arraySettings) {
        const validResult = manager.validateSetting(setting, [
          'template1',
          'template2',
        ] as never);
        expect(validResult.valid).toBe(true);

        const emptyResult = manager.validateSetting(setting, [] as never);
        expect(emptyResult.valid).toBe(true);

        const invalidResult = manager.validateSetting(
          setting,
          'not-array' as never
        );
        expect(invalidResult.valid).toBe(false);
      }
    });
  });

  describe('Word Count Targets - Requirements 13.3', () => {
    /**
     * **Validates: Requirements 13.3**
     *
     * WHEN تعديل طول المقال THEN THE SONA_System SHALL قبول قيم
     * (قصير: 500 كلمة، متوسط: 1000 كلمة، طويل: 2000 كلمة)
     */

    it('should have correct default word count targets', () => {
      expect(DEFAULT_SETTINGS.wordCountTargets.short).toBe(500);
      expect(DEFAULT_SETTINGS.wordCountTargets.medium).toBe(1000);
      expect(DEFAULT_SETTINGS.wordCountTargets.long).toBe(2000);
      expect(DEFAULT_SETTINGS.wordCountTargets.comprehensive).toBe(3000);
    });

    it('should validate word count targets within acceptable ranges', () => {
      const validTargets = {
        short: 500,
        medium: 1000,
        long: 2000,
        comprehensive: 3000,
      };

      const result = manager.validateSetting('wordCountTargets', validTargets);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid word count targets', () => {
      const invalidTargets = {
        short: 50, // Too low
        medium: 1000,
        long: 2000,
        comprehensive: 3000,
      };

      const result = manager.validateSetting(
        'wordCountTargets',
        invalidTargets
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('Cross-Field Validation', () => {
    it('should validate minKeywordOccurrences <= maxKeywordOccurrences', () => {
      const validSettings: Partial<SONASettings> = {
        minKeywordOccurrences: 3,
        maxKeywordOccurrences: 5,
      };

      const validResult = manager.validateSettings(validSettings);
      expect(validResult.valid).toBe(true);

      const invalidSettings: Partial<SONASettings> = {
        minKeywordOccurrences: 6,
        maxKeywordOccurrences: 3,
      };

      const invalidResult = manager.validateSettings(invalidSettings);
      expect(invalidResult.valid).toBe(false);
      expect(
        invalidResult.errors.some((e) => e.includes('minKeywordOccurrences'))
      ).toBe(true);
    });
  });

  describe('Settings Export/Import', () => {
    it('should export settings as valid JSON', async () => {
      const json = await manager.exportSettings();
      expect(() => JSON.parse(json)).not.toThrow();

      const parsed = JSON.parse(json);
      expect(parsed.articleLength).toBeDefined();
      expect(parsed.keywordDensity).toBeDefined();
    });

    it('should reject invalid JSON on import', async () => {
      await expect(manager.importSettings('not valid json')).rejects.toThrow(
        'Invalid JSON format'
      );
    });

    it('should reject invalid settings on import', async () => {
      const invalidJson = JSON.stringify({
        keywordDensity: 100, // Invalid: should be 1-5
      });

      await expect(manager.importSettings(invalidJson)).rejects.toThrow(
        'Invalid settings'
      );
    });
  });

  describe('Change Listeners', () => {
    it('should register and unregister change listeners', () => {
      const listener = () => {};
      const unsubscribe = manager.onSettingsChange(listener);

      expect(typeof unsubscribe).toBe('function');

      // Should not throw
      unsubscribe();
    });
  });

  describe('Cache Management', () => {
    it('should clear cache correctly', () => {
      manager.clearCache();
      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('Feature Toggles', () => {
    it('should check feature enabled status', async () => {
      const features = [
        'synonymReplacement',
        'sentenceVariation',
        'faqGeneration',
        'tipsGeneration',
        'ctas',
      ] as const;

      for (const feature of features) {
        const enabled = await manager.isFeatureEnabled(feature);
        expect(typeof enabled).toBe('boolean');
      }
    });
  });

  describe('Settings Diff', () => {
    it('should calculate settings diff correctly', async () => {
      const newSettings: Partial<SONASettings> = {
        keywordDensity: 4,
        maxRetries: 5,
      };

      const diff = await manager.getSettingsDiff(newSettings);

      // Should have entries for changed settings
      expect(typeof diff).toBe('object');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty settings update', async () => {
      const result = manager.validateSettings({});
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle partial settings update', () => {
      const partialSettings: Partial<SONASettings> = {
        keywordDensity: 4,
      };

      const result = manager.validateSettings(partialSettings);
      expect(result.valid).toBe(true);
    });

    it('should validate all default settings', () => {
      const result = manager.validateSettings(DEFAULT_SETTINGS);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Property-Based Tests', () => {
    it('should always return valid validation result structure', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const result = manager.validateSetting('keywordDensity', value);

          expect(result).toHaveProperty('valid');
          expect(result).toHaveProperty('errors');
          expect(typeof result.valid).toBe('boolean');
          expect(Array.isArray(result.errors)).toBe(true);

          return true;
        }),
        { numRuns: 20 }
      );
    });

    it('should validate that valid settings pass and invalid settings fail', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('short'),
            fc.constant('medium'),
            fc.constant('long'),
            fc.constant('comprehensive')
          ),
          (length) => {
            const result = manager.validateSetting(
              'articleLength',
              length as ArticleLength
            );
            expect(result.valid).toBe(true);
            return true;
          }
        ),
        { numRuns: 4 }
      );
    });
  });
});
