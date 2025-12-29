#!/usr/bin/env node

/**
 * ترحيل البيانات من SQLite إلى PostgreSQL
 * نسخ كامل للبيانات مع الحفاظ على العلاقات
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

  const schema = `
    -- Enable extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

    -- جدول الأدوات
    CREATE TABLE IF NOT EXISTS tools (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      category_id INTEGER REFERENCES tool_categories(id),
      href VARCHAR(500) NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      active BOOLEAN DEFAULT TRUE,
      sort_order INTEGER DEFAULT 0,
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

    -- جدول المقالات
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      category_id INTEGER REFERENCES article_categories(id),
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

    -- جدول الكلمات المفتاحية
    CREATE TABLE IF NOT EXISTS page_keywords (
      id SERIAL PRIMARY KEY,
      page_type VARCHAR(100) NOT NULL,
      page_slug VARCHAR(255) NOT NULL,
      page_title VARCHAR(255) NOT NULL,
      keywords TEXT,
      meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جداول إضافية من قاعدة البيانات الأصلية
    CREATE TABLE IF NOT EXISTS birthstones (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      stone_name VARCHAR(255) NOT NULL,
      stone_name_ar VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS birth_flowers (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      flower_name VARCHAR(255) NOT NULL,
      flower_name_ar VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_birthdays (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      day INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      profession VARCHAR(255),
      birth_year INTEGER,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_events (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      day INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      year INTEGER,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- الفهارس
    CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
    CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
    CREATE INDEX IF NOT EXISTS idx_daily_birthdays_date ON daily_birthdays(month, day);
    CREATE INDEX IF NOT EXISTS idx_daily_events_date ON daily_events(month, day);
  `;

  const statements = schema.split(';').filter((stmt) => stmt.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      await pgPool.query(statement.trim());
    }
  }

  console.log('✅ تم إنشاء الجداول بنجاح');
}

async function migrateAllTables(sqliteDb, pgPool) {
  // قائمة الجداول المهمة للترحيل
  const tablesToMigrate = [
    'tool_categories',
    'tools',
    'article_categories',
    'articles',
    'admin_users',
    'page_keywords',
    'birthstones',
    'birth_flowers',
    'daily_birthdays',
    'daily_events',
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
      .prepare(
        `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name=?
    `
      )
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
      await pgPool.query(`
        SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), 
        COALESCE((SELECT MAX(id) FROM ${tableName}), 1))
      `);
    }

    console.log(`   ✅ تم ترحيل ${insertedCount}/${rows.length} سجل`);
  } catch (error) {
    console.error(`   ❌ خطأ في ترحيل جدول ${tableName}:`, error.message);
  }
}

// تشغيل الترحيل
migrateData();
