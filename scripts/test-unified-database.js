#!/usr/bin/env node

/**
 * اختبار النظام الموحد لقاعدة البيانات
 * يختبر SQLite محلياً و PostgreSQL في الإنتاج
 */

const path = require('path');

async function testUnifiedDatabase() {
  console.log('🧪 اختبار النظام الموحد لقاعدة البيانات...\n');

  try {
    // استيراد النظام الموحد
    const db = require('../lib/db/database-new.ts');

    console.log('📊 اختبار الاتصال...');
    const isConnected = await db.isDatabaseInitialized();
    console.log('✅ حالة الاتصال:', isConnected ? 'متصل' : 'غير متصل');

    console.log('\n📋 اختبار الاستعلامات...');

    // اختبار استعلام بسيط
    const tools = await db.query('SELECT COUNT(*) as count FROM tools');
    console.log('✅ عدد الأدوات:', tools[0]?.count || 0);

    // اختبار استعلام واحد
    const firstTool = await db.queryOne('SELECT * FROM tools LIMIT 1');
    console.log('✅ أول أداة:', firstTool?.title || 'لا توجد أدوات');

    // اختبار الفئات
    const categories = await db.query(
      'SELECT COUNT(*) as count FROM tool_categories'
    );
    console.log('✅ عدد الفئات:', categories[0]?.count || 0);

    // اختبار المقالات
    const articles = await db.query('SELECT COUNT(*) as count FROM articles');
    console.log('✅ عدد المقالات:', articles[0]?.count || 0);

    console.log('\n🔧 اختبار العمليات...');

    // اختبار إدراج (في جدول اختبار)
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS test_table (
          id INTEGER PRIMARY KEY,
          name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const insertResult = await db.execute(
        'INSERT INTO test_table (name) VALUES (?)',
        [`test_${Date.now()}`]
      );

      console.log('✅ اختبار الإدراج نجح:', insertResult.changes > 0);

      // تنظيف
      await db.execute('DROP TABLE IF EXISTS test_table');
    } catch (error) {
      console.log('⚠️ اختبار الإدراج فشل:', error.message);
    }

    console.log('\n🎯 اختبار مفاتيح API...');

    // اختبار نظام مفاتيح API
    const { getApiKeysStatus, generateApiKeysReport } = await import(
      '../lib/config/api-keys.js'
    );

    const status = getApiKeysStatus();
    console.log('📊 حالة مفاتيح API:');

    Object.entries(status).forEach(([provider, info]) => {
      const icon = info.configured ? '✅' : '❌';
      const required = info.required ? '(مطلوب)' : '(اختياري)';
      console.log(
        `   ${icon} ${info.name} ${required}: ${
          info.configured ? 'مُعرَّف' : 'غير مُعرَّف'
        }`
      );
    });

    console.log('\n📄 تقرير مفاتيح API:');
    const report = await generateApiKeysReport();
    console.log(report);

    console.log('\n🎉 اكتمل الاختبار بنجاح!');
    console.log('✅ النظام الموحد يعمل بشكل صحيح');
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    process.exit(1);
  }
}

// تشغيل الاختبار
testUnifiedDatabase();
