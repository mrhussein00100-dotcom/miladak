const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// Get all tables
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all();
console.log('Tables:', tables.map((t) => t.name).join(', '));

// Check article_categories vs categories
console.log('\n--- Checking for article_categories table ---');
const hasArticleCategories = tables.some(
  (t) => t.name === 'article_categories'
);
const hasCategories = tables.some((t) => t.name === 'categories');
console.log('article_categories exists:', hasArticleCategories);
console.log('categories exists:', hasCategories);

// Check articles count
try {
  const articlesCount = db
    .prepare('SELECT COUNT(*) as count FROM articles')
    .get();
  console.log('\nArticles count:', articlesCount.count);
} catch (e) {
  console.log('Error getting articles:', e.message);
}

// Check categories
try {
  const cats = db.prepare('SELECT * FROM categories').all();
  console.log('\nCategories:', cats);
} catch (e) {
  console.log('No categories table');
}

// Check article_categories
try {
  const artCats = db.prepare('SELECT * FROM article_categories').all();
  console.log('\nArticle Categories:', artCats);
} catch (e) {
  console.log('No article_categories table:', e.message);
}

db.close();
