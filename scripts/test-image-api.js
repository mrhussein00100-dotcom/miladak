// اختبار API الصور
const fs = require('fs');
const path = require('path');

// قراءة .env.local يدوياً
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const PEXELS_API_KEY = envVars.PEXELS_API_KEY;
const UNSPLASH_ACCESS_KEY = envVars.UNSPLASH_ACCESS_KEY;

console.log('=== اختبار مفاتيح API للصور ===\n');

console.log(
  'PEXELS_API_KEY:',
  PEXELS_API_KEY ? `${PEXELS_API_KEY.substring(0, 10)}...` : '❌ غير موجود'
);
console.log(
  'UNSPLASH_ACCESS_KEY:',
  UNSPLASH_ACCESS_KEY
    ? `${UNSPLASH_ACCESS_KEY.substring(0, 10)}...`
    : '❌ غير موجود'
);

async function testPexels() {
  if (!PEXELS_API_KEY) {
    console.log('\n❌ Pexels: مفتاح API غير موجود');
    return false;
  }

  try {
    console.log('\n🔍 اختبار Pexels API...');
    const response = await fetch(
      'https://api.pexels.com/v1/search?query=birthday&per_page=3',
      {
        headers: { Authorization: PEXELS_API_KEY },
      }
    );

    if (!response.ok) {
      console.log(`❌ Pexels فشل: HTTP ${response.status}`);
      const text = await response.text();
      console.log('الرد:', text.substring(0, 200));
      return false;
    }

    const data = await response.json();
    console.log(`✅ Pexels يعمل! عدد النتائج: ${data.total_results}`);
    if (data.photos && data.photos.length > 0) {
      console.log(`   أول صورة: ${data.photos[0].src.medium}`);
    }
    return true;
  } catch (error) {
    console.log(`❌ Pexels خطأ: ${error.message}`);
    return false;
  }
}

async function testUnsplash() {
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('\n❌ Unsplash: مفتاح API غير موجود');
    return false;
  }

  try {
    console.log('\n🔍 اختبار Unsplash API...');
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=birthday&per_page=3`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      }
    );

    if (!response.ok) {
      console.log(`❌ Unsplash فشل: HTTP ${response.status}`);
      const text = await response.text();
      console.log('الرد:', text.substring(0, 200));
      return false;
    }

    const data = await response.json();
    console.log(`✅ Unsplash يعمل! عدد النتائج: ${data.total}`);
    if (data.results && data.results.length > 0) {
      console.log(`   أول صورة: ${data.results[0].urls.regular}`);
    }
    return true;
  } catch (error) {
    console.log(`❌ Unsplash خطأ: ${error.message}`);
    return false;
  }
}

async function main() {
  const pexelsOk = await testPexels();
  const unsplashOk = await testUnsplash();

  console.log('\n=== النتيجة ===');
  console.log(`Pexels: ${pexelsOk ? '✅ يعمل' : '❌ لا يعمل'}`);
  console.log(`Unsplash: ${unsplashOk ? '✅ يعمل' : '❌ لا يعمل'}`);

  if (!pexelsOk && !unsplashOk) {
    console.log('\n⚠️ كلا المزودين لا يعملان! تحقق من مفاتيح API');
  }
}

main();
