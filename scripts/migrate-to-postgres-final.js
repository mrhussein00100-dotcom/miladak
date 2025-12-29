#!/usr/bin/env node

/**
 * ترحيل البيانات من SQLite إلى PostgreSQL - النسخة النهائية
 * يتطابق مع بنية قاعدة البيانات الفعلية
 */

const Database = require('better-sqlite3');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

console.log('🚀 بدء ترحيل البيانات من SQLite إلى PostgreSQL...\n');

// إعدادات قاعدة البيانات
const SQLITE_PATH = path.join(__dirname, '..', 'database.sqlite');
const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ متغير POSTGRES_URL غير موجود');
  console.log('يرجى تعيين POSTGRES_URL في متغيرات البيئة');
  process.exit(1);
}

if (!fs.existsSync(SQLITE_PATH)) {
  console.error('❌ ملف SQLite غير موجود:', SQLITE_PATH);
  process.exit(1);
}

async function migrateData() {
  let sqliteDb;
  let pgPool;

  try {
    // الاتصال بـ SQLite
    console.log('📂 الاتصال بـ SQLite...');
    sqliteDb = new Database(SQLITE_PATH, { readonly: true });

    // الاتصال بـ PostgreSQL
    console.log('🐘 الاتصال بـ PostgreSQL...');
    pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    // اختبار الاتصال
    await pgPool.query('SELECT NOW()');
    console.log('✅ تم الاتصال بقواعد البيانات بنجاح\n');

    // إنشاء الجداول في PostgreSQL
    await createPostgreSQLTables(pgPool);

    // ترحيل البيانات
    await migrateAllTables(sqliteDb, pgPool);

    // إنشاء الفهارس
    await createIndexes(pgPool);

    // عرض إحصائيات الترحيل
    await showMigrationStats(pgPool);

    console.log('\n🎉 تم ترحيل البيانات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في الترحيل:', error);
    process.exit(1);
  } finally {
    if (sqliteDb) sqliteDb.close();
    if (pgPool) await pgPool.end();
  }
}

async function createPostgreSQLTables(pgPool) {
  console.log('🔧 إنشاء الجداول في PostgreSQL...');

  const tables = [
    // جدول فئات الأدوات (tool_categories)
    `CREATE TABLE IF NOT EXISTS tool_categories (
      id SERIAL PRIMARY KEY,
      name TEXT,
      title TEXT,
      description TEXT,
      icon TEXT,
      color TEXT,
      sort_order INTEGER,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول الأدوات (tools)
    `CREATE TABLE IF NOT EXISTS tools (
      id SERIAL PRIMARY KEY,
      category_id INTEGER REFERENCES tool_categories(id),
      name TEXT,
      title TEXT,
      description TEXT,
      href TEXT,
      icon TEXT,
      keywords TEXT,
      sort_order INTEGER,
      is_active BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول الفئات (categories) - للمقالات
    `CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT,
      slug TEXT,
      description TEXT,
      color TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول المقالات (articles)
    `CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      category_id INTEGER REFERENCES categories(id),
      title TEXT,
      slug TEXT,
      content TEXT,
      excerpt TEXT,
      featured_image TEXT,
      author TEXT,
      read_time INTEGER DEFAULT 5,
      views INTEGER DEFAULT 0,
      tags TEXT,
      published BOOLEAN DEFAULT FALSE,
      featured BOOLEAN DEFAULT FALSE,
      meta_description TEXT,
      meta_keywords TEXT,
      focus_keyword TEXT,
      og_image TEXT,
      ai_provider TEXT,
      publish_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول المستخدمين الإداريين
    `CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT,
      role TEXT DEFAULT 'editor',
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول الكلمات المفتاحية
    `CREATE TABLE IF NOT EXISTS page_keywords (
      id SERIAL PRIMARY KEY,
      page_type TEXT,
      page_slug TEXT,
      page_title TEXT,
      keywords TEXT,
      meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول أحجار الميلاد
    `CREATE TABLE IF NOT EXISTS birthstones (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      stone_name TEXT,
      stone_name_ar TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول زهور الميلاد
    `CREATE TABLE IF NOT EXISTS birth_flowers (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      flower_name TEXT,
      flower_name_ar TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول المواليد اليومية
    `CREATE TABLE IF NOT EXISTS daily_birthdays (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      day INTEGER NOT NULL,
      name TEXT NOT NULL,
      profession TEXT,
      birth_year INTEGER,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول الأحداث اليومية
    `CREATE TABLE IF NOT EXISTS daily_events (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      day INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      year INTEGER,
      category TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول الألوان المحظوظة
    `CREATE TABLE IF NOT EXISTS lucky_colors (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      color_name TEXT,
      color_name_ar TEXT,
      hex_code TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول الفصول
    `CREATE TABLE IF NOT EXISTS seasons (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      season_name TEXT,
      season_name_ar TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // جدول الأبراج الصينية
    `CREATE TABLE IF NOT EXISTS chinese_zodiac (
      id SERIAL PRIMARY KEY,
      year INTEGER NOT NULL,
      animal_name TEXT,
      animal_name_ar TEXT,
      element TEXT,
      element_ar TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const table of tables) {
    try {
      await pgPool.query(table);
    } catch (error) {
      console.log(`⚠️ خطأ في إنشاء جدول: ${error.message}`);
    }
  }

  console.log('✅ تم إنشاء الجداول بنجاح');
}

async function createIndexes(pgPool) {
  console.log('🔧 إنشاء الفهارس...');

  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id)',
    'CREATE INDEX IF NOT EXISTS idx_tools_active ON tools(is_active)',
    'CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id)',
    'CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published)',
    'CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)',
    'CREATE INDEX IF NOT EXISTS idx_daily_birthdays_date ON daily_birthdays(month, day)',
    'CREATE INDEX IF NOT EXISTS idx_daily_events_date ON daily_events(month, day)',
    'CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)',
  ];

  for (const index of indexes) {
    try {
      await pgPool.query(index);
    } catch (error) {
      console.log(`⚠️ خطأ في إنشاء فهرس: ${error.message}`);
    }
  }

  console.log('✅ تم إنشاء الفهارس بنجاح');
}

async function migrateAllTables(sqliteDb, pgPool) {
  // قائمة الجداول المهمة للترحيل
  const tablesToMigrate = [
    'tool_categories',
    'tools',
    'categories',
    'articles',
    'admin_users',
    'page_keywords',
    'birthstones',
    'birth_flowers',
    'daily_birthdays',
    'daily_events',
    'lucky_colors',
    'seasons',
    'chinese_zodiac',
  ];

  for (const tableName of tablesToMigrate) {
    await migrateTable(sqliteDb, pgPool, tableName);
  }
}

async function migrateTable(sqliteDb, pgPool, tableName) {
  try {
    console.log(`📋 ترحيل جدول ${tableName}...`);

    // التحقق من وجود الجدول في SQLite
    const tableExists = sqliteDb
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
      .get(tableName);

    if (!tableExists) {
      console.log(`   ⚠️ الجدول ${tableName} غير موجود في SQLite`);
      return;
    }

    // الحصول على البيانات من SQLite
    const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();

    if (rows.length === 0) {
      console.log(`   📊 الجدول ${tableName} فارغ`);
      return;
    }

    // مسح البيانات الموجودة في PostgreSQL
    await pgPool.query(`DELETE FROM ${tableName}`);

    // إدراج البيانات
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    const insertQuery = `
      INSERT INTO ${tableName} (${columns.join(', ')}) 
      VALUES (${placeholders})
    `;

    let insertedCount = 0;

    for (const row of rows) {
      try {
        const values = columns.map((col) => row[col]);
        await pgPool.query(insertQuery, values);
        insertedCount++;
      } catch (error) {
        console.log(`   ⚠️ خطأ في إدراج سجل: ${error.message}`);
      }
    }

    // إعادة تعيين sequence للـ id
    if (columns.includes('id')) {
      try {
        await pgPool.query(`
          SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), 
          COALESCE((SELECT MAX(id) FROM ${tableName}), 1))
        `);
      } catch (error) {
        console.log(`   ⚠️ خطأ في إعادة تعيين sequence: ${error.message}`);
      }
    }

    console.log(`   ✅ تم ترحيل ${insertedCount}/${rows.length} سجل`);
  } catch (error) {
    console.error(`   ❌ خطأ في ترحيل جدول ${tableName}:`, error.message);
  }
}

async function showMigrationStats(pgPool) {
  console.log('\n📊 إحصائيات الترحيل:');

  const tables = [
    'tool_categories',
    'tools',
    'categories',
    'articles',
    'admin_users',
    'page_keywords',
    'birthstones',
    'birth_flowers',
    'daily_birthdays',
    'daily_events',
    'lucky_colors',
    'seasons',
    'chinese_zodiac',
  ];

  let totalRecords = 0;

  for (const table of tables) {
    try {
      const result = await pgPool.query(
        `SELECT COUNT(*) as count FROM ${table}`
      );
      const count = parseInt(result.rows[0].count);
      totalRecords += count;
      console.log(`   ${table}: ${count} سجل`);
    } catch (error) {
      console.log(`   ${table}: خطأ في العد`);
    }
  }

  console.log(`\n📈 إجمالي السجلات المرحلة: ${totalRecords}`);
}

// تشغيل الترحيل
migrateData();
