/**
 * محاكاة سلوك المتصفح عند تحديث المقال
 * يفحص المشكلة: الصور لا تُحفظ فعلياً رغم ظهور رسالة النجاح
 */

const SITE_URL = 'https://miladak.com';
const ARTICLE_ID = 105;

async function simulateBrowserUpdate() {
  console.log('='.repeat(60));
  console.log('محاكاة تحديث المقال من المتصفح');
  console.log('='.repeat(60));

  try {
    // 1. جلب المقال (كما يفعل المتصفح عند فتح صفحة التحرير)
    console.log('\n1. جلب المقال الحالي...');
    const getResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`,
      {
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
    const getData = await getResponse.json();

    if (!getData.success) {
      console.error('فشل في جلب المقال:', getData.error);
      return;
    }

    const article = getData.data;
    console.log('✓ تم جلب المقال');
    console.log('  - العنوان:', article.title);
    console.log('  - طول المحتوى الأصلي:', article.content?.length || 0);

    // استخراج الصور
    const originalImages = article.content?.match(/<img[^>]*>/gi) || [];
    console.log('  - عدد الصور الأصلية:', originalImages.length);

    // 2. محاكاة تغيير صورة (استبدال أول صورة بصورة جديدة)
    console.log('\n2. محاكاة استبدال صورة...');

    let modifiedContent = article.content || '';
    const newImageUrl =
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&timestamp=' +
      Date.now();

    // استبدال أول صورة
    let imageReplaced = false;
    modifiedContent = modifiedContent.replace(
      /<img([^>]*)src="([^"]*)"([^>]*)>/i,
      (match, before, src, after) => {
        if (!imageReplaced) {
          imageReplaced = true;
          console.log('  - الصورة القديمة:', src.substring(0, 60) + '...');
          console.log(
            '  - الصورة الجديدة:',
            newImageUrl.substring(0, 60) + '...'
          );
          return `<img${before}src="${newImageUrl}"${after}>`;
        }
        return match;
      }
    );

    if (!imageReplaced) {
      console.log('  - لم يتم العثور على صور للاستبدال');
      // إضافة صورة جديدة
      modifiedContent =
        `<img src="${newImageUrl}" alt="صورة اختبار" />\n` + modifiedContent;
      console.log('  - تم إضافة صورة جديدة بدلاً من ذلك');
    }

    // 3. إرسال التحديث (كما يفعل handleSave في الواجهة)
    console.log('\n3. إرسال التحديث...');

    // تنظيف المحتوى كما يفعل handleSave
    let finalContent = modifiedContent;
    finalContent = finalContent.replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
      ''
    );
    finalContent = finalContent.replace(
      /<img([^>]*[^\/])>(?!<\/img>)/gi,
      '<img$1 />'
    );
    finalContent = finalContent.replace(/<img[^>]*src=""[^>]*>/gi, '');
    finalContent = finalContent.replace(/<img[^>]*src="undefined"[^>]*>/gi, '');
    finalContent = finalContent.replace(/<img[^>]*src="null"[^>]*>/gi, '');

    console.log('  - طول المحتوى بعد التنظيف:', finalContent.length);

    const updatePayload = {
      title: article.title,
      slug: article.slug,
      content: finalContent,
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
      JSON.stringify(updatePayload).length,
      'bytes'
    );

    const updateResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(updatePayload),
      }
    );

    const updateData = await updateResponse.json();
    console.log('  - حالة الاستجابة:', updateResponse.status);
    console.log('  - نجاح:', updateData.success);

    if (!updateData.success) {
      console.error('  - خطأ:', updateData.error);
      if (updateData.details) {
        console.error('  - تفاصيل:', updateData.details);
      }
      return;
    }

    // 4. التحقق الفوري
    console.log('\n4. التحقق الفوري من الحفظ...');

    const verifyResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`,
      {
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }
    );
    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      console.error('فشل في التحقق:', verifyData.error);
      return;
    }

    const verifiedArticle = verifyData.data;
    console.log(
      '  - طول المحتوى المحفوظ:',
      verifiedArticle.content?.length || 0
    );

    // التحقق من وجود الصورة الجديدة
    const newImageBase = newImageUrl.split('?')[0];
    const imageFound = verifiedArticle.content?.includes(newImageBase);

    if (imageFound) {
      console.log('\n✓✓✓ نجاح! الصورة الجديدة موجودة في المحتوى المحفوظ');
    } else {
      console.log('\n✗✗✗ فشل! الصورة الجديدة غير موجودة');

      // تحليل إضافي
      console.log('\nتحليل المشكلة:');
      console.log('  - طول المحتوى المرسل:', finalContent.length);
      console.log(
        '  - طول المحتوى المحفوظ:',
        verifiedArticle.content?.length || 0
      );

      if (verifiedArticle.content?.length === article.content?.length) {
        console.log('  - المحتوى لم يتغير - المشكلة في الحفظ');
      } else if (verifiedArticle.content?.length < finalContent.length) {
        console.log('  - المحتوى أقصر - هناك تنظيف/اقتطاع يحدث');
      }

      // البحث عن الصور في المحتوى المحفوظ
      const savedImages =
        verifiedArticle.content?.match(/<img[^>]*src="([^"]*)"[^>]*>/gi) || [];
      console.log('  - عدد الصور المحفوظة:', savedImages.length);

      if (savedImages.length > 0) {
        console.log('\n  أول 3 صور محفوظة:');
        savedImages.slice(0, 3).forEach((img, idx) => {
          const srcMatch = img.match(/src="([^"]*)"/i);
          const src = srcMatch ? srcMatch[1] : 'غير معروف';
          console.log(`    ${idx + 1}. ${src.substring(0, 70)}...`);
        });
      }
    }

    // 5. اختبار إضافي: التحقق من الصفحة العامة
    console.log('\n5. التحقق من الصفحة العامة...');
    const publicResponse = await fetch(
      `${SITE_URL}/api/articles?slug=${article.slug}`,
      {
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );

    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      if (publicData.success && publicData.data) {
        const publicArticle = Array.isArray(publicData.data)
          ? publicData.data[0]
          : publicData.data;
        if (publicArticle) {
          const publicImageFound =
            publicArticle.content?.includes(newImageBase);
          console.log(
            '  - الصورة في الصفحة العامة:',
            publicImageFound ? 'موجودة ✓' : 'غير موجودة ✗'
          );
        }
      }
    }
  } catch (error) {
    console.error('خطأ:', error.message);
    console.error(error.stack);
  }

  console.log('\n' + '='.repeat(60));
}

// تشغيل الاختبار
simulateBrowserUpdate();
