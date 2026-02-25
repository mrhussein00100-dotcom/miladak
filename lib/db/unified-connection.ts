/**
 * Unified Database Connection Manager - Fixed Version
 * نظام موحد يدعم SQLite و PostgreSQL مع حل مشاكل النشر
 */

import Database from 'better-sqlite3';
import postgresManager from './postgres-fixed';

export type DatabaseType = 'sqlite' | 'postgres';

interface QueryResult {
  rows?: any[];
  rowCount?: number;
  lastInsertRowid?: number | bigint;
  changes?: number;
}

class UnifiedDatabaseManager {
  private dbType: DatabaseType;
  private sqliteDb: Database.Database | null = null;

  constructor() {
    this.dbType = this.detectDatabaseType();
  }

  /**
   * تحديد نوع قاعدة البيانات المستخدمة
   */
  private detectDatabaseType(): DatabaseType {
    if (process.env.VERCEL_URL) {
      return 'postgres';
    }
    if (
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL?.startsWith('postgres') ||
      process.env.DATABASE_TYPE === 'postgres'
    ) {
      return 'postgres';
    }
    return 'sqlite';
  }

  /**
   * تهيئة قاعدة البيانات
   */
  async initialize(): Promise<void> {
    // تجاهل التهيئة أثناء البناء لتجنب تعليق العملية
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('⏭️ تجاهل تهيئة قاعدة البيانات (Next.js Build Phase)');
      return;
    }

    // تجاهل التهيئة أثناء البناء فقط (ليس في الإنتاج)
    if (
      process.env.NODE_ENV === 'production' &&
      !process.env.VERCEL &&
      !process.env.VERCEL_URL &&
      !process.env.POSTGRES_URL
    ) {
      console.log('⏭️ تجاهل تهيئة قاعدة البيانات (وضع البناء المحلي)');
      return;
    }

    console.log(`🔄 تهيئة قاعدة البيانات: ${this.dbType}`);

    try {
      if (this.dbType === 'postgres') {
        await postgresManager.initialize();
        await postgresManager.createTables();
      } else {
        this.initializeSQLite();
      }
      console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
    } catch (error) {
      console.error('⚠️ فشل تهيئة قاعدة البيانات (تم التجاهل لضمان استمرار البناء):', error);
    }
  }

  /**
   * تهيئة SQLite
   */
  private initializeSQLite(): void {
    const path = require('path');
    let dbPath = path.join(process.cwd(), 'database.sqlite');

    if (
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.startsWith('postgres')
    ) {
      dbPath = process.env.DATABASE_URL;
    }

    this.sqliteDb = new Database(dbPath);

    // تحسين الأداء
    this.sqliteDb.pragma('journal_mode = WAL');
    this.sqliteDb.pragma('cache_size = -64000');
    this.sqliteDb.pragma('foreign_keys = ON');
    this.sqliteDb.pragma('synchronous = NORMAL');
    this.sqliteDb.pragma('temp_store = MEMORY');
  }

  /**
   * تنفيذ استعلام
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    // أثناء البناء في أي بيئة (محلي أو إنتاج)، أرجع مصفوفة فارغة لتجنب مشاكل الاتصال
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return [];
    }
    
    // فحص إضافي للمتغيرات البيئية التي تشير للبناء
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.POSTGRES_URL) {
       // نحن في الغالب في بناء محلي
       return [];
    }

    if (this.dbType === 'postgres') {
        return await postgresManager.query<T>(sql, params);
      } else {
        if (!this.sqliteDb) {
          this.initializeSQLite();
        }

        const stmt = this.sqliteDb!.prepare(sql);
        return stmt.all(...params) as T[];
      }
    
  }

  /**
   * تنفيذ استعلام واحد
   */
  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    if (this.dbType === 'postgres') {
      return await postgresManager.queryOne<T>(sql, params);
    } else {
      if (!this.sqliteDb) {
        this.initializeSQLite();
      }

      const stmt = this.sqliteDb!.prepare(sql);
      return (stmt.get(...params) as T) || null;
    }
  }

  /**
   * تنفيذ عملية تحديث/إدراج/حذف
   */
  async execute(sql: string, params: any[] = []): Promise<QueryResult> {
    if (this.dbType === 'postgres') {
      const result = await postgresManager.execute(sql, params);
      return {
        rowCount: result.rowCount || 0,
        rows: result.rows,
      };
    } else {
      if (!this.sqliteDb) {
        this.initializeSQLite();
      }

      const stmt = this.sqliteDb!.prepare(sql);
      const result = stmt.run(...params);
      return {
        changes: result.changes,
        lastInsertRowid:
          typeof result.lastInsertRowid === 'bigint'
            ? Number(result.lastInsertRowid)
            : result.lastInsertRowid,
      };
    }
  }

  /**
   * تنفيذ معاملة
   */
  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    if (this.dbType === 'postgres') {
      return await postgresManager.transaction(async () => {
        return await callback();
      });
    } else {
      if (!this.sqliteDb) {
        this.initializeSQLite();
      }

      return this.sqliteDb!.transaction(callback)();
    }
  }

  /**
   * التحقق من حالة الاتصال
   */
  async isConnected(): Promise<boolean> {
    try {
      if (this.dbType === 'postgres') {
        return await postgresManager.isConnected();
      } else {
        if (!this.sqliteDb) return false;

        const result = this.sqliteDb.prepare('SELECT 1').get();
        return !!result;
      }
    } catch {
      return false;
    }
  }

  /**
   * إغلاق الاتصال
   */
  async close(): Promise<void> {
    if (this.dbType === 'postgres') {
      await postgresManager.close();
    } else if (this.sqliteDb) {
      this.sqliteDb.close();
      this.sqliteDb = null;
    }
  }

  /**
   * الحصول على نوع قاعدة البيانات
   */
  getDatabaseType(): DatabaseType {
    return this.dbType;
  }

  /**
   * تهيئة البيانات الأساسية
   */
  async seedData(): Promise<void> {
    console.log('🌱 تهيئة البيانات الأساسية...');

    // فئات الأدوات
    const categories = [
      {
        name: 'حاسبات التاريخ',
        slug: 'date-calculators',
        title: 'حاسبات التاريخ والوقت',
        icon: '📅',
      },
      {
        name: 'أدوات النص',
        slug: 'text-tools',
        title: 'أدوات معالجة النص',
        icon: '📝',
      },
      {
        name: 'أدوات الصحة',
        slug: 'health-tools',
        title: 'أدوات الصحة واللياقة',
        icon: '🏥',
      },
    ];

    for (const cat of categories) {
      await this.execute(
        `
        INSERT INTO tool_categories (name, slug, title, icon, sort_order)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO NOTHING
      `,
        [cat.name, cat.slug, cat.title, cat.icon, 1]
      );
    }

    // أدوات أساسية
    const tools = [
      {
        slug: 'age-calculator',
        title: 'حاسبة العمر',
        description: 'احسب عمرك بالسنوات والشهور والأيام',
        icon: '🎂',
        category_id: 1,
        href: '/age-calculator',
        featured: true,
      },
      {
        slug: 'days-between',
        title: 'حاسبة الأيام بين التواريخ',
        description: 'احسب عدد الأيام بين تاريخين',
        icon: '📊',
        category_id: 1,
        href: '/days-between',
        featured: true,
      },
    ];

    for (const tool of tools) {
      await this.execute(
        `
        INSERT INTO tools (slug, title, description, icon, category_id, href, featured, active, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (slug) DO NOTHING
      `,
        [
          tool.slug,
          tool.title,
          tool.description,
          tool.icon,
          tool.category_id,
          tool.href,
          tool.featured,
          true,
          1,
        ]
      );
    }

    console.log('✅ تم تهيئة البيانات الأساسية');
  }
}

// Singleton instance
const unifiedDb = new UnifiedDatabaseManager();

export default unifiedDb;
export { UnifiedDatabaseManager };
