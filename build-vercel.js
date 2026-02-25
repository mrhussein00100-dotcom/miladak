#!/usr/bin/env node

/**
 * سكريبت بناء مخصص لـ Vercel
 * يتعامل مع قاعدة البيانات بشكل صحيح أثناء البناء
 */

const { execSync } = require('child_process');

console.log('🚀 بدء عملية البناء لـ Vercel...');

// تعيين متغيرات البيئة للبناء
process.env.SKIP_DATABASE_INIT = 'true';
process.env.NODE_ENV = 'production';

try {
  console.log('📦 تشغيل Next.js build...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_DATABASE_INIT: 'true',
      NODE_ENV: 'production',
    },
  });

  console.log('✅ تم البناء بنجاح!');
} catch (error) {
  console.error('❌ فشل في البناء:', error.message);
  process.exit(1);
}
