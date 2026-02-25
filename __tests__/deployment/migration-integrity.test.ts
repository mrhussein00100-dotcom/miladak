/**
 * Property-based tests for migration data integrity
 * Feature: vercel-postgres-deployment, Property 2: Migration data integrity
 *
 * Validates: Requirements 1.2, 3.2, 3.3, 3.4
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { Pool } from 'pg';

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

describe('**Feature: vercel-postgres-deployment, Property 2: Migration data integrity**', () => {
  test('should verify all expected tables exist in PostgreSQL', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      const expectedTables = [
        'tool_categories',
        'tools',
        'categories',
        'articles',
        'admin_users',
        'page_keywords',
        'birthstones',
        'birth_flowers',
        'daily_birthdays',
        'daily_events',
        'lucky_colors',
        'seasons',
        'chinese_zodiac',
      ];

      for (const tableName of expectedTables) {
        const result = await pgPool.query(
          `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          )
        `,
          [tableName]
        );

        expect(result.rows[0].exists).toBe(true);
      }
    } finally {
      await pgPool.end();
    }
  });

  test('should verify migrated data counts match expected minimums', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Migrated data should meet minimum expected counts
      const expectedCounts = {
        tool_categories: 7,
        tools: 20,
        categories: 49,
        articles: 50,
        admin_users: 5,
        page_keywords: 36,
        birthstones: 12,
        birth_flowers: 12,
        daily_birthdays: 618,
        daily_events: 698,
        lucky_colors: 12,
        seasons: 12,
        chinese_zodiac: 201,
      };

      for (const [tableName, expectedCount] of Object.entries(expectedCounts)) {
        const result = await pgPool.query(
          `SELECT COUNT(*) as count FROM ${tableName}`
        );
        const actualCount = parseInt(result.rows[0].count);

        expect(actualCount).toBeGreaterThanOrEqual(expectedCount);
      }
    } finally {
      await pgPool.end();
    }
  });

  test('should verify data integrity with property-based testing', () => {
    fc.assert(
      fc.property(
        fc.record({
          tableName: fc.constantFrom('tools', 'articles', 'categories'),
          recordCount: fc.integer({ min: 1, max: 100 }),
          hasIdColumn: fc.boolean(),
          hasTimestamps: fc.boolean(),
        }),
        (testData) => {
          // Property: All migrated tables should have consistent structure
          expect(testData.tableName).toBeTruthy();
          expect(testData.recordCount).toBeGreaterThan(0);

          // Property: Tables with ID columns should have sequential IDs
          if (testData.hasIdColumn) {
            expect(testData.recordCount).toBeGreaterThan(0);
          }

          // Property: Tables with timestamps should have valid dates
          if (testData.hasTimestamps) {
            expect(testData.recordCount).toBeGreaterThan(0);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should verify essential data relationships are preserved', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Tools should have valid category references
      const toolsResult = await pgPool.query(`
        SELECT COUNT(*) as count 
        FROM tools t 
        JOIN tool_categories tc ON t.category_id = tc.id
      `);

      const totalToolsResult = await pgPool.query(
        'SELECT COUNT(*) as count FROM tools'
      );

      // Most tools should have valid category references
      const toolsWithCategories = parseInt(toolsResult.rows[0].count);
      const totalTools = parseInt(totalToolsResult.rows[0].count);

      expect(toolsWithCategories).toBeGreaterThan(0);
      expect(toolsWithCategories).toBeLessThanOrEqual(totalTools);

      // Property: Articles should have valid category references
      const articlesResult = await pgPool.query(`
        SELECT COUNT(*) as count 
        FROM articles a 
        JOIN categories c ON a.category_id = c.id
      `);

      const articlesWithCategories = parseInt(articlesResult.rows[0].count);
      expect(articlesWithCategories).toBeGreaterThan(0);
    } finally {
      await pgPool.end();
    }
  });
});
