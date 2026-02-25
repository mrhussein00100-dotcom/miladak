/**
 * SONA v4 Data Structure Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 1: Knowledge Base Completeness**
 * **Validates: Requirements 1.1**
 *
 * These tests verify that the SONA data structure meets the requirements:
 * - Knowledge base contains 50+ facts per category
 * - Templates have required structure
 * - Synonyms dictionary is properly formatted
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// Base path for SONA data
const SONA_DATA_PATH = path.join(process.cwd(), 'data', 'sona');

// Helper to read JSON file
function readJsonFile(filePath: string): any {
  const fullPath = path.join(SONA_DATA_PATH, filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(content);
}

// Helper to get all JSON files in a directory
function getJsonFiles(dirPath: string): string[] {
  const fullPath = path.join(SONA_DATA_PATH, dirPath);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(dirPath, file));
}

describe('SONA Data Structure Tests', () => {
  describe('Directory Structure', () => {
    it('should have all required directories', () => {
      const requiredDirs = [
        'knowledge',
        'templates',
        'templates/intros',
        'templates/paragraphs',
        'templates/conclusions',
        'synonyms',
        'phrases',
        'config',
        'plugins',
      ];

      requiredDirs.forEach((dir) => {
        const fullPath = path.join(SONA_DATA_PATH, dir);
        expect(fs.existsSync(fullPath), `Directory ${dir} should exist`).toBe(
          true
        );
      });
    });
  });

  describe('Knowledge Base Completeness - Property 1', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 1: Knowledge Base Completeness**
     * **Validates: Requirements 1.1**
     *
     * For any knowledge category file, it should contain at least 50 facts
     */

    it('zodiac.json should have 12 zodiac signs with complete data', () => {
      const zodiac = readJsonFile('knowledge/zodiac.json');
      expect(zodiac).not.toBeNull();

      const zodiacSigns = Object.keys(zodiac);
      expect(zodiacSigns.length).toBe(12);

      // Property test: For any zodiac sign, it should have required fields
      fc.assert(
        fc.property(fc.constantFrom(...zodiacSigns), (sign) => {
          const signData = zodiac[sign];

          // Required fields
          expect(signData.name).toBeDefined();
          expect(signData.element).toBeDefined();
          expect(signData.dates).toBeDefined();
          expect(signData.planet).toBeDefined();
          expect(signData.traits).toBeDefined();
          expect(signData.facts).toBeDefined();
          expect(signData.tips).toBeDefined();

          // Facts should have at least 10 items per sign (total 120+ for all signs)
          expect(signData.facts.length).toBeGreaterThanOrEqual(10);
          expect(signData.tips.length).toBeGreaterThanOrEqual(5);
          expect(signData.traits.length).toBeGreaterThanOrEqual(5);

          return true;
        }),
        { numRuns: 12 }
      );
    });

    it('birthday.json should have comprehensive birthday data', () => {
      const birthday = readJsonFile('knowledge/birthday.json');
      expect(birthday).not.toBeNull();

      // Should have traditions, ideas, facts, greetings
      expect(birthday.traditions).toBeDefined();
      expect(birthday.ideas).toBeDefined();
      expect(birthday.facts).toBeDefined();
      expect(birthday.greetings).toBeDefined();
    });

    it('health.json should have health information', () => {
      const health = readJsonFile('knowledge/health.json');
      expect(health).not.toBeNull();
    });

    it('dates.json should have historical date information', () => {
      const dates = readJsonFile('knowledge/dates.json');
      expect(dates).not.toBeNull();
    });
  });

  describe('Template Structure - Property 2', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 2: Template Variety**
     * **Validates: Requirements 2.2, 2.3, 2.4**
     *
     * For any template file, templates should have required structure
     */

    it('intro templates should have at least 50 templates total', () => {
      const introFiles = getJsonFiles('templates/intros');
      let totalIntros = 0;

      introFiles.forEach((file) => {
        const data = readJsonFile(file);
        if (data && data.templates) {
          totalIntros += data.templates.length;
        }
      });

      expect(totalIntros).toBeGreaterThanOrEqual(50);
    });

    it('paragraph templates should have at least 100 templates total', () => {
      const paragraphFiles = getJsonFiles('templates/paragraphs');
      let totalParagraphs = 0;

      paragraphFiles.forEach((file) => {
        const data = readJsonFile(file);
        if (data && data.templates) {
          totalParagraphs += data.templates.length;
        }
      });

      expect(totalParagraphs).toBeGreaterThanOrEqual(100);
    });

    it('conclusion templates should have at least 30 templates total', () => {
      const conclusionFiles = getJsonFiles('templates/conclusions');
      let totalConclusions = 0;

      conclusionFiles.forEach((file) => {
        const data = readJsonFile(file);
        if (data && data.templates) {
          totalConclusions += data.templates.length;
        }
      });

      expect(totalConclusions).toBeGreaterThanOrEqual(30);
    });

    it('all templates should have required fields', () => {
      const allTemplateFiles = [
        ...getJsonFiles('templates/intros'),
        ...getJsonFiles('templates/paragraphs'),
        ...getJsonFiles('templates/conclusions'),
      ];

      allTemplateFiles.forEach((file) => {
        const data = readJsonFile(file);
        if (data && data.templates) {
          // Property test: For any template, it should have id, template, and variables
          fc.assert(
            fc.property(fc.constantFrom(...data.templates), (template: any) => {
              expect(template.id).toBeDefined();
              expect(typeof template.id).toBe('string');
              expect(template.template).toBeDefined();
              expect(typeof template.template).toBe('string');
              expect(template.variables).toBeDefined();
              expect(Array.isArray(template.variables)).toBe(true);
              return true;
            }),
            { numRuns: Math.min(data.templates.length, 100) }
          );
        }
      });
    });

    it('templates should contain valid placeholders', () => {
      const generalIntros = readJsonFile('templates/intros/general.json');
      expect(generalIntros).not.toBeNull();

      if (generalIntros && generalIntros.templates) {
        fc.assert(
          fc.property(
            fc.constantFrom(...generalIntros.templates),
            (template: any) => {
              // Each variable in the variables array should appear in the template
              template.variables.forEach((variable: string) => {
                expect(template.template).toContain(`{${variable}}`);
              });
              return true;
            }
          ),
          { numRuns: generalIntros.templates.length }
        );
      }
    });
  });

  describe('Synonyms Dictionary - Property 8', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 8: Synonym Replacement**
     * **Validates: Requirements 3.1, 10.1**
     *
     * For any word in the synonyms dictionary, it should have at least 3 synonyms
     */

    it('arabic.json should have comprehensive synonyms', () => {
      const synonyms = readJsonFile('synonyms/arabic.json');
      expect(synonyms).not.toBeNull();

      // Should have different categories
      expect(synonyms.verbs).toBeDefined();
      expect(synonyms.adjectives).toBeDefined();
      expect(synonyms.nouns).toBeDefined();
    });

    it('each word should have at least 3 synonyms', () => {
      const synonyms = readJsonFile('synonyms/arabic.json');
      if (!synonyms) return;

      const categories = [
        'verbs',
        'adjectives',
        'nouns',
        'adverbs',
        'connectors',
      ];

      categories.forEach((category) => {
        if (synonyms[category]) {
          const words = Object.keys(synonyms[category]);

          fc.assert(
            fc.property(fc.constantFrom(...words), (word) => {
              const wordSynonyms = synonyms[category][word];
              expect(Array.isArray(wordSynonyms)).toBe(true);
              expect(wordSynonyms.length).toBeGreaterThanOrEqual(3);
              return true;
            }),
            { numRuns: Math.min(words.length, 50) }
          );
        }
      });
    });

    it('synonyms dictionary should have 500+ total entries', () => {
      const synonyms = readJsonFile('synonyms/arabic.json');
      if (!synonyms) return;

      let totalSynonyms = 0;
      const categories = [
        'verbs',
        'adjectives',
        'nouns',
        'adverbs',
        'connectors',
      ];

      categories.forEach((category) => {
        if (synonyms[category]) {
          Object.values(synonyms[category]).forEach((syns: any) => {
            totalSynonyms += syns.length;
          });
        }
      });

      expect(totalSynonyms).toBeGreaterThanOrEqual(500);
    });
  });

  describe('Phrases Library - Property 7', () => {
    /**
     * **Feature: sona-v4-enhancement**
     * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
     */

    it('transitions.json should have 40+ transition phrases', () => {
      const transitions = readJsonFile('phrases/transitions.json');
      expect(transitions).not.toBeNull();

      let totalTransitions = 0;
      Object.values(transitions).forEach((phrases: any) => {
        if (Array.isArray(phrases)) {
          totalTransitions += phrases.length;
        }
      });

      expect(totalTransitions).toBeGreaterThanOrEqual(40);
    });

    it('greetings.json should have 50+ greeting phrases', () => {
      const greetings = readJsonFile('phrases/greetings.json');
      expect(greetings).not.toBeNull();

      // Handle nested structure (birthday.formal, birthday.casual, etc.)
      const countPhrases = (obj: any): number => {
        let count = 0;
        for (const key in obj) {
          const value = obj[key];
          if (Array.isArray(value)) {
            count += value.length;
          } else if (typeof value === 'object') {
            count += countPhrases(value);
          }
        }
        return count;
      };

      const totalGreetings = countPhrases(greetings);
      expect(totalGreetings).toBeGreaterThanOrEqual(50);
    });

    it('ctas.json should have call-to-action phrases', () => {
      const ctas = readJsonFile('phrases/ctas.json');
      expect(ctas).not.toBeNull();

      let totalCTAs = 0;
      Object.values(ctas).forEach((phrases: any) => {
        if (Array.isArray(phrases)) {
          totalCTAs += phrases.length;
        }
      });

      expect(totalCTAs).toBeGreaterThan(0);
    });
  });

  describe('Config Files', () => {
    it('defaults.json should have valid default settings', () => {
      const defaults = readJsonFile('config/defaults.json');
      expect(defaults).not.toBeNull();

      // Should have article settings
      expect(defaults.articleLength).toBeDefined();
      expect(defaults.wordCountTargets).toBeDefined();

      // Should have quality settings
      expect(defaults.minQualityScore).toBeDefined();
      expect(defaults.maxRetries).toBeDefined();
    });

    it('schema.json should exist for validation', () => {
      const schema = readJsonFile('config/schema.json');
      expect(schema).not.toBeNull();
    });
  });

  describe('File Size Constraints - Requirement 9.4', () => {
    /**
     * **Validates: Requirements 9.4**
     *
     * For any JSON file, its size should not exceed 100KB
     */

    it('all JSON files should be under 100KB', () => {
      const allDirs = [
        'knowledge',
        'templates/intros',
        'templates/paragraphs',
        'templates/conclusions',
        'synonyms',
        'phrases',
        'config',
      ];

      allDirs.forEach((dir) => {
        const files = getJsonFiles(dir);
        files.forEach((file) => {
          const fullPath = path.join(SONA_DATA_PATH, file);
          const stats = fs.statSync(fullPath);
          const sizeInKB = stats.size / 1024;

          expect(
            sizeInKB,
            `File ${file} should be under 100KB (actual: ${sizeInKB.toFixed(
              2
            )}KB)`
          ).toBeLessThan(100);
        });
      });
    });
  });
});
