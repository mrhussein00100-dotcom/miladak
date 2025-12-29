/**
 * سكريبت debug لفحص مشكلة الصور البارزة
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('database.sqlite');

console.log('🔍 فحص شامل لمشكلة الصور البارزة\n');

// 1. فحص المقال 48
console.log('1️⃣ فحص المقال رقم 48:');
const article48 = db
  .prepare('SELECT id, title, image, featured_image FROM articles WHERE id = ?')
  .get(48);
console.log('   Featured Image:', article48.featured_image);
console.log('   Image:', article48.image);

// 2. فحص وجود الملف
if (article48.featured_image) {
  const imagePath = path.join('public', article48.featured_image);
  const exists = fs.existsSync(imagePath);
  console.log('   File exists:', exists ? '✅ نعم' : '❌ لا');
  if (exists) {
    const stats = fs.statSync(imagePath);
    console.log('   File size:', (stats.size / 1024).toFixed(2), 'KB');
  }
}

console.log('');

// 3. فحص جميع المقالات المنشورة
console.log('2️⃣ فحص جميع المقالات المنشورة:');
const publishedArticles = db
  .prepare(
    `
  SELECT id, title, image, featured_image, published 
  FROM articles 
  WHERE published = 1 
  ORDER BY id DESC 
  LIMIT 10
`
  )
  .all();

console.log(`   عدد المقالات المنشورة: ${publishedArticles.length}\n`);

publishedArticles.forEach((article) => {
  console.log(
    `   📄 المقال ${article.id}: ${article.title.substring(0, 40)}...`
  );
  console.log(`      Featured Image: ${article.featured_image || 'لا يوجد'}`);
  console.log(`      Image: ${article.image || 'لا يوجد'}`);

  // فحص وجود الملف
  const imageSrc = article.featured_image || article.image;
  if (imageSrc) {
    if (imageSrc.startsWith('http')) {
      console.log(`      Type: External URL`);
    } else {
      const imagePath = path.join('public', imageSrc);
      const exists = fs.existsSync(imagePath);
      console.log(
        `      Type: Local file - ${exists ? '✅ موجود' : '❌ غير موجود'}`
      );
    }
  }
  console.log('');
});

// 4. فحص مجلد uploads
console.log('3️⃣ فحص مجلد uploads:');
const uploadsPath = path.join('public', 'uploads');
if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath);
  console.log(`   عدد الملفات: ${files.length}`);
  console.log(`   آخر 5 ملفات:`);
  files.slice(-5).forEach((file) => {
    const filePath = path.join(uploadsPath, file);
    const stats = fs.statSync(filePath);
    console.log(`      - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
} else {
  console.log('   ❌ المجلد غير موجود!');
}

console.log('');
console.log('4️⃣ التوصيات:');
console.log('   - تحقق من console المتصفح للأخطاء');
console.log('   - تأكد من أن السيرفر يعمل على localhost:3000');
console.log('   - افتح Network tab في DevTools وشاهد طلبات الصور');
console.log('   - تحقق من أن المسار يبدأ بـ / للصور المحلية');

db.close();
