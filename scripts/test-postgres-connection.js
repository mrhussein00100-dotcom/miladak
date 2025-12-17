#!/usr/bin/env node

/**
 * اختبار الاتصال بقاعدة بيانات PostgreSQL
 */

const { Pool } = require('pg');

async function testPostgreSQLConnection() {
  console.log('🧪 اختبار الاتصال بـ PostgreSQL...\n');

  const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!POSTGRES_URL) {
    console.error('❌ متغير POSTGRES_URL غير موجود');
    console.log('يرجى تعيين POSTGRES_URL في متغيرات البيئة');
    console.log('مثال:');
    console.log(
      '$env:POSTGRES_URL="postgres://default:xxxxx@xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"'
    );
    process.exit(1);
  }

  console.log('📂 رابط PostgreSQL:', POSTGRES_URL.substring(0, 30) + '...');

  let pgPool;

  try {
    // إنشاء اتصال PostgreSQL
    pgPool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    // اختبار الاتصال
    console.log('🔌 محاولة الاتصال...');
    const result = await pgPool.query(
      'SELECT NOW() as current_time, version() as pg_version'
    );

    console.log('✅ نجح الاتصال بـ PostgreSQL!');
    console.log(`⏰ الوقت الحالي: ${result.rows[0].current_time}`);
    console.log(
      `📊 إصدار PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${
        result.rows[0].pg_version.split(' ')[1]
      }`
    );

    // اختبار إنشاء جدول بسيط
    console.log('\n🧪 اختبار إنشاء جدول...');
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // إدراج بيانات تجريبية
    await pgPool.query(`
      INSERT INTO connection_test (test_message) 
      VALUES ('اختبار الاتصال نجح - ميلادك v2')
    `);

    // قراءة البيانات
    const testResult = await pgPool.query(
      'SELECT * FROM connection_test ORDER BY id DESC LIMIT 1'
    );
    console.log('✅ تم إنشاء واختبار الجدول بنجاح');
    console.log(`📝 آخر رسالة: ${testResult.rows[0].test_message}`);

    // تنظيف الجدول التجريبي
    await pgPool.query('DROP TABLE IF EXISTS connection_test');
    console.log('🧹 تم تنظيف الجدول التجريبي');

    console.log('\n🎉 جميع اختبارات PostgreSQL نجحت!');
    console.log('✅ قاعدة البيانات جاهزة لاستقبال البيانات');
  } catch (error) {
    console.error('\n❌ خطأ في الاتصال بـ PostgreSQL:');
    console.error('📋 تفاصيل الخطأ:', error.message);

    if (error.code) {
      console.error('🔍 كود الخطأ:', error.code);
    }

    console.log('\n🔧 نصائح لحل المشكلة:');
    console.log('1. تحقق من صحة POSTGRES_URL');
    console.log('2. تأكد من أن قاعدة البيانات منشأة في Vercel');
    console.log('3. تحقق من اتصال الإنترنت');
    console.log('4. تأكد من صلاحيات الوصول لقاعدة البيانات');

    process.exit(1);
  } finally {
    if (pgPool) {
      await pgPool.end();
    }
  }
}

// تشغيل الاختبار
testPostgreSQLConnection();
