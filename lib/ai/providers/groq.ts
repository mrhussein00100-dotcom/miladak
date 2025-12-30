/**
 * مزود Groq API - سريع جداً ومجاني
 * https://groq.com/
 */

export interface GroqGenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo' | 'academic';
  includeKeywords?: string[];
  category?: string;
}

export interface GroqGenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: 'groq';
  generationTime: number;
}

// الحصول على عدد الكلمات المطلوب - قيم محسّنة لـ Groq
// تم رفع الحدود لضمان محتوى غني وشامل
function getWordCount(length: string): {
  min: number;
  max: number;
  target: string;
  absoluteMin: number;
} {
  const lengthWords: Record<
    string,
    { min: number; max: number; target: string; absoluteMin: number }
  > = {
    short: { min: 800, max: 1200, target: '1000', absoluteMin: 600 },
    medium: { min: 1200, max: 1800, target: '1500', absoluteMin: 900 },
    long: { min: 1800, max: 2500, target: '2200', absoluteMin: 1400 },
    comprehensive: { min: 2500, max: 3500, target: '3000', absoluteMin: 2000 },
  };
  return lengthWords[length] || lengthWords.medium;
}

// الحصول على عدد الأقسام المطلوبة حسب الطول - قيم محسّنة
function getSectionCount(length: string): { min: number; max: number } {
  const sections: Record<string, { min: number; max: number }> = {
    short: { min: 6, max: 8 },
    medium: { min: 8, max: 12 },
    long: { min: 12, max: 18 },
    comprehensive: { min: 18, max: 25 },
  };
  return sections[length] || sections.medium;
}

function getStyleDescription(style: string): string {
  const toneMap: Record<string, string> = {
    professional: 'احترافي ومهني',
    friendly: 'ودود وقريب من القارئ',
    formal: 'رسمي وأكاديمي',
    casual: 'عادي وبسيط',
    seo: 'محسن لمحركات البحث',
    academic: 'أكاديمي وعلمي',
  };
  return toneMap[style] || 'احترافي';
}

// توليد قائمة أقسام مخصصة للموضوع
function generateSectionsList(topic: string, sectionCount: number): string {
  const genericSections = [
    `1. مقدمة شاملة عن ${topic}`,
    `2. ما هو ${topic} وما أهميته`,
    `3. فوائد ومميزات ${topic}`,
    `4. كيفية الاستفادة من ${topic}`,
    `5. أنواع وأقسام ${topic}`,
    `6. نصائح مهمة حول ${topic}`,
    `7. أخطاء شائعة يجب تجنبها`,
    `8. تجارب وأمثلة عملية`,
    `9. مقارنات وتحليلات`,
    `10. المستقبل والتطورات`,
    `11. موارد ومصادر إضافية`,
    `12. خلاصة وتوصيات`,
  ];

  return genericSections
    .slice(0, Math.min(sectionCount, genericSections.length))
    .join('\n');
}

// توليد مقال باستخدام Groq
export async function generateArticle(
  request: GroqGenerationRequest
): Promise<GroqGenerationResponse> {
  const startTime = Date.now();
  let apiKey: string;

  try {
    apiKey = await import('@/lib/config/api-keys').then((module) =>
      module.getApiKey('groq')
    );
  } catch (error: any) {
    console.error('❌ Groq: خطأ في الحصول على مفتاح API:', error.message);
    throw new Error(error.message);
  }

  const wordConfig = getWordCount(request.length);
  const sectionConfig = getSectionCount(request.length);
  const styleDesc = getStyleDescription(request.style || 'formal');

  console.log('🚀 Groq: بدء التوليد...');
  console.log('📝 Groq: الموضوع:', request.topic);
  console.log('📏 Groq: الطول:', request.length);
  console.log(
    '🎯 Groq: الهدف:',
    wordConfig.target,
    'كلمة (الحد الأدنى:',
    wordConfig.min,
    ')'
  );
  console.log(
    '🔑 Groq: API Key:',
    apiKey ? `موجود (${apiKey.substring(0, 10)}...)` : '❌ غير موجود'
  );

  // بناء قائمة الأقسام المطلوبة بشكل صريح
  const sectionsList = generateSectionsList(request.topic, sectionConfig.min);

  const prompt = `اكتب مقالاً عربياً شاملاً عن: "${request.topic}"

الطول المطلوب: ${wordConfig.min} كلمة على الأقل (الهدف: ${
    wordConfig.target
  } كلمة)
الأسلوب: ${styleDesc}
${
  request.includeKeywords?.length
    ? `الكلمات المفتاحية: ${request.includeKeywords.join(', ')}`
    : ''
}

الأقسام المطلوبة (اكتب كل قسم بالتفصيل):
${sectionsList}

قسم الأسئلة الشائعة (8 أسئلة مع إجابات مفصلة)

خاتمة شاملة

التنسيق: HTML فقط (<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>)
كل فقرة: 4-5 جمل على الأقل

أرجع JSON:
{"title":"العنوان","content":"<p>المحتوى...</p>","excerpt":"ملخص","metaDescription":"وصف","metaKeywords":"كلمات","focusKeyword":"كلمة"}`;

  try {
    console.log('📡 Groq: إرسال الطلب إلى API...');

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `أنت كاتب محتوى عربي متخصص. اكتب مقالات طويلة ومفصلة.

قواعد إلزامية:
- الحد الأدنى: ${wordConfig.min} كلمة
- كل قسم: 4-6 فقرات
- كل فقرة: 4-5 جمل
- استخدم HTML: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>
- أرجع JSON صحيح فقط`,
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 16000,
          response_format: { type: 'json_object' },
        }),
      }
    );

    console.log('📥 Groq: استلام الرد - Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq: خطأ في API:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    console.log('📄 Groq: طول الرد:', text?.length || 0, 'حرف');

    if (!text) {
      console.error('❌ Groq: لم يتم الحصول على محتوى في الرد');
      throw new Error('لم يتم الحصول على رد من Groq');
    }

    // تنظيف إضافي قبل إرسال الاستجابة للتحليل
    let aiResponse = text
      .replace(/^```json\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .trim();

    // استخراج JSON من الرد
    console.log('🔍 Groq: استخراج JSON من الرد...');
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(
        '❌ Groq: فشل في استخراج JSON. الرد:',
        aiResponse.substring(0, 200)
      );
      throw new Error('فشل في استخراج JSON من الرد');
    }

    const result = JSON.parse(jsonMatch[0]);

    // حساب عدد الكلمات من المحتوى (حساب دقيق للعربية)
    const actualWordCount = result.content
      ? result.content
          .replace(/<[^>]*>/g, ' ') // إزالة HTML tags
          .replace(/[^\u0600-\u06FF\s]/g, ' ') // الاحتفاظ بالعربية والمسافات فقط
          .trim()
          .split(/\s+/)
          .filter((word: string) => word.length > 0).length
      : 0;

    console.log('✅ Groq: نجح التوليد!');
    console.log('📊 Groq: عدد الكلمات الفعلي:', actualWordCount);
    console.log(
      '🎯 Groq: الهدف كان:',
      wordConfig.target,
      '(الحد الأدنى:',
      wordConfig.min,
      ')'
    );
    console.log('⏱️ Groq: الوقت المستغرق:', Date.now() - startTime, 'ms');

    // تحذير إذا كان عدد الكلمات أقل من الحد الأدنى المطلق
    // إعادة المحاولة إذا كان المحتوى قصيراً جداً
    if (actualWordCount < wordConfig.absoluteMin) {
      console.warn(
        `⚠️ Groq: عدد الكلمات (${actualWordCount}) أقل من الحد الأدنى المطلق (${wordConfig.absoluteMin})`
      );
      console.log('🔄 Groq: إعادة المحاولة للحصول على محتوى أطول...');

      // محاولة ثانية مع prompt مختصر ومباشر
      const retryResult = await retryWithExtendedContent(
        apiKey,
        request.topic,
        result.content || '',
        wordConfig,
        sectionConfig
      );

      if (retryResult && retryResult.wordCount > actualWordCount) {
        console.log('✅ Groq: إعادة المحاولة نجحت - محتوى أطول');
        return {
          ...retryResult,
          generationTime: Date.now() - startTime,
        };
      }

      console.log(
        '⚠️ Groq: إعادة المحاولة لم تحسن النتيجة - استخدام النتيجة الأصلية'
      );
    } else if (actualWordCount < wordConfig.min) {
      console.warn(
        `⚠️ Groq: عدد الكلمات (${actualWordCount}) أقل من الهدف (${wordConfig.min}) لكنه مقبول`
      );
    } else {
      console.log(
        `✅ Groq: عدد الكلمات (${actualWordCount}) ضمن النطاق المطلوب`
      );
    }

    return {
      content: result.content || '',
      title: result.title || request.topic,
      metaTitle: result.metaTitle || result.title || request.topic,
      metaDescription:
        result.metaDescription ||
        result.meta_description ||
        result.excerpt ||
        '',
      keywords:
        result.keywords ||
        result.metaKeywords?.split(',').map((k: string) => k.trim()) ||
        [],
      wordCount: actualWordCount,
      provider: 'groq',
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('❌ Groq: خطأ في التوليد:', error);
    throw error;
  }
}

// إعادة صياغة محتوى
export async function rewriteContent(
  content: string,
  style: string
): Promise<{
  original: string;
  rewritten: string;
  wordCount: number;
  provider: 'groq';
}> {
  let apiKey: string;

  try {
    apiKey = await import('@/lib/config/api-keys').then((module) =>
      module.getApiKey('groq')
    );
  } catch (error: any) {
    console.error('❌ Groq: خطأ في الحصول على مفتاح API:', error.message);
    throw new Error(error.message);
  }

  const styleDesc = getStyleDescription(style);

  const prompt = `أعد صياغة النص التالي باللغة العربية بأسلوب ${styleDesc}.

النص الأصلي:
${content}

المتطلبات:
- حافظ على المعنى الأصلي
- غير التراكيب والجمل
- استخدم مرادفات مختلفة
- حافظ على التنسيق والروابط
- اجعل النص فريداً

أرجع النص المعاد صياغته فقط بدون أي تعليقات.`;

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 4000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const rewritten = data.choices?.[0]?.message?.content;

    if (!rewritten) {
      throw new Error('لم يتم الحصول على رد من Groq');
    }

    return {
      original: content,
      rewritten: rewritten.trim(),
      wordCount: rewritten.split(/\s+/).length,
      provider: 'groq',
    };
  } catch (error) {
    console.error('Groq rewrite error:', error);
    throw error;
  }
}

export default {
  generateArticle,
  rewriteContent,
};

// دالة مساعدة لإعادة المحاولة مع توسيع المحتوى
async function retryWithExtendedContent(
  apiKey: string,
  topic: string,
  existingContent: string,
  wordConfig: { min: number; max: number; target: string; absoluteMin: number },
  sectionConfig: { min: number; max: number }
): Promise<GroqGenerationResponse | null> {
  try {
    // استراتيجية: طلب توسيع المحتوى الموجود
    const extendPrompt = `لديك محتوى قصير عن "${topic}". وسّعه ليصبح ${
      wordConfig.min
    } كلمة على الأقل.

المحتوى الحالي:
${existingContent.substring(0, 2000)}

المطلوب:
1. أضف مقدمة مفصلة (4 فقرات)
2. أضف ${sectionConfig.min} أقسام جديدة مع عناوين <h2>
3. كل قسم: 4-5 فقرات، كل فقرة: 4-5 جمل
4. أضف قسم أسئلة شائعة (8 أسئلة مع إجابات مفصلة)
5. أضف خاتمة شاملة

أرجع JSON:
{"title":"العنوان","content":"<p>المحتوى الموسّع...</p>","excerpt":"ملخص","metaDescription":"وصف","metaKeywords":"كلمات","focusKeyword":"كلمة"}`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `أنت كاتب محتوى عربي. وسّع المحتوى ليصبح ${wordConfig.min} كلمة. أرجع JSON فقط.`,
            },
            { role: 'user', content: extendPrompt },
          ],
          temperature: 0.8,
          max_tokens: 16000,
          response_format: { type: 'json_object' },
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return null;

    const jsonMatch = text
      .replace(/^```json\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]);
    const wordCount = result.content
      ? result.content
          .replace(/<[^>]*>/g, ' ')
          .replace(/[^\u0600-\u06FF\s]/g, ' ')
          .trim()
          .split(/\s+/)
          .filter((word: string) => word.length > 0).length
      : 0;

    console.log('📊 Groq (توسيع): عدد الكلمات:', wordCount);

    return {
      content: result.content || '',
      title: result.title || topic,
      metaTitle: result.metaTitle || result.title || topic,
      metaDescription: result.metaDescription || result.excerpt || '',
      keywords:
        result.keywords ||
        result.metaKeywords?.split(',').map((k: string) => k.trim()) ||
        [],
      wordCount,
      provider: 'groq',
      generationTime: 0,
    };
  } catch (error) {
    console.error('❌ Groq: خطأ في توسيع المحتوى:', error);
    return null;
  }
}
