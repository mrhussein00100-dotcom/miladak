/**
 * Unified Database Configuration
 * يوحد جميع إعدادات قواعد البيانات في مكان واحد
 * يدعم SQLite و PostgreSQL
 */

import Database from 'better-sqlite3';
import path from 'path';
import { getDatabaseType } from './connection';
import {
  executePostgresQuery,
  executePostgresQueryOne,
  executePostgresCommand,
} from './postgres';

// مسار قاعدة البيانات الموحدة
export const UNIFIED_DB_PATH =
  process.env.DATABASE_URL || path.join(process.cwd(), 'database.sqlite');

let db: Database.Database | null = null;

/**
 * الحصول على اتصال قاعدة البيانات الموحدة
 */
export function getUnifiedDatabase(): Database.Database {
  // تجاهل أثناء البناء أو إذا كنا نستخدم PostgreSQL
  const dbType = getDatabaseType();
  if (
    dbType === 'postgres' ||
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
    // إرجاع كائن وهمي لتجنب الأخطاء
    return null as any;
  }

  if (db) return db;

  // تأكد من أن المسار ليس postgres URL
  let dbPath = UNIFIED_DB_PATH;
  if (dbPath.startsWith('postgres')) {
    dbPath = path.join(process.cwd(), 'database.sqlite');
  }

  db = new Database(dbPath);

  // تحسينات الأداء
  db.pragma('journal_mode = WAL');
  db.pragma('cache_size = -64000'); // 64MB cache
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');

  console.log('✅ قاعدة البيانات الموحدة جاهزة:', dbPath);

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
export async function queryOne<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | undefined> {
  const dbType = getDatabaseType();

  if (dbType === 'postgres') {
    return await executePostgresQueryOne<T>(sql, params);
  }

  // SQLite fallback
  const database = getUnifiedDatabase();
  return database.prepare(sql).get(...params) as T | undefined;
}

/**
 * تنفيذ استعلام متعدد النتائج
 */
export async function queryAll<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const dbType = getDatabaseType();

  if (dbType === 'postgres') {
    return await executePostgresQuery<T>(sql, params);
  }

  // SQLite fallback
  const database = getUnifiedDatabase();
  return database.prepare(sql).all(...params) as T[];
}

/**
 * تنفيذ استعلام تحديث/إدراج/حذف
 */
export async function execute(
  sql: string,
  params: any[] = []
): Promise<Database.RunResult | { changes: number; lastInsertRowid: number }> {
  const dbType = getDatabaseType();

  if (dbType === 'postgres') {
    const result = await executePostgresCommand(sql, params);
    return {
      changes: result.rowCount,
      lastInsertRowid: result.insertId || 0,
    };
  }

  // SQLite fallback
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
