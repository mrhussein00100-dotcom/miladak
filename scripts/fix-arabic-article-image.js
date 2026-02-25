const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

// Check English article
const englishArticle = db
  .prepare(
    `
  SELECT id, slug, title, image, featured_image 
  FROM articles 
  WHERE slug = 'newborn-baby-care-guide'
`
  )
  .get();

console.log('English article:', englishArticle);

// Check Arabic article
const arabicSlug =
  'تونس-من-انقلاب-متعثر-إلى-صراع-شعبي-على-السلطة-والمستقبل-الديمقراطي';
const arabicArticle = db
  .prepare(
    `
  SELECT id, slug, title, image, featured_image 
  FROM articles 
  WHERE slug = ?
`
  )
  .get(arabicSlug);

console.log('\nArabic article:', arabicArticle);

// If Arabic article has no image, add a default one
if (arabicArticle && (!arabicArticle.image || arabicArticle.image === '')) {
  const defaultImage =
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800';

  db.prepare(
    `
    UPDATE articles 
    SET image = ?, featured_image = ?
    WHERE id = ?
  `
  ).run(defaultImage, defaultImage, arabicArticle.id);

  console.log('\n✅ Updated Arabic article with default image!');
  console.log('Image URL:', defaultImage);
}

db.close();
