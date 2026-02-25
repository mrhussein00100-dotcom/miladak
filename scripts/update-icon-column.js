/**
 * سكريبت لتحديث عمود icon في جدول article_categories
 * لدعم تخزين صور Base64
 */

const { sql } = require('@vercel/postgres');

async function updateIconColumn() {
  console.log('🔄 جاري تحديث عمود icon...\n');

  try {
    // تغيير نوع عمود icon من VARCHAR(100) إلى TEXT
    await sql`
      ALTER TABLE article_categories 
      ALTER COLUMN icon TYPE TEXT
    `;
    console.log('✅ تم تحديث عمود icon في article_categories إلى TEXT');

    // تحديث أيضاً في tool_categories إذا لزم الأمر
    await sql`
      ALTER TABLE tool_categories 
      ALTER COLUMN icon TYPE TEXT
    `;
    console.log('✅ تم تحديث عمود icon في tool_categories إلى TEXT');

    // تحديث في tools أيضاً
    await sql`
      ALTER TABLE tools 
      ALTER COLUMN icon TYPE TEXT
    `;
    console.log('✅ تم تحديث عمود icon في tools إلى TEXT');

    console.log('\n🎉 تم تحديث جميع أعمدة icon بنجاح!');
    console.log('الآن يمكنك تخزين صور Base64 في عمود icon');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

updateIconColumn();
