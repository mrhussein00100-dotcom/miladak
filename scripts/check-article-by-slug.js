const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');

if (!fs.existsSync(dbPath)) {
  console.log('❌ لم يتم العثور على قاعدة البيانات');
  console.log(`المسار المتوقع: ${dbPath}`);
  process.exit(1);
}

console.log(`📁 قاعدة البيانات: ${dbPath}\n`);
const db = new Database(dbPath);

console.log('🔍 فحص المقال بالـ slug المحدد\n');

// Decode the URL-encoded slug
const slug = 'ارتباك-الانقلاب-وولادة-مقاومة-جديدة-في-تونس5';

try {
  // Get article by slug
  const article = db
    .prepare(
      `
    SELECT 
      id,
      title,
      slug,
      featured_image,
      image
    FROM articles 
    WHERE slug = ?
  `
    )
    .get(slug);

  if (!article) {
    console.log('❌ المقال غير موجود بهذا الـ slug');
    process.exit(1);
  }

  console.log('📄 معلومات المقال:');
  console.log(`   ID: ${article.id}`);
  console.log(`   العنوان: ${article.title}`);
  console.log(`   Slug: ${article.slug}`);
  console.log(`   Featured Image: ${article.featured_image || 'لا يوجد'}`);
  console.log(`   Image: ${article.image || 'لا يوجد'}\n`);

  // Check if featured_image file exists
  if (article.featured_image) {
    const imagePath = article.featured_image;

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('✅ الصورة البارزة: رابط خارجي');
      console.log(`   URL: ${imagePath}\n`);
    } else if (imagePath.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '..', 'public', imagePath);
      const exists = fs.existsSync(localPath);

      console.log(`🔍 الصورة البارزة: ملف محلي`);
      console.log(`   المسار: ${imagePath}`);
      console.log(`   المسار الكامل: ${localPath}`);
      console.log(`   موجود: ${exists ? '✅ نعم' : '❌ لا'}\n`);

      if (exists) {
        const stats = fs.statSync(localPath);
        console.log(`   حجم الملف: ${(stats.size / 1024).toFixed(2)} KB`);
      }
    } else {
      console.log('⚠️ الصورة البارزة: مسار غير صالح');
      console.log(`   المسار: ${imagePath}\n`);
    }
  }

  // Check if image file exists
  if (article.image) {
    const imagePath = article.image;

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('✅ الصورة العادية: رابط خارجي');
      console.log(`   URL: ${imagePath}\n`);
    } else if (imagePath.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '..', 'public', imagePath);
      const exists = fs.existsSync(localPath);

      console.log(`🔍 الصورة العادية: ملف محلي`);
      console.log(`   المسار: ${imagePath}`);
      console.log(`   المسار الكامل: ${localPath}`);
      console.log(`   موجود: ${exists ? '✅ نعم' : '❌ لا'}\n`);

      if (exists) {
        const stats = fs.statSync(localPath);
        console.log(`   حجم الملف: ${(stats.size / 1024).toFixed(2)} KB`);
      }
    } else {
      console.log('⚠️ الصورة العادية: مسار غير صالح');
      console.log(`   المسار: ${imagePath}\n`);
    }
  }

  console.log('\n📋 التوصيات:');
  console.log('   1. تحقق من أن السيرفر يعمل (npm run dev)');
  console.log('   2. افتح المقال في المتصفح');
  console.log('   3. افتح DevTools > Console للتحقق من الأخطاء');
  console.log('   4. افتح DevTools > Network > Img لمشاهدة طلبات الصور');
  console.log(`   5. الرابط المباشر: http://localhost:3000/articles/${slug}`);
} catch (error) {
  console.error('❌ خطأ:', error.message);
}

db.close();
