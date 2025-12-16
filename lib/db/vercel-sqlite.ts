/**
 * SQLite Database for Vercel
 * حل مؤقت لاستخدام SQLite على Vercel
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

/**
 * إنشاء قاعدة بيانات SQLite في الذاكرة للإنتاج
 */
export function getVercelDatabase(): Database.Database {
  if (db) return db;

  try {
    // في بيئة الإنتاج، استخدم قاعدة بيانات في الذاكرة
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.log('🔄 إنشاء قاعدة بيانات SQLite في الذاكرة...');
      db = new Database(':memory:');

      // تهيئة الجداول الأساسية
      initializeInMemoryDatabase(db);

      console.log('✅ تم إنشاء قاعدة البيانات في الذاكرة');
    } else {
      // في بيئة التطوير، استخدم الملف المحلي
      const dbPath = path.join(process.cwd(), 'database.sqlite');
      console.log('🔄 الاتصال بقاعدة البيانات المحلية:', dbPath);

      if (!fs.existsSync(dbPath)) {
        console.warn('⚠️ ملف قاعدة البيانات غير موجود، سيتم إنشاؤه');
      }

      db = new Database(dbPath);
    }

    // تحسين الأداء
    db.pragma('journal_mode = WAL');
    db.pragma('cache_size = -64000');
    db.pragma('foreign_keys = ON');
    db.pragma('synchronous = NORMAL');
    db.pragma('temp_store = MEMORY');

    return db;
  } catch (error) {
    console.error('❌ فشل في إنشاء قاعدة البيانات:', error);
    throw error;
  }
}

/**
 * تهيئة قاعدة البيانات في الذاكرة بالجداول الأساسية
 */
function initializeInMemoryDatabase(database: Database.Database) {
  console.log('🔄 تهيئة الجداول الأساسية...');

  // جدول الأدوات
  database.exec(`
    CREATE TABLE IF NOT EXISTS tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      category_id INTEGER,
      href TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // جدول فئات الأدوات
  database.exec(`
    CREATE TABLE IF NOT EXISTS tool_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // جدول المقالات
  database.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      category_id INTEGER,
      image TEXT,
      featured_image TEXT,
      author TEXT,
      read_time INTEGER DEFAULT 5,
      views INTEGER DEFAULT 0,
      tags TEXT,
      published INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      meta_description TEXT,
      meta_keywords TEXT,
      focus_keyword TEXT,
      og_image TEXT,
      ai_provider TEXT,
      publish_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // جدول فئات المقالات
  database.exec(`
    CREATE TABLE IF NOT EXISTS article_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      color TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // إدراج بيانات تجريبية
  insertSampleData(database);

  console.log('✅ تم تهيئة الجداول الأساسية');
}

/**
 * إدراج بيانات تجريبية
 */
function insertSampleData(database: Database.Database) {
  try {
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
      database
        .prepare(
          `
        INSERT OR IGNORE INTO tool_categories (name, slug, title, icon, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `
        )
        .run(cat.name, cat.slug, cat.title, cat.icon, 1);
    }

    // أدوات تجريبية
    const tools = [
      {
        slug: 'age-calculator',
        title: 'حاسبة العمر',
        description: 'احسب عمرك بالسنوات والشهور والأيام',
        icon: '🎂',
        category_id: 1,
        href: '/age-calculator',
        featured: 1,
      },
      {
        slug: 'days-between',
        title: 'حاسبة الأيام بين التواريخ',
        description: 'احسب عدد الأيام بين تاريخين',
        icon: '📊',
        category_id: 1,
        href: '/days-between',
        featured: 1,
      },
    ];

    for (const tool of tools) {
      database
        .prepare(
          `
        INSERT OR IGNORE INTO tools (slug, title, description, icon, category_id, href, featured, active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          tool.slug,
          tool.title,
          tool.description,
          tool.icon,
          tool.category_id,
          tool.href,
          tool.featured,
          1,
          1
        );
    }

    console.log('✅ تم إدراج البيانات التجريبية');
  } catch (error) {
    console.error('⚠️ خطأ في إدراج البيانات التجريبية:', error);
  }
}
