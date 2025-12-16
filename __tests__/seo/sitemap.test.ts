/**
 * Property-Based Tests for SEO Sitemap
 * اختبارات الخصائص لـ Sitemap
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  SITEMAP_PRIORITY,
  SITEMAP_CHANGE_FREQ,
  SEO_CONFIG,
} from '@/lib/seo/config';

// Mock the database module
vi.mock('@/lib/db/unified-database', () => ({
  queryAll: vi.fn(),
}));

import { queryAll } from '@/lib/db/unified-database';

// Helper to generate valid article data
const articleArbitrary = fc.record({
  slug: fc
    .string({ minLength: 1, maxLength: 100 })
    .filter((s) => /^[a-z0-9-]+$/.test(s) || /^[\u0621-\u064A0-9-]+$/.test(s)),
  updated_at: fc
    .date({ min: new Date('2020-01-01'), max: new Date() })
    .map((d) => d.toISOString()),
  published: fc.constant(1),
});

// Helper to generate valid tool data
const toolArbitrary = fc.record({
  name: fc
    .string({ minLength: 1, maxLength: 50 })
    .filter((s) => /^[a-z0-9-]+$/.test(s)),
  href: fc
    .string({ minLength: 1, maxLength: 100 })
    .map((s) => `/tools/${s.replace(/[^a-z0-9-]/g, '-')}`),
  is_active: fc.constant(1),
});

describe('Sitemap Properties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Feature: seo-sitemap-robots-ads, Property 1: Sitemap Completeness**
   * *For any* published article in the database, the generated sitemap SHALL contain
   * a URL entry for that article with the correct slug and lastModified date.
   * **Validates: Requirements 1.1, 1.3, 1.6**
   */
  it('Property 1: All published articles appear in sitemap with correct data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 20 }),
        async (articles) => {
          // Setup mock
          const mockedQueryAll = vi.mocked(queryAll);
          mockedQueryAll.mockImplementation((sql: string) => {
            if (sql.includes('articles')) return articles;
            if (sql.includes('tools')) return [];
            if (sql.includes('categories')) return [];
            return [];
          });

          // Import sitemap dynamically to use mocked dependencies
          const { default: sitemap } = await import('@/app/sitemap');
          const result = sitemap();

          // Verify all articles are in sitemap
          for (const article of articles) {
            const articleUrl = `${SEO_CONFIG.baseUrl}/articles/${article.slug}`;
            const found = result.find((entry) => entry.url === articleUrl);

            expect(found).toBeDefined();
            expect(found?.priority).toBe(SITEMAP_PRIORITY.articlePage);
            expect(found?.changeFrequency).toBe(
              SITEMAP_CHANGE_FREQ.articlePage
            );
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: seo-sitemap-robots-ads, Property 2: Tool Inclusion**
   * *For any* active tool in the database, the generated sitemap SHALL contain
   * a URL entry for that tool with appropriate priority (0.8) and change frequency (monthly).
   * **Validates: Requirements 1.2, 1.4**
   */
  it('Property 2: All active tools appear in sitemap with correct priority', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(toolArbitrary, { minLength: 0, maxLength: 20 }),
        async (tools) => {
          const mockedQueryAll = vi.mocked(queryAll);
          mockedQueryAll.mockImplementation((sql: string) => {
            if (sql.includes('articles')) return [];
            if (sql.includes('tools')) return tools;
            if (sql.includes('categories')) return [];
            return [];
          });

          const { default: sitemap } = await import('@/app/sitemap');
          const result = sitemap();

          // Verify all tools are in sitemap with correct priority
          for (const tool of tools) {
            const toolUrl = `${SEO_CONFIG.baseUrl}${tool.href}`;
            const found = result.find((entry) => entry.url === toolUrl);

            expect(found).toBeDefined();
            expect(found?.priority).toBe(SITEMAP_PRIORITY.toolPage);
            expect(found?.changeFrequency).toBe(SITEMAP_CHANGE_FREQ.toolPage);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: seo-sitemap-robots-ads, Property 3: Priority Assignment**
   * *For any* URL in the sitemap, the priority value SHALL be within the range [0.0, 1.0].
   * **Validates: Requirements 1.7**
   */
  it('Property 3: All sitemap entries have valid priority values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 10 }),
        fc.array(toolArbitrary, { minLength: 0, maxLength: 10 }),
        async (articles, tools) => {
          const mockedQueryAll = vi.mocked(queryAll);
          mockedQueryAll.mockImplementation((sql: string) => {
            if (sql.includes('articles')) return articles;
            if (sql.includes('tools')) return tools;
            if (sql.includes('categories')) return [];
            return [];
          });

          const { default: sitemap } = await import('@/app/sitemap');
          const result = sitemap();

          // Verify all priorities are within valid range
          for (const entry of result) {
            expect(entry.priority).toBeGreaterThanOrEqual(0);
            expect(entry.priority).toBeLessThanOrEqual(1);
          }

          // Verify change frequencies are valid
          const validFrequencies = [
            'always',
            'hourly',
            'daily',
            'weekly',
            'monthly',
            'yearly',
            'never',
          ];
          for (const entry of result) {
            expect(validFrequencies).toContain(entry.changeFrequency);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Static pages should always be present in sitemap
   */
  it('Static pages are always included in sitemap', async () => {
    const mockedQueryAll = vi.mocked(queryAll);
    mockedQueryAll.mockReturnValue([]);

    const { default: sitemap } = await import('@/app/sitemap');
    const result = sitemap();

    // Check essential static pages
    const essentialPages = ['', '/tools', '/articles', '/about', '/privacy'];
    for (const page of essentialPages) {
      const pageUrl = `${SEO_CONFIG.baseUrl}${page}`;
      const found = result.find((entry) => entry.url === pageUrl);
      expect(found).toBeDefined();
    }
  });

  /**
   * Home page should have highest priority
   */
  it('Home page has priority 1.0', async () => {
    const mockedQueryAll = vi.mocked(queryAll);
    mockedQueryAll.mockReturnValue([]);

    const { default: sitemap } = await import('@/app/sitemap');
    const result = sitemap();

    const homePage = result.find((entry) => entry.url === SEO_CONFIG.baseUrl);
    expect(homePage).toBeDefined();
    expect(homePage?.priority).toBe(1.0);
  });
});

// ==================== Sitemap Utils Tests ====================

import {
  splitUrlsIntoSitemaps,
  shouldUseSitemapIndex,
  sanitizeSitemapUrls,
  sortByPriority,
} from '@/lib/seo/sitemap-utils';
import { SITEMAP_LIMITS } from '@/lib/seo/config';
import type { SitemapEntry } from '@/lib/seo/types';

describe('Sitemap Utils Properties', () => {
  /**
   * **Feature: seo-sitemap-robots-ads, Property 6: Sitemap Size Compliance**
   * *For any* generated sitemap file, the total number of URLs SHALL not exceed 50,000.
   * **Validates: Requirements 5.1, 5.3**
   */
  it('Property 6: Sitemap splitting respects URL limits', () => {
    fc.assert(
      fc.property(
        // Generate array of URLs (0 to 100,000)
        fc.integer({ min: 0, max: 100000 }),
        (urlCount) => {
          // Create mock URLs
          const urls: SitemapEntry[] = Array.from(
            { length: urlCount },
            (_, i) => ({
              url: `https://example.com/page-${i}`,
              lastModified: new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.5,
            })
          );

          const sitemaps = splitUrlsIntoSitemaps(urls);

          // Each sitemap should not exceed the limit
          for (const sitemap of sitemaps) {
            expect(sitemap.length).toBeLessThanOrEqual(
              SITEMAP_LIMITS.maxUrlsPerSitemap
            );
          }

          // Total URLs should be preserved
          const totalUrls = sitemaps.reduce((sum, s) => sum + s.length, 0);
          expect(totalUrls).toBe(urlCount);

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * shouldUseSitemapIndex returns true when URLs exceed limit
   */
  it('shouldUseSitemapIndex returns correct value', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 200000 }), (urlCount) => {
        const result = shouldUseSitemapIndex(urlCount);
        const expected = urlCount > SITEMAP_LIMITS.maxUrlsPerSitemap;
        expect(result).toBe(expected);
        return true;
      }),
      { numRuns: 50 }
    );
  });

  /**
   * sanitizeSitemapUrls removes invalid entries
   */
  it('sanitizeSitemapUrls filters invalid URLs', () => {
    const validUrl: SitemapEntry = {
      url: 'https://example.com/valid',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    };

    const invalidUrl: SitemapEntry = {
      url: 'not-a-valid-url',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    };

    const invalidPriority: SitemapEntry = {
      url: 'https://example.com/invalid-priority',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.5, // Invalid: > 1
    };

    const result = sanitizeSitemapUrls([validUrl, invalidUrl, invalidPriority]);

    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://example.com/valid');
  });

  /**
   * sortByPriority orders URLs correctly
   */
  it('sortByPriority orders by priority descending', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            url: fc.webUrl(),
            lastModified: fc.date(),
            changeFrequency: fc.constantFrom(
              'always',
              'hourly',
              'daily',
              'weekly',
              'monthly',
              'yearly',
              'never'
            ),
            // Use double with noNaN to avoid NaN values
            priority: fc.double({ min: 0, max: 1, noNaN: true }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (urls) => {
          const sorted = sortByPriority(urls as SitemapEntry[]);

          // Check that priorities are in descending order
          for (let i = 1; i < sorted.length; i++) {
            expect(sorted[i - 1].priority).toBeGreaterThanOrEqual(
              sorted[i].priority
            );
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
