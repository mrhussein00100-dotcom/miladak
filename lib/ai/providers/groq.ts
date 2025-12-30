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

// الحصول على عدد الكلمات المطلوب - قيم كبيرة للمقالات الطويلة
function getWordCount(length: string): {
  min: number;
  max: number;
  target: string;
} {
  const lengthWords: Record<
    string,
    { min: number; max: number; target: string }
  > = {
    short: { min: 800, max: 1200, target: '1000' },
    medium: { min: 1500, max: 2500, target: '2000' },
    long: { min: 3000, max: 4500, target: '4000' },
    comprehensive: { min: 5000, max: 8000, target: '6000' },
  };
  return lengthWords[length] || lengthWords.medium;
}

// الحصول على عدد الأقسام المطلوبة حسب الطول
function getSectionCount(length: string): { min: number; max: number } {
  const sections: Record<string, { min: number; max: number }> = {
    short: { min: 4, max: 6 },
    medium: { min: 6, max: 10 },
    long: { min: 10, max: 15 },
    comprehensive: { min: 15, max: 25 },
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

  // تحديد ما إذا كان المقال طويل جداً ويحتاج لتوليد متعدد
  const isLongArticle =
    request.length === 'comprehensive' || request.length === 'long';

  const prompt = `أنت كاتب محتوى محترف متخصص في كتابة المقالات الطويلة والشاملة باللغة العربية.

📌 المهمة: اكتب مقالاً شاملاً ومفصلاً عن: "${request.topic}"

⚠️ تعليمات الطول (مهمة جداً - يجب الالتزام بها):
- الحد الأدنى المطلوب: ${wordConfig.min} كلمة
- الهدف: ${wordConfig.target} كلمة
- الحد الأقصى: ${wordConfig.max} كلمة
- عدد الأقسام الرئيسية: ${sectionConfig.min}-${sectionConfig.max} قسم

📝 المواصفات:
- الأسلوب: ${styleDesc}
${
  request.includeKeywords?.length
    ? `- الكلمات المفتاحية (يجب تضمينها): ${request.includeKeywords.join(', ')}`
    : ''
}
${request.category ? `- التصنيف: ${request.category}` : ''}

📋 هيكل المقال المطلوب:
1. عنوان جذاب ومميز يحتوي على الكلمة المفتاحية الرئيسية
2. مقدمة شاملة (${isLongArticle ? '5-7' : '3-4'} فقرات، كل فقرة 60-80 كلمة)
3. ${sectionConfig.min}-${
    sectionConfig.max
  } قسم رئيسي بعناوين <h2>، كل قسم يحتوي على:
   - ${isLongArticle ? '5-8' : '3-5'} فقرات تفصيلية (كل فقرة 50-80 كلمة)
   - قوائم <ul> أو <ol> مع ${isLongArticle ? '5-10' : '3-5'} عناصر
   - أمثلة عملية وتفاصيل مفيدة
   - ${isLongArticle ? '2-3' : '1-2'} أقسام فرعية بعناوين <h3>
4. قسم الأسئلة الشائعة (${isLongArticle ? '8-12' : '5-7'} أسئلة مع إجابات مفصلة)
5. خاتمة شاملة (${isLongArticle ? '4-5' : '2-3'} فقرات)

🎨 قواعد التنسيق:
- استخدم HTML فقط: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>
- كل فقرة داخل <p>...</p>
- لا تستخدم \\n - استخدم تاغات HTML مباشرة
- أغلق كل التاغات بشكل صحيح

🚨 تعليمات حاسمة:
- اكتب ${wordConfig.min}+ كلمة على الأقل - هذا إلزامي
- لا تتوقف في المنتصف - أكمل المقال كاملاً حتى الخاتمة
- كل فقرة يجب أن تكون 50-80 كلمة على الأقل
- أضف معلومات مفيدة وأمثلة عملية في كل قسم
- تأكد من تغطية الموضوع من جميع الجوانب

📤 الناتج (JSON فقط - بدون أي نص إضافي):
{
  "title": "العنوان الجذاب",
  "content": "<p>المحتوى الكامل بHTML</p>",
  "excerpt": "ملخص المقال في 30-50 كلمة",
  "metaDescription": "وصف ميتا 150-160 حرف",
  "metaKeywords": "كلمات مفتاحية مفصولة بفاصلة",
  "focusKeyword": "الكلمة المفتاحية الرئيسية"
}`;

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
              content: `أنت كاتب محتوى عربي محترف متخصص في كتابة المقالات الطويلة والشاملة.

قواعدك الأساسية:
1. اكتب مقالات عربية طويلة جداً وكاملة - لا تتوقف أبداً في المنتصف
2. استخدم تنسيق HTML نظيف: <p> للفقرات، <h2> و <h3> للعناوين، <ul>/<ol> للقوائم
3. لا تستخدم \\n أبداً - استخدم تاغات HTML فقط
4. كل فقرة يجب أن تكون 50-80 كلمة على الأقل
5. أكمل المقال حتى الخاتمة دائماً
6. أرجع JSON صحيح ومكتمل فقط
7. الطول المطلوب إلزامي - يجب الوصول إليه`,
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 32000,
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

    // تحذير إذا كان عدد الكلمات أقل من المطلوب
    if (actualWordCount < wordConfig.min) {
      console.warn(
        `⚠️ Groq: عدد الكلمات (${actualWordCount}) أقل من الحد الأدنى المطلوب (${wordConfig.min})`
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
