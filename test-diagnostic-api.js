/**
 * اختبار API التشخيص الجديد
 */

const https = require('https');

const testContent =
  '<h2>Test</h2><img src="https://example.com/image.jpg" alt="test" />';

async function testDiagnosticAPI() {
  console.log('🧪 اختبار API التشخيص الجديد...\n');

  const postData = JSON.stringify({ content: testContent, dryRun: true });

  const options = {
    hostname: 'miladak.com',
    port: 443,
    path: '/api/admin/articles/test-save',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('Status:', res.statusCode);
          console.log('Response:', JSON.stringify(jsonData, null, 2));
          resolve(jsonData);
        } catch (e) {
          console.log('Status:', res.statusCode);
          console.log('Raw Response:', data);
          resolve({ parseError: e.message, raw: data });
        }
      });
    });

    req.on('error', (e) => {
      console.error('Error:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

testDiagnosticAPI()
  .then(() => {
    console.log('\n✅ انتهى اختبار API التشخيص');
  })
  .catch((error) => {
    console.error('❌ خطأ:', error);
  });
