/**
 * اختبار مشكلة حفظ المقال مع الصور المكررة
 */

const https = require('https');

const SITE_URL = 'https://miladak.com';

// محتوى اختبار يحتوي على نفس الصورة في مواقع مختلفة (المشكلة المبلغ عنها)
const PROBLEMATIC_CONTENT = `
<h2>اختبار الصور المكررة</h2>
<p>هذا نص تجريبي قبل الصورة الأولى.</p>

<figure class="my-6">
  <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة تجريبية" class="w-full rounded-xl" />
  <figcaption>نفس الصورة في figure</figcaption>
</figure>

<p>نص بين الصورتين.</p>

<h3>قسم آخر</h3>
<p>نص قبل نفس الصورة مرة أخرى.</p>
<img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="نفس الصورة" class="w-full rounded-xl my-6" />
<p>نص بعد الصورة.</p>

<div class="text-center my-6">
  <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="نفس الصورة مرة ثالثة" class="rounded-lg shadow-lg" />
</div>

<p>نص في النهاية.</p>
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
          resolve({
            status: res.statusCode,
            data: data,
            parseError: e.message,
          });
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

async function testArticleSaveIssue() {
  console.log('🧪 اختبار مشكلة حفظ المقال مع الصور المكررة...\n');

  try {
    // 1. جلب قائمة المقالات
    console.log('1️⃣ جلب قائمة المقالات...');

    const articlesResponse = await makeRequest(
      `${SITE_URL}/api/admin/articles`
    );

    if (articlesResponse.status === 200 && articlesResponse.data.success) {
      const articles = articlesResponse.data.data.items; // البيانات في data.items
      console.log(`   ✅ تم جلب ${articles.length} مقال`);

      if (articles.length > 0) {
        // اختيار مقال للاختبار
        const testArticle =
          articles.find((a) => a.id && a.title) || articles[0];
        console.log(
          `   📝 اختبار المقال: "${testArticle.title}" (ID: ${testArticle.id})`
        );

        // 2. جلب تفاصيل المقال
        console.log('\n2️⃣ جلب تفاصيل المقال...');
        const articleResponse = await makeRequest(
          `${SITE_URL}/api/admin/articles/${testArticle.id}`
        );

        if (articleResponse.status === 200 && articleResponse.data.success) {
          const article = articleResponse.data.data;
          console.log('   ✅ تم جلب تفاصيل المقال');
          console.log(
            `   📊 طول المحتوى الأصلي: ${
              article.content ? article.content.length : 0
            } حرف`
          );

          // حفظ المحتوى الأصلي للاستعادة لاحقاً
          const originalContent = article.content;

          // 3. اختبار تشخيص المحتوى المشكل
          console.log('\n3️⃣ تشخيص المحتوى المشكل...');
          const debugResponse = await makeRequest(
            `${SITE_URL}/api/debug-content`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: PROBLEMATIC_CONTENT }),
            }
          );

          if (debugResponse.status === 200 && debugResponse.data.success) {
            const debugData = debugResponse.data.data;
            console.log('   ✅ تم تشخيص المحتوى');
            console.log(`   📊 الإحصائيات:`);
            console.log(
              `      - طول المحتوى: ${debugData.original.contentLength} حرف`
            );
            console.log(`      - عدد الصور: ${debugData.original.imageCount}`);
            console.log(
              `      - صور مكررة: ${debugData.original.duplicates.length}`
            );
            console.log(
              `      - تم التعديل: ${
                debugData.comparison.contentChanged ? 'نعم' : 'لا'
              }`
            );

            if (debugData.original.duplicates.length > 0) {
              console.log('   ⚠️  صور مكررة موجودة:');
              debugData.original.duplicates.forEach((dup) => {
                console.log(
                  `      - ${dup.url.substring(0, 40)}... (${dup.count} مرات)`
                );
              });
            }
          }

          // 4. محاولة حفظ المحتوى المشكل
          console.log('\n4️⃣ محاولة حفظ المحتوى المشكل...');

          const updateData = {
            title: article.title,
            slug: article.slug,
            content: PROBLEMATIC_CONTENT,
            excerpt: article.excerpt,
            category_id: article.category_id,
            published: article.published,
            featured: article.featured,
            meta_description: article.meta_description,
            meta_keywords: article.meta_keywords,
            featured_image: article.featured_image,
            author: article.author,
          };

          const updateResponse = await makeRequest(
            `${SITE_URL}/api/admin/articles/${testArticle.id}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateData),
            }
          );

          console.log(`   Status: ${updateResponse.status}`);

          if (updateResponse.status === 200 && updateResponse.data.success) {
            console.log('   ✅ تم حفظ المحتوى المشكل بنجاح!');
            console.log('   📝 لم تحدث أي مشكلة في الحفظ');

            // التحقق من المحتوى المحفوظ
            const verifyResponse = await makeRequest(
              `${SITE_URL}/api/admin/articles/${testArticle.id}`
            );
            if (verifyResponse.status === 200 && verifyResponse.data.success) {
              const savedArticle = verifyResponse.data.data;
              console.log(
                `   📊 طول المحتوى المحفوظ: ${
                  savedArticle.content ? savedArticle.content.length : 0
                } حرف`
              );

              // فحص الصور في المحتوى المحفوظ
              const savedImages = (
                savedArticle.content.match(/<img[^>]*>/gi) || []
              ).length;
              console.log(`   🖼️  عدد الصور المحفوظة: ${savedImages}`);
            }
          } else {
            console.log('   ❌ فشل في حفظ المحتوى المشكل');
            console.log(`   خطأ: ${updateResponse.data.error || 'غير معروف'}`);
            if (updateResponse.data.details) {
              console.log(`   تفاصيل: ${updateResponse.data.details}`);
            }

            // هذا هو المكان الذي نتوقع فيه المشكلة
            console.log('\n   🔍 تحليل المشكلة:');
            if (
              updateResponse.data.error &&
              updateResponse.data.error.includes('صور مكررة')
            ) {
              console.log('   ✅ تم اكتشاف مشكلة الصور المكررة بواسطة النظام');
            } else if (
              updateResponse.data.error &&
              updateResponse.data.error.includes('encoding')
            ) {
              console.log('   ⚠️  مشكلة في ترميز الأحرف');
            } else if (
              updateResponse.data.error &&
              updateResponse.data.error.includes('too long')
            ) {
              console.log('   ⚠️  المحتوى طويل جداً');
            } else {
              console.log('   ❓ مشكلة غير محددة');
            }
          }

          // 5. استعادة المحتوى الأصلي
          console.log('\n5️⃣ استعادة المحتوى الأصلي...');

          const restoreResponse = await makeRequest(
            `${SITE_URL}/api/admin/articles/${testArticle.id}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...updateData,
                content: originalContent,
              }),
            }
          );

          if (restoreResponse.status === 200 && restoreResponse.data.success) {
            console.log('   ✅ تم استعادة المحتوى الأصلي بنجاح');
          } else {
            console.log('   ⚠️  فشل في استعادة المحتوى الأصلي');
          }
        } else {
          console.log('   ❌ فشل في جلب تفاصيل المقال');
          console.log(`   خطأ: ${articleResponse.data.error || 'غير معروف'}`);
        }
      } else {
        console.log('   ⚠️  لا توجد مقالات للاختبار');
      }
    } else {
      console.log('   ❌ فشل في جلب قائمة المقالات');
      console.log(`   Status: ${articlesResponse.status}`);
      if (articlesResponse.data.error) {
        console.log(`   خطأ: ${articlesResponse.data.error}`);
      }
    }
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testArticleSaveIssue()
  .then(() => {
    console.log('\n✅ انتهى اختبار مشكلة حفظ المقال');
    console.log('\n💡 إذا نجح الحفظ، فهذا يعني أن المشكلة تم إصلاحها');
    console.log('💡 إذا فشل الحفظ، فستظهر تفاصيل المشكلة أعلاه');
  })
  .catch((error) => {
    console.error('❌ خطأ عام:', error);
  });
