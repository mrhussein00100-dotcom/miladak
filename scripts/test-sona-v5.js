/**
 * اختبار SONA v5
 * يختبر توليد المحتوى بالنظام الجديد
 */

async function testSonaV5() {
  console.log('🧪 اختبار SONA v5...\n');

  try {
    // اختبار 1: توليد مقال عيد ميلاد
    console.log('📝 اختبار 1: توليد مقال عيد ميلاد...');
    const response1 = await fetch(
      'http://localhost:3000/api/admin/ai/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'عيد ميلاد سعيد أحمد 25 سنة',
          length: 'medium',
          provider: 'sona-v5',
          style: 'formal',
        }),
      }
    );

    const data1 = await response1.json();
    if (data1.success) {
      console.log('✅ نجح التوليد!');
      console.log('📊 عدد الكلمات:', data1.data.wordCount);
      console.log('🏷️ العنوان:', data1.data.title);
      console.log('🤖 المزود:', data1.data.provider);
      console.log('⏱️ الوقت:', data1.data.generationTime + 'ms');
      console.log('\n📄 المحتوى (أول 500 حرف):');
      console.log(data1.data.content.substring(0, 500) + '...\n');
    } else {
      console.log('❌ فشل:', data1.error);
    }

    // اختبار 2: توليد مقال أبراج
    console.log('📝 اختبار 2: توليد مقال أبراج...');
    const response2 = await fetch(
      'http://localhost:3000/api/admin/ai/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'برج الأسد صفاته وتوافقه',
          length: 'medium',
          provider: 'sona-v5',
          style: 'formal',
        }),
      }
    );

    const data2 = await response2.json();
    if (data2.success) {
      console.log('✅ نجح التوليد!');
      console.log('📊 عدد الكلمات:', data2.data.wordCount);
      console.log('🏷️ العنوان:', data2.data.title);
      console.log('🤖 المزود:', data2.data.provider);
      console.log('⏱️ الوقت:', data2.data.generationTime + 'ms');
      console.log('\n📄 المحتوى (أول 500 حرف):');
      console.log(data2.data.content.substring(0, 500) + '...\n');
    } else {
      console.log('❌ فشل:', data2.error);
    }

    // اختبار 3: مقارنة التنويع
    console.log('📝 اختبار 3: مقارنة التنويع (توليد نفس الموضوع مرتين)...');

    const response3a = await fetch(
      'http://localhost:3000/api/admin/ai/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'نصائح صحية للحياة اليومية',
          length: 'short',
          provider: 'sona-v5',
        }),
      }
    );

    const response3b = await fetch(
      'http://localhost:3000/api/admin/ai/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'نصائح صحية للحياة اليومية',
          length: 'short',
          provider: 'sona-v5',
        }),
      }
    );

    const data3a = await response3a.json();
    const data3b = await response3b.json();

    if (data3a.success && data3b.success) {
      const content1 = data3a.data.content;
      const content2 = data3b.data.content;

      // حساب نسبة التشابه البسيطة
      const similarity = calculateSimilarity(content1, content2);

      console.log('✅ تم توليد المقالين!');
      console.log('📊 نسبة التشابه:', (similarity * 100).toFixed(1) + '%');

      if (similarity < 0.5) {
        console.log('🎉 ممتاز! التنويع جيد جداً');
      } else if (similarity < 0.7) {
        console.log('👍 جيد! هناك تنويع معقول');
      } else {
        console.log('⚠️ تحذير: التشابه عالي، يحتاج تحسين');
      }
    }

    console.log('\n✅ اكتملت الاختبارات!');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

// دالة حساب التشابه البسيطة
function calculateSimilarity(text1, text2) {
  const words1 = new Set(text1.split(/\s+/));
  const words2 = new Set(text2.split(/\s+/));

  let common = 0;
  for (const word of words1) {
    if (words2.has(word)) common++;
  }

  return common / Math.max(words1.size, words2.size);
}

testSonaV5();
