/**
 * Database Interface - الواجهة الموحدة لقاعدة البيانات
 * يدعم SQLite و PostgreSQL بشفافية كاملة
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
 * تنفيذ استعلام مع إرجاع عدة نتائج
 */
export async function query<T>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  await ensureInitialized();
  return await unifiedDb.query<T>(sql, params);
}

/**
 * تنفيذ استعلام مع إرجاع نتيجة واحدة
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
 * تنفيذ عملية تحديث/إدراج/حذف
 */
export async function execute(
  sql: string,
  params: unknown[] = []
): Promise<any> {
  await ensureInitialized();
  const result = await unifiedDb.execute(sql, params);

  // إرجاع نتيجة متوافقة مع better-sqlite3
  return {
    changes: result.changes || result.rowCount || 0,
    lastInsertRowid: result.lastInsertRowid || 0,
  };
}

/**
 * تنفيذ معاملة
 */
export async function transaction<T>(callback: () => Promise<T>): Promise<T> {
  await ensureInitialized();
  return await unifiedDb.transaction(callback);
}

/**
 * التحقق من تهيئة قاعدة البيانات
 */
export async function isDatabaseInitialized(): Promise<boolean> {
  try {
    await ensureInitialized();
    return await unifiedDb.isConnected();
  } catch {
    return false;
  }
}

/**
 * إغلاق اتصال قاعدة البيانات
 */
export async function closeDatabase(): Promise<void> {
  await unifiedDb.close();
  isInitialized = false;
}

/**
 * الحصول على نوع قاعدة البيانات
 */
export function getDatabaseType(): string {
  return unifiedDb.getDatabaseType();
}

/**
 * تهيئة البيانات الأساسية
 */
export async function seedDatabase(): Promise<void> {
  await ensureInitialized();
  await unifiedDb.seedData();
}

// الواجهة القديمة للتوافق مع الكود الموجود
export function getRawDatabase(): any {
  throw new Error(
    'getRawDatabase is deprecated. Use the new async functions instead.'
  );
}

// تصدير الواجهة الموحدة
export default {
  query,
  queryOne,
  execute,
  transaction,
  isDatabaseInitialized,
  closeDatabase,
  getDatabaseType,
  seedDatabase,
};
