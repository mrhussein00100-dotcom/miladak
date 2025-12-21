#!/usr/bin/env node

/**
 * 🚀 ترحيل كامل للبيانات إلى PostgreSQL - ميلادك v2
 */

const { Pool } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');

// بيانات الاتصال
const POSTGRES_URL =
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';
const SQLITE_PATH = path.join(__dirname, '..', 'database.sqlite');

console.log('🚀 بدء الترحيل الكامل إلى PostgreSQL...\n');

// إنشاء اتصال PostgreSQL
const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
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

// دالة إنشاء الجداول في PostgreSQL
async function createTables() {
  console.log('📋 إنشاء الجداول في PostgreSQL...');

  const tables = [
    // جدول الأدوات
    `CREATE TABLE IF NOT EXISTS tools (
            id SERIAL PRIMARY KEY,
            category_id INTEGER,
            name TEXT NOT NULL,
            title TEXT,
            description TEXT,
            href TEXT,
            icon TEXT,
            keywords TEXT,
            sort_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            is_featured BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول فئات الأدوات
    `CREATE TABLE IF NOT EXISTS tool_categories (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            title TEXT,
            description TEXT,
            icon TEXT,
            color TEXT,
            sort_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول المقالات
    `CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            content TEXT,
            excerpt TEXT,
            featured_image TEXT,
            category_id INTEGER,
            author TEXT,
            status TEXT DEFAULT 'published',
            meta_title TEXT,
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
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            color TEXT,
            icon TEXT,
            parent_id INTEGER,
            sort_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول المواليد المشهورة
    `CREATE TABLE IF NOT EXISTS daily_birthdays (
            id SERIAL PRIMARY KEY,
            date TEXT NOT NULL,
            name TEXT NOT NULL,
            profession TEXT,
            year INTEGER,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الأحداث التاريخية
    `CREATE TABLE IF NOT EXISTS daily_events (
            id SERIAL PRIMARY KEY,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            year INTEGER,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الأحداث الكبرى
    `CREATE TABLE IF NOT EXISTS major_events (
            id SERIAL PRIMARY KEY,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            year INTEGER,
            importance INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الأبراج الصينية
    `CREATE TABLE IF NOT EXISTS chinese_zodiac (
            id SERIAL PRIMARY KEY,
            year INTEGER NOT NULL,
            animal TEXT NOT NULL,
            element TEXT,
            characteristics TEXT,
            lucky_numbers TEXT,
            lucky_colors TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول أحجار الميلاد
    `CREATE TABLE IF NOT EXISTS birthstones (
            id SERIAL PRIMARY KEY,
            month INTEGER NOT NULL,
            stone_name TEXT NOT NULL,
            color TEXT,
            meaning TEXT,
            properties TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول زهور الميلاد
    `CREATE TABLE IF NOT EXISTS birth_flowers (
            id SERIAL PRIMARY KEY,
            month INTEGER NOT NULL,
            flower_name TEXT NOT NULL,
            meaning TEXT,
            symbolism TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الألوان المحظوظة
    `CREATE TABLE IF NOT EXISTS lucky_colors (
            id SERIAL PRIMARY KEY,
            month INTEGER NOT NULL,
            color_name TEXT NOT NULL,
            hex_code TEXT,
            meaning TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الفصول
    `CREATE TABLE IF NOT EXISTS seasons (
            id SERIAL PRIMARY KEY,
            month INTEGER NOT NULL,
            season_name TEXT NOT NULL,
            description TEXT,
            characteristics TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول السنوات
    `CREATE TABLE IF NOT EXISTS years (
            id SERIAL PRIMARY KEY,
            year INTEGER NOT NULL,
            description TEXT,
            events TEXT,
            characteristics TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول إعدادات الموقع
    `CREATE TABLE IF NOT EXISTS site_settings (
            id SERIAL PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            value TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول مستخدمي الإدارة
    `CREATE TABLE IF NOT EXISTS admin_users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول الكلمات المفتاحية للصفحات
    `CREATE TABLE IF NOT EXISTS page_keywords (
            id SERIAL PRIMARY KEY,
            page_path TEXT NOT NULL,
            keywords TEXT,
            meta_title TEXT,
            meta_description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول قوالب الذكاء الاصطناعي
    `CREATE TABLE IF NOT EXISTS ai_templates (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            template TEXT NOT NULL,
            description TEXT,
            category TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول تاريخ إعادة الكتابة
    `CREATE TABLE IF NOT EXISTS rewrite_history (
            id SERIAL PRIMARY KEY,
            original_content TEXT,
            rewritten_content TEXT,
            model_used TEXT,
            quality_score REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    // جدول إعدادات النشر التلقائي
    `CREATE TABLE IF NOT EXISTS auto_publish_settings (
            id SERIAL PRIMARY KEY,
            is_enabled BOOLEAN DEFAULT false,
            schedule_time TEXT,
            last_run TIMESTAMP,
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
      name: 'فئات الأدوات',
      source: 'tool_categories',
      target: 'tool_categories',
      columns: [
        'name',
        'title',
        'description',
        'icon',
        'color',
        'sort_order',
        'is_active',
      ],
    },
    {
      name: 'الأدوات',
      source: 'tools',
      target: 'tools',
      columns: [
        'category_id',
        'name',
        'title',
        'description',
        'href',
        'icon',
        'keywords',
        'sort_order',
        'is_active',
        'is_featured',
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
      name: 'المواليد المشهورة',
      source: 'daily_birthdays',
      target: 'daily_birthdays',
      columns: ['date', 'name', 'profession', 'year', 'description'],
    },
    {
      name: 'الأحداث التاريخية',
      source: 'daily_events',
      target: 'daily_events',
      columns: ['date', 'title', 'description', 'year', 'category'],
    },
    {
      name: 'الأحداث الكبرى',
      source: 'major_events',
      target: 'major_events',
      columns: ['date', 'title', 'description', 'year', 'importance'],
    },
    {
      name: 'الأبراج الصينية',
      source: 'chinese_zodiac',
      target: 'chinese_zodiac',
      columns: [
        'year',
        'animal',
        'element',
        'characteristics',
        'lucky_numbers',
        'lucky_colors',
      ],
    },
    {
      name: 'أحجار الميلاد',
      source: 'birthstones',
      target: 'birthstones',
      columns: ['month', 'stone_name', 'color', 'meaning', 'properties'],
    },
    {
      name: 'زهور الميلاد',
      source: 'birth_flowers',
      target: 'birth_flowers',
      columns: ['month', 'flower_name', 'meaning', 'symbolism'],
    },
    {
      name: 'الألوان المحظوظة',
      source: 'lucky_colors',
      target: 'lucky_colors',
      columns: ['month', 'color_name', 'hex_code', 'meaning'],
    },
    {
      name: 'الفصول',
      source: 'seasons',
      target: 'seasons',
      columns: ['month', 'season_name', 'description', 'characteristics'],
    },
    {
      name: 'السنوات',
      source: 'years',
      target: 'years',
      columns: ['year', 'description', 'events', 'characteristics'],
    },
    {
      name: 'إعدادات الموقع',
      source: 'site_settings',
      target: 'site_settings',
      columns: ['key', 'value', 'description'],
    },
    {
      name: 'مستخدمي الإدارة',
      source: 'admin_users',
      target: 'admin_users',
      columns: ['username', 'email', 'password_hash', 'role', 'is_active'],
    },
    {
      name: 'الكلمات المفتاحية',
      source: 'page_keywords',
      target: 'page_keywords',
      columns: ['page_path', 'keywords', 'meta_title', 'meta_description'],
    },
    {
      name: 'قوالب الذكاء الاصطناعي',
      source: 'ai_templates',
      target: 'ai_templates',
      columns: ['name', 'template', 'description', 'category', 'is_active'],
    },
    {
      name: 'تاريخ إعادة الكتابة',
      source: 'rewrite_history',
      target: 'rewrite_history',
      columns: [
        'original_content',
        'rewritten_content',
        'model_used',
        'quality_score',
      ],
    },
    {
      name: 'إعدادات النشر التلقائي',
      source: 'auto_publish_settings',
      target: 'auto_publish_settings',
      columns: ['is_enabled', 'schedule_time', 'last_run'],
    },
  ];

  let totalMigrated = 0;

  for (const migration of migrations) {
    try {
      console.log(`\n🔄 ترحيل ${migration.name}...`);

      // قراءة البيانات من SQLite
      let sourceData;
      try {
        sourceData = sqlite.prepare(`SELECT * FROM ${migration.source}`).all();
      } catch (error) {
        console.log(`⚠️  جدول ${migration.source} غير موجود في SQLite`);
        continue;
      }

      if (sourceData.length === 0) {
        console.log(`⚠️  لا توجد بيانات في جدول ${migration.source}`);
        continue;
      }

      // حذف البيانات الموجودة في PostgreSQL
      await pool.query(`DELETE FROM ${migration.target}`);

      // إدراج البيانات الجديدة
      let migratedCount = 0;
      for (const row of sourceData) {
        const columns = migration.columns.filter(
          (col) => row[col] !== undefined && row[col] !== null
        );
        const values = columns.map((col) => row[col]);
        const placeholders = columns
          .map((_, index) => `$${index + 1}`)
          .join(', ');

        if (columns.length === 0) continue;

        const query = `INSERT INTO ${migration.target} (${columns.join(
          ', '
        )}) VALUES (${placeholders})`;

        try {
          await pool.query(query, values);
          migratedCount++;
        } catch (error) {
          console.error(
            `❌ خطأ في إدراج سجل من ${migration.name}:`,
            error.message
          );
        }
      }

      totalMigrated += migratedCount;
      console.log(`✅ تم ترحيل ${migratedCount} سجل من ${migration.name}`);
    } catch (error) {
      console.error(`❌ خطأ في ترحيل ${migration.name}:`, error.message);
    }
  }

  console.log(`\n🎉 تم ترحيل ${totalMigrated} سجل إجمالي!`);
}

// دالة التحقق من البيانات
async function verifyData() {
  console.log('\n🔍 التحقق من البيانات...');

  const tables = [
    'tools',
    'tool_categories',
    'articles',
    'categories',
    'daily_birthdays',
    'daily_events',
    'major_events',
    'chinese_zodiac',
    'birthstones',
    'birth_flowers',
    'lucky_colors',
    'seasons',
    'years',
    'site_settings',
    'admin_users',
    'page_keywords',
    'ai_templates',
    'rewrite_history',
    'auto_publish_settings',
  ];

  let totalRecords = 0;

  for (const table of tables) {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      totalRecords += count;
      console.log(`📊 ${table}: ${count} سجل`);
    } catch (error) {
      console.log(`❌ خطأ في فحص جدول ${table}: ${error.message}`);
    }
  }

  console.log(`\n📈 إجمالي السجلات في PostgreSQL: ${totalRecords}`);
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

    console.log('\n🎉 تم إكمال الترحيل بنجاح!');
    console.log('🚀 قاعدة البيانات PostgreSQL جاهزة للاستخدام');
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
