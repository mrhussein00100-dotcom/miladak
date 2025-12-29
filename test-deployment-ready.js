#!/usr/bin/env node

/**
 * اختبار سريع للتأكد من جاهزية النشر
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 اختبار جاهزية النشر...\n');

let allTestsPassed = true;

// اختبار 1: وجود قاعدة البيانات
console.log('📋 اختبار 1: قاعدة البيانات المحلية');
const dbPath = path.join(__dirname, 'database.sqlite');
if (fs.existsSync(dbPath)) {
  console.log('✅ قاعدة البيانات موجودة');

  // اختبار حجم قاعدة البيانات
  const stats = fs.statSync(dbPath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  console.log(`📊 حجم قاعدة البيانات: ${fileSizeInMB.toFixed(2)} MB`);

  if (fileSizeInMB > 0.1) {
    console.log('✅ قاعدة البيانات تحتوي على بيانات');
  } else {
    console.log('⚠️ قاعدة البيانات صغيرة جداً');
    allTestsPassed = false;
  }
} else {
  console.log('❌ قاعدة البيانات غير موجودة');
  allTestsPassed = false;
}

// اختبار 2: ملفات البيئة
console.log('\n📋 اختبار 2: ملفات البيئة');

const envFiles = ['.env.local', '.env.production'];
envFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} موجود`);

    const content = fs.readFileSync(file, 'utf8');
    const requiredKeys = ['GROQ_API_KEY', 'GEMINI_API_KEY', 'PEXELS_API_KEY'];

    requiredKeys.forEach((key) => {
      if (content.includes(key)) {
        console.log(`  ✅ ${key} موجود`);
      } else {
        console.log(`  ❌ ${key} مفقود`);
        allTestsPassed = false;
      }
    });
  } else {
    console.log(`❌ ${file} غير موجود`);
    if (file === '.env.local') allTestsPassed = false;
  }
});

// اختبار 3: الملفات المهمة
console.log('\n📋 اختبار 3: الملفات المهمة');

const importantFiles = [
  'package.json',
  'next.config.mjs',
  'scripts/migrate-to-postgres-complete.js',
  'scripts/test-postgres-connection.js',
];

importantFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} موجود`);
  } else {
    console.log(`❌ ${file} مفقود`);
    allTestsPassed = false;
  }
});

// اختبار 4: package.json
console.log('\n📋 اختبار 4: تكوين المشروع');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  if (packageJson.name) {
    console.log(`✅ اسم المشروع: ${packageJson.name}`);
  }

  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ سكريبت البناء موجود');
  } else {
    console.log('❌ سكريبت البناء مفقود');
    allTestsPassed = false;
  }

  const requiredDeps = ['next', 'react', 'better-sqlite3', 'pg'];
  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} مثبت`);
    } else {
      console.log(`❌ ${dep} غير مثبت`);
      allTestsPassed = false;
    }
  });
} catch (error) {
  console.log('❌ خطأ في قراءة package.json');
  allTestsPassed = false;
}

// اختبار 5: Git
console.log('\n📋 اختبار 5: Git');

if (fs.existsSync('.git')) {
  console.log('✅ مستودع Git مهيأ');

  if (fs.existsSync('.gitignore')) {
    console.log('✅ ملف .gitignore موجود');

    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (gitignore.includes('node_modules')) {
      console.log('✅ node_modules مستبعد من Git');
    } else {
      console.log('⚠️ node_modules غير مستبعد من Git');
    }

    if (gitignore.includes('.env.local')) {
      console.log('✅ ملفات البيئة مستبعدة من Git');
    } else {
      console.log('⚠️ ملفات البيئة غير مستبعدة من Git');
    }
  } else {
    console.log('⚠️ ملف .gitignore غير موجود');
  }
} else {
  console.log('❌ مستودع Git غير مهيأ');
  allTestsPassed = false;
}

// النتيجة النهائية
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('🎉 جميع الاختبارات نجحت! النظام جاهز للنشر');
  console.log('\n📋 الخطوات التالية:');
  console.log('1. إنشاء قاعدة بيانات PostgreSQL في Vercel');
  console.log('2. إضافة متغيرات البيئة في Vercel');
  console.log('3. تشغيل ترحيل البيانات');
  console.log('4. النشر: git push origin main');
  console.log('\n🚀 الوقت المقدر: 10-15 دقيقة');
} else {
  console.log('❌ بعض الاختبارات فشلت. يرجى إصلاح المشاكل قبل النشر');
  process.exit(1);
}

console.log('='.repeat(50));
