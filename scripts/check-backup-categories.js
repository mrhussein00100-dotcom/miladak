const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database-main-backup.sqlite');
console.log(`=== فحص قاعدة البيانات: ${dbPath} ===\n`);
const db = new Database(dbPath);

// عرض الجداول
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  .all();
console.log('الجداول الموجودة:');
tables.forEach((t) => console.log(`  - ${t.name}`));

// فحص article_categories
const hasArticleCategories = tables.some(
  (t) => t.name === 'article_categories'
);
if (hasArticleCategories) {
  console.log('\n=== article_categories ===');
  const count = db
    .prepare('SELECT COUNT(*) as count FROM article_categories')
    .get();
  console.log(`عدد التصنيفات: ${count.count}`);

  const categories = db
    .prepare('SELECT * FROM article_categories ORDER BY id')
    .all();
  console.log('\nجميع التصنيفات:');
  categories.forEach((cat) => {
    console.log(`  ${cat.id}: ${cat.name} - ${cat.color || 'no color'}`);
  });
} else {
  console.log('\n❌ جدول article_categories غير موجود');
}

// فحص articles
const hasArticles = tables.some((t) => t.name === 'articles');
if (hasArticles) {
  console.log('\n=== articles ===');
  const count = db.prepare('SELECT COUNT(*) as count FROM articles').get();
  console.log(`عدد المقالات: ${count.count}`);

  // category_ids المستخدمة
  const usedCategories = db
    .prepare(
      `
    SELECT DISTINCT category_id, COUNT(*) as count 
    FROM articles 
    GROUP BY category_id 
    ORDER BY count DESC
  `
    )
    .all();
  console.log('\nCategory IDs المستخدمة في المقالات:');
  usedCategories.forEach((cat) => {
    console.log(`  category_id: ${cat.category_id} - ${cat.count} مقال`);
  });
}

db.close();
