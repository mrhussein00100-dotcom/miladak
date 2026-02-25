/**
 * اختبار جلب المقال 105 مباشرة من قاعدة البيانات
 * للتحقق من أن البيانات محفوظة فعلاً
 */

const SITE_URL = 'https://miladak.com';
const ARTICLE_ID = 105;

async function testDirectDBAccess() {
  console.log('='.repeat(60));
  console.log('اختبار الوصول المباشر لقاعدة البيانات');
  console.log('='.repeat(60));

  try {
    // 1. جلب من API الأدمن
    console.log('\n1. جلب من API الأدمن (/api/admin/articles/105)...');
    const adminResponse = await fetch(
      `${SITE_URL}/api/admin/articles/${ARTICLE_ID}`,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      }
    );
    const adminData = await adminResponse.json();

    if (adminData.success) {
      const adminArticle = adminData.data;
      console.log('  ✓ نجح الجلب');
      console.log('  - طول المحتوى:', adminArticle.content?.length || 0);
      const adminImages = adminArticle.content?.match(/<img[^>]*>/gi) || [];
      console.log('  - عدد الصور:', adminImages.length);

      if (adminImages.length > 0) {
        const firstSrc = adminImages[0].match(/src="([^"]*)"/i)?.[1] || '';
        console.log('  - أول صورة:', firstSrc.substring(0, 60) + '...');
      }
    } else {
      console.log('  ✗ فشل:', adminData.error);
    }

    // 2. جلب صفحة المقال العامة مباشرة
    console.log('\n2. جلب صفحة المقال العامة...');

    // أولاً نحتاج الـ slug
    const slug = adminData.data?.slug;
    if (!slug) {
      console.log('  ✗ لم يتم العثور على slug');
      return;
    }

    console.log('  - Slug:', slug);

    // جلب الصفحة HTML
    const pageResponse = await fetch(
      `${SITE_URL}/articles/${encodeURIComponent(slug)}`,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      }
    );

    console.log('  - حالة الاستجابة:', pageResponse.status);

    if (pageResponse.ok) {
      const html = await pageResponse.text();

      // البحث عن الصور في HTML
      const htmlImages = html.match(/<img[^>]*src="([^"]*)"[^>]*>/gi) || [];
      console.log('  - عدد الصور في HTML:', htmlImages.length);

      // البحث عن صور المحتوى تحديداً (داخل article أو prose)
      const contentMatch =
        html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
        html.match(/class="prose[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

      if (contentMatch) {
        const contentImages = contentMatch[0].match(/<img[^>]*>/gi) || [];
        console.log('  - عدد صور المحتوى:', contentImages.length);
      }

      // التحقق من وجود صورة معينة
      const testImageBase = 'pexels-photo-3184291';
      const hasTestImage = html.includes(testImageBase);
      console.log('  - صورة الاختبار موجودة:', hasTestImage ? 'نعم ✓' : 'لا ✗');
    }

    // 3. اختبار API debug إذا كان موجوداً
    console.log('\n3. اختبار API التشخيص...');
    const debugResponse = await fetch(
      `${SITE_URL}/api/debug-article?id=${ARTICLE_ID}`,
      {
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );

    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log(
        '  - بيانات التشخيص:',
        JSON.stringify(debugData, null, 2).substring(0, 500)
      );
    } else {
      console.log('  - API التشخيص غير متاح');
    }

    // 4. مقارنة المحتوى
    console.log('\n4. ملخص المقارنة:');
    console.log('  - المحتوى في API الأدمن: متاح');
    console.log('  - المحتوى في الصفحة العامة: يحتاج تحقق');

    // 5. اقتراحات
    console.log('\n5. اقتراحات لحل المشكلة:');
    console.log('  1. تأكد من مسح cache المتصفح (Ctrl+Shift+R)');
    console.log('  2. تأكد من أن Vercel لا يستخدم cache قديم');
    console.log('  3. جرب فتح الصفحة في نافذة خاصة (Incognito)');
    console.log('  4. تحقق من أن الصور تُرسل بشكل صحيح من الواجهة');
  } catch (error) {
    console.error('خطأ:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

// تشغيل الاختبار
testDirectDBAccess();
