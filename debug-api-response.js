/**
 * فحص استجابة API المقالات بالتفصيل
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
          resolve({ status: res.statusCode, data: jsonData, raw: data });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: null,
            raw: data,
            parseError: e.message,
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function debugAPIResponse() {
  console.log('🔍 فحص استجابة API المقالات بالتفصيل...\n');

  try {
    // اختبار API المقالات الإدارية
    console.log('📡 طلب: /api/admin/articles');

    const response = await makeRequest(`${SITE_URL}/api/admin/articles`);

    console.log(`📊 النتائج:`);
    console.log(`   Status Code: ${response.status}`);
    console.log(`   Parse Error: ${response.parseError || 'لا يوجد'}`);
    console.log(
      `   Raw Response Length: ${response.raw ? response.raw.length : 0} bytes`
    );

    if (response.data) {
      console.log(`\n📋 بنية البيانات:`);
      console.log(`   Type: ${typeof response.data}`);
      console.log(`   Keys: ${Object.keys(response.data)}`);

      if (response.data.success !== undefined) {
        console.log(`   Success: ${response.data.success}`);
      }

      if (response.data.data !== undefined) {
        console.log(`   Data Type: ${typeof response.data.data}`);
        console.log(`   Data Value: ${response.data.data}`);

        if (Array.isArray(response.data.data)) {
          console.log(`   Array Length: ${response.data.data.length}`);
          if (response.data.data.length > 0) {
            console.log(
              `   First Item Keys: ${Object.keys(response.data.data[0])}`
            );
          }
        }
      }

      if (response.data.error) {
        console.log(`   Error: ${response.data.error}`);
      }

      console.log(`\n📄 البيانات الكاملة (أول 500 حرف):`);
      console.log(
        JSON.stringify(response.data, null, 2).substring(0, 500) + '...'
      );
    } else {
      console.log(`\n📄 Raw Response (أول 500 حرف):`);
      console.log(response.raw.substring(0, 500) + '...');
    }

    // اختبار API المقالات العامة أيضاً
    console.log('\n\n📡 طلب: /api/articles');

    const publicResponse = await makeRequest(`${SITE_URL}/api/articles`);

    console.log(`📊 النتائج:`);
    console.log(`   Status Code: ${publicResponse.status}`);
    console.log(`   Parse Error: ${publicResponse.parseError || 'لا يوجد'}`);

    if (publicResponse.data) {
      console.log(`\n📋 بنية البيانات:`);
      console.log(`   Type: ${typeof publicResponse.data}`);
      console.log(`   Keys: ${Object.keys(publicResponse.data)}`);

      if (publicResponse.data.success !== undefined) {
        console.log(`   Success: ${publicResponse.data.success}`);
      }

      if (publicResponse.data.data !== undefined) {
        console.log(`   Data Type: ${typeof publicResponse.data.data}`);
        console.log(`   Data Value: ${publicResponse.data.data}`);

        if (Array.isArray(publicResponse.data.data)) {
          console.log(`   Array Length: ${publicResponse.data.data.length}`);
        }
      }

      console.log(`\n📄 البيانات الكاملة (أول 300 حرف):`);
      console.log(
        JSON.stringify(publicResponse.data, null, 2).substring(0, 300) + '...'
      );
    }
  } catch (error) {
    console.error('❌ خطأ في الفحص:', error.message);
  }
}

// تشغيل الفحص
debugAPIResponse()
  .then(() => {
    console.log('\n✅ انتهى الفحص');
  })
  .catch((error) => {
    console.error('❌ خطأ عام:', error);
  });
