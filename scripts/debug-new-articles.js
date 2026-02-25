const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'database.sqlite';

if (!fs.existsSync(dbPath)) {
  console.log('❌ قاعدة البيانات غير موجودة');
  process.exit(1);
}

console.log('🔍 فحص المقالات الجديدة في قاعدة البيانات');
console.log('='.repeat(60));

try {
  const db = new Database(dbPath);

  // جلب آخر 10 مقالات
  const articles = db
    .prepare(
      `
    SELECT id, title, slug, image, featured_image, created_at 
    FROM articles 
    ORDER BY id DESC 
    LIMIT 10
  `
    )
    .all();

  console.log('\n📋 آخر 10 مقالات:');
  console.log('-'.repeat(60));

  articles.forEach((article, index) => {
    console.log(`\n${index + 1}. المقال ID: ${article.id}`);
    console.log(`   العنوان: ${article.title.substring(0, 50)}...`);
    console.log(`   الـ Slug: ${article.slug}`);
    console.log(`   image: ${article.image || '❌ فارغ'}`);
    console.log(`   featured_image: ${article.featured_image || '❌ فارغ'}`);
    console.log(`   تاريخ الإنشاء: ${article.created_at}`);

    // تحديد أي صورة ستظهر
    const displayImage = article.featured_image || article.image;
    if (displayImage) {
      console.log(
        `   ✅ الصورة التي ستظهر: ${displayImage.substring(0, 60)}...`
      );
    } else {
      console.log(`   ❌ لا توجد صورة للعرض!`);
    }
  });

  // إحصائيات
  const stats = db
    .prepare(
      `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN featured_image IS NOT NULL AND featured_image != '' THEN 1 ELSE 0 END) as with_featured,
      SUM(CASE WHEN image IS NOT NULL AND image != '' THEN 1 ELSE 0 END) as with_image,
      SUM(CASE WHEN (featured_image IS NULL OR featured_image = '') AND (image IS NULL OR image = '') THEN 1 ELSE 0 END) as no_image
    FROM articles
  `
    )
    .get();

  console.log('\n\n📊 إحصائيات الصور:');
  console.log('-'.repeat(60));
  console.log(`   إجمالي المقالات: ${stats.total}`);
  console.log(`   مقالات بصورة بارزة (featured_image): ${stats.with_featured}`);
  console.log(`   مقالات بصورة عادية (image): ${stats.with_image}`);
  console.log(`   مقالات بدون أي صورة: ${stats.no_image}`);

  // فحص هيكل الجدول
  console.log('\n\n🔧 هيكل جدول articles:');
  console.log('-'.repeat(60));
  const tableInfo = db.prepare('PRAGMA table_info(articles)').all();
  tableInfo.forEach((col) => {
    console.log(
      `   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${
        col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''
      }`
    );
  });

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
