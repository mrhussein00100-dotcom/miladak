/**
 * اختبار استبدال الصورة في المقال 105
 * يحاكي ما يحدث عند استبدال صورة في المحرر
 */

const API_BASE = 'https://miladak.com';

async function testImageReplace() {
  console.log('=== اختبار استبدال الصورة في المقال 105 ===\n');

  try {
    // 1. جلب المقال
    console.log('1. جلب المقال 105...');
    const getRes = await fetch(`${API_BASE}/api/admin/articles/105`);
    const getData = await getRes.json();

    if (!getData.success) {
      console.error('فشل في جلب المقال:', getData.error);
      return;
    }

    const article = getData.data;
    console.log('- العنوان:', article.title?.substring(0, 50));
    console.log('- طول المحتوى:', article.content?.length);

    // 2. تحليل الصور
    const imageMatches =
      article.content?.match(/<img[^>]*src="([^"]*)"[^>]*>/gi) || [];
    console.log('\n2. تحليل الصور:');
    console.log('- عدد الصور:', imageMatches.length);

    let base64Count = 0;
    let urlCount = 0;
    imageMatches.forEach((img, idx) => {
      const srcMatch = img.match(/src="([^"]*)"/i);
      const src = srcMatch ? srcMatch[1] : '';
      if (src.startsWith('data:')) {
        base64Count++;
        console.log(`- صورة ${idx + 1}: base64 (${src.length} حرف)`);
      } else {
        urlCount++;
        console.log(`- صورة ${idx + 1}: ${src.substring(0, 60)}...`);
      }
    });
    console.log(`\n- صور base64: ${base64Count}`);
    console.log(`- صور URL: ${urlCount}`);

    // 3. البحث عن قسم "خلاصة وتوصيات"
    console.log('\n3. البحث عن قسم "خلاصة وتوصيات"...');
    const sectionIndex = article.content?.indexOf('خلاصة وتوصيات');
    if (sectionIndex === -1) {
      console.log('- لم يتم العثور على القسم');
    } else {
      console.log('- تم العثور على القسم في الموضع:', sectionIndex);

      // البحث عن الصورة التالية بعد هذا القسم
      const afterSection = article.content.substring(sectionIndex);
      const nextImageMatch = afterSection.match(
        /<img[^>]*src="([^"]*)"[^>]*>/i
      );
      if (nextImageMatch) {
        const imgSrc = nextImageMatch[1];
        console.log('- الصورة التالية:', imgSrc.substring(0, 80));
      }
    }

    // 4. محاولة استبدال صورة
    console.log('\n4. محاولة استبدال صورة...');

    // استبدال أول صورة URL بصورة جديدة
    let newContent = article.content;
    const firstUrlImage = newContent.match(
      /<img[^>]*src="(https?:\/\/[^"]*)"[^>]*>/i
    );

    if (firstUrlImage) {
      const oldSrc = firstUrlImage[1];
      const newSrc =
        'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=800';

      console.log('- الصورة القديمة:', oldSrc.substring(0, 60));
      console.log('- الصورة الجديدة:', newSrc.substring(0, 60));

      newContent = newContent.replace(oldSrc, newSrc);
      console.log('- طول المحتوى الجديد:', newContent.length);
    }

    // 5. محاولة الحفظ
    console.log('\n5. محاولة حفظ المقال...');

    const saveRes = await fetch(`${API_BASE}/api/admin/articles/105`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
    });

    console.log('- حالة الاستجابة:', saveRes.status);

    const saveData = await saveRes.json();
    console.log('- النتيجة:', saveData.success ? 'نجاح' : 'فشل');
    if (!saveData.success) {
      console.log('- الخطأ:', saveData.error);
      console.log('- التفاصيل:', saveData.details);
    }
  } catch (error) {
    console.error('خطأ:', error.message);
  }

  console.log('\n=== انتهى الاختبار ===');
}

testImageReplace();
