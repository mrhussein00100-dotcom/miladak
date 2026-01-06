/**
 * اختبار API المقالات على الموقع المباشر
 */

const https = require('https');

const SITE_URL = 'https://miladak.com';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
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

async function testArticlesAPI() {
  console.log('🧪 اختبار APIs المقالات...\n');

  try {
    // 1. اختبار API المقالات العامة (للزوار)
    console.log('1️⃣ اختبار API المقالات العامة...');

    const publicResponse = await makeRequest(`${SITE_URL}/api/articles`);
    console.log(`   Status: ${publicResponse.status}`);

    if (publicResponse.status === 200) {
      if (
        typeof publicResponse.data === 'object' &&
        publicResponse.data.success
      ) {
        console.log('   ✅ API المقالات العامة يعمل');
        console.log(
          `   📊 عدد المقالات: ${
            publicResponse.data.data ? publicResponse.data.data.length : 0
          }`
        );

        if (publicResponse.data.data && publicResponse.data.data.length > 0) {
          const firstArticle = publicResponse.data.data[0];
          console.log(
            `   📝 أول مقال: "${firstArticle.title}" (ID: ${firstArticle.id})`
          );
        }
      } else {
        console.log('   ⚠️  استجابة غير متوقعة من API المقالات العامة');
        console.log(
          `   البيانات: ${JSON.stringify(publicResponse.data).substring(
            0,
            200
          )}...`
        );
      }
    } else {
      console.log(
        `   ❌ فشل API المقالات العامة - Status: ${publicResponse.status}`
      );
    }

    // 2. اختبار API المقالات الإدارية
    console.log('\n2️⃣ اختبار API المقالات الإدارية...');

    const adminResponse = await makeRequest(`${SITE_URL}/api/admin/articles`);
    console.log(`   Status: ${adminResponse.status}`);

    if (adminResponse.status === 200) {
      if (
        typeof adminResponse.data === 'object' &&
        adminResponse.data.success
      ) {
        console.log('   ✅ API المقالات الإدارية يعمل');
        console.log(
          `   📊 عدد المقالات: ${
            adminResponse.data.data ? adminResponse.data.data.length : 0
          }`
        );

        if (adminResponse.data.data && adminResponse.data.data.length > 0) {
          const firstArticle = adminResponse.data.data[0];
          console.log(
            `   📝 أول مقال: "${firstArticle.title}" (ID: ${firstArticle.id})`
          );

          // اختبار جلب مقال واحد
          console.log('\n3️⃣ اختبار جلب مقال واحد...');
          const singleResponse = await makeRequest(
            `${SITE_URL}/api/admin/articles/${firstArticle.id}`
          );
          console.log(`   Status: ${singleResponse.status}`);

          if (singleResponse.status === 200 && singleResponse.data.success) {
            console.log('   ✅ تم جلب المقال بنجاح');
            const article = singleResponse.data.data;
            console.log(`   📊 معلومات المقال:`);
            console.log(`      - العنوان: ${article.title}`);
            console.log(`      - الـ slug: ${article.slug}`);
            console.log(
              `      - طول المحتوى: ${
                article.content ? article.content.length : 0
              } حرف`
            );
            console.log(`      - التصنيف: ${article.category_id}`);
            console.log(`      - منشور: ${article.published ? 'نعم' : 'لا'}`);
            console.log(`      - مميز: ${article.featured ? 'نعم' : 'لا'}`);

            // فحص المحتوى للصور
            if (article.content) {
              const imageMatches = article.content.match(/<img[^>]*>/gi) || [];
              console.log(
                `      - عدد الصور في المحتوى: ${imageMatches.length}`
              );

              if (imageMatches.length > 0) {
                console.log('   🖼️  الصور الموجودة:');
                imageMatches.slice(0, 3).forEach((img, index) => {
                  const srcMatch = img.match(/src="([^"]*)"/i);
                  if (srcMatch) {
                    console.log(
                      `      ${index + 1}. ${srcMatch[1].substring(0, 50)}...`
                    );
                  }
                });
              }
            }

            return { articleId: firstArticle.id, article };
          } else {
            console.log('   ❌ فشل في جلب المقال الواحد');
            console.log(`   خطأ: ${singleResponse.data.error || 'غير معروف'}`);
          }
        }
      } else {
        console.log('   ⚠️  استجابة غير متوقعة من API المقالات الإدارية');
        console.log(
          `   البيانات: ${JSON.stringify(adminResponse.data).substring(
            0,
            200
          )}...`
        );
      }
    } else if (adminResponse.status === 401) {
      console.log('   ⚠️  مطلوب تسجيل دخول للوصول للـ API الإداري');
    } else {
      console.log(
        `   ❌ فشل API المقالات الإدارية - Status: ${adminResponse.status}`
      );
      console.log(
        `   البيانات: ${JSON.stringify(adminResponse.data).substring(
          0,
          200
        )}...`
      );
    }

    // 3. اختبار API التصنيفات
    console.log('\n4️⃣ اختبار API التصنيفات...');

    const categoriesResponse = await makeRequest(
      `${SITE_URL}/api/admin/categories`
    );
    console.log(`   Status: ${categoriesResponse.status}`);

    if (categoriesResponse.status === 200 && categoriesResponse.data.success) {
      console.log('   ✅ API التصنيفات يعمل');
      console.log(
        `   📊 عدد التصنيفات: ${
          categoriesResponse.data.data ? categoriesResponse.data.data.length : 0
        }`
      );
    } else {
      console.log('   ❌ فشل API التصنيفات');
    }
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testArticlesAPI()
  .then((result) => {
    console.log('\n✅ انتهى اختبار APIs');
    if (result && result.articleId) {
      console.log(
        `\n💡 يمكنك اختبار تعديل المقال رقم ${result.articleId} على:`
      );
      console.log(`   ${SITE_URL}/admin/articles/${result.articleId}`);
    }
  })
  .catch((error) => {
    console.error('❌ خطأ عام:', error);
  });
