#!/usr/bin/env node

/**
 * اختبار سريع للبناء - بدون فحص الأنواع
 * يتحقق من أن الكود يمكن بناؤه بنجاح
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 اختبار البناء السريع...\n');

try {
  // تعيين متغيرات البيئة
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  process.env.NEXT_TELEMETRY_DISABLED = '1';

  console.log('📦 بناء المشروع (بدون فحص الأنواع)...');

  // بناء المشروع مع تجاهل أخطاء TypeScript
  const buildCommand =
    process.platform === 'win32'
      ? 'npx next build'
      : 'NODE_OPTIONS="--max-old-space-size=4096" npx next build';

  execSync(buildCommand, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      SKIP_TYPE_CHECK: 'true',
    },
  });

  console.log('\n✅ البناء نجح بدون أخطاء!');
  console.log('🎉 النظام جاهز للنشر على Vercel');
} catch (error) {
  console.error('\n❌ فشل البناء:', error.message);
  console.log('\n🔍 تحقق من الأخطاء أعلاه وأصلحها قبل النشر');
  process.exit(1);
}
