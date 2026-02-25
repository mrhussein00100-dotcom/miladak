/**
 * سكريبت اختبار المولد الموحد الجديد
 * يختبر توليد المقالات بأطوال مختلفة
 */

const path = require('path');

// تحميل متغيرات البيئة
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function testUnifiedGenerator() {
  console.log('🧪 بدء اختبار المولد الموحد...\n');

  try {
    // استيراد المولد
    const {
      generateArticle,
      generateArticleWithImages,
    } = require('../lib/ai/unified-generator');

    // اختبار 1: مقال قصير عن عيد ميلاد
    console.log('📝 اختبار 1: مقال قصير عن عيد ميلاد');
    console.log('─'.repeat(50));

    const shortArticle = await generateArticle({
      topic: 'عيد ميلاد أحمد 25 سنة',
      length: 'short',
      provider: 'local',
    });

    console.log(`✅ العنوان: ${shortArticle.title}`);
    console.log(`📊 عدد الكلمات: ${shortArticle.wordCount}`);
    console.log(`⭐ درجة الجودة: ${shortArticle.qualityScore}%`);
    console.log(`⏱️ وقت التوليد: ${shortArticle.generationTime}ms`);
    console.log(
      `📋 الحالة: ${shortArticle.qualityReport.passed ? '✅ ناجح' : '❌ فشل'}`
    );
    console.log(
      `💡 اقتراحات: ${
        shortArticle.qualityReport.suggestions.join(', ') || 'لا يوجد'
      }`
    );
    console.log('\n');

    // اختبار 2: مقال متوسط عن برج
    console.log('📝 اختبار 2: مقال متوسط عن برج الأسد');
    console.log('─'.repeat(50));

    const mediumArticle = await generateArticle({
      topic: 'برج الأسد صفاته وتوافقه',
      length: 'medium',
      provider: 'local',
      category: 'zodiac',
    });

    console.log(`✅ العنوان: ${mediumArticle.title}`);
    console.log(`📊 عدد الكلمات: ${mediumArticle.wordCount}`);
    console.log(`⭐ درجة الجودة: ${mediumArticle.qualityScore}%`);
    console.log(`⏱️ وقت التوليد: ${mediumArticle.generationTime}ms`);
    console.log(
      `📋 الحالة: ${mediumArticle.qualityReport.passed ? '✅ ناجح' : '❌ فشل'}`
    );
    console.log('\n');

    // اختبار 3: مقال طويل مع صور
    console.log('📝 اختبار 3: مقال طويل مع صور');
    console.log('─'.repeat(50));

    const longArticle = await generateArticleWithImages({
      topic: 'نصائح صحية للحفاظ على الوزن المثالي',
      length: 'long',
      provider: 'local',
      category: 'health',
      includeImages: true,
      imageCount: 5,
    });

    console.log(`✅ العنوان: ${longArticle.title}`);
    console.log(`📊 عدد الكلمات: ${longArticle.wordCount}`);
    console.log(`⭐ درجة الجودة: ${longArticle.qualityScore}%`);
    console.log(`⏱️ وقت التوليد: ${longArticle.generationTime}ms`);
    console.log(
      `🖼️ الصورة البارزة: ${
        longArticle.featuredImage ? '✅ موجودة' : '❌ غير موجودة'
      }`
    );
    console.log(`🖼️ صور المحتوى: ${longArticle.inlineImages?.length || 0}`);
    console.log('\n');

    // ملخص
    console.log('═'.repeat(50));
    console.log('📊 ملخص الاختبارات:');
    console.log('═'.repeat(50));
    console.log(
      `✅ مقال قصير: ${shortArticle.wordCount} كلمة (المطلوب: 800-1200)`
    );
    console.log(
      `✅ مقال متوسط: ${mediumArticle.wordCount} كلمة (المطلوب: 2000-3000)`
    );
    console.log(
      `✅ مقال طويل: ${longArticle.wordCount} كلمة (المطلوب: 3500-4500)`
    );
    console.log('\n🎉 اكتمل الاختبار بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    process.exit(1);
  }
}

// تشغيل الاختبار
testUnifiedGenerator();
