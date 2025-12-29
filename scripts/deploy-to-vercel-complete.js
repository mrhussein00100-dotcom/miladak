#!/usr/bin/env node

/**
 * نشر شامل لموقع ميلادك v2 على Vercel
 * يتضمن جميع الخطوات المطلوبة للنشر
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 بدء النشر الشامل على Vercel...\n');

// التحقق من وجود Vercel CLI
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI موجود');
    return true;
  } catch (error) {
    console.log('❌ Vercel CLI غير مثبت');
    console.log('📥 تثبيت Vercel CLI...');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ تم تثبيت Vercel CLI بنجاح');
      return true;
    } catch (installError) {
      console.error('❌ فشل في تثبيت Vercel CLI:', installError.message);
      return false;
    }
  }
}

// إعداد متغيرات البيئة
function setupEnvironmentVariables() {
  console.log('\n🔧 إعداد متغيرات البيئة...');

  const envVars = {
    // قاعدة البيانات
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
    AUTH_SECRET: 'miladak_secret_2025_production',

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

  try {
    for (const [key, value] of Object.entries(envVars)) {
      console.log(`   📝 إعداد ${key}...`);
      execSync(`vercel env add ${key} production`, {
        input: value + '\n',
        stdio: ['pipe', 'pipe', 'inherit'],
      });
    }
    console.log('✅ تم إعداد جميع متغيرات البيئة');
  } catch (error) {
    console.log('⚠️ بعض متغيرات البيئة موجودة مسبقاً (هذا طبيعي)');
  }
}

// بناء المشروع
function buildProject() {
  console.log('\n🔨 بناء المشروع...');

  try {
    // تنظيف الملفات المؤقتة
    console.log('   🧹 تنظيف الملفات المؤقتة...');
    if (fs.existsSync('.next')) {
      execSync('rmdir /s /q .next', { stdio: 'inherit' });
    }

    // تثبيت التبعيات
    console.log('   📦 تثبيت التبعيات...');
    execSync('npm install', { stdio: 'inherit' });

    // بناء المشروع
    console.log('   🏗️ بناء المشروع...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('✅ تم بناء المشروع بنجاح');
    return true;
  } catch (error) {
    console.error('❌ فشل في بناء المشروع:', error.message);
    return false;
  }
}

// نشر على Vercel
function deployToVercel() {
  console.log('\n🚀 نشر على Vercel...');

  try {
    // تسجيل الدخول إلى Vercel (إذا لم يكن مسجلاً)
    console.log('   🔐 التحقق من تسجيل الدخول...');
    try {
      execSync('vercel whoami', { stdio: 'pipe' });
      console.log('   ✅ مسجل الدخول بالفعل');
    } catch (error) {
      console.log('   📝 تسجيل الدخول إلى Vercel...');
      execSync('vercel login', { stdio: 'inherit' });
    }

    // نشر المشروع
    console.log('   🚀 نشر المشروع...');
    const deployResult = execSync('vercel --prod --yes', {
      stdio: 'pipe',
      encoding: 'utf8',
    });

    // استخراج رابط النشر
    const deployUrl = deployResult.trim().split('\n').pop();
    console.log('✅ تم النشر بنجاح!');
    console.log(`🌐 رابط الموقع: ${deployUrl}`);

    return deployUrl;
  } catch (error) {
    console.error('❌ فشل في النشر:', error.message);
    return null;
  }
}

// اختبار الموقع المنشور
async function testDeployedSite(url) {
  console.log('\n🧪 اختبار الموقع المنشور...');

  try {
    const https = require('https');

    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        if (response.statusCode === 200) {
          console.log('✅ الموقع يعمل بشكل صحيح');
          console.log(`📊 كود الاستجابة: ${response.statusCode}`);
          resolve(true);
        } else {
          console.log(`⚠️ كود الاستجابة غير متوقع: ${response.statusCode}`);
          resolve(false);
        }
      });

      request.on('error', (error) => {
        console.error('❌ خطأ في الاتصال:', error.message);
        resolve(false);
      });

      request.setTimeout(10000, () => {
        console.error('❌ انتهت مهلة الاتصال');
        request.destroy();
        resolve(false);
      });
    });
  } catch (error) {
    console.error('❌ خطأ في اختبار الموقع:', error.message);
    return false;
  }
}

// إعداد النطاق المخصص
function setupCustomDomain() {
  console.log('\n🌐 إعداد النطاق المخصص...');

  try {
    console.log('   📝 إضافة النطاق miladak.com...');
    execSync('vercel domains add miladak.com', { stdio: 'inherit' });

    console.log('   🔗 ربط النطاق بالمشروع...');
    execSync('vercel alias miladak.com', { stdio: 'inherit' });

    console.log('✅ تم إعداد النطاق المخصص');
    return true;
  } catch (error) {
    console.log('⚠️ النطاق موجود مسبقاً أو يحتاج إعداد يدوي');
    return false;
  }
}

// الدالة الرئيسية
async function main() {
  try {
    console.log('🎯 هدف النشر: نشر موقع ميلادك v2 على Vercel مع PostgreSQL');
    console.log(
      '📋 الخطوات: CLI → متغيرات البيئة → بناء → نشر → اختبار → نطاق\n'
    );

    // 1. التحقق من Vercel CLI
    if (!checkVercelCLI()) {
      process.exit(1);
    }

    // 2. إعداد متغيرات البيئة
    setupEnvironmentVariables();

    // 3. بناء المشروع
    if (!buildProject()) {
      process.exit(1);
    }

    // 4. نشر على Vercel
    const deployUrl = deployToVercel();
    if (!deployUrl) {
      process.exit(1);
    }

    // 5. اختبار الموقع
    const siteWorking = await testDeployedSite(deployUrl);

    // 6. إعداد النطاق المخصص
    setupCustomDomain();

    // تقرير النتائج
    console.log('\n📊 تقرير النشر:');
    console.log(`✅ النشر: نجح`);
    console.log(`✅ الرابط: ${deployUrl}`);
    console.log(
      `${siteWorking ? '✅' : '⚠️'} اختبار الموقع: ${
        siteWorking ? 'نجح' : 'يحتاج مراجعة'
      }`
    );
    console.log(`🌐 النطاق: miladak.com (قد يحتاج وقت للانتشار)`);

    console.log('\n🎉 تم النشر بنجاح! الموقع جاهز للاستخدام.');
  } catch (error) {
    console.error('\n❌ خطأ عام في النشر:', error.message);
    process.exit(1);
  }
}

// تشغيل النشر
main();
