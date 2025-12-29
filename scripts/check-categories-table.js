const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database-main-backup.sqlite');
console.log(`=== فحص جدول categories ===\n`);
const db = new Database(dbPath);

// فحص categories
const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
console.log(`عدد التصنيفات: ${count.count}`);

// عرض أعمدة الجدول
const columns = db.prepare('PRAGMA table_info(categories)').all();
console.log('\nأعمدة الجدول:');
columns.forEach((col) => {
  console.log(`  - ${col.name} (${col.type})`);
});

// عرض جميع التصنيفات
const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
console.log('\nجميع التصنيفات:');
categories.forEach((cat) => {
  console.log(
    `  ${cat.id}: ${cat.name || cat.title} - slug: ${
      cat.slug || 'N/A'
    } - color: ${cat.color || 'N/A'}`
  );
});

db.close();
