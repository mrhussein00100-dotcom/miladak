/**
 * اختبار حفظ المقال 105 مع استبدال صورة
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://miladak.com';

async function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const req = protocol.request(
      url,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data: data.substring(0, 500) });
          }
        });
      }
    );

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testArticle105() {
  console.log('=== اختبار المقال 105 ===\n');

  // 1. جلب المقال الحالي
  console.log('1. جلب المقال 105...');
  const getResult = await fetchJson(`${BASE_URL}/api/admin/articles/105`);

  if (getResult.status !== 200 || !getResult.data.success) {
    console.error('فشل في جلب المقال:', getResult);
    return;
  }

  const article = getResult.data.data;
  console.log('   - العنوان:', article.title?.substring(0, 50));
  console.log('   - طول المحتوى:', article.content?.length || 0);

  // 2. تحليل الصور في المحتوى
  const content = article.content || '';
  const imageMatches = content.match(/<img[^>]*>/gi) || [];
  console.log('\n2. تحليل الصور:');
  console.log('   - عدد الصور:', imageMatches.length);

  imageMatches.forEach((img, idx) => {
    const srcMatch = img.match(/src="([^"]*)"/i);
    const src = srcMatch ? srcMatch[1] : 'no-src';
    console.log(`   - صورة ${idx + 1}: ${src.substring(0, 80)}...`);
  });

  // 3. البحث عن قسم "خلاصة وتوصيات"
  console.log('\n3. البحث عن قسم "خلاصة وتوصيات"...');
  const conclusionIndex = content.indexOf('خلاصة وتوصيات');
  if (conclusionIndex === -1) {
    console.log('   - لم يتم العثور على القسم');
    // البحث عن عناوين مشابهة
    const h2Matches = content.match(/<h2[^>]*>([^<]*)<\/h2>/gi) || [];
    console.log('   - العناوين الموجودة:');
    h2Matches.forEach((h2, idx) => {
      console.log(
        `     ${idx + 1}. ${h2.replace(/<[^>]*>/g, '').substring(0, 50)}`
      );
    });
  } else {
    console.log('   - تم العثور على القسم في الموضع:', conclusionIndex);

    // البحث عن الصورة بعد هذا القسم
    const afterConclusion = content.substring(conclusionIndex);
    const nextImageMatch = afterConclusion.match(/<img[^>]*>/i);
    if (nextImageMatch) {
      const imgSrc = nextImageMatch[0].match(/src="([^"]*)"/i);
      console.log(
        '   - الصورة التالية:',
        imgSrc ? imgSrc[1].substring(0, 80) : 'no-src'
      );
    }
  }

  // 4. محاولة حفظ المقال بدون تغيير
  console.log('\n4. محاولة حفظ المقال بدون تغيير...');
  const saveResult = await fetchJson(`${BASE_URL}/api/admin/articles/105`, {
    method: 'PUT',
    body: JSON.stringify({
      title: article.title,
      content: article.content,
      slug: article.slug,
      category_id: article.category_id,
      published: article.published,
    }),
  });

  console.log('   - حالة الاستجابة:', saveResult.status);
  console.log('   - النتيجة:', saveResult.data.success ? 'نجاح' : 'فشل');
  if (!saveResult.data.success) {
    console.log('   - الخطأ:', saveResult.data.error);
    console.log('   - التفاصيل:', saveResult.data.details);
  }

  // 5. محاولة حفظ مع صورة جديدة
  console.log('\n5. محاولة حفظ مع استبدال صورة...');

  // استبدال أول صورة بصورة جديدة
  const newImageUrl =
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
  let modifiedContent = content;

  if (imageMatches.length > 0) {
    // استبدال الصورة الأولى
    const oldImg = imageMatches[0];
    const newImg = oldImg.replace(/src="[^"]*"/, `src="${newImageUrl}"`);
    modifiedContent = content.replace(oldImg, newImg);

    console.log('   - تم استبدال الصورة الأولى');
    console.log('   - طول المحتوى الجديد:', modifiedContent.length);
  }

  const saveModifiedResult = await fetchJson(
    `${BASE_URL}/api/admin/articles/105`,
    {
      method: 'PUT',
      body: JSON.stringify({
        title: article.title,
        content: modifiedContent,
        slug: article.slug,
        category_id: article.category_id,
        published: article.published,
      }),
    }
  );

  console.log('   - حالة الاستجابة:', saveModifiedResult.status);
  console.log(
    '   - النتيجة:',
    saveModifiedResult.data.success ? 'نجاح' : 'فشل'
  );
  if (!saveModifiedResult.data.success) {
    console.log('   - الخطأ:', saveModifiedResult.data.error);
    console.log('   - التفاصيل:', saveModifiedResult.data.details);
  }

  console.log('\n=== انتهى الاختبار ===');
}

testArticle105().catch(console.error);
