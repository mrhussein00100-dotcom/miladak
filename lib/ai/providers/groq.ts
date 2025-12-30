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
function getWordCount(length: string): string {
  const lengthWords: Record<string, string> = {
    short: '1500',
    medium: '2500',
    long: '4500',
    comprehensive: '6500',
  };
  return lengthWords[length] || '2500';
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

  console.log('🚀 Groq: بدء التوليد...');
  console.log('📝 Groq: الموضوع:', request.topic);
  console.log('📏 Groq: الطول:', request.length);
  console.log(
    '🔑 Groq: API Key:',
    apiKey ? `موجود (${apiKey.substring(0, 10)}...)` : '❌ غير موجود'
  );

  const wordCount = getWordCount(request.length);
  const styleDesc = getStyleDescription(request.style || 'formal');

  const prompt = `أنت كاتب محتوى محترف متخصص في كتابة المقالات الطويلة والشاملة. اكتب مقالاً كاملاً وطويلاً باللغة العربية عن: ${
    request.topic
  }

المواصفات المهمة جداً:
- الأسلوب: ${styleDesc}
- الطول المطلوب: ${wordCount} كلمة على الأقل (هذا الحد الأدنى - يمكنك كتابة أكثر)
- يجب أن يكون المقال شاملاً ومفصلاً
${
  request.includeKeywords?.length
    ? `- الكلمات المفتاحية: ${request.includeKeywords.join(', ')}`
    : ''
}
${request.category ? `- التصنيف: ${request.category}` : ''}

هيكل المقال المطلوب (اتبعه بدقة):
1. عنوان جذاب ومميز
2. مقدمة شاملة (4-5 فقرات طويلة)
3. 8-12 قسم رئيسي بعناوين <h2>، كل قسم يحتوي على:
   - 4-6 فقرات تفصيلية
   - قوائم <ul> أو <ol> حيث مناسب
   - أمثلة وتفاصيل عملية
4. أقسام فرعية بعناوين <h3> داخل كل قسم رئيسي
5. خاتمة شاملة (3-4 فقرات)

قواعد التنسيق الصارمة:
- استخدم HTML النظيف فقط: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>
- كل فقرة داخل <p>...</p>
- لا تستخدم \\n أو أي رموز هروب - استخدم تاغات HTML مباشرة
- أغلق كل التاغات بشكل صحيح

تعليمات حاسمة:
- اكتب مقالاً طويلاً جداً (${wordCount}+ كلمة) - هذا مهم جداً
- لا تتوقف في المنتصف - أكمل المقال كاملاً
- أضف تفاصيل وأمثلة ومعلومات إضافية
- اجعل كل فقرة طويلة ومفصلة (50-100 كلمة لكل فقرة)
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
                'أنت كاتب محتوى عربي محترف متخصص في كتابة المقالات الطويلة والشاملة. اكتب مقالات عربية طويلة جداً وكاملة بتنسيق HTML نظيف. استخدم <p> للفقرات، <h2> و <h3> للعناوين. لا تستخدم \\n أبداً. أكمل المقال حتى النهاية بكل التفاصيل وأرجع JSON صحيح. المقالات يجب أن تكون شاملة ومفصلة.',
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
