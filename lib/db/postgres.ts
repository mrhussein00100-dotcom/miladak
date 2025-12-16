/**
 * PostgreSQL Database Connection
 * نظام قاعدة البيانات الدائم للإنتاج
 */

import { Pool, PoolClient } from 'pg';

let pool: Pool | null = null;

/**
 * إنشاء pool اتصالات PostgreSQL
 */
function createPool(): Pool {
  if (pool) return pool;

  const connectionString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!connectionString) {
    throw new Error(
      'PostgreSQL connection string not found in environment variables'
    );
  }

  pool = new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // معالجة الأخطاء
  pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
  });

  console.log('✅ PostgreSQL pool created');
  return pool;
}

/**
 * الحصول على اتصال PostgreSQL
 */
export async function getPostgresConnection(): Promise<PoolClient> {
  const pgPool = createPool();
  return await pgPool.connect();
}

/**
 * تنفيذ استعلام PostgreSQL
 */
export async function executePostgresQuery<T>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const client = await getPostgresConnection();

  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

/**
 * تنفيذ استعلام واحد PostgreSQL
 */
export async function executePostgresQueryOne<T>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  const rows = await executePostgresQuery<T>(sql, params);
  return rows[0];
}

/**
 * تنفيذ أمر PostgreSQL (INSERT, UPDATE, DELETE)
 */
export async function executePostgresCommand(
  sql: string,
  params: unknown[] = []
): Promise<{ rowCount: number; insertId?: number }> {
  const client = await getPostgresConnection();

  try {
    const result = await client.query(sql, params);
    return {
      rowCount: result.rowCount || 0,
      insertId: result.rows[0]?.id,
    };
  } finally {
    client.release();
  }
}

/**
 * تنفيذ معاملة PostgreSQL
 */
export async function executePostgresTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPostgresConnection();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * إغلاق pool الاتصالات
 */
export async function closePostgresPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ PostgreSQL pool closed');
  }
}

/**
 * اختبار الاتصال بـ PostgreSQL
 */
export async function testPostgresConnection(): Promise<boolean> {
  try {
    const client = await getPostgresConnection();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ PostgreSQL connection test successful');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection test failed:', error);
    return false;
  }
}
