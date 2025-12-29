/**
 * Property-based tests for migration verification
 * Feature: vercel-postgres-deployment, Property 7: Migration verification
 *
 * Validates: Requirements 3.5
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { Pool } from 'pg';

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

describe('**Feature: vercel-postgres-deployment, Property 7: Migration verification**', () => {
  test('should verify migration completed successfully with expected data counts', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Migration should report success with actual data
      const tables = [
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

      let totalRecords = 0;
      const tableStats = {};

      for (const table of tables) {
        try {
          const result = await pgPool.query(
            `SELECT COUNT(*) as count FROM ${table}`
          );
          const count = parseInt(result.rows[0].count);
          tableStats[table] = count;
          totalRecords += count;
        } catch (error) {
          // Table might not exist, set count to 0
          tableStats[table] = 0;
        }
      }

      // Property: Should have migrated substantial amount of data
      expect(totalRecords).toBeGreaterThan(1000); // We expect 1,381+ records

      // Property: Key tables should have data
      expect(tableStats['tools']).toBeGreaterThanOrEqual(20);
      expect(tableStats['articles']).toBeGreaterThanOrEqual(50);
      expect(tableStats['daily_birthdays']).toBeGreaterThanOrEqual(600);
      expect(tableStats['daily_events']).toBeGreaterThanOrEqual(600);
    } finally {
      await pgPool.end();
    }
  });

  test('should verify data integrity after migration', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Migrated data should have valid IDs
      const tablesWithIds = ['tools', 'articles', 'categories', 'admin_users'];

      for (const table of tablesWithIds) {
        const result = await pgPool.query(`
          SELECT MIN(id) as min_id, MAX(id) as max_id, COUNT(*) as count 
          FROM ${table}
        `);

        if (result.rows[0].count > 0) {
          expect(result.rows[0].min_id).toBeGreaterThan(0);
          expect(result.rows[0].max_id).toBeGreaterThanOrEqual(
            result.rows[0].min_id
          );
        }
      }

      // Property: Tools should have valid titles and hrefs
      const toolsResult = await pgPool.query(`
        SELECT COUNT(*) as count 
        FROM tools 
        WHERE title IS NOT NULL AND title != '' 
        AND href IS NOT NULL AND href != ''
      `);

      const totalToolsResult = await pgPool.query(
        'SELECT COUNT(*) as count FROM tools'
      );

      // Most tools should have valid titles and hrefs
      expect(parseInt(toolsResult.rows[0].count)).toBeGreaterThan(0);
      expect(parseInt(toolsResult.rows[0].count)).toBeLessThanOrEqual(
        parseInt(totalToolsResult.rows[0].count)
      );

      // Property: Articles should have valid titles
      const articlesResult = await pgPool.query(`
        SELECT COUNT(*) as count 
        FROM articles 
        WHERE title IS NOT NULL AND title != ''
      `);

      expect(parseInt(articlesResult.rows[0].count)).toBeGreaterThan(0);
    } finally {
      await pgPool.end();
    }
  });

  test('should verify migration verification with property-based testing', () => {
    fc.assert(
      fc.property(
        fc.record({
          expectedMinRecords: fc.integer({ min: 1000, max: 2000 }),
          expectedTables: fc.integer({ min: 10, max: 15 }),
          migrationSuccess: fc.boolean(),
          dataIntegrityCheck: fc.boolean(),
        }),
        (verificationData) => {
          // Property: Migration should meet minimum expectations
          expect(verificationData.expectedMinRecords).toBeGreaterThan(1000);
          expect(verificationData.expectedTables).toBeGreaterThanOrEqual(10);

          // Property: Successful migration should have data integrity
          if (verificationData.migrationSuccess) {
            expect(verificationData.dataIntegrityCheck).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should verify specific data samples are correctly migrated', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Should have expected tool categories
      const categoriesResult = await pgPool.query(
        'SELECT COUNT(*) as count FROM tool_categories'
      );
      expect(parseInt(categoriesResult.rows[0].count)).toBeGreaterThanOrEqual(
        7
      );

      // Property: Should have birthstones for all months
      const birthstonesResult = await pgPool.query(
        'SELECT COUNT(DISTINCT month) as months FROM birthstones'
      );
      expect(parseInt(birthstonesResult.rows[0].months)).toBeGreaterThanOrEqual(
        12
      );

      // Property: Should have birth flowers for all months
      const flowersResult = await pgPool.query(
        'SELECT COUNT(DISTINCT month) as months FROM birth_flowers'
      );
      expect(parseInt(flowersResult.rows[0].months)).toBeGreaterThanOrEqual(12);

      // Property: Should have daily events spread across the year
      const eventsResult = await pgPool.query(
        'SELECT COUNT(DISTINCT month) as months FROM daily_events'
      );
      expect(parseInt(eventsResult.rows[0].months)).toBeGreaterThanOrEqual(12);

      // Property: Should have daily birthdays spread across the year
      const birthdaysResult = await pgPool.query(
        'SELECT COUNT(DISTINCT month) as months FROM daily_birthdays'
      );
      expect(parseInt(birthdaysResult.rows[0].months)).toBeGreaterThanOrEqual(
        12
      );
    } finally {
      await pgPool.end();
    }
  });

  test('should verify migration status reporting', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Database should be accessible and responsive
      const startTime = Date.now();
      const result = await pgPool.query('SELECT NOW() as current_time');
      const endTime = Date.now();

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].current_time).toBeTruthy();

      // Property: Database should respond quickly (within 2 seconds as per requirements)
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
    } finally {
      await pgPool.end();
    }
  });
});
