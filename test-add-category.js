const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// اختبار إضافة تصنيف جديد
const now = new Date().toISOString();
const testName = 'تصنيف اختباري ' + Date.now();
const testSlug = 'test-category-' + Date.now();

try {
  const result = db
    .prepare(
      `
    INSERT INTO categories (name, slug, description, color, icon, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
    )
    .run(testName, testSlug, 'وصف اختباري', '#6366f1', '', 100, now, now);

  console.log('✅ تم إضافة التصنيف بنجاح!');
  console.log('ID:', result.lastInsertRowid);

  // جلب التصنيف المضاف
  const cat = db
    .prepare('SELECT * FROM categories WHERE id = ?')
    .get(result.lastInsertRowid);
  console.log('التصنيف المضاف:', JSON.stringify(cat, null, 2));

  // حذف التصنيف الاختباري
  db.prepare('DELETE FROM categories WHERE id = ?').run(result.lastInsertRowid);
  console.log('✅ تم حذف التصنيف الاختباري');
} catch (e) {
  console.log('❌ خطأ:', e.message);
}

db.close();
