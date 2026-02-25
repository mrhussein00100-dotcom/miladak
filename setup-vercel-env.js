#!/usr/bin/env node

/**
 * إعداد متغيرات البيئة في Vercel
 */

const { execSync } = require('child_process');

const envVars = {
  // قاعدة البيانات - مع مراعاة حساسية الأحرف
  DATABASE_URL:
    'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require',
  POSTGRES_URL:
    'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require',
  PRISMA_DATABASE_URL:
    'prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19kZG4yU3lBYU5Kb3RyclRJTF9qMmgiLCJhcGlfa2V5IjoiMDFLQ05HUjU2NEs3WlZaTkdHSDlSQjRYRkMiLCJ0ZW5hbnRfaWQiOiI2NjEwN2JjNWNjZWRhMzYyMTZhOTY5NTZmNjFlMDY5YTQ3ZTQxNTRlOTM1YjBhNjE2NmUzN2RmMzk0ZDRhYzY0IiwiaW50ZXJuYWxfc2VjcmV0IjoiYmEyMjI4NWQtNTQ0ZS00M2MxLTgxYjEtOTlhNmE4MzY0MDVhIn0.vsUOQlB0KJe_xJrdtk5qAjlF9WFH89DEIZaZQTnVKzw',
  DATABASE_TYPE: 'postgres',

  // مفاتيح API
  GROQ_API_KEY: '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',
  GEMINI_API_KEY: 'AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM',
  PEXELS_API_KEY: 'Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx',
  NEXT_PUBLIC_PEXELS_API_KEY:
    'Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx',

  // إعدادات الأمان
  AUTH_SECRET: 'miladak_production_secret_2025_strong_key_xyz123',

  // AdSense
  NEXT_PUBLIC_ADSENSE_CLIENT: 'ca-pub-5755672349927118',
  ADSENSE_PUBLISHER_ID: 'pub-5755672349927118',

  // إعدادات الموقع
  NEXT_PUBLIC_APP_URL: 'https://miladak.com',
  NEXT_PUBLIC_APP_NAME: 'ميلادك',
  NEXT_PUBLIC_BASE_URL: 'https://miladak.com',
  NEXT_PUBLIC_SITE_URL: 'https://miladak.com',

  // إعدادات البناء
  NEXT_TELEMETRY_DISABLED: '1',
  NODE_OPTIONS: '--max-old-space-size=4096',
};

console.log('🔧 إعداد متغيرات البيئة في Vercel...\n');

let successCount = 0;
let skipCount = 0;

for (const [key, value] of Object.entries(envVars)) {
  try {
    console.log(`📝 إضافة ${key}...`);
    // استخدام echo لتمرير القيمة مع --force لتجاوز القيم الموجودة
    execSync(`echo ${value} | npx vercel env add ${key} production --force`, {
      stdio: 'pipe',
      encoding: 'utf8',
      shell: true,
    });
    console.log(`   ✅ تم إضافة ${key}`);
    successCount++;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`   ⏭️ ${key} موجود مسبقاً`);
      skipCount++;
    } else {
      console.log(`   ⚠️ تحذير: ${error.message.substring(0, 50)}`);
      skipCount++;
    }
  }
}

console.log(
  `\n📊 النتيجة: ${successCount} تمت إضافتها، ${skipCount} تم تخطيها`
);
console.log('\n✅ اكتمل إعداد متغيرات البيئة!');
console.log('\n💡 يمكنك التحقق من المتغيرات في Vercel Dashboard:');
console.log(
  '   https://vercel.com/miladaks-projects/miladak-v2/settings/environment-variables'
);
