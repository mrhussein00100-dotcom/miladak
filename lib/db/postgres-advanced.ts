/**
 * PostgreSQL Database Connection Manager
 * نظام قاعدة بيانات متقدم مع دعم كامل لـ PostgreSQL
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

class PostgreSQLManager {
  private pool: Pool | null = null;
  private config: DatabaseConfig | null = null;

  /**
   * تهيئة الاتصال بقاعدة البيانات
   */
  async initialize(): Promise<void> {
    try {
      this.config = this.getConfig();

      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
        max: 20, // حد أقصى للاتصالات
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // اختبار الاتصال
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      console.log('✅ PostgreSQL connected successfully');
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error);
      throw error;
    }
  }

  /**
   * الحصول على إعدادات قاعدة البيانات
   */
  private getConfig(): DatabaseConfig {
    // Vercel Postgres
    if (process.env.POSTGRES_URL) {
      const url = new URL(process.env.POSTGRES_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
        ssl: true,
      };
    }

    // إعدادات مخصصة
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'miladak',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: process.env.DB_SSL === 'true',
    };
  }

  /**
   * تنفيذ استعلام
   */
  async query<T = any>(text: string, params: any[] = []): Promise<T[]> {
    if (!this.pool) {
      await this.initialize();
    }

    try {
      const result: QueryResult = await this.pool!.query(text, params);
      return result.rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
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
    if (!this.pool) {
      await this.initialize();
    }

    try {
      return await this.pool!.query(text, params);
    } catch (error) {
      console.error('Database execute error:', error);
      throw error;
    }
  }

  /**
   * تنفيذ معاملة (Transaction)
   */
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    if (!this.pool) {
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
    }
  }

  /**
   * التحقق من حالة الاتصال
   */
  async isConnected(): Promise<boolean> {
    try {
      if (!this.pool) return false;

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
    const schema = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- جدول الأدوات
      CREATE TABLE IF NOT EXISTS tools (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        category_id INTEGER,
        href VARCHAR(500) NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول فئات الأدوات
      CREATE TABLE IF NOT EXISTS tool_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255),
        icon VARCHAR(100),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول المقالات
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        category_id INTEGER,
        image VARCHAR(500),
        featured_image VARCHAR(500),
        author VARCHAR(255),
        read_time INTEGER DEFAULT 5,
        views INTEGER DEFAULT 0,
        tags TEXT,
        published BOOLEAN DEFAULT FALSE,
        featured BOOLEAN DEFAULT FALSE,
        meta_description TEXT,
        meta_keywords TEXT,
        focus_keyword VARCHAR(255),
        og_image VARCHAR(500),
        ai_provider VARCHAR(100),
        publish_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول فئات المقالات
      CREATE TABLE IF NOT EXISTS article_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        color VARCHAR(50),
        icon VARCHAR(100),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول المستخدمين الإداريين
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        password_salt VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'editor',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- الفهارس
      CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
      CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
    `;

    const statements = schema.split(';').filter((stmt) => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await this.execute(statement.trim());
      }
    }

    console.log('✅ Database tables created successfully');
  }
}

// Singleton instance
const postgresManager = new PostgreSQLManager();

export default postgresManager;
export { PostgreSQLManager };
