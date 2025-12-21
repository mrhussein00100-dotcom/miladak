#!/usr/bin/env node

/**
 * اختبار الاتصال بقاعدة بيانات PostgreSQL الإنتاجية
 */

const { Pool } = require('pg');

const DATABASE_URL =
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

async function testConnection() {
  console.log('🧪 اختبار الاتصال بـ PostgreSQL الإنتاجية...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ تم الاتصال بنجاح!');

    // اختبار استعلام بسيط
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`📅 وقت الخادم: ${result.rows[0].current_time}`);

    // التحقق من الجداول
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`\n📊 الجداول الموجودة (${tablesResult.rows.length}):`);
    tablesResult.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

    // التحقق من البيانات
    if (tablesResult.rows.length > 0) {
      console.log('\n📈 إحصائيات البيانات:');

      const tables = [
        'tools',
        'tool_categories',
        'articles',
        'article_categories',
        'admin_users',
      ];
      for (const table of tables) {
        try {
          const countResult = await client.query(
            `SELECT COUNT(*) as count FROM ${table}`
          );
          console.log(`   - ${table}: ${countResult.rows[0].count} سجل`);
        } catch (e) {
          console.log(`   - ${table}: غير موجود`);
        }
      }
    }

    client.release();
    await pool.end();

    console.log('\n✅ اختبار الاتصال ناجح!');
    return true;
  } catch (error) {
    console.error('❌ فشل الاتصال:', error.message);
    await pool.end();
    return false;
  }
}

testConnection();
