#!/usr/bin/env node

/**
 * سكريبت النشر عبر GitHub + Vercel
 * يحل مشاكل قاعدة البيانات والبناء
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 بدء النشر عبر GitHub...');

// 1. إنشاء ملف .env.production محسن
const productionEnv = `
# إعدادات الإنتاج
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# قاعدة البيانات
DATABASE_TYPE=postgres

# إعدادات الموقع
NEXT_PUBLIC_APP_NAME=ميلادك
NEXT_PUBLIC_SITE_URL=https://miladak-v2.vercel.app
NEXT_PUBLIC_BASE_URL=https://miladak-v2.vercel.app
`.trim();

fs.writeFileSync('.env.production', productionEnv);
console.log('✅ تم إنشاء .env.production');

// 2. تحديث vercel.json
const vercelConfig = {
  version: 2,
  env: {
    DATABASE_TYPE: 'postgres',
    NODE_ENV: 'production',
  },
  build: {
    env: {
      SKIP_DATABASE_INIT: 'true',
    },
  },
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('✅ تم تحديث vercel.json');

// 3. إنشاء GitHub repository إذا لم يكن موجود
try {
  execSync('git remote -v', { stdio: 'pipe' });
  console.log('✅ Git repository موجود');
} catch {
  console.log('📝 إنشاء Git repository...');
  execSync('git init');
  execSync('git add .');
  execSync('git commit -m "Initial commit"');
  console.log('⚠️  يجب إنشاء repository على GitHub وربطه:');
  console.log(
    '   git remote add origin https://github.com/username/miladak-v2.git'
  );
  console.log('   git push -u origin main');
  return;
}

// 4. رفع التغييرات لـ GitHub
try {
  execSync('git add .');
  execSync('git commit -m "Fix deployment issues and PostgreSQL connection"');
  execSync('git push');
  console.log('✅ تم رفع التغييرات لـ GitHub');
} catch (error) {
  console.log('⚠️  خطأ في رفع التغييرات:', error.message);
}

console.log('\n🎯 الخطوات التالية:');
console.log('1. اذهب إلى https://vercel.com');
console.log('2. اربط GitHub repository');
console.log('3. أضف متغيرات البيئة في Vercel Dashboard');
console.log('4. انشر المشروع');
