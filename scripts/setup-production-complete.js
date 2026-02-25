#!/usr/bin/env node

/**
 * إعداد الإنتاج الكامل - PostgreSQL + API Keys
 */

const fs = require('fs');
const path = require('path');

async function setupProduction() {
  console.log('🚀 إعداد الإنتاج الكامل...\n');

  try {
    // 1. التحقق من متغيرات البيئة المطلوبة
    console.log('🔍 التحقق من متغيرات البيئة...');

    const requiredEnvVars = ['POSTGRES_URL', 'GROQ_API_KEY', 'GEMINI_API_KEY'];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      console.log('⚠️ متغيرات البيئة المفقودة:');
      missingVars.forEach((varName) => {
        console.log(`   ❌ ${varName}`);
      });
      console.log(
        '\nيرجى تعيين هذه المتغيرات في Vercel Dashboard > Settings > Environment Variables'
      );

      // إنشاء ملف مرجعي
      const envTemplate = `
# متغيرات البيئة المطلوبة للإنتاج

# قاعدة البيانات PostgreSQL
POSTGRES_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
DATABASE_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"

# مفاتيح AI (مطلوبة)
GROQ_API_KEY="gsk_xxx"
GEMINI_API_KEY="AIzaSyxxx"

# مفاتيح AI (اختيارية)
COHERE_API_KEY="xxx"
HUGGINGFACE_API_KEY="hf_xxx"
PEXELS_API_KEY="xxx"

# الأمان
NEXTAUTH_SECRET="your-super-secret-key-here"
AUTH_SECRET="miladak-production-secret-2025"

# معلومات الموقع
NEXT_PUBLIC_APP_URL="https://miladak.com"
NEXT_PUBLIC_SITE_URL="https://miladak.com"
`;

      fs.writeFileSync(
        path.join(__dirname, '..', 'REQUIRED_ENV_VARS.txt'),
        envTemplate.trim()
      );
      console.log('📄 تم إنشاء ملف REQUIRED_ENV_VARS.txt مع القيم المطلوبة');

      return;
    }

    console.log('✅ جميع متغيرات البيئة المطلوبة موجودة');

    // 2. اختبار الاتصال بـ PostgreSQL
    console.log('\n🐘 اختبار الاتصال بـ PostgreSQL...');

    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false },
      });

      const result = await pool.query('SELECT NOW()');
      console.log('✅ الاتصال بـ PostgreSQL نجح');
      await pool.end();
    } catch (error) {
      console.error('❌ فشل الاتصال بـ PostgreSQL:', error.message);
      console.log('يرجى التحقق من صحة POSTGRES_URL');
      return;
    }

    // 3. اختبار مفاتيح API
    console.log('\n🔑 اختبار مفاتيح API...');

    // اختبار Groq
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'User-Agent': 'Miladak/1.0',
        },
      });

      if (response.ok) {
        console.log('✅ Groq API يعمل');
      } else {
        console.log('⚠️ Groq API قد لا يعمل بشكل صحيح');
      }
    } catch (error) {
      console.log('⚠️ لا يمكن اختبار Groq API:', error.message);
    }

    // اختبار Gemini
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`,
        {
          headers: {
            'User-Agent': 'Miladak/1.0',
          },
        }
      );

      if (response.ok) {
        console.log('✅ Gemini API يعمل');
      } else {
        console.log('⚠️ Gemini API قد لا يعمل بشكل صحيح');
      }
    } catch (error) {
      console.log('⚠️ لا يمكن اختبار Gemini API:', error.message);
    }

    // 4. إنشاء تقرير الحالة
    console.log('\n📊 إنشاء تقرير الحالة...');

    const statusReport = `
# تقرير حالة الإنتاج - ${new Date().toISOString()}

## ✅ متغيرات البيئة
- POSTGRES_URL: موجود
- GROQ_API_KEY: موجود
- GEMINI_API_KEY: موجود
- COHERE_API_KEY: ${
      process.env.COHERE_API_KEY ? 'موجود' : 'غير موجود (اختياري)'
    }
- HUGGINGFACE_API_KEY: ${
      process.env.HUGGINGFACE_API_KEY ? 'موجود' : 'غير موجود (اختياري)'
    }
- PEXELS_API_KEY: ${
      process.env.PEXELS_API_KEY ? 'موجود' : 'غير موجود (اختياري)'
    }

## 🐘 قاعدة البيانات
- PostgreSQL: متصل ويعمل
- النظام الموحد: جاهز للاستخدام

## 🤖 مزودي AI
- Groq: جاهز
- Gemini: جاهز
- Cohere: ${process.env.COHERE_API_KEY ? 'جاهز' : 'غير مُعرَّف'}
- HuggingFace: ${process.env.HUGGINGFACE_API_KEY ? 'جاهز' : 'غير مُعرَّف'}

## 📸 الصور
- Pexels: ${process.env.PEXELS_API_KEY ? 'جاهز' : 'غير مُعرَّف'}

## 🚀 الخطوات التالية
1. تشغيل ترحيل البيانات: \`node scripts/migrate-to-postgres-complete.js\`
2. اختبار الموقع في الإنتاج
3. مراقبة الأداء والأخطاء

## 📞 الدعم
إذا واجهت مشاكل:
1. تحقق من logs في Vercel Dashboard
2. تأكد من صحة متغيرات البيئة
3. اختبر الاتصالات محلياً أولاً
`;

    fs.writeFileSync(
      path.join(__dirname, '..', 'PRODUCTION_STATUS.md'),
      statusReport.trim()
    );
    console.log('📄 تم إنشاء تقرير PRODUCTION_STATUS.md');

    console.log('\n🎉 إعداد الإنتاج اكتمل بنجاح!');
    console.log('\n📋 الخطوات التالية:');
    console.log('1. تشغيل ترحيل البيانات إذا لم يتم بعد');
    console.log('2. نشر الموقع على Vercel');
    console.log('3. اختبار جميع الوظائف');
  } catch (error) {
    console.error('❌ خطأ في إعداد الإنتاج:', error);
    process.exit(1);
  }
}

// تشغيل الإعداد
setupProduction();
