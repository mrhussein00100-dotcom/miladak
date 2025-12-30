/**
 * اختبار مفاتيح API
 */

const fs = require('fs');
const path = require('path');

// قراءة .env.local يدوياً
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

async function testGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  console.log('\n🔵 اختبار Groq...');
  console.log(
    '   المفتاح:',
    apiKey ? `${apiKey.substring(0, 10)}...` : '❌ غير موجود'
  );

  if (!apiKey) return false;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (response.ok) {
      console.log('   ✅ Groq يعمل!');
      return true;
    } else {
      console.log('   ❌ خطأ:', response.status, await response.text());
      return false;
    }
  } catch (error) {
    console.log('   ❌ خطأ:', error.message);
    return false;
  }
}

async function testCohere() {
  const apiKey = process.env.COHERE_API_KEY;
  console.log('\n🟣 اختبار Cohere...');
  console.log(
    '   المفتاح:',
    apiKey ? `${apiKey.substring(0, 10)}...` : '❌ غير موجود'
  );

  if (!apiKey) return false;

  try {
    const response = await fetch('https://api.cohere.ai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (response.ok) {
      console.log('   ✅ Cohere يعمل!');
      return true;
    } else {
      console.log('   ❌ خطأ:', response.status, await response.text());
      return false;
    }
  } catch (error) {
    console.log('   ❌ خطأ:', error.message);
    return false;
  }
}

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('\n🔴 اختبار Gemini...');
  console.log(
    '   المفتاح:',
    apiKey ? `${apiKey.substring(0, 10)}...` : '❌ غير موجود'
  );

  if (!apiKey) return false;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );

    if (response.ok) {
      console.log('   ✅ Gemini يعمل!');
      return true;
    } else {
      console.log('   ❌ خطأ:', response.status, await response.text());
      return false;
    }
  } catch (error) {
    console.log('   ❌ خطأ:', error.message);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('   🔑 اختبار مفاتيح API');
  console.log('═══════════════════════════════════════');

  const results = {
    gemini: await testGemini(),
    groq: await testGroq(),
    cohere: await testCohere(),
  };

  console.log('\n═══════════════════════════════════════');
  console.log('   📊 النتائج النهائية');
  console.log('═══════════════════════════════════════');
  console.log(`   Gemini: ${results.gemini ? '✅' : '❌'}`);
  console.log(`   Groq:   ${results.groq ? '✅' : '❌'}`);
  console.log(`   Cohere: ${results.cohere ? '✅' : '❌'}`);
  console.log('═══════════════════════════════════════\n');
}

main();
