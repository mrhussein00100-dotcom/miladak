/**
 * اختبار تحديث صور المقال 105 على الموقع المنشور
 * يفحص المشكلة: الصور لا تُحفظ فعلياً رغم ظهور رسالة النجاح
 */

const SITE_URL = 'https://miladak.com';
const ARTICLE_ID = 105;

async function testArticleImageUpdate() {
  console.log('='.repeat(60));
  console.log('اختبار تحديث صور المقال 105');
  console.log('='.repeat(60));

  try {
    // 1. جلب المقال الحالي
    console.log('\n1. جلب المقال الحالي...');
    const getResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`
    );
    const getData = await getResponse.json();

    if (!getData.success) {
      console.error('فشل في جلب المقال:', getData.error);
      return;
    }

    const article = getData.data;
    console.log('✓ تم جلب المقال بنجاح');
    console.log('  - العنوان:', article.title);
    console.log('  - طول المحتوى:', article.content?.length || 0, 'حرف');

    // استخراج الصور من المحتوى
    const imageMatches =
      article.content?.match(/<img[^>]*src="([^"]*)"[^>]*>/gi) || [];
    console.log('  - عدد الصور في المحتوى:', imageMatches.length);

    if (imageMatches.length > 0) {
      console.log('\n  الصور الحالية:');
      imageMatches.forEach((img, idx) => {
        const srcMatch = img.match(/src="([^"]*)"/i);
        const src = srcMatch ? srcMatch[1] : 'غير معروف';
        console.log(`    ${idx + 1}. ${src.substring(0, 80)}...`);
      });
    }

    // 2. تحضير صورة جديدة للاختبار
    console.log('\n2. تحضير صورة اختبار جديدة...');
    const testImageUrl =
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&test=' +
      Date.now();

    // إنشاء محتوى جديد مع صورة اختبار
    let newContent = article.content || '';

    // إضافة صورة اختبار في البداية
    const testImageHtml = `<figure class="test-image-${Date.now()}"><img src="${testImageUrl}" alt="صورة اختبار" /></figure>`;

    // إذا كان هناك محتوى، أضف الصورة في البداية
    if (newContent) {
      newContent = testImageHtml + '\n' + newContent;
    } else {
      newContent = testImageHtml;
    }

    console.log('  - تم إضافة صورة اختبار جديدة');
    console.log('  - رابط الصورة:', testImageUrl.substring(0, 80) + '...');

    // 3. إرسال التحديث
    console.log('\n3. إرسال التحديث...');
    const updateResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          slug: article.slug,
          content: newContent,
          excerpt: article.excerpt,
          category_id: article.category_id,
          published: article.published,
          featured: article.featured,
          meta_description: article.meta_description,
          meta_keywords: article.meta_keywords,
          featured_image: article.featured_image,
        }),
      }
    );

    const updateData = await updateResponse.json();
    console.log('  - حالة الاستجابة:', updateResponse.status);
    console.log('  - نجاح:', updateData.success);

    if (!updateData.success) {
      console.error('  - خطأ:', updateData.error);
      console.error('  - تفاصيل:', updateData.details);
      return;
    }

    console.log('✓ تم إرسال التحديث بنجاح');

    // 4. التحقق من الحفظ الفعلي
    console.log('\n4. التحقق من الحفظ الفعلي...');

    // انتظار قليلاً
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const verifyResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`
    );
    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      console.error('فشل في التحقق:', verifyData.error);
      return;
    }

    const verifiedArticle = verifyData.data;
    const verifiedImages =
      verifiedArticle.content?.match(/<img[^>]*src="([^"]*)"[^>]*>/gi) || [];

    console.log(
      '  - طول المحتوى بعد الحفظ:',
      verifiedArticle.content?.length || 0,
      'حرف'
    );
    console.log('  - عدد الصور بعد الحفظ:', verifiedImages.length);

    // التحقق من وجود صورة الاختبار
    const testImageFound = verifiedArticle.content?.includes(
      testImageUrl.split('?')[0]
    );

    if (testImageFound) {
      console.log('\n✓✓✓ نجاح! تم حفظ الصورة الجديدة بشكل صحيح');
    } else {
      console.log('\n✗✗✗ فشل! الصورة الجديدة لم تُحفظ');
      console.log('\nتحليل المشكلة:');

      // مقارنة المحتوى
      if (verifiedArticle.content === article.content) {
        console.log('  - المحتوى لم يتغير على الإطلاق');
        console.log('  - المشكلة: التحديث لا يصل إلى قاعدة البيانات');
      } else {
        console.log('  - المحتوى تغير لكن الصورة غير موجودة');
        console.log('  - المشكلة: قد يكون هناك تنظيف للصور أثناء الحفظ');
      }
    }

    // 5. عرض الصور بعد التحديث
    if (verifiedImages.length > 0) {
      console.log('\n  الصور بعد التحديث:');
      verifiedImages.slice(0, 5).forEach((img, idx) => {
        const srcMatch = img.match(/src="([^"]*)"/i);
        const src = srcMatch ? srcMatch[1] : 'غير معروف';
        console.log(`    ${idx + 1}. ${src.substring(0, 80)}...`);
      });
    }
  } catch (error) {
    console.error('خطأ:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

// تشغيل الاختبار
testArticleImageUpdate();
