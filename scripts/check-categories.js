const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'database.sqlite';

if (!fs.existsSync(dbPath)) {
  console.log('❌ قاعدة البيانات غير موجودة');
  process.exit(1);
}

console.log('📋 فحص التصنيفات المتاحة');
console.log('='.repeat(30));

try {
  const db = new Database(dbPath);

  const categories = db
    .prepare('SELECT id, name, slug FROM categories ORDER BY id')
    .all();

  if (categories.length === 0) {
    console.log('❌ لا توجد تصنيفات في قاعدة البيانات');
  } else {
    console.log('✅ التصنيفات المتاحة:');
    categories.forEach((cat) => {
      console.log(`   ${cat.id}: ${cat.name} (${cat.slug})`);
    });
  }

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
