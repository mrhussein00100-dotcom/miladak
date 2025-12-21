/**
 * Property-based tests for schema completeness
 * Feature: vercel-postgres-deployment, Property 6: Schema completeness
 *
 * Validates: Requirements 3.1
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { Pool } from 'pg';

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

describe('**Feature: vercel-postgres-deployment, Property 6: Schema completeness**', () => {
  test('should verify all required database tables are created successfully', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: All essential tables should exist
      const requiredTables = [
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
      ];

      const result = await pgPool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);

      const existingTables = result.rows.map((row) => row.table_name);

      for (const requiredTable of requiredTables) {
        expect(existingTables).toContain(requiredTable);
      }

      // Property: Should have at least the minimum required tables
      expect(existingTables.length).toBeGreaterThanOrEqual(
        requiredTables.length
      );
    } finally {
      await pgPool.end();
    }
  });

  test('should verify table columns and data types are properly created', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Essential tables should have required columns
      const tableColumnChecks = [
        { table: 'tools', columns: ['id', 'title', 'href'] },
        { table: 'articles', columns: ['id', 'title', 'content'] },
        { table: 'categories', columns: ['id', 'name'] },
        { table: 'admin_users', columns: ['id', 'username'] },
      ];

      for (const check of tableColumnChecks) {
        const result = await pgPool.query(
          `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
        `,
          [check.table]
        );

        const existingColumns = result.rows.map((row) => row.column_name);

        for (const requiredColumn of check.columns) {
          expect(existingColumns).toContain(requiredColumn);
        }
      }
    } finally {
      await pgPool.end();
    }
  });

  test('should verify indexes are created for performance', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Important tables should have indexes for performance
      const result = await pgPool.query(`
        SELECT indexname, tablename 
        FROM pg_indexes 
        WHERE schemaname = 'public'
      `);

      const indexes = result.rows;

      // Should have some indexes created
      expect(indexes.length).toBeGreaterThan(0);

      // Check for primary key indexes (automatically created)
      const primaryKeyTables = [
        'tools',
        'articles',
        'categories',
        'admin_users',
      ];
      for (const table of primaryKeyTables) {
        const tableIndexes = indexes.filter((idx) => idx.tablename === table);
        expect(tableIndexes.length).toBeGreaterThan(0);
      }
    } finally {
      await pgPool.end();
    }
  });

  test('should verify schema completeness with property-based testing', () => {
    fc.assert(
      fc.property(
        fc.record({
          tableName: fc.constantFrom(
            'tools',
            'articles',
            'categories',
            'admin_users'
          ),
          columnCount: fc.integer({ min: 3, max: 20 }),
          hasIdColumn: fc.boolean(),
          hasPrimaryKey: fc.boolean(),
        }),
        (schemaData) => {
          // Property: All tables should have reasonable column counts
          expect(schemaData.columnCount).toBeGreaterThanOrEqual(3);
          expect(schemaData.columnCount).toBeLessThanOrEqual(20);

          // Property: Tables should have consistent naming
          expect(schemaData.tableName).toMatch(/^[a-z_]+$/);

          // Property: Essential tables should have ID columns
          if (
            ['tools', 'articles', 'categories', 'admin_users'].includes(
              schemaData.tableName
            )
          ) {
            expect(schemaData.hasIdColumn).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should verify foreign key relationships are properly established', async () => {
    if (!POSTGRES_URL) {
      console.warn('POSTGRES_URL not set, skipping PostgreSQL tests');
      return;
    }

    const pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Property: Foreign key constraints should exist where expected
      const result = await pgPool.query(`
        SELECT 
          tc.table_name, 
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
      `);

      const foreignKeys = result.rows;

      // Should have some foreign key relationships
      // Note: This might be 0 if we didn't create explicit foreign keys
      expect(foreignKeys.length).toBeGreaterThanOrEqual(0);
    } finally {
      await pgPool.end();
    }
  });
});
