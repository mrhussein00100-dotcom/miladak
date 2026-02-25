const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

const slug =
  'تونس-من-انقلاب-متعثر-إلى-صراع-شعبي-على-السلطة-والمستقبل-الديمقراطي';
const testImageUrl =
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80';

console.log('🖼️ إضافة صورة تجريبية للمقال...\n');

// Update the article with test image
const result = db
  .prepare(
    `
  UPDATE articles 
  SET image = ?, featured_image = ?
  WHERE slug = ?
`
  )
  .run(testImageUrl, testImageUrl, slug);

console.log('✅ تم التحديث:', result.changes, 'مقال');
console.log('');

// Verify the update
const article = db
  .prepare(
    `
  SELECT id, slug, title, image, featured_image
  FROM articles
  WHERE slug = ?
`
  )
  .get(slug);

if (article) {
  console.log('📄 المقال بعد التحديث:');
  console.log('   ID:', article.id);
  console.log('   Title:', article.title);
  console.log('   Image:', article.image ? '✅ موجودة' : '❌ غير موجودة');
  console.log(
    '   Featured Image:',
    article.featured_image ? '✅ موجودة' : '❌ غير موجودة'
  );
  console.log('');
  console.log('🌐 الآن افتح المقال في المتصفح:');
  console.log('   http://localhost:3000/articles/' + encodeURIComponent(slug));
}

db.close();
