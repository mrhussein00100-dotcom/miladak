/**
 * Database Connection Manager
 * يدعم SQLite للتطوير المحلي و PostgreSQL للإنتاج
 */

import Database from 'better-sqlite3';
import path from 'path';
import { getVercelDatabase } from './vercel-sqlite';

// Database singleton
let db: Database.Database | null = null;

/**
 * تحديد نوع قاعدة البيانات المستخدمة
 */
export function getDatabaseType(): 'sqlite' | 'postgres' {
  // إذا كان هناك POSTGRES_URL، استخدم PostgreSQL
  if (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL?.startsWith('postgres')
  ) {
    return 'postgres';
  }
  // وإلا استخدم SQLite
  return 'sqlite';
}

/**
 * الحصول على اتصال SQLite
 */
export function getSQLiteConnection(): Database.Database {
  if (db) return db;

  try {
    // استخدام النظام المحسن للـ Vercel
    db = getVercelDatabase();
    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error);

    // fallback إلى قاعدة بيانات في الذاكرة
    console.log('🔄 إنشاء قاعدة بيانات احتياطية في الذاكرة...');
    db = new Database(':memory:');

    // تحسين الأداء
    db.pragma('journal_mode = WAL');
    db.pragma('cache_size = -64000');
    db.pragma('foreign_keys = ON');
    db.pragma('synchronous = NORMAL');
    db.pragma('temp_store = MEMORY');

    return db;
  }
}

/**
 * تنفيذ استعلام SQLite
 */
export function executeSQLiteQuery<T>(
  sql: string,
  params: unknown[] = []
): T[] {
  const database = getSQLiteConnection();
  const stmt = database.prepare(sql);
  return stmt.all(...params) as T[];
}

/**
 * تنفيذ استعلام واحد SQLite
 */
export function executeSQLiteQueryOne<T>(
  sql: string,
  params: unknown[] = []
): T | undefined {
  const database = getSQLiteConnection();
  const stmt = database.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

/**
 * تنفيذ عملية تحديث/إدراج/حذف SQLite
 */
export function executeSQLiteCommand(
  sql: string,
  params: unknown[] = []
): Database.RunResult {
  const database = getSQLiteConnection();
  const stmt = database.prepare(sql);
  return stmt.run(...params);
}

/**
 * إغلاق اتصال قاعدة البيانات
 */
export function closeConnection(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * التحقق من تهيئة قاعدة البيانات
 */
export function isDatabaseInitialized(): boolean {
  try {
    const dbType = getDatabaseType();

    if (dbType === 'sqlite') {
      const database = getSQLiteConnection();
      const result = database
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='tools'"
        )
        .get();
      return !!result;
    }

    // للـ PostgreSQL، نفترض أنها مهيأة إذا كان هناك URL
    return !!process.env.POSTGRES_URL;
  } catch (error) {
    console.error('Database initialization check failed:', error);
    return false;
  }
}
