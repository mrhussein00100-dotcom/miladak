const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'database.sqlite';

console.log('🔍 فحص المقال ID 48 بالتفصيل');
console.log('='.repeat(60));

try {
  const db = new Database(dbPath);

  const article = db
    .prepare(
      `
    SELECT * FROM articles WHERE id = 48
  `
    )
    .get();

  if (article) {
    console.log('\n📋 بيانات المقال:');
    console.log(`   ID: ${article.id}`);
    console.log(`   العنوان: ${article.title}`);
    console.log(`   الـ Slug: ${article.slug}`);
    console.log(`   منشور: ${article.published}`);
    console.log(`\n🖼️ بيانات الصور:`);
    console.log(`   image: "${article.image}"`);
    console.log(`   featured_image: "${article.featured_image}"`);

    // التحقق من الصورة
    const featuredImage = article.featured_image;
    if (featuredImage) {
      console.log(`\n✅ الصورة البارزة موجودة: ${featuredImage}`);

      // التحقق إذا كانت محلية
      if (featuredImage.startsWith('/')) {
        const localPath = 'public' + featuredImage;
        const exists = fs.existsSync(localPath);
        console.log(`   نوع: محلية`);
        console.log(`   المسار الكامل: ${localPath}`);
        console.log(`   الملف موجود: ${exists ? '✅ نعم' : '❌ لا'}`);

        if (!exists) {
          console.log('\n❌ المشكلة: الملف غير موجود في المسار المحدد!');

          // البحث عن ملفات مشابهة
          const uploadsDir = 'public/uploads';
          if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            console.log(`\n📁 الملفات الموجودة في ${uploadsDir}:`);
            files.forEach((f) => console.log(`   - ${f}`));
          }
        }
      } else if (featuredImage.startsWith('http')) {
        console.log(`   نوع: خارجية (URL)`);
        console.log(`   يجب أن تعمل بشكل طبيعي`);
      }
    } else {
      console.log('\n❌ لا توجد صورة بارزة!');
    }
  } else {
    console.log('❌ المقال غير موجود');
  }

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
