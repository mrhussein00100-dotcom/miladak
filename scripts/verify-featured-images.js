const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

console.log('🔍 التحقق من الصور البارزة في المقالات...\n');

// Get all articles
const articles = db
  .prepare(
    `
  SELECT id, slug, title, image, featured_image, created_at
  FROM articles
  ORDER BY created_at DESC
  LIMIT 10
`
  )
  .all();

console.log(`📊 آخر ${articles.length} مقالات:\n`);

articles.forEach((article, index) => {
  console.log(`${index + 1}. ${article.title}`);
  console.log(`   Slug: ${article.slug}`);
  console.log(`   Image: ${article.image ? '✅' : '❌'}`);
  console.log(`   Featured Image: ${article.featured_image ? '✅' : '❌'}`);
  console.log(`   Created: ${article.created_at}`);
  console.log('');
});

// Count articles with/without featured images
const stats = db
  .prepare(
    `
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN featured_image IS NOT NULL THEN 1 ELSE 0 END) as with_featured,
    SUM(CASE WHEN featured_image IS NULL THEN 1 ELSE 0 END) as without_featured
  FROM articles
`
  )
  .get();

console.log('📈 إحصائيات الصور البارزة:');
console.log(`   إجمالي المقالات: ${stats.total}`);
console.log(
  `   مع صورة بارزة: ${stats.with_featured} (${Math.round(
    (stats.with_featured / stats.total) * 100
  )}%)`
);
console.log(
  `   بدون صورة بارزة: ${stats.without_featured} (${Math.round(
    (stats.without_featured / stats.total) * 100
  )}%)`
);

db.close();
