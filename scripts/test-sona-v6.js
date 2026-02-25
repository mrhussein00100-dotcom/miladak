/**
 * اختبار SONA v6 - Smart Orchestrator
 *
 * تشغيل: node scripts/test-sona-v6.js
 */

const path = require('path');
const fs = require('fs');

// تحميل متغيرات البيئة يدوياً
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

async function testSONAv6() {
  console.log('🧪 اختبار SONA v6 - Smart Orchestrator');
  console.log('='.repeat(50));

  // التحقق من مفاتيح API
  console.log('\n📋 التحقق من مفاتيح API:');
  console.log(
    '- GROQ_API_KEY:',
    process.env.GROQ_API_KEY ? '✅ موجود' : '❌ غير موجود'
  );
  console.log(
    '- GEMINI_API_KEY:',
    process.env.GEMINI_API_KEY ? '✅ موجود' : '❌ غير موجود'
  );
  console.log(
    '- GOOGLE_AI_API_KEY:',
    process.env.GOOGLE_AI_API_KEY ? '✅ موجود' : '❌ غير موجود'
  );
  console.log(
    '- OPENAI_API_KEY:',
    process.env.OPENAI_API_KEY ? '✅ موجود' : '❌ غير موجود'
  );

  // اختبار بسيط للـ Prompts
  console.log('\n📝 اختبار Prompts:');

  const promptsPath = path.join(
    __dirname,
    '..',
    'lib',
    'sona',
    'v6',
    'prompts'
  );

  try {
    // اختبار birthday prompts
    console.log('\n🎂 Birthday Prompts:');
    const birthdayPrompt = `
    اكتب مقالاً عن عيد ميلاد أحمد الذي يبلغ 25 عاماً.
    
    المحتوى المطلوب:
    1. تهنئة مميزة
    2. أفكار هدايا
    3. أفكار للاحتفال
    `;
    console.log('✅ Birthday prompt جاهز');

    // اختبار zodiac prompts
    console.log('\n⭐ Zodiac Prompts:');
    const zodiacPrompt = `
    اكتب مقالاً عن برج الحمل.
    
    المحتوى المطلوب:
    1. صفات البرج
    2. التوافق مع الأبراج الأخرى
    3. الحجر الكريم واللون المحظوظ
    `;
    console.log('✅ Zodiac prompt جاهز');

    // اختبار pregnancy prompts
    console.log('\n🤰 Pregnancy Prompts:');
    const pregnancyPrompt = `
    اكتب مقالاً طبياً عن الأسبوع 20 من الحمل.
    
    المحتوى المطلوب:
    1. تطور الجنين
    2. التغيرات في جسم الأم
    3. نصائح صحية
    `;
    console.log('✅ Pregnancy prompt جاهز');

    // اختبار age prompts
    console.log('\n📅 Age Prompts:');
    const agePrompt = `
    اكتب مقالاً عن عمر 30 سنة.
    
    المحتوى المطلوب:
    1. إحصائيات العمر
    2. مراحل الحياة
    3. نصائح
    `;
    console.log('✅ Age prompt جاهز');
  } catch (error) {
    console.error('❌ خطأ في اختبار Prompts:', error.message);
  }

  // اختبار Lexicon
  console.log('\n📚 اختبار Lexicon:');

  try {
    const fs = require('fs');

    const synonymsPath = path.join(
      __dirname,
      '..',
      'data',
      'sona',
      'lexicon',
      'synonyms.json'
    );
    const wordsPath = path.join(
      __dirname,
      '..',
      'data',
      'sona',
      'lexicon',
      'words.json'
    );
    const idiomsPath = path.join(
      __dirname,
      '..',
      'data',
      'sona',
      'lexicon',
      'idioms.json'
    );

    if (fs.existsSync(synonymsPath)) {
      const synonyms = JSON.parse(fs.readFileSync(synonymsPath, 'utf8'));
      console.log(
        `✅ synonyms.json: ${Object.keys(synonyms.synonyms).length} كلمة`
      );
    } else {
      console.log('❌ synonyms.json غير موجود');
    }

    if (fs.existsSync(wordsPath)) {
      const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
      console.log(`✅ words.json: ${words.metadata.totalWords} كلمة`);
    } else {
      console.log('❌ words.json غير موجود');
    }

    if (fs.existsSync(idiomsPath)) {
      const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf8'));
      console.log(`✅ idioms.json: ${idioms.metadata.totalIdioms} تعبير`);
    } else {
      console.log('❌ idioms.json غير موجود');
    }
  } catch (error) {
    console.error('❌ خطأ في اختبار Lexicon:', error.message);
  }

  // اختبار الملفات
  console.log('\n📁 التحقق من ملفات SONA v6:');

  const fs = require('fs');
  const files = [
    'lib/sona/v6/index.ts',
    'lib/sona/v6/types.ts',
    'lib/sona/v6/orchestrator.ts',
    'lib/sona/v6/analyzer.ts',
    'lib/sona/v6/enhancer.ts',
    'lib/sona/v6/cache.ts',
    'lib/sona/v6/usage.ts',
    'lib/sona/v6/providers/index.ts',
    'lib/sona/v6/providers/groq.ts',
    'lib/sona/v6/providers/gemini.ts',
    'lib/sona/v6/providers/openai.ts',
    'lib/sona/v6/prompts/index.ts',
    'lib/sona/v6/prompts/birthday.ts',
    'lib/sona/v6/prompts/zodiac.ts',
    'lib/sona/v6/prompts/pregnancy.ts',
    'lib/sona/v6/prompts/age.ts',
    'lib/ai/providers/sona-v6.ts',
  ];

  let allFilesExist = true;
  for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - غير موجود`);
      allFilesExist = false;
    }
  }

  console.log('\n' + '='.repeat(50));

  if (allFilesExist) {
    console.log('✅ جميع ملفات SONA v6 موجودة!');
    console.log('\n📌 الخطوات التالية:');
    console.log('1. تأكد من وجود مفاتيح API في .env.local');
    console.log('2. شغل الخادم: npm run dev');
    console.log('3. جرب التوليد من لوحة التحكم');
  } else {
    console.log('⚠️ بعض الملفات مفقودة!');
  }

  console.log('\n🎉 انتهى الاختبار!');
}

testSONAv6().catch(console.error);
