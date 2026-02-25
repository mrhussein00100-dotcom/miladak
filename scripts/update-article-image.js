const Database = require('better-sqlite3');

const dbPath = 'database.sqlite';
const articleId = 43;
const newImage =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400';

console.log('🔄 تحديث صورة المقال ID:', articleId);

try {
  const db = new Database(dbPath);

  // تحديث الصورة
  db.prepare(
    `
    UPDATE articles 
    SET featured_image = ?, image = ?
    WHERE id = ?
  `
  ).run(newImage, newImage, articleId);

  // التحقق
  const article = db
    .prepare(
      'SELECT id, title, featured_image, image FROM articles WHERE id = ?'
    )
    .get(articleId);

  console.log('✅ تم التحديث:');
  console.log('   featured_image:', article.featured_image);
  console.log('   image:', article.image);

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
