/**
 * سكريبت اختبار حفظ المقال عبر API
 * يختبر السيناريو الذي وصفه المستخدم
 */

const https = require('https');

const ARTICLE_ID = 105;
const BASE_URL = 'https://miladak.com';

// صورة جديدة للاختبار
const NEW_IMAGE_URL =
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';

async function fetchArticle() {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/api/admin/articles/${ARTICLE_ID}`;
    console.log(`📖 جلب المقال من: ${url}`);

    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

async function updateArticle(articleData) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/api/admin/articles/${ARTICLE_ID}`;
    const postData = JSON.stringify(articleData);

    const options = {
      hostname: 'miladak.com',
      port: 443,
      path: `/api/admin/articles/${ARTICLE_ID}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    console.log(`📤 إرسال التحديث إلى: ${url}`);
    console.log(`   - حجم البيانات: ${postData.length} bytes`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔍 بدء اختبار حفظ المقال...\n');

  try {
    // 1. جلب المقال الحالي
    console.log('الخطوة 1: جلب المقال الحالي');
    const fetchResult = await fetchArticle();

    if (!fetchResult.success) {
      console.error('❌ فشل جلب المقال:', fetchResult.error);
      return;
    }

    const article = fetchResult.data;
    console.log('✅ تم جلب المقال:');
    console.log(`   - العنوان: ${article.title}`);
    console.log(`   - طول المحتوى: ${article.content?.length || 0} حرف`);
    console.log(`   - آخر تحديث: ${article.updated_at}`);

    // عد الصور
    const imageMatches = article.content?.match(/<img[^>]*>/gi) || [];
    console.log(`   - عدد الصور: ${imageMatches.length}`);

    // 2. البحث عن الصورة تحت عنوان "خلاصة وتوصيات"
    console.log('\nالخطوة 2: البحث عن الصورة تحت عنوان "خلاصة وتوصيات"');

    const conclusionIndex = article.content?.indexOf('خلاصة وتوصيات');
    if (conclusionIndex === -1) {
      console.log('⚠️ لم يتم العثور على عنوان "خلاصة وتوصيات"');
    } else {
      console.log(`   - موقع العنوان: ${conclusionIndex}`);

      // البحث عن أول صورة بعد العنوان
      const contentAfterTitle = article.content.substring(conclusionIndex);
      const imageMatch = contentAfterTitle.match(
        /<img[^>]*src="([^"]*)"[^>]*>/i
      );

      if (imageMatch) {
        console.log(
          `   - الصورة الحالية: ${imageMatch[1].substring(0, 80)}...`
        );
      }
    }

    // 3. استبدال الصورة
    console.log('\nالخطوة 3: استبدال الصورة');

    let newContent = article.content;
    let imageReplaced = false;

    if (conclusionIndex !== -1) {
      // استبدال أول صورة بعد عنوان "خلاصة وتوصيات"
      const beforeConclusion = article.content.substring(0, conclusionIndex);
      const afterConclusion = article.content.substring(conclusionIndex);

      const newAfterConclusion = afterConclusion.replace(
        /<img([^>]*?)src="([^"]*)"([^>]*?)>/i,
        `<img$1src="${NEW_IMAGE_URL}"$3>`
      );

      if (newAfterConclusion !== afterConclusion) {
        newContent = beforeConclusion + newAfterConclusion;
        imageReplaced = true;
        console.log('✅ تم استبدال الصورة في المحتوى');
      }
    }

    if (!imageReplaced) {
      // استبدال أي صورة للاختبار
      newContent = article.content.replace(
        /<img([^>]*?)src="([^"]*)"([^>]*?)>/i,
        `<img$1src="${NEW_IMAGE_URL}"$3>`
      );
      console.log('✅ تم استبدال أول صورة في المحتوى');
    }

    // 4. إرسال التحديث
    console.log('\nالخطوة 4: إرسال التحديث');

    const updateData = {
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
    };

    const updateResult = await updateArticle(updateData);

    console.log(`   - حالة الاستجابة: ${updateResult.status}`);
    console.log(`   - النتيجة:`, updateResult.data);

    if (updateResult.data.success) {
      console.log('✅ API أرجع نجاح');
    } else {
      console.log('❌ API أرجع فشل:', updateResult.data.error);
    }

    // 5. التحقق من الحفظ
    console.log('\nالخطوة 5: التحقق من الحفظ');

    // انتظار قليلاً
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const verifyResult = await fetchArticle();

    if (verifyResult.success) {
      const verifiedContent = verifyResult.data.content;

      if (verifiedContent.includes(NEW_IMAGE_URL)) {
        console.log('✅ الصورة الجديدة محفوظة بشكل صحيح!');
      } else {
        console.log('❌ الصورة الجديدة لم تُحفظ!');
        console.log('   - هذا يؤكد المشكلة التي وصفها المستخدم');
      }

      console.log(`   - آخر تحديث بعد الحفظ: ${verifyResult.data.updated_at}`);
    }
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

main();
