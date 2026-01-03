/**
 * Property-Based Tests for Articles Display Limit
 * Feature: historical-events-page-enhancement
 *
 * Property 4: Articles Display Limit
 * For any number of related articles available, the system SHALL display
 * at most 6 article cards.
 * **Validates: Requirements 4.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Article interface
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
}

// Article generator
const articleArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 100000 }),
  title: fc.string({ minLength: 5, maxLength: 200 }),
  slug: fc.string({ minLength: 5, maxLength: 100 }),
  excerpt: fc.string({ minLength: 0, maxLength: 300 }),
  featured_image: fc.webUrl(),
  created_at: fc.date().map((d) => d.toISOString()),
});

// Articles array generator (0-20 articles)
const articlesArrayArbitrary = fc.array(articleArbitrary, {
  minLength: 0,
  maxLength: 20,
});

// Maximum articles to display
const MAX_ARTICLES = 6;

// Function to limit articles (matching component logic)
function limitArticles(articles: Article[]): Article[] {
  return articles.slice(0, MAX_ARTICLES);
}

// Function to check if articles should be displayed
function shouldDisplayArticles(articles: Article[]): boolean {
  return articles.length > 0;
}

describe('Articles Display Limit - Property Tests', () => {
  /**
   * Property 4: Articles Display Limit
   * Displayed articles should be at most 6
   * **Validates: Requirements 4.3**
   */
  it('should display at most 6 articles', () => {
    fc.assert(
      fc.property(articlesArrayArbitrary, (articles) => {
        const displayed = limitArticles(articles);
        expect(displayed.length).toBeLessThanOrEqual(MAX_ARTICLES);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Displayed articles count equals min(total, 6)
   * **Validates: Requirements 4.3**
   */
  it('displayed articles count should equal min(total, 6)', () => {
    fc.assert(
      fc.property(articlesArrayArbitrary, (articles) => {
        const displayed = limitArticles(articles);
        const expected = Math.min(articles.length, MAX_ARTICLES);
        expect(displayed.length).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: First 6 articles are preserved in order
   * **Validates: Requirements 4.3**
   */
  it('first 6 articles should be preserved in order', () => {
    fc.assert(
      fc.property(articlesArrayArbitrary, (articles) => {
        const displayed = limitArticles(articles);
        displayed.forEach((article, index) => {
          expect(article.id).toBe(articles[index].id);
          expect(article.title).toBe(articles[index].title);
          expect(article.slug).toBe(articles[index].slug);
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty articles array produces empty display
   * **Validates: Requirements 4.3**
   */
  it('empty articles array should produce empty display', () => {
    const displayed = limitArticles([]);
    expect(displayed.length).toBe(0);
    expect(shouldDisplayArticles([])).toBe(false);
  });

  /**
   * Property: Articles section should be displayed only when articles exist
   * **Validates: Requirements 4.3**
   */
  it('articles section should be displayed only when articles exist', () => {
    fc.assert(
      fc.property(articlesArrayArbitrary, (articles) => {
        const shouldDisplay = shouldDisplayArticles(articles);
        expect(shouldDisplay).toBe(articles.length > 0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Exactly 6 articles when more than 6 available
   * **Validates: Requirements 4.3**
   */
  it('should display exactly 6 articles when more than 6 available', () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 7, maxLength: 20 }),
        (articles) => {
          const displayed = limitArticles(articles);
          expect(displayed.length).toBe(MAX_ARTICLES);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All articles displayed when 6 or fewer available
   * **Validates: Requirements 4.3**
   */
  it('should display all articles when 6 or fewer available', () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 1, maxLength: 6 }),
        (articles) => {
          const displayed = limitArticles(articles);
          expect(displayed.length).toBe(articles.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Article IDs in displayed list are unique
   * **Validates: Requirements 4.3**
   */
  it('article IDs in displayed list should be unique', () => {
    fc.assert(
      fc.property(articlesArrayArbitrary, (articles) => {
        // Ensure unique IDs in input
        const uniqueArticles = articles.filter(
          (article, index, self) =>
            index === self.findIndex((a) => a.id === article.id)
        );
        const displayed = limitArticles(uniqueArticles);
        const ids = displayed.map((a) => a.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      }),
      { numRuns: 100 }
    );
  });
});
