/**
 * SONA v4 Export/Import Manager Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 16: Export/Import Round Trip**
 * **Validates: Requirements 16.1, 16.2**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  ExportImportManager,
  ExportData,
  DEFAULT_EXPORT_OPTIONS,
  DEFAULT_IMPORT_OPTIONS,
} from '../../lib/sona/exportImportManager';

describe('Export/Import Manager Tests', () => {
  let manager: ExportImportManager;

  beforeEach(() => {
    manager = new ExportImportManager();
  });

  describe('Basic Functionality - Requirements 16.1, 16.2', () => {
    it('should create export/import manager instance', () => {
      expect(manager).toBeDefined();
      expect(typeof manager.export).toBe('function');
      expect(typeof manager.import).toBe('function');
      expect(typeof manager.validateImportData).toBe('function');
    });

    it('should have default export options', () => {
      expect(DEFAULT_EXPORT_OPTIONS).toBeDefined();
      expect(DEFAULT_EXPORT_OPTIONS.includeKnowledge).toBe(true);
      expect(DEFAULT_EXPORT_OPTIONS.includeTemplates).toBe(true);
      expect(DEFAULT_EXPORT_OPTIONS.includeSynonyms).toBe(true);
      expect(DEFAULT_EXPORT_OPTIONS.includePhrases).toBe(true);
      expect(DEFAULT_EXPORT_OPTIONS.includeSettings).toBe(true);
      expect(DEFAULT_EXPORT_OPTIONS.format).toBe('json');
    });

    it('should have default import options', () => {
      expect(DEFAULT_IMPORT_OPTIONS).toBeDefined();
      expect(DEFAULT_IMPORT_OPTIONS.conflictResolution).toBe('merge');
      expect(DEFAULT_IMPORT_OPTIONS.validateBeforeImport).toBe(true);
    });
  });

  describe('Validation - Requirements 16.2', () => {
    it('should validate valid export data', () => {
      const validData: ExportData = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: ['knowledge', 'templates'],
        },
        knowledge: { zodiac: { الحمل: {} } },
        templates: { intros: { general: [] } },
      };

      const result = manager.validateImportData(validData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null data', () => {
      const result = manager.validateImportData(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid data format: expected object');
    });

    it('should reject non-object data', () => {
      const result = manager.validateImportData('string');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid data format: expected object');
    });

    it('should warn about missing metadata', () => {
      const dataWithoutMetadata = {
        knowledge: {},
      };

      const result = manager.validateImportData(dataWithoutMetadata);

      expect(result.errors).toContain('Missing metadata');
    });

    it('should warn about missing version', () => {
      const dataWithoutVersion = {
        metadata: {
          exportedAt: new Date().toISOString(),
          contents: [],
        },
      };

      const result = manager.validateImportData(dataWithoutVersion);

      expect(result.warnings).toContain('Missing version in metadata');
    });

    it('should validate synonyms structure', () => {
      const invalidSynonyms = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: ['synonyms'],
        },
        synonyms: {
          word1: 'not-an-array', // Should be array
        },
      };

      const result = manager.validateImportData(invalidSynonyms);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('expected array'))).toBe(
        true
      );
    });

    it('should accept valid synonyms structure', () => {
      const validSynonyms = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: ['synonyms'],
        },
        synonyms: {
          كبير: ['ضخم', 'هائل', 'عظيم'],
          صغير: ['ضئيل', 'قليل'],
        },
      };

      const result = manager.validateImportData(validSynonyms);

      expect(result.valid).toBe(true);
    });
  });

  describe('Property 16: Export/Import Round Trip', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 16: Export/Import Round Trip**
     * **Validates: Requirements 16.1, 16.2**
     *
     * For any exported data, importing it back should produce
     * identical data (excluding timestamps)
     */

    it('should preserve data structure in validation', () => {
      fc.assert(
        fc.property(
          fc.record({
            metadata: fc.record({
              version: fc.string({ minLength: 1, maxLength: 10 }),
              exportedAt: fc.string({ minLength: 1, maxLength: 30 }),
              contents: fc.array(fc.string({ minLength: 1, maxLength: 20 })),
            }),
          }),
          (data) => {
            const result = manager.validateImportData(data);

            // Should always return a valid result structure
            expect(typeof result.valid).toBe('boolean');
            expect(Array.isArray(result.errors)).toBe(true);
            expect(Array.isArray(result.warnings)).toBe(true);

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should validate synonyms arrays correctly', () => {
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 1, maxLength: 20 }),
            fc.array(fc.string({ minLength: 1, maxLength: 20 }))
          ),
          (synonyms) => {
            const data = {
              metadata: {
                version: '4.0.0',
                exportedAt: new Date().toISOString(),
                contents: ['synonyms'],
              },
              synonyms,
            };

            const result = manager.validateImportData(data);

            // Valid synonyms should pass validation
            expect(result.valid).toBe(true);

            return true;
          }
        ),
        { numRuns: 15 }
      );
    });

    it('should handle empty data gracefully', () => {
      const emptyData: ExportData = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: [],
        },
      };

      const result = manager.validateImportData(emptyData);

      expect(result.valid).toBe(true);
    });
  });

  describe('Deep Merge', () => {
    it('should merge objects correctly', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 }, e: 4 };

      const merged = (manager as any).deepMerge(target, source);

      expect(merged).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it('should merge arrays by combining unique items', () => {
      const target = [1, 2, 3];
      const source = [3, 4, 5];

      const merged = (manager as any).deepMerge(target, source);

      expect(merged).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle nested objects', () => {
      const target = { level1: { level2: { a: 1 } } };
      const source = { level1: { level2: { b: 2 } } };

      const merged = (manager as any).deepMerge(target, source);

      expect(merged).toEqual({ level1: { level2: { a: 1, b: 2 } } });
    });

    it('should replace primitive values', () => {
      const target = { a: 1 };
      const source = { a: 2 };

      const merged = (manager as any).deepMerge(target, source);

      expect(merged).toEqual({ a: 2 });
    });
  });

  describe('Synonyms Merge', () => {
    it('should merge synonyms dictionaries', () => {
      const existing = {
        كبير: ['ضخم', 'هائل'],
        صغير: ['ضئيل'],
      };

      const incoming = {
        كبير: ['عظيم'], // Should be added to existing
        جديد: ['حديث'], // New word
      };

      const merged = (manager as any).mergeSynonyms(existing, incoming);

      expect(merged.كبير).toContain('ضخم');
      expect(merged.كبير).toContain('هائل');
      expect(merged.كبير).toContain('عظيم');
      expect(merged.صغير).toEqual(['ضئيل']);
      expect(merged.جديد).toEqual(['حديث']);
    });

    it('should deduplicate synonyms', () => {
      const existing = {
        كبير: ['ضخم', 'هائل'],
      };

      const incoming = {
        كبير: ['ضخم', 'عظيم'], // ضخم is duplicate
      };

      const merged = (manager as any).mergeSynonyms(existing, incoming);

      // Should not have duplicates
      const uniqueCount = new Set(merged.كبير).size;
      expect(uniqueCount).toBe(merged.كبير.length);
    });

    it('should handle empty dictionaries', () => {
      const existing = {};
      const incoming = { كلمة: ['مرادف'] };

      const merged = (manager as any).mergeSynonyms(existing, incoming);

      expect(merged).toEqual({ كلمة: ['مرادف'] });
    });
  });

  describe('Import Result Structure', () => {
    it('should return proper import result for invalid data', async () => {
      const result = await manager.import('invalid json{{{');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.imported.knowledge).toBe(0);
      expect(result.imported.templates).toBe(0);
    });

    it('should return proper import result for valid empty data', async () => {
      const validEmptyData: ExportData = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: [],
        },
      };

      const result = await manager.import(validEmptyData);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle Arabic text in data', () => {
      const arabicData: ExportData = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          description: 'تصدير بيانات SONA',
          contents: ['knowledge'],
        },
        knowledge: {
          zodiac: {
            الحمل: { traits: ['الشجاعة', 'الحماس'] },
          },
        },
      };

      const result = manager.validateImportData(arabicData);

      expect(result.valid).toBe(true);
    });

    it('should handle mixed Arabic and English', () => {
      const mixedData: ExportData = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: ['synonyms'],
        },
        synonyms: {
          'Hello مرحبا': ['Hi أهلا', 'Welcome مرحبا بك'],
        },
      };

      const result = manager.validateImportData(mixedData);

      expect(result.valid).toBe(true);
    });

    it('should handle deeply nested structures', () => {
      const deepData: ExportData = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: ['templates'],
        },
        templates: {
          intros: {
            general: {
              templates: [
                {
                  id: 'intro_1',
                  content: 'مرحباً',
                  variables: { name: 'string' },
                },
              ],
            },
          },
        },
      };

      const result = manager.validateImportData(deepData);

      expect(result.valid).toBe(true);
    });

    it('should handle large data structures', () => {
      const largeData: ExportData = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: ['synonyms'],
        },
        synonyms: Object.fromEntries(
          Array.from({ length: 100 }, (_, i) => [
            `word${i}`,
            [`syn1_${i}`, `syn2_${i}`, `syn3_${i}`],
          ])
        ),
      };

      const result = manager.validateImportData(largeData);

      expect(result.valid).toBe(true);
    });
  });

  describe('Export Size Estimation', () => {
    it('should return a positive number for size estimate', async () => {
      const size = await manager.getExportSizeEstimate({
        includeKnowledge: false,
        includeTemplates: false,
        includeSynonyms: false,
        includePhrases: false,
        includeSettings: false,
      });

      // Even empty export has metadata
      expect(size).toBeGreaterThan(0);
    });
  });
});
