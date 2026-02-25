/**
 * اختبار مشكلة حفظ المقال على الموقع المباشر
 */

const https = require('https');

const SITE_URL = 'https://miladak.com';

// محتوى اختبار يحتوي على صور في مواقع مختلفة
const TEST_CONTENT = `
<h2>عنوان تجريبي</h2>
<p>هذا نص تجريبي قبل الصورة الأولى.</p>

<figure class="my-6">
  <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة تجريبية 1" class="w-full rounded-xl" />
  <figcaption>صورة تجريبية في figure</figcaption>
</figure>

<p>نص بين الصورتين.</p>

<div class="text-center my-6">
  <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة تجريبية 2" class="rounded-lg shadow-lg" />
</div>

<h3>قسم آخر</h3>
<p>نص قبل الصورة الثالثة.</p>
<img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة تجريبية 3" class="w-full rounded-xl my-6" />
<p>نص بعد الصورة الثالثة.</p>
`;

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testArticleSave() {
  console.log('🧪 اختبار حفظ المقال على الموقع المباشر...\n');

  try {
    // 1. اختبار API تشخيص المحتوى
    console.log('1️⃣ اختبار API تشخيص المحتوى...');

    const debugResponse = await makeRequest(`${SITE_URL}/api/debug-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: TEST_CONTENT }),
    });

    console.log(`   Status: ${debugResponse.status}`);

    if (debugResponse.status === 200 && debugResponse.data.success) {
      console.log('   ✅ API تشخيص المحتوى يعمل بشكل صحيح');

      const debugData = debugResponse.data.data;
      console.log(`   📊 الإحصائيات:`);
      console.log(
        `      - طول المحتوى: ${debugData.original.contentLength} حرف`
      );
      console.log(`      - عدد الصور: ${debugData.original.imageCount}`);
      console.log(`      - صور مكررة: ${debugData.original.duplicates.length}`);
      console.log(
        `      - تم التعديل: ${
          debugData.comparison.contentChanged ? 'نعم' : 'لا'
        }`
      );

      if (debugData.original.duplicates.length > 0) {
        console.log('   ⚠️  صور مكررة موجودة:');
        debugData.original.duplicates.forEach((dup) => {
          console.log(
            `      - ${dup.url.substring(0, 50)}... (${dup.count} مرات)`
          );
        });
      }
    } else {
      console.log('   ❌ فشل في API تشخيص المحتوى');
      console.log(`   خطأ: ${debugResponse.data.error || 'غير معروف'}`);
    }

    console.log('\n2️⃣ اختبار جلب مقال موجود...');

    // جلب قائمة المقالات أولاً
    const articlesResponse = await makeRequest(
      `${SITE_URL}/api/admin/articles`
    );

    if (articlesResponse.status === 200 && articlesResponse.data.success) {
      const articles = articlesResponse.data.data;
      console.log(`   ✅ تم جلب ${articles.length} مقال`);

      if (articles.length > 0) {
        const testArticle = articles[0];
        console.log(
          `   📝 اختبار المقال: "${testArticle.title}" (ID: ${testArticle.id})`
        );

        // جلب تفاصيل المقال
        const articleResponse = await makeRequest(
          `${SITE_URL}/api/admin/articles/${testArticle.id}`
        );

        if (articleResponse.status === 200 && articleResponse.data.success) {
          console.log('   ✅ تم جلب تفاصيل المقال بنجاح');

          const article = articleResponse.data.data;
          console.log(`   📊 معلومات المقال:`);
          console.log(`      - العنوان: ${article.title}`);
          console.log(
            `      - طول المحتوى: ${
              article.content ? article.content.length : 0
            } حرف`
          );
          console.log(`      - التصنيف: ${article.category_id}`);
          console.log(`      - منشور: ${article.published ? 'نعم' : 'لا'}`);

          // اختبار تحديث المقال بمحتوى تجريبي
          console.log('\n3️⃣ اختبار تحديث المقال...');

          const updateData = {
            title: article.title,
            slug: article.slug,
            content: TEST_CONTENT,
            excerpt: article.excerpt,
            category_id: article.category_id,
            published: article.published,
            featured: article.featured,
            meta_description: article.meta_description,
            meta_keywords: article.meta_keywords,
            featured_image: article.featured_image,
          };

          const updateResponse = await makeRequest(
            `${SITE_URL}/api/admin/articles/${testArticle.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updateData),
            }
          );

          console.log(`   Status: ${updateResponse.status}`);

          if (updateResponse.status === 200 && updateResponse.data.success) {
            console.log('   ✅ تم تحديث المقال بنجاح');
            console.log('   📝 المحتوى الجديد تم حفظه بدون مشاكل');

            // استعادة المحتوى الأصلي
            const restoreResponse = await makeRequest(
              `${SITE_URL}/api/admin/articles/${testArticle.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...updateData,
                  content: article.content,
                }),
              }
            );

            if (restoreResponse.status === 200) {
              console.log('   ✅ تم استعادة المحتوى الأصلي');
            }
          } else {
            console.log('   ❌ فشل في تحديث المقال');
            console.log(`   خطأ: ${updateResponse.data.error || 'غير معروف'}`);
            if (updateResponse.data.details) {
              console.log(`   تفاصيل: ${updateResponse.data.details}`);
            }
          }
        } else {
          console.log('   ❌ فشل في جلب تفاصيل المقال');
        }
      } else {
        console.log('   ⚠️  لا توجد مقالات للاختبار');
      }
    } else {
      console.log('   ❌ فشل في جلب قائمة المقالات');
    }
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testArticleSave()
  .then(() => {
    console.log('\n✅ انتهى الاختبار');
  })
  .catch((error) => {
    console.error('❌ خطأ عام:', error);
  });
