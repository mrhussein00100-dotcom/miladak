/**
 * Vercel Postgres Database Connection
 * يدعم كلاً من SQLite (للتطوير المحلي) و Postgres (للإنتاج)
 */

import { sql } from '@vercel/postgres';

// التحقق من بيئة التشغيل
const isProduction = process.env.NODE_ENV === 'production';
const usePostgres = !!process.env.POSTGRES_URL;

/**
 * تنفيذ استعلام واحد
 */
export async function queryOne<T = any>(
  sqlQuery: string,
  params: any[] = []
): Promise<T | undefined> {
  if (!usePostgres) {
    // استخدام SQLite للتطوير المحلي
    const { queryOne: sqliteQueryOne } = await import('./database');
    return sqliteQueryOne<T>(sqlQuery, params);
  }

  // تحويل الاستعلام من SQLite إلى Postgres
  const pgQuery = convertToPostgres(sqlQuery);
  const result = await sql.query(pgQuery, params);
  return result.rows[0] as T | undefined;
}

/**
 * تنفيذ استعلام متعدد النتائج
 */
export async function queryAll<T = any>(
  sqlQuery: string,
  params: any[] = []
): Promise<T[]> {
  if (!usePostgres) {
    const { query } = await import('./database');
    return query<T>(sqlQuery, params);
  }

  const pgQuery = convertToPostgres(sqlQuery);
  const result = await sql.query(pgQuery, params);
  return result.rows as T[];
}

/**
 * تنفيذ استعلام تحديث/إدراج/حذف
 */
export async function execute(
  sqlQuery: string,
  params: any[] = []
): Promise<{ changes: number; lastInsertRowid: number }> {
  if (!usePostgres) {
    const { execute: sqliteExecute } = await import('./database');
    const result = sqliteExecute(sqlQuery, params);
    return {
      changes: result.changes,
      lastInsertRowid: Number(result.lastInsertRowid),
    };
  }

  const pgQuery = convertToPostgres(sqlQuery);
  const result = await sql.query(pgQuery, params);
  return {
    changes: result.rowCount || 0,
    lastInsertRowid: result.rows[0]?.id || 0,
  };
}

/**
 * تحويل استعلام SQLite إلى Postgres
 */
function convertToPostgres(query: string): string {
  let pgQuery = query;

  // تحويل ? إلى $1, $2, etc.
  let paramIndex = 0;
  pgQuery = pgQuery.replace(/\?/g, () => `$${++paramIndex}`);

  // تحويل AUTOINCREMENT إلى SERIAL
  pgQuery = pgQuery.replace(
    /INTEGER PRIMARY KEY AUTOINCREMENT/gi,
    'SERIAL PRIMARY KEY'
  );

  // تحويل DATETIME إلى TIMESTAMP
  pgQuery = pgQuery.replace(/DATETIME/gi, 'TIMESTAMP');

  // تحويل INTEGER (للـ boolean) إلى BOOLEAN
  // لا نفعل هذا تلقائياً لأنه قد يسبب مشاكل

  return pgQuery;
}

/**
 * التحقق من نوع قاعدة البيانات المستخدمة
 */
export function getDatabaseType(): 'postgres' | 'sqlite' {
  return usePostgres ? 'postgres' : 'sqlite';
}

/**
 * التحقق من اتصال قاعدة البيانات
 */
export async function checkConnection(): Promise<boolean> {
  try {
    if (usePostgres) {
      await sql`SELECT 1`;
    } else {
      const { getRawDatabase } = await import('./database');
      getRawDatabase();
    }
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export default {
  queryOne,
  queryAll,
  execute,
  getDatabaseType,
  checkConnection,
};
