/**
 * اختبار إنشاء مقال جديد عبر API
 */

const testArticle = {
  title: 'مقال اختبار الصورة البارزة - ' + Date.now(),
  content:
    '<p>هذا مقال تجريبي لاختبار عرض الصورة البارزة في الموقع.</p><p>يجب أن تظهر الصورة البارزة في أعلى المقال.</p>',
  excerpt: 'مقال تجريبي لاختبار الصورة البارزة',
  category_id: 38,
  published: 1,
  featured: 0,
  meta_description: 'مقال تجريبي لاختبار الصورة البارزة',
  meta_keywords: 'اختبار, صورة بارزة',
  featured_image:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400',
  author: 'فريق الاختبار',
};

async function createArticle() {
  console.log('🧪 اختبار إنشاء مقال جديد عبر API');
  console.log('='.repeat(50));
  console.log('\n📝 بيانات المقال:');
  console.log('   العنوان:', testArticle.title);
  console.log('   الصورة البارزة:', testArticle.featured_image);

  try {
    const response = await fetch('http://localhost:3000/api/admin/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testArticle),
    });

    const data = await response.json();

    if (data.success) {
      console.log('\n✅ تم إنشاء المقال بنجاح!');
      console.log('   ID:', data.data.id);
      console.log('\n🔗 رابط المقال:');
      console.log(
        '   http://localhost:3000/articles/' +
          encodeURIComponent(
            testArticle.title
              .toLowerCase()
              .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
          )
      );

      // التحقق من حفظ الصورة
      console.log('\n🔍 التحقق من حفظ الصورة...');
      const checkResponse = await fetch(
        `http://localhost:3000/api/admin/articles/${data.data.id}`
      );
      const checkData = await checkResponse.json();

      if (checkData.success && checkData.data) {
        console.log(
          '   featured_image في قاعدة البيانات:',
          checkData.data.featured_image || '❌ فارغ'
        );
        console.log(
          '   image في قاعدة البيانات:',
          checkData.data.image || '❌ فارغ'
        );

        if (checkData.data.featured_image) {
          console.log('\n🎉 الاختبار نجح! الصورة البارزة محفوظة بشكل صحيح');
        } else {
          console.log('\n❌ المشكلة: الصورة البارزة لم تُحفظ!');
        }
      }
    } else {
      console.log('\n❌ فشل في إنشاء المقال:', data.error);
    }
  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
  }
}

createArticle();
