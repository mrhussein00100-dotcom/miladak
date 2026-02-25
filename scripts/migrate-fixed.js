#!/usr/bin/env node

/**
 * ترحيل البيانات المحدث - يحل مشاكل هيكل الجداول
 */

const Database = require('better-sqlite3');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

console.log('🚀 بدء ترحيل البيانات المحدث...\n');

const SQLITE_PATH = path.join(__dirname, '..', 'database.sqlite');
const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ متغير POSTGRES_URL غير موجود');
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
    console.log('📂 الاتصال بـ SQLite...');
    sqliteDb = new Database(SQLITE_PATH, { readonly: true });

    console.log('🐘 الاتصال بـ PostgreSQL...');
    pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    await pgPool.query('SELECT NOW()');
    console.log('✅ تم الاتصال بقواعد البيانات بنجاح\n');

    // إنشاء الجداول المحدثة
    await createUpdatedTables(pgPool);

    // ترحيل البيانات مع التعامل مع الاختلافات
    await migrateWithMapping(sqliteDb, pgPool);

    console.log('\n🎉 تم ترحيل البيانات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في الترحيل:', error);
    process.exit(1);
  } finally {
    if (sqliteDb) sqliteDb.close();
    if (pgPool) await pgPool.end();
  }
}

async function createUpdatedTables(pgPool) {
  console.log('🔧 إنشاء الجداول المحدثة...');

  const schema = `
    -- Enable extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- حذف الجداول الموجودة
    DROP TABLE IF EXISTS articles CASCADE;
    DROP TABLE IF EXISTS tools CASCADE;
    DROP TABLE IF EXISTS tool_categories CASCADE;
    DROP TABLE IF EXISTS article_categories CASCADE;
    DROP TABLE IF EXISTS admin_users CASCADE;
    DROP TABLE IF EXISTS page_keywords CASCADE;
    DROP TABLE IF EXISTS birthstones CASCADE;
    DROP TABLE IF EXISTS birth_flowers CASCADE;
    DROP TABLE IF EXISTS daily_birthdays CASCADE;
    DROP TABLE IF EXISTS daily_events CASCADE;

    -- جدول فئات الأدوات (متطابق مع SQLite)
    CREATE TABLE tool_categories (
      id SERIAL PRIMARY KEY,
      name TEXT,
      title TEXT,
      description TEXT,
      icon TEXT,
      color TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول الأدوات (متطابق مع SQLite)
    CREATE TABLE tools (
      id SERIAL PRIMARY KEY,
      category_id INTEGER REFERENCES tool_categories(id),
      name TEXT,
      title TEXT,
      description TEXT,
      href TEXT,
      icon TEXT,
      keywords TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول فئات المقالات (من جدول categories في SQLite)
    CREATE TABLE article_categories (
      id SERIAL PRIMARY KEY,
      name TEXT,
      slug TEXT,
      description TEXT,
      color TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول المقالات (محدث ليتطابق مع SQLite)
    CREATE TABLE articles (
      id SERIAL PRIMARY KEY,
      slug TEXT,
      title TEXT,
      excerpt TEXT,
      content TEXT,
      category_id INTEGER REFERENCES article_categories(id),
      image TEXT,
      featured_image TEXT,
      author TEXT DEFAULT 'Admin',
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
    );

    -- باقي الجداول
    CREATE TABLE admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      role TEXT DEFAULT 'editor',
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE page_keywords (
      id SERIAL PRIMARY KEY,
      page_type TEXT NOT NULL,
      page_slug TEXT NOT NULL,
      page_title TEXT NOT NULL,
      keywords TEXT,
      meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE birthstones (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      stone_name TEXT NOT NULL,
      stone_name_ar TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE birth_flowers (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      flower_name TEXT NOT NULL,
      flower_name_ar TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE daily_birthdays (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      day INTEGER NOT NULL,
      name TEXT NOT NULL,
      profession TEXT,
      birth_year INTEGER,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE daily_events (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      day INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      year INTEGER,
      category TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- الفهارس
    CREATE INDEX idx_tools_category ON tools(category_id);
    CREATE INDEX idx_articles_category ON articles(category_id);
    CREATE INDEX idx_daily_birthdays_date ON daily_birthdays(month, day);
    CREATE INDEX idx_daily_events_date ON daily_events(month, day);
  `;

  const statements = schema.split(';').filter((stmt) => stmt.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      await pgPool.query(statement.trim());
    }
  }

  console.log('✅ تم إنشاء الجداول المحدثة بنجاح');
}

async function migrateWithMapping(sqliteDb, pgPool) {
  // ترحيل فئات الأدوات
  await migrateTableDirect(sqliteDb, pgPool, 'tool_categories');

  // ترحيل الأدوات
  await migrateTableDirect(sqliteDb, pgPool, 'tools');

  // ترحيل فئات المقالات (من جدول categories)
  await migrateCategoriesToArticleCategories(sqliteDb, pgPool);

  // ترحيل المقالات
  await migrateTableDirect(sqliteDb, pgPool, 'articles');

  // ترحيل باقي الجداول
  await migrateTableDirect(sqliteDb, pgPool, 'admin_users');
  await migrateTableDirect(sqliteDb, pgPool, 'page_keywords');
  await migrateTableDirect(sqliteDb, pgPool, 'birthstones');
  await migrateTableDirect(sqliteDb, pgPool, 'birth_flowers');
  await migrateTableDirect(sqliteDb, pgPool, 'daily_birthdays');
  await migrateTableDirect(sqliteDb, pgPool, 'daily_events');
}

async function migrateTableDirect(sqliteDb, pgPool, tableName) {
  try {
    console.log(`📋 ترحيل جدول ${tableName}...`);

    const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();

    if (rows.length === 0) {
      console.log(`   📊 الجدول ${tableName} فارغ`);
      return;
    }

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

    // إعادة تعيين sequence
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

async function migrateCategoriesToArticleCategories(sqliteDb, pgPool) {
  try {
    console.log(`📋 ترحيل جدول categories إلى article_categories...`);

    const rows = sqliteDb.prepare(`SELECT * FROM categories`).all();

    if (rows.length === 0) {
      console.log(`   📊 جدول categories فارغ`);
      return;
    }

    let insertedCount = 0;

    for (const row of rows) {
      try {
        await pgPool.query(
          `
          INSERT INTO article_categories (id, name, slug, description, color, icon, sort_order, created_at, updated_at) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
          [
            row.id,
            row.name,
            row.slug || row.name?.toLowerCase().replace(/\s+/g, '-'),
            row.description,
            row.color,
            row.icon,
            row.sort_order || 0,
            row.created_at,
            row.updated_at,
          ]
        );
        insertedCount++;
      } catch (error) {
        console.log(`   ⚠️ خطأ في إدراج فئة: ${error.message}`);
      }
    }

    // إعادة تعيين sequence
    await pgPool.query(`
      SELECT setval(pg_get_serial_sequence('article_categories', 'id'), 
      COALESCE((SELECT MAX(id) FROM article_categories), 1))
    `);

    console.log(`   ✅ تم ترحيل ${insertedCount}/${rows.length} فئة مقال`);
  } catch (error) {
    console.error(`   ❌ خطأ في ترحيل فئات المقالات:`, error.message);
  }
}

// تشغيل الترحيل
migrateData();
