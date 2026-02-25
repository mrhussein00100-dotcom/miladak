const Database = require('better-sqlite3');
const fs = require('fs');

// البحث عن قاعدة البيانات
const dbPath = 'database.sqlite';

if (!fs.existsSync(dbPath)) {
  console.log('❌ قاعدة البيانات غير موجودة في:', dbPath);
  process.exit(1);
}

console.log('🔍 اختبار إصلاح الصور البارزة');
console.log('='.repeat(40));

try {
  const db = new Database(dbPath);

  // فحص المقال المحدد
  const testSlug = 'ارتباك-الانقلاب-وولادة-مقاومة-جديدة-في-تونس5';

  const article = db
    .prepare(
      `
    SELECT id, title, featured_image, image, published 
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

  console.log('📄 المقال:', article.title);
  console.log('🆔 ID:', article.id);
  console.log('🖼️ الصورة البارزة:', article.featured_image || 'لا يوجد');
  console.log('📷 الصورة العادية:', article.image || 'لا يوجد');

  // محاكاة منطق getImageSrc
  const finalImage = article.featured_image || article.image;

  if (finalImage) {
    const isExternal =
      finalImage.startsWith('http://') || finalImage.startsWith('https://');
    const isValidLocal = finalImage.startsWith('/');
    const isValid = isExternal || isValidLocal;

    console.log('\n✅ النتيجة:');
    console.log('   الصورة المختارة:', finalImage);
    console.log('   نوع الصورة:', isExternal ? 'خارجية' : 'محلية');
    console.log('   صالحة للعرض:', isValid ? 'نعم ✅' : 'لا ❌');

    if (isValid) {
      console.log('\n🎉 الإصلاح نجح! الصورة ستظهر بشكل صحيح');
    } else {
      console.log('\n❌ هناك مشكلة في مسار الصورة');
    }
  } else {
    console.log('\n⚠️ لا توجد صورة للمقال');
  }

  db.close();
} catch (error) {
  console.error('❌ خطأ:', error.message);
}
