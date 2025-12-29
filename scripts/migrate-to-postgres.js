#!/usr/bin/env node

/**
 * نقل البيانات من SQLite إلى PostgreSQL
 * يقوم بقراءة البيانات من قاعدة البيانات المحلية ونقلها إلى PostgreSQL
 */

const Database = require('better-sqlite3');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

console.log('🚀 بدء نقل البيانات من SQLite إلى PostgreSQL...\n');

// إعدادات قاعدة البيانات
const sqlitePath = path.join(process.cwd(), 'database.sqlite');
const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!postgresUrl) {
  console.error('❌ متغير POSTGRES_URL غير موجود في البيئة');
  process.exit(1);
}

if (!fs.existsSync(sqlitePath)) {
  console.error('❌ ملف SQLite غير موجود:', sqlitePath);
  process.exit(1);
}

// إنشاء الاتصالات
const sqlite = new Database(sqlitePath, { readonly: true });
const postgres = new Pool({
  connectionString: postgresUrl,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// خريطة تحويل الجداول
const tableMapping = {
  tool_categories: {
    columns: [
      'id',
      'name',
      'slug',
      'title',
      'icon',
      'sort_order',
      'created_at',
      'updated_at',
    ],
    sequence: 'tool_categories_id_seq',
  },
  tools: {
    columns: [
      'id',
      'slug',
      'title',
      'description',
      'icon',
      'category_id',
      'href',
      'featured',
      'active',
      'sort_order',
      'views',
      'created_at',
      'updated_at',
    ],
    sequence: 'tools_id_seq',
  },
  article_categories: {
    columns: [
      'id',
      'name',
      'slug',
      'description',
      'color',
      'icon',
      'sort_order',
      'created_at',
      'updated_at',
    ],
    sequence: 'article_categories_id_seq',
  },
  articles: {
    columns: [
      'id',
      'slug',
      'title',
      'excerpt',
      'content',
      'category_id',
      'image',
      'featured_image',
      'author',
      'read_time',
      'views',
      'tags',
      'published',
      'featured',
      'meta_description',
      'meta_keywords',
      'focus_keyword',
      'og_image',
      'ai_provider',
      'publish_date',
      'created_at',
      'updated_at',
    ],
    sequence: 'articles_id_seq',
  },
  admin_users: {
    columns: [
      'id',
      'username',
      'password_hash',
      'password_salt',
      'role',
      'active',
      'created_at',
      'updated_at',
    ],
    sequence: 'admin_users_id_seq',
  },
  birthstones: {
    columns: [
      'id',
      'month',
      'stone_name',
      'stone_name_ar',
      'description',
      'created_at',
      'updated_at',
    ],
    sequence: 'birthstones_id_seq',
  },
  birth_flowers: {
    columns: [
      'id',
      'month',
      'flower_name',
      'flower_name_ar',
      'description',
      'created_at',
      'updated_at',
    ],
    sequence: 'birth_flowers_id_seq',
  },
  celebrities: {
    columns: [
      'id',
      'name',
      'profession',
      'birth_date',
      'birth_year',
      'description',
      'created_at',
      'updated_at',
    ],
    sequence: 'celebrities_id_seq',
  },
  historical_events: {
    columns: [
      'id',
      'title',
      'description',
      'event_date',
      'category',
      'created_at',
      'updated_at',
    ],
    sequence: 'historical_events_id_seq',
  },
  page_keywords: {
    columns: [
      'id',
      'page_type',
      'page_slug',
      'page_title',
      'keywords',
      'meta_description',
      'created_at',
      'updated_at',
    ],
    sequence: 'page_keywords_id_seq',
  },
};

async function migrateData() {
  const client = await postgres.connect();

  try {
    console.log('✅ اتصال PostgreSQL نجح\n');

    // إنشاء الجداول أولاً
    console.log('📋 إنشاء الجداول...');
    const schemaPath = path.join(__dirname, '../lib/db/postgres-schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schema);
      console.log('✅ تم إنشاء الجداول\n');
    }

    // نقل البيانات لكل جدول
    for (const [tableName, config] of Object.entries(tableMapping)) {
      await migrateTable(client, tableName, config);
    }

    console.log('\n🎉 تم نقل جميع البيانات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في نقل البيانات:', error);
    throw error;
  } finally {
    client.release();
    await postgres.end();
    sqlite.close();
  }
}

async function migrateTable(client, tableName, config) {
  try {
    console.log(`📊 نقل جدول ${tableName}...`);

    // التحقق من وجود الجدول في SQLite
    const tableExists = sqlite
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
    const rows = sqlite.prepare(`SELECT * FROM ${tableName}`).all();

    if (rows.length === 0) {
      console.log(`   📝 الجدول ${tableName} فارغ`);
      return;
    }

    // حذف البيانات الموجودة في PostgreSQL
    await client.query(`DELETE FROM ${tableName}`);

    // إدراج البيانات
    let insertedCount = 0;

    for (const row of rows) {
      const columns = config.columns.filter((col) => row.hasOwnProperty(col));
      const values = columns.map((col) => row[col]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

      const insertQuery = `
        INSERT INTO ${tableName} (${columns.join(', ')}) 
        VALUES (${placeholders})
      `;

      try {
        await client.query(insertQuery, values);
        insertedCount++;
      } catch (error) {
        console.error(`   ❌ خطأ في إدراج سجل في ${tableName}:`, error.message);
      }
    }

    // تحديث sequence إذا كان موجوداً
    if (config.sequence && insertedCount > 0) {
      const maxId = Math.max(...rows.map((row) => row.id || 0));
      await client.query(`SELECT setval('${config.sequence}', ${maxId})`);
    }

    console.log(`   ✅ تم نقل ${insertedCount} سجل من ${tableName}`);
  } catch (error) {
    console.error(`   ❌ خطأ في نقل جدول ${tableName}:`, error.message);
  }
}

// تشغيل النقل
migrateData().catch((error) => {
  console.error('💥 فشل النقل:', error);
  process.exit(1);
});
