#!/usr/bin/env node

/**
 * 🔧 إصلاح نهائي لقاعدة البيانات - ميلادك v2
 */

const { Pool } = require('pg');

const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

console.log('🔧 إصلاح نهائي لقاعدة البيانات...');

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function finalDatabaseFix() {
  try {
    console.log('🔌 اختبار الاتصال...');
    await pool.query('SELECT NOW()');
    console.log('✅ تم الاتصال بنجاح');

    // حذف جميع الجداول وإعادة إنشائها
    console.log('🗑️ حذف جميع الجداول...');
    await pool.query('DROP SCHEMA public CASCADE');
    await pool.query('CREATE SCHEMA public');
    await pool.query('GRANT ALL ON SCHEMA public TO postgres');
    await pool.query('GRANT ALL ON SCHEMA public TO public');

    console.log('✅ تم حذف وإعادة إنشاء المخطط');

    // إنشاء الجداول الصحيحة
    console.log('📋 إنشاء الجداول الصحيحة...');

    const correctTables = [
      // جدول الفئات أولاً
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

      // جدول الأدوات مع category_id
      `CREATE TABLE tools (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                category VARCHAR(100),
                category_id INTEGER REFERENCES categories(id),
                icon VARCHAR(100),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

      // جدول المقالات
      `CREATE TABLE articles (
                id SERIAL PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                slug VARCHAR(500) UNIQUE NOT NULL,
                content TEXT,
                excerpt TEXT,
                featured_image VARCHAR(500),
                category_id INTEGER REFERENCES categories(id),
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

      // جدول المشاهير
      `CREATE TABLE celebrities (
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
      `CREATE TABLE historical_events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                event_date DATE NOT NULL,
                description TEXT,
                category VARCHAR(100),
                importance_level INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

      // جدول الكلمات المفتاحية
      `CREATE TABLE page_keywords (
                id SERIAL PRIMARY KEY,
                page_path VARCHAR(500) NOT NULL UNIQUE,
                keywords TEXT,
                meta_title VARCHAR(500),
                meta_description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
    ];

    for (const table of correctTables) {
      await pool.query(table);
    }

    console.log('✅ تم إنشاء الجداول الصحيحة');

    // إدراج البيانات الأساسية
    console.log('📝 إدراج البيانات الأساسية...');

    // الفئات أولاً
    await pool.query(`INSERT INTO categories (name, slug, description, color, icon) VALUES 
            ('الحاسبات', 'calculators', 'أدوات الحساب والقياس', '#3B82F6', '🧮'),
            ('المحولات', 'converters', 'أدوات التحويل بين الوحدات', '#10B981', '🔄'),
            ('المولدات', 'generators', 'أدوات إنشاء المحتوى', '#8B5CF6', '🎨'),
            ('الصحة', 'health', 'أدوات صحية ورياضية', '#EF4444', '❤️'),
            ('التواريخ', 'dates', 'أدوات التواريخ والأوقات', '#F59E0B', '📅')`);

    // الأدوات مع category_id
    await pool.query(`INSERT INTO tools (name, slug, description, category, category_id, icon) VALUES 
            ('حاسبة العمر', 'age-calculator', 'احسب عمرك بدقة بالسنوات والشهور والأيام', 'calculators', 1, '🧮'),
            ('محول التاريخ', 'date-converter', 'تحويل التواريخ بين الهجري والميلادي', 'converters', 2, '📅'),
            ('حاسبة الأيام', 'days-between', 'احسب الأيام بين تاريخين', 'calculators', 1, '📊'),
            ('مولد البطاقات', 'card-generator', 'أنشئ بطاقات معايدة جميلة', 'generators', 3, '🎨'),
            ('حاسبة BMI', 'bmi-calculator', 'احسب مؤشر كتلة الجسم', 'health', 4, '⚖️'),
            ('حاسبة السعرات', 'calorie-calculator', 'احسب السعرات الحرارية اليومية', 'health', 4, '🍎'),
            ('حاسبة العمر بالثواني', 'age-in-seconds', 'احسب عمرك بالثواني', 'calculators', 1, '⏱️'),
            ('حاسبة يوم الأسبوع', 'day-of-week', 'اعرف يوم الأسبوع لأي تاريخ', 'dates', 5, '📆'),
            ('عداد الأحداث', 'event-countdown', 'عد تنازلي للأحداث المهمة', 'dates', 5, '⏰'),
            ('حاسبة المناطق الزمنية', 'timezone-calculator', 'تحويل الأوقات بين المناطق الزمنية', 'converters', 2, '🌍')`);

    // المقالات
    await pool.query(`INSERT INTO articles (title, slug, content, excerpt, category_id, meta_title, meta_description) VALUES 
            ('كيفية حساب العمر بدقة', 'how-to-calculate-age-accurately', 
             '<h2>مقدمة</h2><p>حساب العمر بدقة أمر مهم في كثير من المجالات...</p>', 
             'دليل شامل لحساب العمر بدقة باستخدام أدوات ميلادك', 1,
             'كيفية حساب العمر بدقة - ميلادك', 
             'تعلم كيفية حساب عمرك بدقة باستخدام أفضل الأدوات والطرق المتاحة'),
            ('تحويل التاريخ الهجري إلى الميلادي', 'hijri-to-gregorian-conversion',
             '<h2>التحويل بين التقاويم</h2><p>التحويل بين التقويم الهجري والميلادي...</p>', 
             'كل ما تحتاج معرفته عن تحويل التواريخ بين الهجري والميلادي', 2,
             'تحويل التاريخ الهجري إلى الميلادي - ميلادك',
             'تعلم كيفية تحويل التواريخ بين الهجري والميلادي بسهولة ودقة'),
            ('أهمية حساب مؤشر كتلة الجسم', 'importance-of-bmi-calculation',
             '<h2>مؤشر كتلة الجسم</h2><p>مؤشر كتلة الجسم هو مقياس مهم للصحة...</p>', 
             'تعرف على أهمية حساب مؤشر كتلة الجسم وكيفية تفسير النتائج', 4,
             'أهمية حساب مؤشر كتلة الجسم - ميلادك',
             'دليل شامل لفهم مؤشر كتلة الجسم وأهميته في تقييم الصحة العامة')`);

    // بعض المشاهير
    await pool.query(`INSERT INTO celebrities (name, birth_date, profession, nationality, description) VALUES 
            ('محمد صلاح', '1992-06-15', 'لاعب كرة قدم', 'مصري', 'لاعب كرة قدم مصري محترف يلعب في ليفربول'),
            ('فيروز', '1935-11-21', 'مطربة', 'لبنانية', 'مطربة لبنانية أسطورية تُلقب بجارة القمر'),
            ('عمر الشريف', '1932-04-10', 'ممثل', 'مصري', 'ممثل مصري عالمي مشهور بأدواره في السينما'),
            ('أم كلثوم', '1904-12-31', 'مطربة', 'مصرية', 'مطربة مصرية أسطورية تُلقب بكوكب الشرق'),
            ('أحمد زويل', '1946-02-26', 'عالم كيمياء', 'مصري', 'عالم كيمياء مصري حائز على جائزة نوبل')`);

    // أحداث تاريخية
    await pool.query(`INSERT INTO historical_events (title, event_date, description, category) VALUES 
            ('اكتشاف أمريكا', '1492-10-12', 'كريستوفر كولومبوس يكتشف القارة الأمريكية', 'اكتشافات'),
            ('الثورة المصرية', '1952-07-23', 'قيام ثورة 23 يوليو في مصر بقيادة الضباط الأحرار', 'ثورات'),
            ('إعلان قيام دولة الإمارات', '1971-12-02', 'إعلان قيام دولة الإمارات العربية المتحدة', 'سياسة'),
            ('فتح القسطنطينية', '1453-05-29', 'فتح القسطنطينية على يد السلطان محمد الفاتح', 'فتوحات'),
            ('اختراع الطباعة', '1440-01-01', 'يوهانس غوتنبرغ يخترع المطبعة', 'اختراعات')`);

    // كلمات مفتاحية للصفحات
    await pool.query(`INSERT INTO page_keywords (page_path, keywords, meta_title, meta_description) VALUES 
            ('/', 'حاسبة العمر, محول التاريخ, ميلادك, أدوات حساب, تحويل التواريخ', 'ميلادك - أدوات حساب العمر والتواريخ', 'موقع ميلادك يوفر أدوات متقدمة لحساب العمر وتحويل التواريخ بدقة عالية'),
            ('/tools', 'أدوات, حاسبات, محولات, مولدات, أدوات مجانية', 'الأدوات - ميلادك', 'مجموعة شاملة من الأدوات المفيدة لحساب العمر والتواريخ والصحة'),
            ('/articles', 'مقالات, دروس, شروحات, معلومات', 'المقالات - ميلادك', 'مقالات ودروس مفيدة حول حساب العمر والتواريخ والصحة'),
            ('/categories', 'فئات, تصنيفات, أقسام', 'الفئات - ميلادك', 'تصفح الأدوات والمقالات حسب الفئات المختلفة')`);

    // التحقق من البيانات
    console.log('\n🔍 التحقق من البيانات...');
    const toolsCount = await pool.query('SELECT COUNT(*) FROM tools');
    const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
    const articlesCount = await pool.query('SELECT COUNT(*) FROM articles');
    const celebritiesCount = await pool.query(
      'SELECT COUNT(*) FROM celebrities'
    );
    const eventsCount = await pool.query(
      'SELECT COUNT(*) FROM historical_events'
    );
    const keywordsCount = await pool.query(
      'SELECT COUNT(*) FROM page_keywords'
    );

    console.log(`📊 الأدوات: ${toolsCount.rows[0].count}`);
    console.log(`📂 الفئات: ${categoriesCount.rows[0].count}`);
    console.log(`📰 المقالات: ${articlesCount.rows[0].count}`);
    console.log(`🌟 المشاهير: ${celebritiesCount.rows[0].count}`);
    console.log(`📜 الأحداث: ${eventsCount.rows[0].count}`);
    console.log(`🔍 الكلمات المفتاحية: ${keywordsCount.rows[0].count}`);

    console.log('\n🎉 تم إصلاح قاعدة البيانات نهائياً!');
    console.log('🚀 قاعدة البيانات جاهزة للنشر');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  finalDatabaseFix();
}

module.exports = { finalDatabaseFix };
