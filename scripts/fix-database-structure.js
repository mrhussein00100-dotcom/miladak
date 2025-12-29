#!/usr/bin/env node

/**
 * 🔧 إصلاح بنية قاعدة البيانات - ميلادك v2
 */

const { Pool } = require('pg');

const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

console.log('🔧 إصلاح بنية قاعدة البيانات...');

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function fixDatabaseStructure() {
  try {
    console.log('🔌 اختبار الاتصال...');
    await pool.query('SELECT NOW()');
    console.log('✅ تم الاتصال بنجاح');

    // فحص الجداول الموجودة
    console.log('🔍 فحص الجداول الموجودة...');
    const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

    const existingTables = tablesResult.rows.map((row) => row.table_name);
    console.log('📋 الجداول الموجودة:', existingTables);

    // حذف الجداول القديمة وإعادة إنشائها
    console.log('🗑️ حذف الجداول القديمة...');
    const tablesToDrop = [
      'tools',
      'articles',
      'categories',
      'celebrities',
      'historical_events',
      'page_keywords',
    ];

    for (const table of tablesToDrop) {
      if (existingTables.includes(table)) {
        await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`✅ تم حذف جدول ${table}`);
      }
    }

    // إنشاء الجداول الجديدة
    console.log('📋 إنشاء الجداول الجديدة...');

    const newTables = [
      `CREATE TABLE tools (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                category VARCHAR(100),
                icon VARCHAR(100),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

      `CREATE TABLE articles (
                id SERIAL PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                slug VARCHAR(500) UNIQUE NOT NULL,
                content TEXT,
                excerpt TEXT,
                featured_image VARCHAR(500),
                category_id INTEGER,
                author VARCHAR(255) DEFAULT 'ميلادك',
                status VARCHAR(50) DEFAULT 'published',
                meta_title VARCHAR(500),
                meta_description TEXT,
                keywords TEXT,
                reading_time INTEGER DEFAULT 5,
                views INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

      `CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                color VARCHAR(50) DEFAULT '#3B82F6',
                icon VARCHAR(100) DEFAULT '📂',
                parent_id INTEGER,
                sort_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
    ];

    for (const table of newTables) {
      await pool.query(table);
    }

    console.log('✅ تم إنشاء الجداول الجديدة');

    // إدراج بيانات أساسية
    console.log('📝 إدراج بيانات أساسية...');

    // الأدوات
    await pool.query(`INSERT INTO tools (name, slug, description, category, icon) VALUES 
            ('حاسبة العمر', 'age-calculator', 'احسب عمرك بدقة', 'calculators', '🧮'),
            ('محول التاريخ', 'date-converter', 'تحويل التواريخ', 'converters', '📅'),
            ('حاسبة الأيام', 'days-between', 'احسب الأيام بين تاريخين', 'calculators', '📊'),
            ('مولد البطاقات', 'card-generator', 'أنشئ بطاقات جميلة', 'generators', '🎨'),
            ('حاسبة BMI', 'bmi-calculator', 'احسب مؤشر كتلة الجسم', 'health', '⚖️')`);

    // الفئات
    await pool.query(`INSERT INTO categories (name, slug, description, color, icon) VALUES 
            ('الحاسبات', 'calculators', 'أدوات الحساب', '#3B82F6', '🧮'),
            ('المحولات', 'converters', 'أدوات التحويل', '#10B981', '🔄'),
            ('المولدات', 'generators', 'أدوات الإنشاء', '#8B5CF6', '🎨'),
            ('الصحة', 'health', 'أدوات صحية', '#EF4444', '❤️')`);

    // المقالات
    await pool.query(`INSERT INTO articles (title, slug, content, excerpt, category_id) VALUES 
            ('كيفية حساب العمر', 'how-to-calculate-age', 'دليل شامل لحساب العمر...', 'تعلم حساب العمر بدقة', 1),
            ('تحويل التواريخ', 'date-conversion-guide', 'كيفية تحويل التواريخ...', 'دليل تحويل التواريخ', 2)`);

    // التحقق من البيانات
    console.log('\n🔍 التحقق من البيانات...');
    const toolsCount = await pool.query('SELECT COUNT(*) FROM tools');
    const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
    const articlesCount = await pool.query('SELECT COUNT(*) FROM articles');

    console.log(`📊 الأدوات: ${toolsCount.rows[0].count}`);
    console.log(`📂 الفئات: ${categoriesCount.rows[0].count}`);
    console.log(`📰 المقالات: ${articlesCount.rows[0].count}`);

    console.log('\n🎉 تم إصلاح بنية قاعدة البيانات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  fixDatabaseStructure();
}

module.exports = { fixDatabaseStructure };
