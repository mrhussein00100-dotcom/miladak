#!/usr/bin/env node

/**
 * اختبار الاتصال بقاعدة البيانات
 */

const {
  query,
  queryOne,
  isDatabaseInitialized,
} = require('../lib/db/database.ts');

console.log('🔍 اختبار الاتصال بقاعدة البيانات...\n');

async function testDatabase() {
  try {
    // التحقق من تهيئة قاعدة البيانات
    console.log('1️⃣ التحقق من تهيئة قاعدة البيانات...');
    const isInitialized = isDatabaseInitialized();
    console.log(`   النتيجة: ${isInitialized ? '✅ مهيأة' : '❌ غير مهيأة'}\n`);

    // اختبار استعلام بسيط
    console.log('2️⃣ اختبار استعلام بسيط...');
    try {
      const tables = query(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `);
      console.log(`   تم العثور على ${tables.length} جدول:`);
      tables.forEach((table) => {
        console.log(`   - ${table.name}`);
      });
    } catch (error) {
      console.log(`   ❌ فشل الاستعلام: ${error.message}`);
    }

    // اختبار جدول الأدوات
    console.log('\n3️⃣ اختبار جدول الأدوات...');
    try {
      const toolsCount = queryOne('SELECT COUNT(*) as count FROM tools');
      console.log(`   عدد الأدوات: ${toolsCount?.count || 0}`);

      const sampleTool = queryOne('SELECT * FROM tools LIMIT 1');
      if (sampleTool) {
        console.log(`   مثال على أداة: ${sampleTool.title}`);
      }
    } catch (error) {
      console.log(`   ❌ فشل في الوصول لجدول الأدوات: ${error.message}`);
    }

    // اختبار جدول المقالات
    console.log('\n4️⃣ اختبار جدول المقالات...');
    try {
      const articlesCount = queryOne('SELECT COUNT(*) as count FROM articles');
      console.log(`   عدد المقالات: ${articlesCount?.count || 0}`);
    } catch (error) {
      console.log(`   ❌ فشل في الوصول لجدول المقالات: ${error.message}`);
    }

    console.log('\n✅ انتهى اختبار قاعدة البيانات');
  } catch (error) {
    console.error('\n❌ خطأ في اختبار قاعدة البيانات:', error);
    process.exit(1);
  }
}

testDatabase();
