const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// عرض الجداول
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all();
console.log(
  'Tables:',
  tables.map((t) => t.name)
);

// عرض التصنيفات
try {
  const cats = db.prepare('SELECT * FROM categories LIMIT 5').all();
  console.log('Categories:', cats);
} catch (e) {
  console.log('Error:', e.message);
}

// عرض هيكل جدول categories
try {
  const info = db.prepare('PRAGMA table_info(categories)').all();
  console.log(
    'Categories columns:',
    info.map((c) => c.name)
  );
} catch (e) {
  console.log('Error:', e.message);
}

db.close();
