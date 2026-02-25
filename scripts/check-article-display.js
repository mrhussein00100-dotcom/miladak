const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'database.sqlite';

if (!fs.existsSync(dbPath)) {
  console.log('❌ قاعدة البيانات غير موجودة');
  process.exit(1);
}

console.log('🔍 فحص عرض المقالات');
console.log('='.repeat(60));

try {
  const db = new Database(dbPath);

  // جلب المقالات التي لديها صور بارزة
  const articlesWithImages = db
    .prepare(
      `
    SELECT id, title, slug, image, featured_image, published
    FROM articles 
    WHERE featured_image IS NOT NULL AND featured_image != ''
    ORDER BY id DESC 
    LIMIT 5
  `
    )
    .all();

  console.log('\n✅ مقالات لديها صور بارزة (يجب أن تظهر):');
  console.log('-'.repeat(60));
  articlesWithImages.forEach((article) => {
    console.log(`\nID: ${article.id}`);
    console.log(`العنوان: ${article.title.substring(0, 40)}...`);
    console.log(`الرابط: /articles/${article.slug}`);
    console.log(`featured_image: ${article.featured_image}`);
    console.log(`منشور: ${article.published ? 'نعم' : 'لا'}`);
  });

  // جلب المقالات التي ليس لديها صور
  const articlesWithoutImages = db
    .prepare(
      `
    SELECT id, title, slug, image, featured_image, published
    FROM articles 
    WHERE (featured_image IS NULL OR featured_image = '') AND (image IS NULL OR image = '')
    ORDER BY id DESC 
    LIMIT 5
  `
    )
    .all();

  console.log('\n\n❌ مقالات بدون صور (لن تظهر صورة):');
  console.log('-'.repeat(60));
  articlesWithoutImages.forEach((article) => {
    console.log(`\nID: ${article.id}`);
    console.log(`العنوان: ${article.title.substring(0, 40)}...`);
    console.log(`الرابط: /articles/${article.slug}`);
    console.log(`منشور: ${article.published ? 'نعم' : 'لا'}`);
  });

  // اختبار محاكاة getImageSrc
  console.log('\n\n🧪 اختبار منطق getImageSrc:');
  console.log('-'.repeat(60));

  const testArticle = articlesWithImages[0];
  if (testArticle) {
    const imagePath = testArticle.featured_image || testArticle.image;
    const isExternal =
      imagePath &&
      (imagePath.startsWith('http://') || imagePath.startsWith('https://'));
    const isValidLocal = imagePath && imagePath.startsWith('/');
    const isValid = isExternal || isValidLocal;

    console.log(`\nاختبار المقال ID ${testArticle.id}:`);
    console.log(`  featured_image: ${testArticle.featured_image}`);
    console.log(`  image: ${testArticle.image || 'فارغ'}`);
    console.log(`  الصورة المختارة: ${imagePath}`);
    console.log(`  نوع الصورة: ${isExternal ? 'خارجية' : 'محلية'}`);
    console.log(`  صالحة للعرض: ${isValid ? '✅ نعم' : '❌ لا'}`);
  }

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
