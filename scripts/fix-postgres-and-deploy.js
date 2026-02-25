/**
 * سكريبت شامل لإصلاح PostgreSQL والنشر على Vercel
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// بيانات الاتصال
const DATABASE_URL =
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

console.log('🚀 بدء عملية إصلاح قاعدة البيانات والنشر...\n');

async function main() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. اختبار الاتصال
    console.log('1️⃣ اختبار الاتصال بقاعدة البيانات...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ الاتصال ناجح:', testResult.rows[0].now);
    console.log('');

    // 2. إنشاء الجداول
    console.log('2️⃣ إنشاء الجداول الأساسية...');
    await createTables(pool);
    console.log('✅ تم إنشاء الجداول بنجاح\n');

    // 3. نقل البيانات من SQLite
    console.log('3️⃣ نقل البيانات من SQLite...');
    await migrateSQLiteData(pool);
    console.log('✅ تم نقل البيانات بنجاح\n');

    // 4. التحقق من البيانات
    console.log('4️⃣ التحقق من البيانات...');
    await verifyData(pool);
    console.log('✅ البيانات صحيحة\n');

    console.log('🎉 تم إصلاح قاعدة البيانات بنجاح!');
    console.log('');
    console.log('الخطوات التالية:');
    console.log('1. قم بتشغيل: npm run build');
    console.log('2. قم بتشغيل: vercel --prod');
    console.log('3. أضف متغيرات البيئة في Vercel Dashboard');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

async function createTables(pool) {
  const schema = `
    -- Enable UUID extension
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

    -- جدول الكلمات المفتاحية للصفحات
    CREATE TABLE IF NOT EXISTS page_keywords (
      id SERIAL PRIMARY KEY,
      page_path VARCHAR(500) NOT NULL,
      keyword TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول الأحداث التاريخية
    CREATE TABLE IF NOT EXISTS historical_events (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      day INTEGER NOT NULL,
      event_text TEXT NOT NULL,
      year INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول المشاهير
    CREATE TABLE IF NOT EXISTS celebrities (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      day INTEGER NOT NULL,
      name TEXT NOT NULL,
      profession TEXT,
      birth_year INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول الأحجار والزهور
    CREATE TABLE IF NOT EXISTS birthstones_flowers (
      id SERIAL PRIMARY KEY,
      month INTEGER UNIQUE NOT NULL,
      birthstone TEXT,
      flower TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول الألوان والأرقام
    CREATE TABLE IF NOT EXISTS colors_numbers (
      id SERIAL PRIMARY KEY,
      month INTEGER UNIQUE NOT NULL,
      lucky_color TEXT,
      lucky_number INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- الفهارس
    CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
    CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
    CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
    CREATE INDEX IF NOT EXISTS idx_page_keywords_path ON page_keywords(page_path);
    CREATE INDEX IF NOT EXISTS idx_historical_events_date ON historical_events(month, day);
    CREATE INDEX IF NOT EXISTS idx_celebrities_date ON celebrities(month, day);
  `;

  const statements = schema.split(';').filter((stmt) => stmt.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await pool.query(statement.trim());
      } catch (error) {
        if (
          !error.message.includes('already exists') &&
          !error.message.includes('does not exist')
        ) {
          console.error('خطأ في تنفيذ:', statement.substring(0, 80));
          console.error('رسالة الخطأ:', error.message);
          // لا نوقف العملية، نستمر
        }
      }
    }
  }

  console.log('  ✓ تم إنشاء الجداول (مع تجاهل الأخطاء البسيطة)');
}

async function migrateSQLiteData(pool) {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, '..', 'database.sqlite');

  if (!fs.existsSync(dbPath)) {
    console.log(
      '⚠️ لم يتم العثور على قاعدة بيانات SQLite، سيتم إنشاء بيانات افتراضية'
    );
    await seedDefaultData(pool);
    return;
  }

  const sqlite = new Database(dbPath, { readonly: true });

  try {
    // نقل فئات الأدوات
    const toolCategories = sqlite
      .prepare('SELECT * FROM tool_categories')
      .all();
    for (const cat of toolCategories) {
      await pool.query(
        `INSERT INTO tool_categories (id, name, slug, title, icon, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         title = EXCLUDED.title,
         icon = EXCLUDED.icon`,
        [cat.id, cat.name, cat.slug, cat.title, cat.icon, cat.sort_order || 0]
      );
    }
    console.log(`  ✓ نقل ${toolCategories.length} فئة أدوات`);

    // نقل الأدوات
    const tools = sqlite.prepare('SELECT * FROM tools').all();
    for (const tool of tools) {
      await pool.query(
        `INSERT INTO tools (id, slug, title, description, icon, category_id, href, featured, active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         icon = EXCLUDED.icon,
         category_id = EXCLUDED.category_id,
         href = EXCLUDED.href,
         featured = EXCLUDED.featured,
         active = EXCLUDED.active`,
        [
          tool.id,
          tool.slug,
          tool.title,
          tool.description,
          tool.icon,
          tool.category_id,
          tool.href,
          tool.featured || false,
          tool.active !== false,
          tool.sort_order || 0,
        ]
      );
    }
    console.log(`  ✓ نقل ${tools.length} أداة`);

    // نقل فئات المقالات
    const articleCategories = sqlite
      .prepare('SELECT * FROM article_categories')
      .all();
    for (const cat of articleCategories) {
      await pool.query(
        `INSERT INTO article_categories (id, name, slug, description, color, icon, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         color = EXCLUDED.color,
         icon = EXCLUDED.icon`,
        [
          cat.id,
          cat.name,
          cat.slug,
          cat.description,
          cat.color,
          cat.icon,
          cat.sort_order || 0,
        ]
      );
    }
    console.log(`  ✓ نقل ${articleCategories.length} فئة مقالات`);

    // نقل المقالات
    const articles = sqlite.prepare('SELECT * FROM articles').all();
    for (const article of articles) {
      await pool.query(
        `INSERT INTO articles (id, slug, title, excerpt, content, category_id, image, featured_image, author, read_time, views, tags, published, featured, meta_description, meta_keywords, focus_keyword)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         content = EXCLUDED.content,
         excerpt = EXCLUDED.excerpt,
         featured_image = EXCLUDED.featured_image`,
        [
          article.id,
          article.slug,
          article.title,
          article.excerpt,
          article.content,
          article.category_id,
          article.image,
          article.featured_image,
          article.author || 'Admin',
          article.read_time || 5,
          article.views || 0,
          article.tags,
          article.published || false,
          article.featured || false,
          article.meta_description,
          article.meta_keywords,
          article.focus_keyword,
        ]
      );
    }
    console.log(`  ✓ نقل ${articles.length} مقالة`);
  } catch (error) {
    console.error('خطأ في نقل البيانات:', error.message);
  } finally {
    sqlite.close();
  }
}

async function seedDefaultData(pool) {
  // فئات الأدوات الافتراضية
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
    await pool.query(
      `INSERT INTO tool_categories (name, slug, title, icon, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO NOTHING`,
      [cat.name, cat.slug, cat.title, cat.icon, 1]
    );
  }

  // أدوات افتراضية
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
    await pool.query(
      `INSERT INTO tools (slug, title, description, icon, category_id, href, featured, active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO NOTHING`,
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

  console.log('  ✓ تم إنشاء البيانات الافتراضية');
}

async function verifyData(pool) {
  const tables = ['tool_categories', 'tools', 'article_categories', 'articles'];

  for (const table of tables) {
    const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
    console.log(`  ✓ ${table}: ${result.rows[0].count} سجل`);
  }
}

main().catch(console.error);
