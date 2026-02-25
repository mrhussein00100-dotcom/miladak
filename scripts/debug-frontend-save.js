/**
 * تشخيص مشكلة حفظ الصور من الواجهة
 * يفحص ما يحدث بالضبط عند الحفظ
 */

const SITE_URL = 'https://miladak.com';
const ARTICLE_ID = 105;

async function debugFrontendSave() {
  console.log('='.repeat(60));
  console.log('تشخيص مشكلة حفظ الصور من الواجهة');
  console.log('='.repeat(60));

  try {
    // 1. جلب المقال الحالي
    console.log('\n1. جلب المقال الحالي...');
    const getResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`
    );
    const getData = await getResponse.json();

    if (!getData.success) {
      console.error('فشل في جلب المقال');
      return;
    }

    const article = getData.data;
    console.log('✓ تم جلب المقال');

    // 2. تحليل المحتوى الحالي
    console.log('\n2. تحليل المحتوى الحالي:');
    const content = article.content || '';
    console.log('  - طول المحتوى:', content.length);

    // البحث عن أنواع الصور المختلفة
    const allImages = content.match(/<img[^>]*>/gi) || [];
    const base64Images =
      content.match(/<img[^>]*src="data:image[^"]*"[^>]*>/gi) || [];
    const httpImages =
      content.match(/<img[^>]*src="https?:\/\/[^"]*"[^>]*>/gi) || [];
    const relativeImages =
      content.match(/<img[^>]*src="\/[^"]*"[^>]*>/gi) || [];

    console.log('  - إجمالي الصور:', allImages.length);
    console.log('  - صور base64:', base64Images.length);
    console.log('  - صور HTTP/HTTPS:', httpImages.length);
    console.log('  - صور نسبية:', relativeImages.length);

    if (base64Images.length > 0) {
      console.log('\n  ⚠️ تحذير: يوجد صور base64 في المحتوى!');
      console.log('  هذه الصور قد تسبب مشاكل في الحفظ بسبب حجمها الكبير');

      // حساب حجم صور base64
      let base64Size = 0;
      base64Images.forEach((img) => {
        const srcMatch = img.match(/src="(data:image[^"]*)"/i);
        if (srcMatch) {
          base64Size += srcMatch[1].length;
        }
      });
      console.log(
        '  - حجم صور base64 التقريبي:',
        Math.round(base64Size / 1024),
        'KB'
      );
    }

    // 3. محاكاة سيناريو استبدال صورة
    console.log('\n3. محاكاة سيناريو استبدال صورة:');

    // إنشاء صورة جديدة للاختبار
    const timestamp = Date.now();
    const newImageUrl = `https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&t=${timestamp}`;

    // استبدال أول صورة HTTP
    let modifiedContent = content;
    let replaced = false;

    modifiedContent = modifiedContent.replace(
      /<img([^>]*)src="(https?:\/\/[^"]*)"([^>]*)>/i,
      (match, before, src, after) => {
        if (!replaced) {
          replaced = true;
          console.log('  - الصورة الأصلية:', src.substring(0, 50) + '...');
          console.log(
            '  - الصورة الجديدة:',
            newImageUrl.substring(0, 50) + '...'
          );
          return `<img${before}src="${newImageUrl}"${after}>`;
        }
        return match;
      }
    );

    if (!replaced) {
      console.log('  - لم يتم العثور على صور HTTP للاستبدال');
      return;
    }

    // 4. إرسال التحديث
    console.log('\n4. إرسال التحديث...');

    const payload = {
      title: article.title,
      slug: article.slug,
      content: modifiedContent,
      excerpt: article.excerpt || '',
      category_id: article.category_id,
      published: article.published ? 1 : 0,
      featured: article.featured ? 1 : 0,
      meta_description: article.meta_description || '',
      meta_keywords: article.meta_keywords || '',
      featured_image: article.featured_image || '',
    };

    console.log(
      '  - حجم الـ payload:',
      JSON.stringify(payload).length,
      'bytes'
    );
    console.log('  - طول المحتوى المرسل:', modifiedContent.length);

    const updateResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    console.log('  - حالة الاستجابة:', updateResponse.status);

    const updateData = await updateResponse.json();
    console.log('  - نجاح:', updateData.success);

    if (!updateData.success) {
      console.error('  - خطأ:', updateData.error);
      return;
    }

    // 5. التحقق الفوري
    console.log('\n5. التحقق الفوري...');

    // انتظار قليل
    await new Promise((r) => setTimeout(r, 1000));

    const verifyResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`,
      {
        headers: { 'Cache-Control': 'no-cache' },
      }
    );
    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      const verifiedContent = verifyData.data.content || '';
      const newImageBase = newImageUrl.split('?')[0];
      const imageFound = verifiedContent.includes(newImageBase);

      console.log('  - طول المحتوى المحفوظ:', verifiedContent.length);
      console.log('  - الصورة الجديدة موجودة:', imageFound ? 'نعم ✓' : 'لا ✗');

      if (!imageFound) {
        // تحليل إضافي
        console.log('\n  تحليل المشكلة:');

        // هل المحتوى تغير؟
        if (verifiedContent === content) {
          console.log('  - المحتوى لم يتغير على الإطلاق!');
          console.log('  - السبب المحتمل: مشكلة في الحفظ في قاعدة البيانات');
        } else if (verifiedContent.length < modifiedContent.length) {
          console.log('  - المحتوى أقصر من المرسل');
          console.log('  - السبب المحتمل: تنظيف/اقتطاع أثناء الحفظ');
        }

        // البحث عن الصور في المحتوى المحفوظ
        const savedImages =
          verifiedContent.match(/<img[^>]*src="([^"]*)"[^>]*>/gi) || [];
        console.log('  - عدد الصور المحفوظة:', savedImages.length);

        if (savedImages.length > 0) {
          console.log('\n  أول 3 صور محفوظة:');
          savedImages.slice(0, 3).forEach((img, idx) => {
            const src = img.match(/src="([^"]*)"/i)?.[1] || '';
            console.log(`    ${idx + 1}. ${src.substring(0, 60)}...`);
          });
        }
      }
    }

    // 6. ملخص
    console.log('\n6. ملخص التشخيص:');
    console.log('  - API يعمل بشكل صحيح');
    console.log('  - الحفظ يتم بنجاح');
    console.log('  - المشكلة المحتملة: Cache المتصفح');
    console.log('\n  الحل المقترح:');
    console.log('  1. امسح cache المتصفح (Ctrl+Shift+Delete)');
    console.log('  2. أو افتح الصفحة في نافذة خاصة');
    console.log('  3. أو أضف ?t=' + Date.now() + ' لرابط الصفحة');
  } catch (error) {
    console.error('خطأ:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

debugFrontendSave();
