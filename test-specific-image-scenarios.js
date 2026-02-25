/**
 * اختبار سيناريوهات محددة لمشكلة الصور في المقالات
 */

const https = require('https');

const SITE_URL = 'https://miladak.com';

// سيناريوهات مختلفة للاختبار
const TEST_SCENARIOS = [
  {
    name: 'نفس الصورة في مواقع مختلفة',
    content: `
<h2>اختبار الصورة المكررة</h2>
<p>نص قبل الصورة الأولى.</p>
<img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة 1" class="w-full rounded-xl" />
<p>نص بين الصورتين.</p>
<figure class="my-6">
  <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة 2" class="w-full rounded-xl" />
</figure>
<p>نص بعد الصورة.</p>
`,
  },
  {
    name: 'صورة مع أحرف خاصة في URL',
    content: `
<h2>اختبار الأحرف الخاصة</h2>
<p>نص قبل الصورة.</p>
<img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="صورة مع معاملات" class="w-full rounded-xl" />
<p>نص بعد الصورة.</p>
`,
  },
  {
    name: 'صورة داخل div منسق',
    content: `
<h2>اختبار الصورة في div</h2>
<p>نص قبل الصورة.</p>
<div class="text-center my-6 bg-gray-100 p-4 rounded-lg">
  <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة في div" class="rounded-lg shadow-lg max-w-md mx-auto" />
  <p class="text-sm text-gray-600 mt-2">وصف الصورة</p>
</div>
<p>نص بعد الصورة.</p>
`,
  },
  {
    name: 'صور متعددة مختلفة',
    content: `
<h2>اختبار صور متعددة</h2>
<p>نص قبل الصور.</p>
<img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة 1" class="w-full rounded-xl mb-4" />
<img src="https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg" alt="صورة 2" class="w-full rounded-xl mb-4" />
<img src="https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg" alt="صورة 3" class="w-full rounded-xl" />
<p>نص بعد الصور.</p>
`,
  },
  {
    name: 'صورة مع HTML معقد',
    content: `
<h2>اختبار HTML معقد</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة معقدة" class="w-full h-48 object-cover" />
    <div class="p-4">
      <h3 class="font-bold text-lg">عنوان الصورة</h3>
      <p class="text-gray-600">وصف الصورة هنا</p>
    </div>
  </div>
  <div class="flex items-center">
    <p>محتوى نصي بجانب الصورة</p>
  </div>
</div>
`,
  },
];

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

async function testImageScenarios() {
  console.log('🧪 اختبار سيناريوهات محددة لمشكلة الصور...\n');

  try {
    // جلب مقال للاختبار
    console.log('📋 جلب مقال للاختبار...');
    const articlesResponse = await makeRequest(
      `${SITE_URL}/api/admin/articles`
    );

    if (articlesResponse.status !== 200 || !articlesResponse.data.success) {
      console.log('❌ فشل في جلب المقالات');
      return;
    }

    const articles = articlesResponse.data.data.items;
    const testArticle = articles[0];
    console.log(
      `✅ سيتم الاختبار على المقال: "${testArticle.title}" (ID: ${testArticle.id})`
    );

    // جلب تفاصيل المقال
    const articleResponse = await makeRequest(
      `${SITE_URL}/api/admin/articles/${testArticle.id}`
    );
    if (articleResponse.status !== 200 || !articleResponse.data.success) {
      console.log('❌ فشل في جلب تفاصيل المقال');
      return;
    }

    const article = articleResponse.data.data;
    const originalContent = article.content;

    console.log(
      `📊 المقال الأصلي: ${originalContent ? originalContent.length : 0} حرف\n`
    );

    // اختبار كل سيناريو
    for (let i = 0; i < TEST_SCENARIOS.length; i++) {
      const scenario = TEST_SCENARIOS[i];
      console.log(`${i + 1}️⃣ اختبار: ${scenario.name}`);

      // تشخيص المحتوى أولاً
      const debugResponse = await makeRequest(`${SITE_URL}/api/debug-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: scenario.content }),
      });

      if (debugResponse.status === 200 && debugResponse.data.success) {
        const debugData = debugResponse.data.data;
        console.log(`   🔍 التشخيص:`);
        console.log(
          `      - طول المحتوى: ${debugData.original.contentLength} حرف`
        );
        console.log(`      - عدد الصور: ${debugData.original.imageCount}`);
        console.log(
          `      - صور مكررة: ${debugData.original.duplicates.length}`
        );
        console.log(
          `      - تعديل مطلوب: ${
            debugData.comparison.contentChanged ? 'نعم' : 'لا'
          }`
        );

        if (debugData.original.duplicates.length > 0) {
          console.log(
            `      ⚠️  صور مكررة: ${debugData.original.duplicates
              .map((d) => d.count)
              .join(', ')}`
          );
        }
      }

      // محاولة الحفظ
      const updateData = {
        title: article.title,
        slug: article.slug,
        content: scenario.content,
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

      if (updateResponse.status === 200 && updateResponse.data.success) {
        console.log(`   ✅ نجح الحفظ`);

        // التحقق من المحتوى المحفوظ
        const verifyResponse = await makeRequest(
          `${SITE_URL}/api/admin/articles/${testArticle.id}`
        );
        if (verifyResponse.status === 200 && verifyResponse.data.success) {
          const savedContent = verifyResponse.data.data.content;
          const savedImages = (savedContent.match(/<img[^>]*>/gi) || []).length;
          console.log(
            `   📊 المحفوظ: ${savedContent.length} حرف، ${savedImages} صور`
          );
        }
      } else {
        console.log(`   ❌ فشل الحفظ - Status: ${updateResponse.status}`);
        if (updateResponse.data.error) {
          console.log(`   خطأ: ${updateResponse.data.error}`);
        }
        if (updateResponse.data.details) {
          console.log(`   تفاصيل: ${updateResponse.data.details}`);
        }
      }

      console.log(''); // سطر فارغ

      // انتظار قصير بين الاختبارات
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // استعادة المحتوى الأصلي
    console.log('🔄 استعادة المحتوى الأصلي...');
    const restoreResponse = await makeRequest(
      `${SITE_URL}/api/admin/articles/${testArticle.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          slug: article.slug,
          content: originalContent,
          excerpt: article.excerpt,
          category_id: article.category_id,
          published: article.published,
          featured: article.featured,
          meta_description: article.meta_description,
          meta_keywords: article.meta_keywords,
          featured_image: article.featured_image,
          author: article.author,
        }),
      }
    );

    if (restoreResponse.status === 200 && restoreResponse.data.success) {
      console.log('✅ تم استعادة المحتوى الأصلي');
    } else {
      console.log('⚠️  فشل في استعادة المحتوى الأصلي');
    }
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testImageScenarios()
  .then(() => {
    console.log('\n✅ انتهى اختبار السيناريوهات');
    console.log('\n📋 الخلاصة:');
    console.log('- إذا نجحت جميع السيناريوهات، فالمشكلة تم إصلاحها');
    console.log('- إذا فشل سيناريو معين، فهناك حالة خاصة تحتاج معالجة');
    console.log('- تحقق من التفاصيل أعلاه لمعرفة السبب الدقيق');
  })
  .catch((error) => {
    console.error('❌ خطأ عام:', error);
  });
