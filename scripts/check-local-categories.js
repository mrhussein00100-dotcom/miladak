const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// البحث عن قواعد البيانات
const possiblePaths = [
  path.join(__dirname, '..', 'database.sqlite'),
  path.join(__dirname, '..', 'database-backup.sqlite'),
  path.join(__dirname, '..', 'database-main-backup.sqlite'),
  path.join(__dirname, '..', 'miladak.db'),
];

let dbPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    console.log(`✓ وجدت: ${p}`);
    dbPath = p;
  } else {
    console.log(`✗ غير موجود: ${p}`);
  }
}

if (!dbPath) {
  console.log('\nلم يتم العثور على قاعدة بيانات!');
  process.exit(1);
}

console.log(`\n=== فحص قاعدة البيانات: ${dbPath} ===\n`);
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
    .prepare('SELECT * FROM article_categories LIMIT 10')
    .all();
  console.log('\nعينة من التصنيفات:');
  categories.forEach((cat) => {
    console.log(`  ${cat.id}: ${cat.name}`);
  });
}

// فحص categories
const hasCategories = tables.some((t) => t.name === 'categories');
if (hasCategories) {
  console.log('\n=== categories ===');
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  console.log(`عدد التصنيفات: ${count.count}`);

  const categories = db.prepare('SELECT * FROM categories LIMIT 10').all();
  console.log('\nعينة من التصنيفات:');
  categories.forEach((cat) => {
    console.log(`  ${cat.id}: ${cat.name || cat.title}`);
  });
}

db.close();
