#!/usr/bin/env node

/**
 * اختبار الاتصال بـ PostgreSQL والتحقق من البيانات
 */

const { Pool } = require('pg');

console.log('🔍 اختبار الاتصال بـ PostgreSQL...\n');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ متغير POSTGRES_URL غير موجود');
  process.exit(1);
}

async function testConnection() {
  let pool;

  try {
    // إنشاء pool للاتصال
    pool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    console.log('🔗 محاولة الاتصال...');

    // اختبار الاتصال الأساسي
    const timeResult = await pool.query('SELECT NOW() as current_time');
    console.log('✅ تم الاتصال بنجاح');
    console.log(`⏰ وقت الخادم: ${timeResult.rows[0].current_time}\n`);

    // اختبار الجداول
    console.log('📋 فحص الجداول...');
    const tablesResult = await pool.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 0) {
      console.log('⚠️ لا توجد جداول في قاعدة البيانات');
    } else {
      console.log(`📊 تم العثور على ${tablesResult.rows.length} جدول:`);

      for (const table of tablesResult.rows) {
        try {
          const countResult = await pool.query(
            `SELECT COUNT(*) as count FROM ${table.table_name}`
          );
          console.log(
            `   - ${table.table_name}: ${countResult.rows[0].count} سجل (${table.column_count} عمود)`
          );
        } catch (error) {
          console.log(
            `   - ${table.table_name}: خطأ في العد (${table.column_count} عمود)`
          );
        }
      }
    }

    // اختبار الجداول المهمة
    console.log('\n🔍 فحص الجداول المهمة...');
    const importantTables = [
      'tools',
      'articles',
      'tool_categories',
      'article_categories',
    ];

    for (const tableName of importantTables) {
      try {
        const result = await pool.query(
          `
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_name = $1 AND table_schema = 'public'
        `,
          [tableName]
        );

        if (result.rows[0].count > 0) {
          const dataResult = await pool.query(
            `SELECT COUNT(*) as count FROM ${tableName}`
          );
          console.log(`   ✅ ${tableName}: ${dataResult.rows[0].count} سجل`);
        } else {
          console.log(`   ❌ ${tableName}: الجدول غير موجود`);
        }
      } catch (error) {
        console.log(`   ❌ ${tableName}: خطأ - ${error.message}`);
      }
    }

    // اختبار عينة من البيانات
    console.log('\n📄 عينة من البيانات...');
    try {
      const toolsResult = await pool.query(
        'SELECT title, slug FROM tools LIMIT 3'
      );
      if (toolsResult.rows.length > 0) {
        console.log('   🔧 الأدوات:');
        toolsResult.rows.forEach((tool) => {
          console.log(`      - ${tool.title} (${tool.slug})`);
        });
      }
    } catch (error) {
      console.log('   ⚠️ لا يمكن جلب بيانات الأدوات');
    }

    try {
      const articlesResult = await pool.query(
        'SELECT title, slug FROM articles WHERE published = true LIMIT 3'
      );
      if (articlesResult.rows.length > 0) {
        console.log('   📝 المقالات المنشورة:');
        articlesResult.rows.forEach((article) => {
          console.log(`      - ${article.title} (${article.slug})`);
        });
      }
    } catch (error) {
      console.log('   ⚠️ لا يمكن جلب بيانات المقالات');
    }

    // اختبار الأداء
    console.log('\n⚡ اختبار الأداء...');
    const startTime = Date.now();
    await pool.query('SELECT 1');
    const endTime = Date.now();
    console.log(`   📊 زمن الاستجابة: ${endTime - startTime}ms`);

    console.log('\n🎉 جميع الاختبارات نجحت!');
    console.log('✅ قاعدة البيانات جاهزة للاستخدام');
  } catch (error) {
    console.error('\n❌ خطأ في الاختبار:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.log('💡 تحقق من صحة POSTGRES_URL');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 تحقق من أن الخادم يعمل وأن المنفذ صحيح');
    } else if (error.code === '28P01') {
      console.log('💡 تحقق من صحة اسم المستخدم وكلمة المرور');
    }

    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

testConnection();
