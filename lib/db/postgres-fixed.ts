/**
 * PostgreSQL Database Connection Manager - Fixed Version
 * نظام قاعدة بيانات محسن مع إصلاح مشاكل الاتصال
 */

import { Pool, PoolClient, QueryResult } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

function convertQuestionMarkPlaceholders(
  sql: string,
  params: unknown[]
): string {
  if (!sql.includes('?') || params.length === 0) return sql;

  let paramIndex = 1;
  let result = '';
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];

    if (ch === "'" && !inDouble) {
      if (inSingle && sql[i + 1] === "'") {
        result += "''";
        i++;
        continue;
      }
      inSingle = !inSingle;
      result += ch;
      continue;
    }

    if (ch === '"' && !inSingle) {
      if (inDouble && sql[i + 1] === '"') {
        result += '""';
        i++;
        continue;
      }
      inDouble = !inDouble;
      result += ch;
      continue;
    }

    if (ch === '?' && !inSingle && !inDouble) {
      result += `$${paramIndex}`;
      paramIndex++;
      continue;
    }

    result += ch;
  }

  return result;
}

class PostgreSQLManager {
  private pool: Pool | null = null;
  private config: DatabaseConfig | null = null;
  private isInitialized = false;

  /**
   * تهيئة الاتصال بقاعدة البيانات
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.config = this.getConfig();
      console.log('🔌 Connecting to PostgreSQL...');

      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });

      // اختبار الاتصال
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.isInitialized = true;
      console.log('✅ PostgreSQL connected successfully');
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  /**
   * الحصول على إعدادات قاعدة البيانات
   */
  private getConfig(): DatabaseConfig {
    // استخدام DATABASE_URL أو POSTGRES_URL
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    console.log('🔍 Database URL check:', dbUrl ? 'Found' : 'Not found');
    console.log(
      '🔍 DATABASE_URL:',
      process.env.DATABASE_URL ? 'Set' : 'Not set'
    );
    console.log(
      '🔍 POSTGRES_URL:',
      process.env.POSTGRES_URL ? 'Set' : 'Not set'
    );

    if (dbUrl && dbUrl.startsWith('postgres')) {
      try {
        const url = new URL(dbUrl);
        console.log('✅ Parsed database URL - Host:', url.hostname);
        return {
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          database: url.pathname.slice(1),
          user: url.username,
          password: url.password,
          ssl: true,
        };
      } catch (error) {
        console.error('❌ Error parsing database URL:', error);
      }
    }

    // إعدادات افتراضية - استخدام Prisma DB كافتراضي
    console.log('⚠️ Using default database config');
    return {
      host: process.env.DB_HOST || 'db.prisma.io',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'postgres',
      user:
        process.env.DB_USER ||
        '66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64',
      password: process.env.DB_PASSWORD || 'sk_ddn2SyAaNJotrrTIL_j2h',
      ssl: true,
    };
  }

  /**
   * تنفيذ استعلام
   */
  async query<T = any>(text: string, params: any[] = []): Promise<T[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const normalizedText = convertQuestionMarkPlaceholders(text, params);
      const result: QueryResult = await this.pool!.query(
        normalizedText,
        params
      );
      return result.rows as T[];
    } catch (error) {
      console.error('❌ Database query error:', error);
      console.error('SQL:', text);
      console.error('Params:', params);
      throw error;
    }
  }

  /**
   * تنفيذ استعلام واحد
   */
  async queryOne<T = any>(text: string, params: any[] = []): Promise<T | null> {
    const results = await this.query<T>(text, params);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * تنفيذ عملية تحديث/إدراج/حذف
   */
  async execute(text: string, params: any[] = []): Promise<QueryResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const normalizedText = convertQuestionMarkPlaceholders(text, params);
      return await this.pool!.query(normalizedText, params);
    } catch (error) {
      console.error('❌ Database execute error:', error);
      console.error('SQL:', text);
      console.error('Params:', params);
      throw error;
    }
  }

  /**
   * تنفيذ معاملة (Transaction)
   */
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const client = await this.pool!.connect();

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
   * إغلاق جميع الاتصالات
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isInitialized = false;
    }
  }

  /**
   * التحقق من حالة الاتصال
   */
  async isConnected(): Promise<boolean> {
    try {
      if (!this.pool || !this.isInitialized) return false;

      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * إنشاء الجداول الأساسية
   */
  async createTables(): Promise<void> {
    console.log('🔧 Creating database tables...');

    // لا نحتاج لإنشاء الجداول لأنها موجودة بالفعل
    // فقط نتحقق من وجودها
    try {
      const tablesResult = await this.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      console.log(`✅ Found ${tablesResult.length} tables in database`);

      if (tablesResult.length === 0) {
        console.log('⚠️ No tables found, database might need migration');
      }
    } catch (error) {
      console.error('❌ Error checking tables:', error);
    }
  }
}

// Singleton instance
const postgresManager = new PostgreSQLManager();

export default postgresManager;
export { PostgreSQLManager };
