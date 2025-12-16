const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'database.sqlite';

if (!fs.existsSync(dbPath)) {
  console.log('❌ قاعدة البيانات غير موجودة');
  process.exit(1);
}

console.log('🔍 فحص المقال المحدد');
console.log('='.repeat(60));

try {
  const db = new Database(dbPath);

  // فحص المقال ID 43
  const slug = 'تطورات-سياسية-جذرية-في-تونس-وتحولات-في-المشهد-السياسي-المحلي';

  const article = db
    .prepare(
      `
    SELECT a.*, c.name as category_name, c.color as category_color
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.slug = ? AND a.published = 1
  `
    )
    .get(slug);

  if (article) {
    console.log('\n✅ المقال موجود:');
    console.log(`   ID: ${article.id}`);
    console.log(`   العنوان: ${article.title.substring(0, 50)}...`);
    console.log(`   الـ Slug: ${article.slug}`);
    console.log(`   image: ${article.image || '❌ فارغ'}`);
    console.log(`   featured_image: ${article.featured_image || '❌ فارغ'}`);
    console.log(`   منشور: ${article.published ? 'نعم' : 'لا'}`);

    // محاكاة getImageSrc
    const imagePath = article.featured_image || article.image;
    console.log(`\n🖼️ الصورة التي ستظهر: ${imagePath || 'لا توجد'}`);

    if (imagePath) {
      const isExternal =
        imagePath.startsWith('http://') || imagePath.startsWith('https://');
      const isValidLocal = imagePath.startsWith('/');
      console.log(`   نوع: ${isExternal ? 'خارجية' : 'محلية'}`);
      console.log(
        `   صالحة: ${isExternal || isValidLocal ? '✅ نعم' : '❌ لا'}`
      );

      // التحقق من وجود الملف المحلي
      if (isValidLocal) {
        const localPath = 'public' + imagePath;
        const exists = fs.existsSync(localPath);
        console.log(
          `   الملف موجود: ${exists ? '✅ نعم' : '❌ لا'} (${localPath})`
        );
      }
    }
  } else {
    console.log('❌ المقال غير موجود أو غير منشور');
  }

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
