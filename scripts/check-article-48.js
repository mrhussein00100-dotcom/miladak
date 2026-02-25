const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

console.log('🔍 فحص المقال رقم 48...\n');

const article = db
  .prepare(
    `
  SELECT id, slug, title, image, featured_image, published, created_at
  FROM articles
  WHERE id = 48
`
  )
  .get();

if (article) {
  console.log('📄 تفاصيل المقال:');
  console.log('   ID:', article.id);
  console.log('   Title:', article.title);
  console.log('   Slug:', article.slug);
  console.log('   Image:', article.image || 'NULL');
  console.log('   Featured Image:', article.featured_image || 'NULL');
  console.log('   Published:', article.published);
  console.log('   Created:', article.created_at);
} else {
  console.log('❌ المقال غير موجود');
}

db.close();
