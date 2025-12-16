/**
 * Database Interface - Updated to use Unified Connection System
 * واجهة قاعدة البيانات - محدثة لاستخدام النظام الموحد
 */

import unifiedDb from './unified-connection';

// تهيئة قاعدة البيانات عند أول استخدام
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await unifiedDb.initialize();
    isInitialized = true;
  }
}

/**
 * Wrapper that provides async interface
 */
interface DatabaseWrapper {
  get: <T = unknown>(sql: string, params?: unknown[]) => Promise<T | undefined>;
  all: <T = unknown>(sql: string, params?: unknown[]) => Promise<T[]>;
  run: (
    sql: string,
    params?: unknown[]
  ) => Promise<{ changes: number; lastInsertRowid: number }>;
}

/**
 * Get database connection with async wrapper
 */
export async function getDatabase(): Promise<DatabaseWrapper> {
  await ensureInitialized();

  return {
    get: async <T = unknown>(
      sql: string,
      params: unknown[] = []
    ): Promise<T | undefined> => {
      const result = await unifiedDb.queryOne<T>(sql, params);
      return result || undefined;
    },
    all: async <T = unknown>(
      sql: string,
      params: unknown[] = []
    ): Promise<T[]> => {
      return await unifiedDb.query<T>(sql, params);
    },
    run: async (
      sql: string,
      params: unknown[] = []
    ): Promise<{ changes: number; lastInsertRowid: number }> => {
      const result = await unifiedDb.execute(sql, params);
      return {
        changes: result.changes || result.rowCount || 0,
        lastInsertRowid: result.lastInsertRowid || 0,
      };
    },
  };
}

/**
 * Get raw database connection
 * @deprecated Use the new unified system instead
 */
export function getRawDatabase(): any {
  console.warn(
    'getRawDatabase() is deprecated. Use the new async functions instead.'
  );
  throw new Error(
    'getRawDatabase is no longer supported. Use async database functions.'
  );
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  await unifiedDb.close();
  isInitialized = false;
}

/**
 * Execute a query with parameters
 */
export async function query<T>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  await ensureInitialized();
  return await unifiedDb.query<T>(sql, params);
}

/**
 * Execute a single row query
 */
export async function queryOne<T>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  await ensureInitialized();
  const result = await unifiedDb.queryOne<T>(sql, params);
  return result || undefined;
}

/**
 * Execute an insert/update/delete
 */
export async function execute(
  sql: string,
  params: unknown[] = []
): Promise<{ changes: number; lastInsertRowid: number }> {
  await ensureInitialized();
  const result = await unifiedDb.execute(sql, params);
  return {
    changes: result.changes || result.rowCount || 0,
    lastInsertRowid: result.lastInsertRowid || 0,
  };
}

/**
 * Execute multiple statements in a transaction
 */
export async function transaction<T>(fn: () => Promise<T>): Promise<T> {
  await ensureInitialized();
  return await unifiedDb.transaction(fn);
}

/**
 * Check if database is initialized
 */
export async function isDatabaseInitialized(): Promise<boolean> {
  try {
    await ensureInitialized();
    return await unifiedDb.isConnected();
  } catch {
    return false;
  }
}

const dbModule = {
  getDatabase,
  getRawDatabase,
  closeDatabase,
  query,
  queryOne,
  execute,
  transaction,
  isDatabaseInitialized,
};

export default dbModule;
