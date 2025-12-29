#!/usr/bin/env node

/**
 * اختبار الموقع المنشور
 */

const https = require('https');

const urls = [
  'https://miladak.com',
  'https://miladak.com/test-simple',
  'https://miladak.com/api/tools',
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400,
          size: data.length,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        ok: false,
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        ok: false,
        error: 'Timeout',
      });
    });
  });
}

async function main() {
  console.log('🧪 اختبار الموقع المنشور...\n');

  for (const url of urls) {
    const result = await testUrl(url);
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${url}`);
    console.log(`   Status: ${result.status}`);
    if (result.error) console.log(`   Error: ${result.error}`);
    if (result.size) console.log(`   Size: ${result.size} bytes`);
    console.log('');
  }
}

main();
