/**
 * سكريبت لاختبار حفظ الصورة البارزة
 */

const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

// جلب المقال 48
const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(48);

console.log('📄 المقال رقم 48:');
console.log('   ID:', article.id);
console.log('   Title:', article.title);
console.log('   Image:', article.image);
console.log('   Featured Image:', article.featured_image);
console.log('');

// تحديث الصورة البارزة
console.log('🔄 تحديث الصورة البارزة...');
const result = db
  .prepare(
    `
  UPDATE articles 
  SET featured_image = ? 
  WHERE id = ?
`
  )
  .run('/uploads/test-image.jpg', 48);

console.log('   Rows changed:', result.changes);

// التحقق من التحديث
const updated = db.prepare('SELECT * FROM articles WHERE id = ?').get(48);
console.log('');
console.log('✅ بعد التحديث:');
console.log('   Featured Image:', updated.featured_image);

db.close();
