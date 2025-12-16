const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

// Check the article with the Arabic slug
const slug =
  'تونس-من-انقلاب-متعثر-إلى-صراع-شعبي-على-السلطة-والمستقبل-الديمقراطي';

const article = db
  .prepare(
    `
  SELECT id, slug, title, image, featured_image 
  FROM articles 
  WHERE slug = ?
`
  )
  .get(slug);

console.log('Article found:', article);

// Check if featured_image column exists
const columns = db.prepare(`PRAGMA table_info(articles)`).all();
console.log('\nArticles table columns:');
columns.forEach((col) => {
  console.log(`- ${col.name} (${col.type})`);
});

// If article exists but no featured_image, copy from image
if (article && !article.featured_image && article.image) {
  console.log('\nUpdating featured_image from image field...');
  db.prepare(
    `
    UPDATE articles 
    SET featured_image = image 
    WHERE id = ?
  `
  ).run(article.id);
  console.log('✓ Updated successfully!');
}

db.close();
