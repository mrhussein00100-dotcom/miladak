/**
 * سكريبت لتحديث عمود icon مباشرة في PostgreSQL
 */

const { Client } = require('pg');

const connectionString =
  'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require';

async function updateIconColumns() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔄 جاري الاتصال بقاعدة البيانات...');
    await client.connect();
    console.log('✅ تم الاتصال بنجاح!\n');

    // تحديث article_categories
    console.log('📝 تحديث article_categories.icon...');
    try {
      await client.query(
        'ALTER TABLE article_categories ALTER COLUMN icon TYPE TEXT'
      );
      console.log('   ✅ تم التحديث');
    } catch (e) {
      console.log('   ℹ️ ' + e.message);
    }

    // تحديث tool_categories
    console.log('📝 تحديث tool_categories.icon...');
    try {
      await client.query(
        'ALTER TABLE tool_categories ALTER COLUMN icon TYPE TEXT'
      );
      console.log('   ✅ تم التحديث');
    } catch (e) {
      console.log('   ℹ️ ' + e.message);
    }

    // تحديث tools
    console.log('📝 تحديث tools.icon...');
    try {
      await client.query('ALTER TABLE tools ALTER COLUMN icon TYPE TEXT');
      console.log('   ✅ تم التحديث');
    } catch (e) {
      console.log('   ℹ️ ' + e.message);
    }

    // التحقق من النتيجة
    console.log('\n📊 التحقق من أنواع الأعمدة:');
    const result = await client.query(`
      SELECT table_name, column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE column_name = 'icon' 
      AND table_schema = 'public'
    `);

    result.rows.forEach((row) => {
      console.log(
        `   ${row.table_name}.${row.column_name}: ${row.data_type} ${
          row.character_maximum_length
            ? `(${row.character_maximum_length})`
            : ''
        }`
      );
    });

    console.log('\n🎉 تم الانتهاء!');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await client.end();
  }
}

updateIconColumns();
