#!/usr/bin/env node

/**
 * اختبار صفحة قاعدة البيانات
 */

const https = require('https');

console.log('🧪 اختبار صفحة قاعدة البيانات...\n');

function testDBPage() {
  return new Promise((resolve, reject) => {
    console.log('🔍 اختبار: https://miladak.com/test-db');

    const request = https.get('https://miladak.com/test-db', (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        console.log(`📊 كود الاستجابة: ${response.statusCode}`);

        if (response.statusCode === 200) {
          console.log('✅ الصفحة تعمل بشكل صحيح');

          // فحص المحتوى
          if (data.includes('الاتصال نجح')) {
            console.log('✅ قاعدة البيانات تعمل');
          } else if (data.includes('خطأ في قاعدة البيانات')) {
            console.log('❌ خطأ في قاعدة البيانات');
            console.log('محتوى الصفحة:', data.substring(0, 500));
          }

          resolve(true);
        } else {
          console.log(`⚠️ كود استجابة غير متوقع: ${response.statusCode}`);
          console.log('محتوى الاستجابة:', data.substring(0, 500));
          resolve(false);
        }
      });
    });

    request.on('error', (error) => {
      console.error('❌ خطأ في الاتصال:', error.message);
      resolve(false);
    });

    request.setTimeout(15000, () => {
      console.error('❌ انتهت مهلة الاتصال');
      request.destroy();
      resolve(false);
    });
  });
}

testDBPage()
  .then((success) => {
    if (success) {
      console.log('\n✅ اختبار الصفحة نجح!');
    } else {
      console.log('\n❌ اختبار الصفحة فشل');
    }
  })
  .catch((error) => {
    console.error('\n❌ خطأ عام:', error.message);
  });
