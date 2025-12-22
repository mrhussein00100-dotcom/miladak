const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// Check what tables exist
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all();
console.log('Tables in database.sqlite:');
console.log(tables.map((t) => t.name).join(', '));

// Check if categories table exists
const hasCategories = tables.some((t) => t.name === 'categories');
const hasArticleCategories = tables.some(
  (t) => t.name === 'article_categories'
);

console.log('\nHas categories table:', hasCategories);
console.log('Has article_categories table:', hasArticleCategories);

// Check articles table structure
const articlesInfo = db.prepare('PRAGMA table_info(articles)').all();
console.log('\nArticles table columns:');
articlesInfo.forEach((col) => console.log(`  - ${col.name} (${col.type})`));

// Check categories table if exists
if (hasCategories) {
  const catInfo = db.prepare('PRAGMA table_info(categories)').all();
  console.log('\nCategories table columns:');
  catInfo.forEach((col) => console.log(`  - ${col.name} (${col.type})`));

  // Get categories
  const cats = db.prepare('SELECT * FROM categories').all();
  console.log('\nCategories:');
  console.log(JSON.stringify(cats, null, 2));
}

// Check articles
const articles = db
  .prepare('SELECT id, title, category_id, published FROM articles LIMIT 5')
  .all();
console.log('\nSample articles:');
console.log(JSON.stringify(articles, null, 2));

db.close();
