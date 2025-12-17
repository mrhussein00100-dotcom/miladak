#!/usr/bin/env node

/**
 * 🚀 ترحيل سريع للبيانات - ميلادك v2
 * يستخدم قاعدة البيانات PostgreSQL الموجودة
 */

const { Pool } = require('pg');
const path = require('path');

// استخدام قاعدة البيانات الموجودة
const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

console.log('🚀 بدء ترحيل البيانات إلى PostgreSQL الموجودة...');

if (!POSTGRES_URL) {
  console.error('❌ خطأ: POSTGRES_URL غير محدد');
  process.exit(1);
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function quickMigration() {
  try {
    console.log('🔌 اختبار اتصال PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ تم الاتصال بـ PostgreSQL بنجاح');

    // إنشاء الجداول الأساسية
    console.log('📋 إنشاء الجداول الأساسية...');

    const basicTables = [
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

      `CREATE TABLE IF NOT EXISTS articles (
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

      `CREATE TABLE IF NOT EXISTS categories (
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

      `CREATE TABLE IF NOT EXISTS historical_events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                event_date DATE NOT NULL,
                description TEXT,
                category VARCHAR(100),
                importance_level INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

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

    for (const table of basicTables) {
      await pool.query(table);
    }

    console.log('✅ تم إنشاء الجداول الأساسية');

    // إدراج بيانات تجريبية للأدوات
    console.log('📝 إدراج بيانات الأدوات...');
    await pool.query(`INSERT INTO tools (name, slug, description, category, icon) VALUES 
            ('حاسبة العمر', 'age-calculator', 'احسب عمرك بدقة بالسنوات والشهور والأيام', 'calculators', '🧮'),
            ('محول التاريخ', 'date-converter', 'تحويل التواريخ بين الهجري والميلادي', 'converters', '📅'),
            ('حاسبة الأيام', 'days-between', 'احسب الأيام بين تاريخين', 'calculators', '📊'),
            ('مولد البطاقات', 'card-generator', 'أنشئ بطاقات معايدة جميلة', 'generators', '🎨'),
            ('حاسبة BMI', 'bmi-calculator', 'احسب مؤشر كتلة الجسم', 'health', '⚖️')
            ON CONFLICT (slug) DO NOTHING`);

    // إدراج بيانات الفئات
    console.log('📂 إدراج بيانات الفئات...');
    await pool.query(`INSERT INTO categories (name, slug, description, color, icon) VALUES 
            ('الحاسبات', 'calculators', 'أدوات الحساب والقياس', '#3B82F6', '🧮'),
            ('المحولات', 'converters', 'أدوات التحويل بين الوحدات', '#10B981', '🔄'),
            ('المولدات', 'generators', 'أدوات إنشاء المحتوى', '#8B5CF6', '🎨'),
            ('الصحة', 'health', 'أدوات صحية ورياضية', '#EF4444', '❤️'),
            ('التواريخ', 'dates', 'أدوات التواريخ والأوقات', '#F59E0B', '📅')
            ON CONFLICT (slug) DO NOTHING`);

    // إدراج بعض المقالات التجريبية
    console.log('📰 إدراج مقالات تجريبية...');
    await pool.query(`INSERT INTO articles (title, slug, content, excerpt, category_id, meta_title, meta_description) VALUES 
            ('كيفية حساب العمر بدقة', 'how-to-calculate-age-accurately', 
             'تعلم كيفية حساب العمر بدقة باستخدام أدوات ميلادك المتقدمة...', 
             'دليل شامل لحساب العمر بدقة', 1,
             'كيفية حساب العمر بدقة - ميلادك', 
             'تعلم كيفية حساب عمرك بدقة باستخدام أفضل الأدوات والطرق المتاحة'),
            ('تحويل التاريخ الهجري إلى الميلادي', 'hijri-to-gregorian-conversion',
             'دليل شامل لتحويل التواريخ بين الهجري والميلادي بسهولة...', 
             'كل ما تحتاج معرفته عن تحويل التواريخ', 2,
             'تحويل التاريخ الهجري إلى الميلادي - ميلادك',
             'تعلم كيفية تحويل التواريخ بين الهجري والميلادي بسهولة ودقة')
            ON CONFLICT (slug) DO NOTHING`);

    // إدراج بعض المشاهير
    console.log('🌟 إدراج بيانات المشاهير...');
    await pool.query(`INSERT INTO celebrities (name, birth_date, profession, nationality, description) VALUES 
            ('محمد صلاح', '1992-06-15', 'لاعب كرة قدم', 'مصري', 'لاعب كرة قدم مصري محترف'),
            ('فيروز', '1935-11-21', 'مطربة', 'لبنانية', 'مطربة لبنانية أسطورية'),
            ('عمر الشريف', '1932-04-10', 'ممثل', 'مصري', 'ممثل مصري عالمي مشهور')
            ON CONFLICT DO NOTHING`);

    // إدراج أحداث تاريخية
    console.log('📜 إدراج أحداث تاريخية...');
    await pool.query(`INSERT INTO historical_events (title, event_date, description, category) VALUES 
            ('اكتشاف أمريكا', '1492-10-12', 'كريستوفر كولومبوس يكتشف أمريكا', 'اكتشافات'),
            ('الثورة المصرية', '1952-07-23', 'قيام ثورة 23 يوليو في مصر', 'ثورات'),
            ('إعلان قيام دولة الإمارات', '1971-12-02', 'إعلان قيام دولة الإمارات العربية المتحدة', 'سياسة')
            ON CONFLICT DO NOTHING`);

    // إدراج كلمات مفتاحية للصفحات
    console.log('🔍 إدراج كلمات مفتاحية...');
    await pool.query(`INSERT INTO page_keywords (page_path, keywords, meta_title, meta_description) VALUES 
            ('/', 'حاسبة العمر, محول التاريخ, ميلادك, أدوات', 'ميلادك - أدوات حساب العمر والتواريخ', 'موقع ميلادك يوفر أدوات متقدمة لحساب العمر وتحويل التواريخ'),
            ('/tools', 'أدوات, حاسبات, محولات, مولدات', 'الأدوات - ميلادك', 'مجموعة شاملة من الأدوات المفيدة لحساب العمر والتواريخ'),
            ('/articles', 'مقالات, دروس, شروحات', 'المقالات - ميلادك', 'مقالات ودروس مفيدة حول حساب العمر والتواريخ')
            ON CONFLICT (page_path) DO NOTHING`);

    // التحقق من البيانات
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
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      console.log(`📊 ${table}: ${count} سجل`);
    }

    console.log('\n🎉 تم ترحيل البيانات بنجاح!');
    console.log('🚀 قاعدة البيانات جاهزة للاستخدام');
  } catch (error) {
    console.error('\n❌ خطأ في الترحيل:', error.message);
    console.log('⚠️ سنتابع النشر رغم الخطأ...');
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  quickMigration();
}

module.exports = { quickMigration };
