const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'database.sqlite';
const slug = 'تطورات-سياسية-جذرية-في-تونس-وتحولات-في-المشهد-السياسي-المحلي';

console.log('🔍 فحص المقال المحدد');
console.log('Slug:', slug);
console.log('='.repeat(60));

try {
  const db = new Database(dbPath);

  const article = db
    .prepare(
      `
    SELECT * FROM articles WHERE slug = ?
  `
    )
    .get(slug);

  if (article) {
    console.log('\n✅ المقال موجود:');
    console.log('   ID:', article.id);
    console.log('   العنوان:', article.title);
    console.log('   منشور:', article.published);
    console.log('   image:', article.image || '❌ فارغ');
    console.log('   featured_image:', article.featured_image || '❌ فارغ');

    // التحقق من الصورة المحلية
    if (article.featured_image && article.featured_image.startsWith('/')) {
      const localPath = 'public' + article.featured_image;
      const exists = fs.existsSync(localPath);
      console.log('\n🖼️ فحص الصورة المحلية:');
      console.log('   المسار:', localPath);
      console.log('   موجودة:', exists ? '✅ نعم' : '❌ لا');
    }
  } else {
    console.log('❌ المقال غير موجود');
  }

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
