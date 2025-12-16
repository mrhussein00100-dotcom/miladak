const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'database.sqlite';

if (!fs.existsSync(dbPath)) {
  console.log('❌ قاعدة البيانات غير موجودة');
  process.exit(1);
}

console.log('🧪 اختبار إنشاء مقال جديد مع صورة بارزة');
console.log('='.repeat(50));

try {
  const db = new Database(dbPath);

  // إنشاء مقال تجريبي
  const testArticle = {
    title: 'مقال تجريبي لاختبار الصورة البارزة',
    slug: 'test-featured-image-' + Date.now(),
    content:
      '<p>هذا مقال تجريبي لاختبار حفظ الصورة البارزة في قاعدة البيانات.</p>',
    excerpt: 'مقال تجريبي',
    image: '',
    featured_image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400',
    category_id: 38,
    published: 1,
    featured: 0,
    author: 'admin',
    read_time: 1,
    meta_description: 'مقال تجريبي لاختبار الصورة البارزة',
    meta_keywords: 'اختبار, صورة بارزة',
    ai_provider: null,
    publish_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('📝 إنشاء مقال جديد...');
  console.log('   العنوان:', testArticle.title);
  console.log('   الصورة البارزة:', testArticle.featured_image);

  // إدراج المقال
  const insertResult = db
    .prepare(
      `
    INSERT INTO articles (
      title, slug, content, excerpt, image, featured_image, category_id,
      published, featured, author, read_time, views,
      meta_description, meta_keywords, ai_provider, publish_date,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)
  `
    )
    .run(
      testArticle.title,
      testArticle.slug,
      testArticle.content,
      testArticle.excerpt,
      testArticle.image,
      testArticle.featured_image,
      testArticle.category_id,
      testArticle.published,
      testArticle.featured,
      testArticle.author,
      testArticle.read_time,
      testArticle.meta_description,
      testArticle.meta_keywords,
      testArticle.ai_provider,
      testArticle.publish_date,
      testArticle.created_at,
      testArticle.updated_at
    );

  const articleId = insertResult.lastInsertRowid;
  console.log('✅ تم إنشاء المقال بنجاح! ID:', articleId);

  // التحقق من حفظ البيانات
  const savedArticle = db
    .prepare(
      `
    SELECT id, title, slug, featured_image, image, published 
    FROM articles 
    WHERE id = ?
  `
    )
    .get(articleId);

  console.log('\n🔍 التحقق من البيانات المحفوظة:');
  console.log('   ID:', savedArticle.id);
  console.log('   العنوان:', savedArticle.title);
  console.log('   الـ Slug:', savedArticle.slug);
  console.log('   الصورة البارزة:', savedArticle.featured_image || 'لا يوجد');
  console.log('   الصورة العادية:', savedArticle.image || 'لا يوجد');
  console.log('   منشور:', savedArticle.published ? 'نعم' : 'لا');

  // محاكاة منطق getImageSrc
  const finalImage = savedArticle.featured_image || savedArticle.image;

  if (finalImage) {
    const isExternal =
      finalImage.startsWith('http://') || finalImage.startsWith('https://');
    const isValidLocal = finalImage.startsWith('/');
    const isValid = isExternal || isValidLocal;

    console.log('\n✅ نتيجة اختبار getImageSrc:');
    console.log('   الصورة المختارة:', finalImage);
    console.log('   نوع الصورة:', isExternal ? 'خارجية' : 'محلية');
    console.log('   صالحة للعرض:', isValid ? 'نعم ✅' : 'لا ❌');

    if (isValid) {
      console.log(
        '\n🎉 الاختبار نجح! الصورة البارزة تم حفظها وستظهر بشكل صحيح'
      );
    } else {
      console.log('\n❌ هناك مشكلة في مسار الصورة');
    }
  } else {
    console.log('\n❌ لم يتم حفظ الصورة البارزة!');
  }

  // حذف المقال التجريبي
  console.log('\n🗑️ حذف المقال التجريبي...');
  db.prepare('DELETE FROM articles WHERE id = ?').run(articleId);
  console.log('✅ تم حذف المقال التجريبي');

  db.close();
} catch (error) {
  console.error('❌ خطأ في الاختبار:', error.message);
}
