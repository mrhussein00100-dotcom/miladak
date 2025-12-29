#!/usr/bin/env node

/**
 * 🔧 إصلاح بسيط لقاعدة البيانات - ميلادك v2
 */

const { Pool } = require('pg');

const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

console.log('🔧 إصلاح بسيط لقاعدة البيانات...');

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function simpleDatabaseFix() {
  try {
    console.log('🔌 اختبار الاتصال...');
    await pool.query('SELECT NOW()');
    console.log('✅ تم الاتصال بنجاح');

    // إضافة العمود المفقود إلى جدول tools
    console.log('🔧 إضافة العمود المفقود...');
    try {
      await pool.query(
        'ALTER TABLE tools ADD COLUMN IF NOT EXISTS category_id INTEGER'
      );
      console.log('✅ تم إضافة category_id إلى جدول tools');
    } catch (error) {
      console.log('⚠️ العمود موجود بالفعل أو خطأ في الإضافة');
    }

    // تحديث البيانات الموجودة
    console.log('📝 تحديث البيانات...');
    await pool.query(`
            UPDATE tools SET category_id = 1 WHERE category = 'calculators' OR category IS NULL;
            UPDATE tools SET category_id = 2 WHERE category = 'converters';
            UPDATE tools SET category_id = 3 WHERE category = 'generators';
            UPDATE tools SET category_id = 4 WHERE category = 'health';
            UPDATE tools SET category_id = 5 WHERE category = 'dates';
        `);

    // إنشاء فهرس للأداء
    try {
      await pool.query(
        'CREATE INDEX IF NOT EXISTS idx_tools_category_id ON tools(category_id)'
      );
      await pool.query(
        'CREATE INDEX IF NOT EXISTS idx_tools_is_active ON tools(is_active)'
      );
      await pool.query(
        'CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)'
      );
      console.log('✅ تم إنشاء الفهارس');
    } catch (error) {
      console.log('⚠️ الفهارس موجودة بالفعل');
    }

    // التحقق من البيانات
    console.log('\n🔍 التحقق من البيانات...');
    const toolsResult = await pool.query(
      'SELECT COUNT(*) as count, category_id FROM tools GROUP BY category_id'
    );
    console.log('📊 الأدوات حسب الفئة:');
    toolsResult.rows.forEach((row) => {
      console.log(`   الفئة ${row.category_id}: ${row.count} أداة`);
    });

    console.log('\n🎉 تم إصلاح قاعدة البيانات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  simpleDatabaseFix();
}

module.exports = { simpleDatabaseFix };
