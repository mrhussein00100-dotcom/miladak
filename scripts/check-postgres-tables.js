/**
 * فحص الجداول الموجودة في PostgreSQL
 */

const { Pool } = require('pg');

const DATABASE_URL =
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

async function main() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 فحص الجداول الموجودة...\n');

    // الحصول على قائمة الجداول
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('الجداول الموجودة:');
    for (const row of tablesResult.rows) {
      console.log(`  - ${row.table_name}`);

      // الحصول على أعمدة كل جدول
      const columnsResult = await pool.query(
        `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `,
        [row.table_name]
      );

      console.log('    الأعمدة:');
      for (const col of columnsResult.rows) {
        console.log(`      • ${col.column_name} (${col.data_type})`);
      }
      console.log('');
    }
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await pool.end();
  }
}

main();
