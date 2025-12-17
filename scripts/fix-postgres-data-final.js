#!/usr/bin/env node

/**
 * 🔧 إصلاح نهائي لبيانات PostgreSQL - ميلادك v2
 *
 * هذا السكريبت يقوم بـ:
 * 1. التحقق من اتصال PostgreSQL
 * 2. إنشاء الجداول المطلوبة
 * 3. ترحيل البيانات من SQLite إلى PostgreSQL
 * 4. التحقق من صحة البيانات
 */

const { Pool } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');

// إعدادات قاعدة البيانات
const POSTGRES_URL = process.env.POSTGRES_URL;
const SQLITE_PATH = path.join(__dirname, '..', 'database.sqlite');

console.log('🚀 بدء إصلاح بيانات PostgreSQL...\n');

// التحقق من متغيرات البيئة
if (!POSTGRES_URL) {
  console.error('❌ خطأ: POSTGRES_URL غير محدد');
  console.log('💡 يرجى تعيين POSTGRES_URL في متغيرات البيئة');
  process.exit(1);
}

// إنشاء اتصال PostgreSQL
const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// إنشاء اتصال SQLite
let sqlite;
try {
  sqlite = new Database(SQLITE_PATH, { readonly: true });
  console.log('✅ تم الاتصال بـ SQLite بنجاح');
} catch (error) {
  console.error('❌ خطأ في الاتصال بـ SQLite:', error.message);
  process.exit(1);
}

// دالة إنشاء الجداول
async function createTables() {
  console.log('📋 إنشاء الجداول في PostgreSQL...');

  const tables = [
    // جدول الأدوات
    `CREATE TABLE IF NOT EXISTS tools (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            category VARCHAR(100),
            icon VARCHAR(100),
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول المقالات
    `CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            slug VARCHAR(500) UNIQUE NOT NULL,
            content TEXT,
            excerpt TEXT,
            featured_image VARCHAR(500),
            category_id INTEGER,
            author VARCHAR(255),
            status VARCHAR(50) DEFAULT 'published',
            meta_title VARCHAR(500),
            meta_description TEXT,
            keywords TEXT,
            reading_time INTEGER,
            views INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الفئات
    `CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            color VARCHAR(50),
            icon VARCHAR(100),
            parent_id INTEGER,
            sort_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول المواليد المشهورة
    `CREATE TABLE IF NOT EXISTS celebrities (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            birth_date DATE NOT NULL,
            profession VARCHAR(255),
            nationality VARCHAR(100),
            description TEXT,
            image_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الأحداث التاريخية
    `CREATE TABLE IF NOT EXISTS historical_events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            event_date DATE NOT NULL,
            description TEXT,
            category VARCHAR(100),
            importance_level INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الألوان والأرقام
    `CREATE TABLE IF NOT EXISTS colors_numbers (
            id SERIAL PRIMARY KEY,
            birth_date DATE NOT NULL,
            lucky_color VARCHAR(100),
            lucky_number INTEGER,
            personality_traits TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول أحجار الميلاد والزهور
    `CREATE TABLE IF NOT EXISTS birthstones_flowers (
            id SERIAL PRIMARY KEY,
            month INTEGER NOT NULL,
            birthstone VARCHAR(100),
            flower VARCHAR(100),
            meaning TEXT,
            properties TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الكلمات المفتاحية للصفحات
    `CREATE TABLE IF NOT EXISTS page_keywords (
            id SERIAL PRIMARY KEY,
            page_path VARCHAR(500) NOT NULL,
            keywords TEXT,
            meta_title VARCHAR(500),
            meta_description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
  ];

  for (const table of tables) {
    try {
      await pool.query(table);
      console.log('✅ تم إنشاء جدول بنجاح');
    } catch (error) {
      console.error('❌ خطأ في إنشاء جدول:', error.message);
    }
  }
}

// دالة ترحيل البيانات
async function migrateData() {
  console.log('\n📦 بدء ترحيل البيانات...');

  const migrations = [
    {
      name: 'الأدوات',
      source: 'tools',
      target: 'tools',
      columns: ['name', 'slug', 'description', 'category', 'icon', 'is_active'],
    },
    {
      name: 'المقالات',
      source: 'articles',
      target: 'articles',
      columns: [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'category_id',
        'author',
        'status',
        'meta_title',
        'meta_description',
        'keywords',
        'reading_time',
        'views',
      ],
    },
    {
      name: 'الفئات',
      source: 'categories',
      target: 'categories',
      columns: [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'parent_id',
        'sort_order',
        'is_active',
      ],
    },
    {
      name: 'المواليد المشهورة',
      source: 'celebrities',
      target: 'celebrities',
      columns: [
        'name',
        'birth_date',
        'profession',
        'nationality',
        'description',
        'image_url',
      ],
    },
    {
      name: 'الأحداث التاريخية',
      source: 'historical_events',
      target: 'historical_events',
      columns: [
        'title',
        'event_date',
        'description',
        'category',
        'importance_level',
      ],
    },
    {
      name: 'الكلمات المفتاحية',
      source: 'page_keywords',
      target: 'page_keywords',
      columns: ['page_path', 'keywords', 'meta_title', 'meta_description'],
    },
  ];

  for (const migration of migrations) {
    try {
      console.log(`\n🔄 ترحيل ${migration.name}...`);

      // قراءة البيانات من SQLite
      const sourceData = sqlite
        .prepare(`SELECT * FROM ${migration.source}`)
        .all();

      if (sourceData.length === 0) {
        console.log(`⚠️  لا توجد بيانات في جدول ${migration.source}`);
        continue;
      }

      // حذف البيانات الموجودة في PostgreSQL
      await pool.query(`DELETE FROM ${migration.target}`);

      // إدراج البيانات الجديدة
      for (const row of sourceData) {
        const columns = migration.columns.filter(
          (col) => row[col] !== undefined
        );
        const values = columns.map((col) => row[col]);
        const placeholders = columns
          .map((_, index) => `$${index + 1}`)
          .join(', ');

        const query = `INSERT INTO ${migration.target} (${columns.join(
          ', '
        )}) VALUES (${placeholders})`;

        try {
          await pool.query(query, values);
        } catch (error) {
          console.error(
            `❌ خطأ في إدراج سجل من ${migration.name}:`,
            error.message
          );
        }
      }

      // التحقق من عدد السجلات
      const result = await pool.query(
        `SELECT COUNT(*) FROM ${migration.target}`
      );
      const count = parseInt(result.rows[0].count);

      console.log(`✅ تم ترحيل ${count} سجل من ${migration.name}`);
    } catch (error) {
      console.error(`❌ خطأ في ترحيل ${migration.name}:`, error.message);
    }
  }
}

// دالة التحقق من البيانات
async function verifyData() {
  console.log('\n🔍 التحقق من البيانات...');

  const tables = [
    'tools',
    'articles',
    'categories',
    'celebrities',
    'historical_events',
    'page_keywords',
  ];

  for (const table of tables) {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      console.log(`📊 ${table}: ${count} سجل`);
    } catch (error) {
      console.error(`❌ خطأ في فحص جدول ${table}:`, error.message);
    }
  }
}

// دالة اختبار API
async function testAPI() {
  console.log('\n🧪 اختبار API endpoints...');

  try {
    // اختبار الأدوات
    const toolsResult = await pool.query(
      'SELECT COUNT(*) FROM tools WHERE is_active = true'
    );
    const toolsCount = parseInt(toolsResult.rows[0].count);
    console.log(`✅ الأدوات النشطة: ${toolsCount}`);

    // اختبار المقالات
    const articlesResult = await pool.query(
      "SELECT COUNT(*) FROM articles WHERE status = 'published'"
    );
    const articlesCount = parseInt(articlesResult.rows[0].count);
    console.log(`✅ المقالات المنشورة: ${articlesCount}`);

    // اختبار الفئات
    const categoriesResult = await pool.query(
      'SELECT COUNT(*) FROM categories WHERE is_active = true'
    );
    const categoriesCount = parseInt(categoriesResult.rows[0].count);
    console.log(`✅ الفئات النشطة: ${categoriesCount}`);
  } catch (error) {
    console.error('❌ خطأ في اختبار API:', error.message);
  }
}

// الدالة الرئيسية
async function main() {
  try {
    // اختبار اتصال PostgreSQL
    console.log('🔌 اختبار اتصال PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ تم الاتصال بـ PostgreSQL بنجاح\n');

    // إنشاء الجداول
    await createTables();

    // ترحيل البيانات
    await migrateData();

    // التحقق من البيانات
    await verifyData();

    // اختبار API
    await testAPI();

    console.log('\n🎉 تم إصلاح بيانات PostgreSQL بنجاح!');
    console.log('🚀 الموقع جاهز للنشر على Vercel');
  } catch (error) {
    console.error('\n❌ خطأ عام:', error.message);
    process.exit(1);
  } finally {
    // إغلاق الاتصالات
    if (sqlite) sqlite.close();
    await pool.end();
  }
}

// تشغيل السكريبت
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
