const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

console.log('🔍 اختبار نهائي لنظام الصور البارزة\n');

// Test the specific article
const slug = 'ارتباك-الانقلاب-وولادة-مقاومة-جديدة-في-تونس5';
const article = db
  .prepare(
    `
  SELECT id, title, slug, featured_image, image
  FROM articles 
  WHERE slug = ?
`
  )
  .get(slug);

if (!article) {
  console.log('❌ المقال غير موجود');
  process.exit(1);
}

console.log('✅ المقال موجود في قاعدة البيانات');
console.log(`   ID: ${article.id}`);
console.log(`   العنوان: ${article.title}`);
console.log(`   Featured Image: ${article.featured_image}`);
console.log(`   Image: ${article.image || 'لا يوجد'}\n`);

// Check file existence
if (article.featured_image) {
  const imagePath = article.featured_image;

  if (imagePath.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, '..', 'public', imagePath);
    const exists = fs.existsSync(fullPath);

    console.log('✅ الصورة البارزة محلية');
    console.log(`   المسار النسبي: ${imagePath}`);
    console.log(`   المسار الكامل: ${fullPath}`);
    console.log(`   الملف موجود: ${exists ? '✅ نعم' : '❌ لا'}\n`);

    if (exists) {
      const stats = fs.statSync(fullPath);
      console.log(`   حجم الملف: ${(stats.size / 1024).toFixed(2)} KB\n`);
    }
  } else if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://')
  ) {
    console.log('✅ الصورة البارزة خارجية');
    console.log(`   URL: ${imagePath}\n`);
  }
}

// Check component files
console.log('📋 فحص ملفات المكونات:\n');

const filesToCheck = [
  'lib/utils/imageUtils.ts',
  'components/ui/SafeImage.tsx',
  'components/ArticlePageClient.tsx',
  'app/articles/[slug]/page.tsx',
];

filesToCheck.forEach((file) => {
  const fullPath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(fullPath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n📝 الخطوات التالية:');
console.log('   1. تأكد من تشغيل السيرفر: npm run dev');
console.log('   2. افتح المقال في المتصفح:');
console.log(`      http://localhost:3000/articles/${slug}`);
console.log('   3. افتح DevTools (F12)');
console.log('   4. تحقق من Console للأخطاء');
console.log('   5. تحقق من Network > Img لطلبات الصور');
console.log('\n💡 إذا لم تظهر الصورة:');
console.log('   - تحقق من أن المسار يبدأ بـ /uploads/');
console.log('   - تحقق من أن الملف موجود في public/uploads/');
console.log('   - تحقق من أن SafeImage component يعمل بشكل صحيح');
console.log('   - تحقق من أن getImageSrc يعطي الأولوية لـ featured_image');

db.close();
