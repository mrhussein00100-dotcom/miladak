import Database from 'better-sqlite3';
import path from 'path';

// Database singleton
let db: Database.Database | null = null;

/**
 * Get raw database connection with optimized settings
 */
export function getRawDatabase(): Database.Database {
  if (db) return db;

  const dbPath =
    process.env.DATABASE_URL || path.join(process.cwd(), 'database.sqlite');

  db = new Database(dbPath);

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  // Set cache size (negative = KB, positive = pages)
  db.pragma('cache_size = -64000'); // 64MB cache

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Synchronous mode for better performance with WAL
  db.pragma('synchronous = NORMAL');

  // Memory-mapped I/O
  db.pragma('mmap_size = 268435456'); // 256MB

  // Temp store in memory
  db.pragma('temp_store = MEMORY');

  return db;
}

/**
 * Wrapper that provides async-like interface for better-sqlite3
 */
interface DatabaseWrapper {
  get: <T = unknown>(sql: string, params?: unknown[]) => Promise<T | undefined>;
  all: <T = unknown>(sql: string, params?: unknown[]) => Promise<T[]>;
  run: (sql: string, params?: unknown[]) => Promise<Database.RunResult>;
}

/**
 * Get database connection with async-like wrapper
 */
export async function getDatabase(): Promise<DatabaseWrapper> {
  const rawDb = getRawDatabase();

  return {
    get: async <T = unknown>(
      sql: string,
      params: unknown[] = []
    ): Promise<T | undefined> => {
      const stmt = rawDb.prepare(sql);
      return stmt.get(...params) as T | undefined;
    },
    all: async <T = unknown>(
      sql: string,
      params: unknown[] = []
    ): Promise<T[]> => {
      const stmt = rawDb.prepare(sql);
      return stmt.all(...params) as T[];
    },
    run: async (
      sql: string,
      params: unknown[] = []
    ): Promise<Database.RunResult> => {
      const stmt = rawDb.prepare(sql);
      return stmt.run(...params);
    },
  };
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Execute a query with parameters
 */
export function query<T>(sql: string, params: unknown[] = []): T[] {
  const database = getRawDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(...params) as T[];
}

/**
 * Execute a single row query
 */
export function queryOne<T>(
  sql: string,
  params: unknown[] = []
): T | undefined {
  const database = getRawDatabase();
  const stmt = database.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

/**
 * Execute an insert/update/delete
 */
export function execute(
  sql: string,
  params: unknown[] = []
): Database.RunResult {
  const database = getRawDatabase();
  const stmt = database.prepare(sql);
  return stmt.run(...params);
}

/**
 * Execute multiple statements in a transaction
 */
export function transaction<T>(fn: () => T): T {
  const database = getRawDatabase();
  return database.transaction(fn)();
}

/**
 * Check if database is initialized
 */
export function isDatabaseInitialized(): boolean {
  try {
    const database = getRawDatabase();
    const result = database
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tools'"
      )
      .get();
    return !!result;
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
