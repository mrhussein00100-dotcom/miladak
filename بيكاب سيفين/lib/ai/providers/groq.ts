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

// الحصول على عدد الكلمات المطلوب (من الموقع القديم)
function getWordCount(length: string): string {
  const lengthWords: Record<string, string> = {
    short: '500',
    medium: '900',
    long: '3500',
    comprehensive: '5000',
  };
  return lengthWords[length] || '900';
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
  const apiKey = process.env.GROQ_API_KEY;

  console.log('🚀 Groq: بدء التوليد...');
  console.log('📝 Groq: الموضوع:', request.topic);
  console.log('📏 Groq: الطول:', request.length);
  console.log(
    '🔑 Groq: API Key:',
    apiKey ? `موجود (${apiKey.substring(0, 10)}...)` : '❌ غير موجود'
  );

  if (!apiKey) {
    console.error('❌ Groq: مفتاح API غير موجود!');
    throw new Error('GROQ_API_KEY غير موجود في متغيرات البيئة');
  }

  const wordCount = getWordCount(request.length);
  const styleDesc = getStyleDescription(request.style || 'formal');

  const prompt = `أنت كاتب محتوى محترف. اكتب مقالاً كاملاً باللغة العربية عن: ${
    request.topic
  }

المواصفات:
- الأسلوب: ${styleDesc}
- الطول المطلوب: ${wordCount} كلمة على الأقل
${
  request.includeKeywords?.length
    ? `- الكلمات المفتاحية: ${request.includeKeywords.join(', ')}`
    : ''
}
${request.category ? `- التصنيف: ${request.category}` : ''}

هيكل المقال:
1. عنوان جذاب
2. مقدمة (3-4 فقرات)
3. 6-8 أقسام بعناوين <h2>، كل قسم به 3-4 فقرات
4. قوائم <ul> أو <ol> حيث مناسب
5. خاتمة (2-3 فقرات)

قواعد التنسيق الصارمة:
- استخدم HTML النظيف فقط: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>
- كل فقرة داخل <p>...</p>
- لا تستخدم \\n أو أي رموز هروب - استخدم تاغات HTML مباشرة
- أغلق كل التاغات بشكل صحيح

مهم جداً:
- أكمل المقال كاملاً (${wordCount}+ كلمة) - لا تتوقف في المنتصف
- أرجع JSON صحيح ومغلق

الناتج (JSON فقط):
{
  "title": "العنوان",
  "content": "<p>المحتوى بHTML نظيف</p>",
  "excerpt": "ملخص 30 كلمة",
  "metaDescription": "وصف 150 حرف",
  "metaKeywords": "كلمات مفصولة بفاصلة",
  "focusKeyword": "الكلمة الرئيسية"
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
              content:
                'أنت كاتب محتوى عربي محترف. اكتب مقالات عربية طويلة وكاملة بتنسيق HTML نظيف. استخدم <p> للفقرات، <h2> للعناوين. لا تستخدم \\n أبداً. أكمل المقال حتى النهاية وأرجع JSON صحيح.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 8000,
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

    // حساب عدد الكلمات من المحتوى
    const actualWordCount = result.content
      ? result.content
          .replace(/<[^>]*>/g, ' ')
          .trim()
          .split(/\s+/)
          .filter(Boolean).length
      : 0;

    console.log('✅ Groq: نجح التوليد!');
    console.log('📊 Groq: عدد الكلمات:', actualWordCount);
    console.log('⏱️ Groq: الوقت المستغرق:', Date.now() - startTime, 'ms');

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
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY غير موجود');
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
