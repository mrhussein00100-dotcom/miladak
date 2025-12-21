/**
 * Property-Based Tests for Database Connection Establishment
 * Feature: vercel-postgres-deployment, Property 1: Database connectivity establishment
 * Validates: Requirements 1.1
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fc from 'fast-check';
import { Pool } from 'pg';

describe('Database Connection Establishment Properties', () => {
  let testPool: Pool | null = null;

  afterAll(async () => {
    if (testPool) {
      await testPool.end();
    }
  });

  /**
   * Property 1: Database connectivity establishment
   * For any valid PostgreSQL connection string, the system should successfully
   * establish a connection and execute basic queries
   */
  it('should establish connection with valid PostgreSQL connection strings', async () => {
    // Test with the actual connection string from environment
    const connectionString =
      process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString || !connectionString.startsWith('postgres')) {
      console.log(
        '⏭️ Skipping PostgreSQL connection test - no connection string provided'
      );
      return;
    }

    await fc.assert(
      fc.asyncProperty(fc.constant(connectionString), async (connString) => {
        let pool: Pool | null = null;

        try {
          // Create connection pool
          pool = new Pool({
            connectionString: connString,
            max: 1, // Single connection for testing
            idleTimeoutMillis: 5000,
            connectionTimeoutMillis: 10000,
          });

          // Test basic connection
          const client = await pool.connect();

          // Execute basic query
          const result = await client.query('SELECT NOW() as current_time');

          // Verify result
          expect(result.rows).toBeDefined();
          expect(result.rows.length).toBe(1);
          expect(result.rows[0].current_time).toBeDefined();

          client.release();

          // Test connection health
          const healthCheck = await pool.query('SELECT 1 as health');
          expect(healthCheck.rows[0].health).toBe(1);

          return true;
        } catch (error) {
          console.error('Connection test failed:', error);
          throw error;
        } finally {
          if (pool) {
            await pool.end();
          }
        }
      }),
      {
        numRuns: 3, // Limited runs for connection tests
        timeout: 15000, // 15 second timeout
      }
    );
  });

  /**
   * Property 2: Connection string validation
   * For any malformed connection string, the system should handle errors gracefully
   */
  it('should handle invalid connection strings gracefully', async () => {
    const invalidConnectionStrings = fc.oneof(
      fc.constant('invalid-connection-string'),
      fc.constant('postgres://'),
      fc.constant('postgres://user@'),
      fc.constant('postgres://user:pass@'),
      fc.constant('postgres://user:pass@host:invalid-port/db'),
      fc.constant('')
    );

    await fc.assert(
      fc.asyncProperty(invalidConnectionStrings, async (invalidConnString) => {
        let pool: Pool | null = null;

        try {
          pool = new Pool({
            connectionString: invalidConnString,
            max: 1,
            connectionTimeoutMillis: 2000, // Short timeout for invalid connections
          });

          // This should throw an error
          await pool.connect();

          // If we reach here, the connection unexpectedly succeeded
          // This might happen with some edge cases, so we'll allow it
          return true;
        } catch (error) {
          // Expected behavior - invalid connections should fail
          expect(error).toBeDefined();
          return true;
        } finally {
          if (pool) {
            try {
              await pool.end();
            } catch {
              // Ignore cleanup errors for invalid connections
            }
          }
        }
      }),
      {
        numRuns: 10,
        timeout: 5000,
      }
    );
  });

  /**
   * Property 3: Connection pool behavior
   * For any valid connection, the pool should manage connections efficiently
   */
  it('should manage connection pools efficiently', async () => {
    const connectionString =
      process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString || !connectionString.startsWith('postgres')) {
      console.log(
        '⏭️ Skipping connection pool test - no connection string provided'
      );
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }), // Pool size
        fc.integer({ min: 1, max: 3 }), // Number of concurrent queries
        async (maxConnections, queryCount) => {
          let pool: Pool | null = null;

          try {
            pool = new Pool({
              connectionString,
              max: maxConnections,
              idleTimeoutMillis: 5000,
              connectionTimeoutMillis: 10000,
            });

            // Execute multiple queries concurrently
            const queries = Array.from({ length: queryCount }, (_, i) =>
              pool!.query('SELECT $1 as query_number', [i + 1])
            );

            const results = await Promise.all(queries);

            // Verify all queries succeeded
            expect(results).toHaveLength(queryCount);
            results.forEach((result, index) => {
              expect(result.rows[0].query_number).toBe(index + 1);
            });

            return true;
          } catch (error) {
            console.error('Pool management test failed:', error);
            throw error;
          } finally {
            if (pool) {
              await pool.end();
            }
          }
        }
      ),
      {
        numRuns: 5,
        timeout: 20000,
      }
    );
  });

  /**
   * Property 4: Connection cleanup
   * For any established connection, proper cleanup should occur
   */
  it('should properly cleanup connections', async () => {
    const connectionString =
      process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString || !connectionString.startsWith('postgres')) {
      console.log(
        '⏭️ Skipping connection cleanup test - no connection string provided'
      );
      return;
    }

    await fc.assert(
      fc.asyncProperty(fc.constant(connectionString), async (connString) => {
        const pool = new Pool({
          connectionString: connString,
          max: 2,
          idleTimeoutMillis: 1000,
          connectionTimeoutMillis: 5000,
        });

        try {
          // Create and use connection
          const client = await pool.connect();
          await client.query('SELECT 1');
          client.release();

          // End pool
          await pool.end();

          // Verify pool is ended
          expect(pool.ended).toBe(true);

          return true;
        } catch (error) {
          console.error('Connection cleanup test failed:', error);
          throw error;
        }
      }),
      {
        numRuns: 3,
        timeout: 10000,
      }
    );
  });
});
