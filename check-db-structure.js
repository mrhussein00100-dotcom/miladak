const Database = require('better-sqlite3');

try {
  const db = new Database('database.sqlite', { readonly: true });

  // الحصول على قائمة الجداول
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all();
  console.log('🗂️ الجداول الموجودة:');
  tables.forEach((t) => console.log(`- ${t.name}`));

  // فحص هيكل جدول tool_categories
  console.log('\n📋 هيكل جدول tool_categories:');
  const toolCatsSchema = db.prepare('PRAGMA table_info(tool_categories)').all();
  toolCatsSchema.forEach((c) => console.log(`- ${c.name}: ${c.type}`));

  // فحص هيكل جدول tools
  console.log('\n🔧 هيكل جدول tools:');
  const toolsSchema = db.prepare('PRAGMA table_info(tools)').all();
  toolsSchema.forEach((c) => console.log(`- ${c.name}: ${c.type}`));

  // عد البيانات
  console.log('\n📊 إحصائيات البيانات:');
  tables.forEach((table) => {
    try {
      const count = db
        .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
        .get();
      console.log(`- ${table.name}: ${count.count} سجل`);
    } catch (e) {
      console.log(`- ${table.name}: خطأ في العد`);
    }
  });

  db.close();
} catch (error) {
  console.error('خطأ:', error.message);
}
