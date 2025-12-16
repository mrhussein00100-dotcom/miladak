const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// البحث عن قاعدة البيانات
const dbPaths = [
  './lib/db/database.db',
  './miladak.db',
  './database.db',
  './db.sqlite',
];

let dbPath = null;
for (const testPath of dbPaths) {
  try {
    if (fs.existsSync(testPath)) {
      dbPath = testPath;
      break;
    }
  } catch (error) {
    continue;
  }
}

if (!dbPath) {
  console.log('❌ لم يتم العثور على قاعدة البيانات');
  process.exit(1);
}

console.log(`📍 استخدام قاعدة البيانات: ${dbPath}`);

try {
  const db = new Database(dbPath);

  console.log('🔍 التحقق النهائي من إصلاح الصور البارزة');
  console.log('='.repeat(50));

  // فحص المقال المحدد
  const testSlug = 'ارتباك-الانقلاب-وولادة-مقاومة-جديدة-في-تونس5';

  const article = db
    .prepare(
      `
    SELECT id, title, slug, featured_image, image, published 
    FROM articles 
    WHERE slug = ?
  `
    )
    .get(testSlug);

  if (!article) {
    console.log('❌ المقال غير موجود');
    db.close();
    return;
  }

  console.log('✅ بيانات المقال:');
  console.log(`   ID: ${article.id}`);
  console.log(`   العنوان: ${article.title}`);
  console.log(`   الصورة البارزة: ${article.featured_image || 'لا يوجد'}`);
  console.log(`   الصورة العادية: ${article.image || 'لا يوجد'}`);
  console.log(`   منشور: ${article.published ? 'نعم' : 'لا'}`);

  // محاكاة منطق getImageSrc الجديد
  const featuredImage = article.featured_image;
  const fallbackImage = article.image;

  console.log('\n🔧 محاكاة منطق getImageSrc الجديد:');
  console.log(`   المعامل الأول (featured_image): ${featuredImage || 'null'}`);
  console.log(`   المعامل الثاني (fallback_image): ${fallbackImage || 'null'}`);

  let finalImageSrc = null;

  if (featuredImage) {
    finalImageSrc = featuredImage;
    console.log(`   ✅ استخدام الصورة البارزة: ${finalImageSrc}`);
  } else if (fallbackImage) {
    finalImageSrc = fallbackImage;
    console.log(`   ⚠️ استخدام الصورة الاحتياطية: ${finalImageSrc}`);
  } else {
    console.log(`   ❌ لا توجد صورة متاحة`);
  }

  // فحص نوع الصورة
  if (finalImageSrc) {
    const isExternal =
      finalImageSrc.startsWith('http://') ||
      finalImageSrc.startsWith('https://');
    const isValidLocal =
      finalImageSrc.startsWith('/uploads/') && finalImageSrc.length > 10;

    console.log(`   نوع الصورة: ${isExternal ? 'خارجية' : 'محلية'}`);
    console.log(`   صالحة للعرض: ${isExternal || isValidLocal ? 'نعم' : 'لا'}`);

    if (isExternal || isValidLocal) {
      console.log('\n🎉 النتيجة النهائية: الصورة ستظهر بنجاح!');
    } else {
      console.log('\n❌ النتيجة النهائية: الصورة لن تظهر');
    }
  }

  // فحص جميع المقالات التي لها صور
  console.log('\n📊 فحص جميع المقالات المنشورة مع الصور:');
  const articles = db
    .prepare(
      `
    SELECT id, title, featured_image, image, published 
    FROM articles 
    WHERE published = 1 AND (featured_image IS NOT NULL OR image IS NOT NULL)
    ORDER BY id DESC
    LIMIT 10
  `
    )
    .all();

  articles.forEach((art) => {
    const finalSrc = art.featured_image || art.image;
    const isExternal =
      finalSrc &&
      (finalSrc.startsWith('http://') || finalSrc.startsWith('https://'));
    const isValidLocal =
      finalSrc && finalSrc.startsWith('/uploads/') && finalSrc.length > 10;
    const willDisplay = isExternal || isValidLocal;

    console.log(`   📄 ${art.id}: ${art.title.substring(0, 30)}...`);
    console.log(`      الصورة النهائية: ${finalSrc || 'لا يوجد'}`);
    console.log(`      ستظهر: ${willDisplay ? '✅ نعم' : '❌ لا'}`);
  });

  console.log('\n🏁 انتهى الفحص النهائي');
  db.close();
} catch (error) {
  console.error('❌ خطأ في تشغيل السكريبت:', error.message);
}
