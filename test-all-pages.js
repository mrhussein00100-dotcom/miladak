#!/usr/bin/env node

const https = require('https');

const baseUrl = 'https://miladak-v2.vercel.app';
const pages = [
  '/',
  '/test-simple',
  '/test-db',
  '/tools',
  '/articles',
  '/categories',
  '/cards',
  '/calculate-birthday',
  '/api/tools',
  '/api/articles',
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 15000 }, (res) => {
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
      resolve({ url, status: 0, ok: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 0, ok: false, error: 'Timeout' });
    });
  });
}

async function main() {
  console.log('🧪 اختبار جميع صفحات الموقع...\n');
  console.log(`Base URL: ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;

  for (const page of pages) {
    const result = await testUrl(baseUrl + page);
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${page} - Status: ${result.status}`);
    if (result.ok) passed++;
    else failed++;
  }

  console.log(`\n📊 النتيجة: ${passed} نجح، ${failed} فشل`);
}

main();
