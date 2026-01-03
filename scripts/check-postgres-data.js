/**
 * سكريبت للتحقق من البيانات في PostgreSQL
 */

const path = require('path');
const fs = require('fs');

// قراءة ملف .env.prod.local يدوياً (يحتوي على POSTGRES_URL)
const envPath = path.join(__dirname, '..', '.env.prod.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach((line) => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    let value = valueParts.join('=').trim();
    // إزالة علامات الاقتباس و \r\n
    value = value
      .replace(/^["']|["']$/g, '')
      .replace(/\\r\\n/g, '')
      .replace(/\r\n/g, '');
    process.env[key.trim()] = value;
  }
});

const { Pool } = require('pg');

async function checkData() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 التحقق من البيانات في PostgreSQL...\n');

    // قائمة الجداول للتحقق
    const tables = [
      'daily_events',
      'historical_events',
      'birthstones',
      'birth_flowers',
      'celebrities',
      'articles',
      'categories',
      'tools',
      'page_keywords',
    ];

    for (const table of tables) {
      try {
        const result = await pool.query(
          `SELECT COUNT(*) as count FROM ${table}`
        );
        const count = result.rows[0].count;
        console.log(`📊 ${table}: ${count} سجل`);

        // عرض عينة من البيانات إذا كانت موجودة
        if (parseInt(count) > 0) {
          const sample = await pool.query(`SELECT * FROM ${table} LIMIT 2`);
          console.log(
            `   عينة:`,
            JSON.stringify(sample.rows[0], null, 2).substring(0, 200) + '...\n'
          );
        }
      } catch (err) {
        console.log(`❌ ${table}: الجدول غير موجود أو خطأ - ${err.message}`);
      }
    }

    // التحقق من جميع الجداول الموجودة
    console.log('\n📋 جميع الجداول في قاعدة البيانات:');
    const allTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    allTables.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await pool.end();
  }
}

checkData();
