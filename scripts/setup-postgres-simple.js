/**
 * سكريبت بسيط لإعداد PostgreSQL
 */

const { Pool } = require('pg');

const DATABASE_URL =
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

console.log('🚀 إعداد قاعدة بيانات PostgreSQL...\n');

async function main() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. اختبار الاتصال
    console.log('1️⃣ اختبار الاتصال...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ الاتصال ناجح:', testResult.rows[0].now);
    console.log('');

    // 2. إنشاء الجداول واحداً تلو الآخر
    console.log('2️⃣ إنشاء الجداول...');

    // جدول فئات الأدوات
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tool_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255),
        icon VARCHAR(100),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ tool_categories');

    // جدول الأدوات
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tools (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        category_id INTEGER,
        href VARCHAR(500) NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ tools');

    // جدول فئات المقالات
    await pool.query(`
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
      )
    `);
    console.log('  ✓ article_categories');

    // جدول المقالات
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        category_id INTEGER,
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
      )
    `);
    console.log('  ✓ articles');

    // جدول المستخدمين
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        password_salt VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'editor',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ admin_users');

    // جدول الكلمات المفتاحية
    await pool.query(`
      CREATE TABLE IF NOT EXISTS page_keywords (
        id SERIAL PRIMARY KEY,
        page_path VARCHAR(500) NOT NULL,
        keyword TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ page_keywords');

    // 3. إنشاء الفهارس
    console.log('\n3️⃣ إنشاء الفهارس...');

    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug)',
      'CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id)',
      'CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)',
      'CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published)',
      'CREATE INDEX IF NOT EXISTS idx_page_keywords_path ON page_keywords(page_path)',
    ];

    for (const index of indexes) {
      try {
        await pool.query(index);
      } catch (error) {
        // تجاهل أخطاء الفهارس الموجودة
      }
    }
    console.log('  ✓ تم إنشاء الفهارس');

    // 4. إضافة بيانات افتراضية
    console.log('\n4️⃣ إضافة بيانات افتراضية...');

    // فئات الأدوات
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
    console.log('  ✓ فئات الأدوات');

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
    console.log('  ✓ الأدوات');

    // 5. التحقق من البيانات
    console.log('\n5️⃣ التحقق من البيانات...');
    const tables = [
      'tool_categories',
      'tools',
      'article_categories',
      'articles',
    ];

    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`  ✓ ${table}: ${result.rows[0].count} سجل`);
    }

    console.log('\n🎉 تم إعداد قاعدة البيانات بنجاح!');
    console.log('\nالخطوات التالية:');
    console.log('1. npm run build');
    console.log('2. vercel --prod');
  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
