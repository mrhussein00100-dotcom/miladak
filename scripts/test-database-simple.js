#!/usr/bin/env node

/**
 * اختبار بسيط لقاعدة البيانات
 */

const Database = require('better-sqlite3');
const path = require('path');

function testDatabase() {
  console.log('🧪 اختبار قاعدة البيانات...\n');

  try {
    // الاتصال بقاعدة البيانات
    const dbPath = path.join(__dirname, '..', 'database.sqlite');
    console.log('📂 مسار قاعدة البيانات:', dbPath);

    const db = new Database(dbPath, { readonly: true });

    // اختبار الاتصال
    const result = db.prepare('SELECT 1 as test').get();
    console.log('✅ الاتصال بقاعدة البيانات نجح');

    // عرض الجداول
    const tables = db
      .prepare(
        `
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `
      )
      .all();

    console.log(`\n📊 تم العثور على ${tables.length} جدول:`);
    tables.forEach((table) => {
      const count = db
        .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
        .get();
      console.log(`   📋 ${table.name}: ${count.count} سجل`);
    });

    // اختبار الأدوات
    const tools = db.prepare('SELECT COUNT(*) as count FROM tools').get();
    console.log(`\n🔧 عدد الأدوات: ${tools.count}`);

    const activeTools = db
      .prepare('SELECT COUNT(*) as count FROM tools WHERE is_active = 1')
      .get();
    console.log(`✅ الأدوات النشطة: ${activeTools.count}`);

    // اختبار المقالات
    const articles = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    console.log(`\n📝 عدد المقالات: ${articles.count}`);

    const publishedArticles = db
      .prepare('SELECT COUNT(*) as count FROM articles WHERE published = 1')
      .get();
    console.log(`✅ المقالات المنشورة: ${publishedArticles.count}`);

    // اختبار الفئات
    const categories = db
      .prepare('SELECT COUNT(*) as count FROM tool_categories')
      .get();
    console.log(`\n📂 عدد فئات الأدوات: ${categories.count}`);

    // عرض بعض الأدوات
    const sampleTools = db
      .prepare(
        'SELECT name as slug, title FROM tools WHERE is_active = 1 LIMIT 5'
      )
      .all();
    console.log('\n🔧 عينة من الأدوات:');
    sampleTools.forEach((tool) => {
      console.log(`   • ${tool.title} (${tool.slug || 'بدون slug'})`);
    });

    db.close();
    console.log('\n🎉 اختبار قاعدة البيانات اكتمل بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في اختبار قاعدة البيانات:', error.message);
    process.exit(1);
  }
}

// تشغيل الاختبار
testDatabase();
