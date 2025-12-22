const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// جلب الجداول
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all();
console.log('الجداول الموجودة:');
console.log(tables.map((t) => t.name).join('\n'));

// فحص جدول categories
console.log('\n--- هيكل جدول categories ---');
try {
  const info = db.pragma('table_info(categories)');
  console.log(JSON.stringify(info, null, 2));
} catch (e) {
  console.log('خطأ:', e.message);
}

// فحص البيانات
console.log('\n--- بيانات التصنيفات ---');
try {
  const cats = db.prepare('SELECT * FROM categories LIMIT 5').all();
  console.log(JSON.stringify(cats, null, 2));
} catch (e) {
  console.log('خطأ:', e.message);
}

db.close();
