/**
 * Unified Database Configuration
 * يوحد جميع إعدادات قواعد البيانات في مكان واحد
 */

import Database from 'better-sqlite3';
import path from 'path';

// مسار قاعدة البيانات الموحدة
export const UNIFIED_DB_PATH =
  process.env.DATABASE_URL || path.join(process.cwd(), 'database.sqlite');

let db: Database.Database | null = null;

/**
 * الحصول على اتصال قاعدة البيانات الموحدة
 */
export function getUnifiedDatabase(): Database.Database {
  if (db) return db;

  db = new Database(UNIFIED_DB_PATH);

  // تحسينات الأداء
  db.pragma('journal_mode = WAL');
  db.pragma('cache_size = -64000'); // 64MB cache
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');

  console.log('✅ قاعدة البيانات الموحدة جاهزة:', UNIFIED_DB_PATH);

  return db;
}

/**
 * إغلاق اتصال قاعدة البيانات
 */
export function closeUnifiedDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('📊 تم إغلاق قاعدة البيانات الموحدة');
  }
}

/**
 * تنفيذ استعلام بسيط
 */
export function queryOne<T = any>(
  sql: string,
  params: any[] = []
): T | undefined {
  const database = getUnifiedDatabase();
  return database.prepare(sql).get(...params) as T | undefined;
}

/**
 * تنفيذ استعلام متعدد النتائج
 */
export function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  const database = getUnifiedDatabase();
  return database.prepare(sql).all(...params) as T[];
}

/**
 * تنفيذ استعلام تحديث/إدراج/حذف
 */
export function execute(sql: string, params: any[] = []): Database.RunResult {
  const database = getUnifiedDatabase();
  return database.prepare(sql).run(...params);
}

/**
 * تنفيذ معاملة (transaction)
 */
export function transaction<T>(callback: (db: Database.Database) => T): T {
  const database = getUnifiedDatabase();
  const txn = database.transaction(callback);
  return txn(database);
}

export default {
  getUnifiedDatabase,
  closeUnifiedDatabase,
  queryOne,
  queryAll,
  execute,
  transaction,
  UNIFIED_DB_PATH,
};
