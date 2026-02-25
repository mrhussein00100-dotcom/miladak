/**
 * إصلاح المقالات القديمة - نسخ image إلى featured_image
 * هذا السكريبت يصلح المقالات التي لديها image ولكن ليس لديها featured_image
 */

const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'database.sqlite';

if (!fs.existsSync(dbPath)) {
  console.log('❌ قاعدة البيانات غير موجودة');
  process.exit(1);
}

console.log('🔧 إصلاح المقالات القديمة - نسخ image إلى featured_image');
console.log('='.repeat(60));

try {
  const db = new Database(dbPath);

  // البحث عن المقالات التي لديها image ولكن ليس لديها featured_image
  const articlesToFix = db
    .prepare(
      `
    SELECT id, title, image, featured_image
    FROM articles 
    WHERE image IS NOT NULL AND image != '' 
    AND (featured_image IS NULL OR featured_image = '')
  `
    )
    .all();

  console.log(`\n📋 عدد المقالات التي تحتاج إصلاح: ${articlesToFix.length}`);

  if (articlesToFix.length === 0) {
    console.log('✅ لا توجد مقالات تحتاج إصلاح!');
    db.close();
    process.exit(0);
  }

  console.log('\n🔄 جاري الإصلاح...');
  console.log('-'.repeat(60));

  const updateStmt = db.prepare(`
    UPDATE articles 
    SET featured_image = image 
    WHERE id = ?
  `);

  let fixedCount = 0;
  articlesToFix.forEach((article) => {
    console.log(`\n   إصلاح المقال ID ${article.id}:`);
    console.log(`   العنوان: ${article.title.substring(0, 40)}...`);
    console.log(`   image: ${article.image.substring(0, 50)}...`);

    updateStmt.run(article.id);
    fixedCount++;
    console.log(`   ✅ تم نسخ image إلى featured_image`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 تم إصلاح ${fixedCount} مقال بنجاح!`);

  // التحقق من النتيجة
  const verifyResult = db
    .prepare(
      `
    SELECT COUNT(*) as count
    FROM articles 
    WHERE image IS NOT NULL AND image != '' 
    AND (featured_image IS NULL OR featured_image = '')
  `
    )
    .get();

  console.log(
    `\n📊 المقالات المتبقية بدون featured_image: ${verifyResult.count}`
  );

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
