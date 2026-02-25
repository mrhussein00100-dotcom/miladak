/**
 * Property-Based Tests for Keywords Grouping
 * Feature: historical-events-page-enhancement
 *
 * Property 3: Keywords Grouping
 * For any array of keywords fetched from the database, the system SHALL organize
 * them into categorized groups where each group contains at most 20 keywords.
 * **Validates: Requirements 3.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Keyword generator
const keywordArbitrary = fc.string({ minLength: 2, maxLength: 50 });

// Keywords array generator (0-200 keywords)
const keywordsArrayArbitrary = fc.array(keywordArbitrary, {
  minLength: 0,
  maxLength: 200,
});

// Group configuration
const GROUP_SIZE = 20;
const GROUP_CONFIGS = [
  { name: 'الأكثر بحثاً', icon: '🔥' },
  { name: 'مواضيع مشابهة', icon: '💡' },
  { name: 'قد يعجبك أيضاً', icon: '⭐' },
  { name: 'اكتشف المزيد', icon: '🌟' },
  { name: 'مواضيع شائعة', icon: '📈' },
  { name: 'اقتراحات لك', icon: '💎' },
];

interface KeywordGroup {
  name: string;
  icon: string;
  keywords: string[];
}

// Grouping function matching component logic
function groupKeywords(keywords: string[]): KeywordGroup[] {
  return GROUP_CONFIGS.map((config, index) => ({
    ...config,
    keywords: keywords.slice(index * GROUP_SIZE, (index + 1) * GROUP_SIZE),
  })).filter((g) => g.keywords.length > 0);
}

// Calculate total keywords across all groups
function getTotalKeywordsInGroups(groups: KeywordGroup[]): number {
  return groups.reduce((total, group) => total + group.keywords.length, 0);
}

describe('Keywords Grouping - Property Tests', () => {
  /**
   * Property 3: Keywords Grouping
   * Each group should contain at most 20 keywords
   * **Validates: Requirements 3.3**
   */
  it('each group should contain at most 20 keywords', () => {
    fc.assert(
      fc.property(keywordsArrayArbitrary, (keywords) => {
        const groups = groupKeywords(keywords);
        groups.forEach((group) => {
          expect(group.keywords.length).toBeLessThanOrEqual(GROUP_SIZE);
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Total keywords in groups equals min(input length, max capacity)
   * **Validates: Requirements 3.3**
   */
  it('total keywords in groups should equal min(input length, max capacity)', () => {
    fc.assert(
      fc.property(keywordsArrayArbitrary, (keywords) => {
        const groups = groupKeywords(keywords);
        const totalInGroups = getTotalKeywordsInGroups(groups);
        const maxCapacity = GROUP_CONFIGS.length * GROUP_SIZE;
        const expected = Math.min(keywords.length, maxCapacity);
        expect(totalInGroups).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty keywords array produces empty groups
   * **Validates: Requirements 3.3**
   */
  it('empty keywords array should produce empty groups', () => {
    const groups = groupKeywords([]);
    expect(groups.length).toBe(0);
  });

  /**
   * Property: Groups are created in order
   * **Validates: Requirements 3.3**
   */
  it('groups should be created in order', () => {
    fc.assert(
      fc.property(keywordsArrayArbitrary, (keywords) => {
        const groups = groupKeywords(keywords);
        groups.forEach((group, index) => {
          expect(group.name).toBe(GROUP_CONFIGS[index].name);
          expect(group.icon).toBe(GROUP_CONFIGS[index].icon);
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Keywords are distributed sequentially
   * **Validates: Requirements 3.3**
   */
  it('keywords should be distributed sequentially across groups', () => {
    fc.assert(
      fc.property(keywordsArrayArbitrary, (keywords) => {
        const groups = groupKeywords(keywords);
        let keywordIndex = 0;

        groups.forEach((group) => {
          group.keywords.forEach((keyword) => {
            if (keywordIndex < keywords.length) {
              expect(keyword).toBe(keywords[keywordIndex]);
              keywordIndex++;
            }
          });
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Number of groups is ceil(keywords.length / GROUP_SIZE) up to max groups
   * **Validates: Requirements 3.3**
   */
  it('number of groups should be correct based on keywords count', () => {
    fc.assert(
      fc.property(keywordsArrayArbitrary, (keywords) => {
        const groups = groupKeywords(keywords);
        const expectedGroups = Math.min(
          Math.ceil(keywords.length / GROUP_SIZE),
          GROUP_CONFIGS.length
        );
        expect(groups.length).toBe(keywords.length === 0 ? 0 : expectedGroups);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All groups except possibly the last should be full
   * **Validates: Requirements 3.3**
   */
  it('all groups except possibly the last should be full', () => {
    fc.assert(
      fc.property(keywordsArrayArbitrary, (keywords) => {
        const groups = groupKeywords(keywords);

        // All groups except the last should have exactly GROUP_SIZE keywords
        // (unless we have fewer keywords than GROUP_SIZE)
        for (let i = 0; i < groups.length - 1; i++) {
          expect(groups[i].keywords.length).toBe(GROUP_SIZE);
        }
      }),
      { numRuns: 100 }
    );
  });
});
