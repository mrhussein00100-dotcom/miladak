#!/usr/bin/env node

/**
 * إصلاح بيانات PostgreSQL وإعادة ترحيلها
 * Fix PostgreSQL data and re-migrate
 */

const { Pool } = require('pg');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log('🔧 إصلاح بيانات PostgreSQL...\n');

const SQLITE_PATH = path.join(__dirname, '..', 'database.sqlite');
const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ متغير POSTGRES_URL غير موجود');
  process.exit(1);
}

async function fixPostgreSQLData() {
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

    // إنشاء الجداول مع البنية الصحيحة
    await createCorrectTables(pgPool);

    // ترحيل البيانات بالترتيب الصحيح
    await migrateDataInOrder(sqliteDb, pgPool);

    console.log('\n🎉 تم إصلاح وترحيل البيانات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في الإصلاح:', error);
    process.exit(1);
  } finally {
    if (sqliteDb) sqliteDb.close();
    if (pgPool) await pgPool.end();
  }
}

async function createCorrectTables(pgPool) {
  console.log('🔧 إنشاء الجداول بالبنية الصحيحة...');

  // حذف الجداول الموجودة وإعادة إنشائها
  await pgPool.query('DROP TABLE IF EXISTS articles CASCADE');
  await pgPool.query('DROP TABLE IF EXISTS tools CASCADE');
  await pgPool.query('DROP TABLE IF EXISTS article_categories CASCADE');
  await pgPool.query('DROP TABLE IF EXISTS tool_categories CASCADE');

  const schema = `
    -- جدول فئات الأدوات
    CREATE TABLE tool_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255),
      description TEXT,
      icon VARCHAR(100),
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول الأدوات
    CREATE TABLE tools (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      category_id INTEGER REFERENCES tool_categories(id),
      href VARCHAR(500) NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول فئات المقالات
    CREATE TABLE article_categories (
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
    CREATE TABLE articles (
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

    -- الفهارس
    CREATE INDEX idx_tools_slug ON tools(slug);
    CREATE INDEX idx_tools_category ON tools(category_id);
    CREATE INDEX idx_tools_active ON tools(is_active);
    CREATE INDEX idx_articles_slug ON articles(slug);
    CREATE INDEX idx_articles_published ON articles(published);
    CREATE INDEX idx_articles_category ON articles(category_id);
  `;

  const statements = schema.split(';').filter((stmt) => stmt.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      await pgPool.query(statement.trim());
    }
  }

  console.log('✅ تم إنشاء الجداول بالبنية الصحيحة');
}

async function migrateDataInOrder(sqliteDb, pgPool) {
  console.log('📋 ترحيل البيانات بالترتيب الصحيح...\n');

  // 1. ترحيل فئات الأدوات أولاً
  await migrateToolCategories(sqliteDb, pgPool);

  // 2. ترحيل الأدوات
  await migrateTools(sqliteDb, pgPool);

  // 3. ترحيل فئات المقالات
  await migrateArticleCategories(sqliteDb, pgPool);

  // 4. ترحيل المقالات
  await migrateArticles(sqliteDb, pgPool);

  // 5. ترحيل البيانات الإضافية
  await migrateAdditionalData(sqliteDb, pgPool);
}

async function migrateToolCategories(sqliteDb, pgPool) {
  console.log('📂 ترحيل فئات الأدوات...');

  try {
    const categories = sqliteDb.prepare('SELECT * FROM tool_categories').all();

    for (const cat of categories) {
      await pgPool.query(
        `INSERT INTO tool_categories (id, name, slug, title, description, icon, sort_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         icon = EXCLUDED.icon,
         sort_order = EXCLUDED.sort_order`,
        [
          cat.id,
          cat.name,
          cat.slug,
          cat.title,
          cat.description,
          cat.icon,
          cat.sort_order,
          cat.created_at,
          cat.updated_at,
        ]
      );
    }

    // إعادة تعيين sequence
    await pgPool.query(
      `SELECT setval('tool_categories_id_seq', COALESCE((SELECT MAX(id) FROM tool_categories), 1))`
    );

    console.log(`   ✅ تم ترحيل ${categories.length} فئة أدوات`);
  } catch (error) {
    console.log(`   ⚠️ خطأ في ترحيل فئات الأدوات: ${error.message}`);
  }
}

async function migrateTools(sqliteDb, pgPool) {
  console.log('🛠️ ترحيل الأدوات...');

  try {
    const tools = sqliteDb.prepare('SELECT * FROM tools').all();

    for (const tool of tools) {
      await pgPool.query(
        `INSERT INTO tools (id, name, slug, title, description, icon, category_id, href, is_featured, is_active, sort_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         icon = EXCLUDED.icon,
         category_id = EXCLUDED.category_id,
         href = EXCLUDED.href,
         is_featured = EXCLUDED.is_featured,
         is_active = EXCLUDED.is_active,
         sort_order = EXCLUDED.sort_order`,
        [
          tool.id,
          tool.name,
          tool.slug,
          tool.title,
          tool.description,
          tool.icon,
          tool.category_id,
          tool.href,
          tool.is_featured,
          tool.is_active,
          tool.sort_order,
          tool.created_at,
          tool.updated_at,
        ]
      );
    }

    // إعادة تعيين sequence
    await pgPool.query(
      `SELECT setval('tools_id_seq', COALESCE((SELECT MAX(id) FROM tools), 1))`
    );

    console.log(`   ✅ تم ترحيل ${tools.length} أداة`);
  } catch (error) {
    console.log(`   ⚠️ خطأ في ترحيل الأدوات: ${error.message}`);
  }
}

async function migrateArticleCategories(sqliteDb, pgPool) {
  console.log('📚 ترحيل فئات المقالات...');

  try {
    // إنشاء فئات افتراضية إذا لم تكن موجودة
    const defaultCategories = [
      {
        id: 1,
        name: 'عام',
        slug: 'general',
        description: 'مقالات عامة',
        color: '#3B82F6',
        icon: '📝',
      },
      {
        id: 2,
        name: 'تقنية',
        slug: 'tech',
        description: 'مقالات تقنية',
        color: '#10B981',
        icon: '💻',
      },
      {
        id: 3,
        name: 'صحة',
        slug: 'health',
        description: 'مقالات صحية',
        color: '#EF4444',
        icon: '🏥',
      },
    ];

    for (const cat of defaultCategories) {
      await pgPool.query(
        `INSERT INTO article_categories (id, name, slug, description, color, icon, sort_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         ON CONFLICT (slug) DO NOTHING`,
        [
          cat.id,
          cat.name,
          cat.slug,
          cat.description,
          cat.color,
          cat.icon,
          cat.id,
        ]
      );
    }

    // إعادة تعيين sequence
    await pgPool.query(
      `SELECT setval('article_categories_id_seq', COALESCE((SELECT MAX(id) FROM article_categories), 1))`
    );

    console.log(`   ✅ تم إنشاء ${defaultCategories.length} فئة مقالات`);
  } catch (error) {
    console.log(`   ⚠️ خطأ في إنشاء فئات المقالات: ${error.message}`);
  }
}

async function migrateArticles(sqliteDb, pgPool) {
  console.log('📄 ترحيل المقالات...');

  try {
    const articles = sqliteDb.prepare('SELECT * FROM articles').all();

    for (const article of articles) {
      // تعيين category_id افتراضي إذا كان null
      const categoryId = article.category_id || 1;

      await pgPool.query(
        `INSERT INTO articles (id, slug, title, excerpt, content, category_id, image, featured_image, author, read_time, views, tags, published, featured, meta_description, meta_keywords, focus_keyword, og_image, ai_provider, publish_date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
         ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         excerpt = EXCLUDED.excerpt,
         content = EXCLUDED.content,
         category_id = EXCLUDED.category_id,
         image = EXCLUDED.image,
         featured_image = EXCLUDED.featured_image,
         updated_at = NOW()`,
        [
          article.id,
          article.slug,
          article.title,
          article.excerpt,
          article.content,
          categoryId,
          article.image,
          article.featured_image,
          article.author,
          article.read_time,
          article.views,
          article.tags,
          article.published,
          article.featured,
          article.meta_description,
          article.meta_keywords,
          article.focus_keyword,
          article.og_image,
          article.ai_provider,
          article.publish_date,
          article.created_at,
          article.updated_at,
        ]
      );
    }

    // إعادة تعيين sequence
    await pgPool.query(
      `SELECT setval('articles_id_seq', COALESCE((SELECT MAX(id) FROM articles), 1))`
    );

    console.log(`   ✅ تم ترحيل ${articles.length} مقال`);
  } catch (error) {
    console.log(`   ⚠️ خطأ في ترحيل المقالات: ${error.message}`);
  }
}

async function migrateAdditionalData(sqliteDb, pgPool) {
  console.log('📊 ترحيل البيانات الإضافية...');

  // قائمة الجداول الإضافية
  const additionalTables = [
    'admin_users',
    'page_keywords',
    'daily_birthdays',
    'daily_events',
    'birthstones',
    'birth_flowers',
  ];

  for (const tableName of additionalTables) {
    try {
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
        continue;
      }

      const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();

      if (rows.length === 0) {
        console.log(`   📊 الجدول ${tableName} فارغ`);
        continue;
      }

      // مسح البيانات الموجودة
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
          console.log(
            `   ⚠️ خطأ في إدراج سجل في ${tableName}: ${error.message}`
          );
        }
      }

      // إعادة تعيين sequence إذا كان هناك عمود id
      if (columns.includes('id')) {
        await pgPool.query(`
          SELECT setval('${tableName}_id_seq', 
          COALESCE((SELECT MAX(id) FROM ${tableName}), 1))
        `);
      }

      console.log(`   ✅ ${tableName}: ${insertedCount}/${rows.length} سجل`);
    } catch (error) {
      console.log(`   ❌ خطأ في ترحيل ${tableName}: ${error.message}`);
    }
  }
}

// تشغيل الإصلاح
fixPostgreSQLData();
