/**
 * مزود Gemini API للذكاء الاصطناعي
 * مجاني ويدعم اللغة العربية
 * تم التحديث: ديسمبر 2025
 */

// النموذج الافتراضي - تم التحديث ديسمبر 2025
// استخدام gemini-2.0-flash بدلاً من exp لتجنب Rate Limit
const DEFAULT_MODEL = 'gemini-2.0-flash';
const FALLBACK_MODELS = [
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-latest',
];

export interface GeminiGenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo' | 'academic';
  includeKeywords?: string[];
  category?: string;
}

export interface GeminiGenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: 'gemini';
  generationTime: number;
}

export interface GeminiRewriteRequest {
  content: string;
  style: 'formal' | 'casual' | 'seo' | 'simplified' | 'academic';
}

export interface GeminiRewriteResponse {
  original: string;
  rewritten: string;
  wordCount: number;
  provider: 'gemini';
}

// الحصول على عدد الكلمات المطلوب حسب الطول
function getWordCount(length: string): { min: number; max: number } {
  switch (length) {
    case 'short':
      return { min: 400, max: 600 };
    case 'medium':
      return { min: 1200, max: 1800 };
    case 'long':
      return { min: 2500, max: 3500 };
    case 'comprehensive':
      return { min: 4500, max: 6000 };
    default:
      return { min: 1200, max: 1800 };
  }
}

// الحصول على وصف النمط
function getStyleDescription(style: string): string {
  switch (style) {
    case 'formal':
      return 'رسمي واحترافي';
    case 'casual':
      return 'عامي وودود';
    case 'seo':
      return 'محسن لمحركات البحث مع كلمات مفتاحية';
    case 'academic':
      return 'أكاديمي وعلمي';
    default:
      return 'متوازن';
  }
}

// توليد مقال باستخدام Gemini
export async function generateArticle(
  request: GeminiGenerationRequest
): Promise<GeminiGenerationResponse> {
  const startTime = Date.now();

  let apiKey: string;
  try {
    apiKey = await import('@/lib/config/api-keys').then((module) =>
      module.getApiKey('gemini')
    );
  } catch (error: any) {
    console.error('❌ Gemini: خطأ في الحصول على مفتاح API:', error.message);
    throw new Error(error.message);
  }

  const wordCount = getWordCount(request.length);
  const styleDesc = getStyleDescription(request.style || 'formal');
  const keywordsText = request.includeKeywords?.length
    ? `استخدم الكلمات المفتاحية التالية: ${request.includeKeywords.join(', ')}`
    : '';

  const prompt = `أنت كاتب محتوى محترف. اكتب مقالاً كاملاً باللغة العربية عن: ${
    request.topic
  }

المواصفات:
- الأسلوب: ${styleDesc}
- الطول المطلوب: ${wordCount.min} إلى ${wordCount.max} كلمة
- التصنيف: ${request.category || 'عام'}
${keywordsText}

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
- أكمل المقال كاملاً (${wordCount.min}+ كلمة) - لا تتوقف في المنتصف
- أرجع JSON صحيح ومغلق

الناتج (JSON فقط):
{
  "title": "العنوان",
  "content": "<p>المحتوى بHTML نظيف</p>",
  "metaTitle": "عنوان الميتا (60 حرف كحد أقصى)",
  "metaDescription": "وصف الميتا (160 حرف كحد أقصى)",
  "keywords": ["كلمة1", "كلمة2", "كلمة3"]
}`;

  const models = [DEFAULT_MODEL, ...FALLBACK_MODELS];
  let lastError = '';
  let aiResponse = '';

  for (const model of models) {
    try {
      console.log(`🔄 Gemini: محاولة النموذج ${model}...`);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      });

      if (!response.ok) {
        let errText = `HTTP ${response.status}`;
        try {
          const asJson = await response.json();
          errText = JSON.stringify(asJson);
        } catch {}
        lastError = JSON.stringify({
          provider: 'gemini',
          model,
          http_status: response.status,
          error: errText,
        });
        console.warn(`⚠️ Gemini ${model} فشل:`, response.status);
        continue;
      }

      const data = await response.json();
      const cand = data?.candidates?.[0] || {};
      const parts = cand?.content?.parts || [];
      const text = parts.map((p: any) => p.text || '').join('');
      const finish = cand?.finishReason;
      const feedback = data?.promptFeedback;

      if (text && finish !== 'SAFETY' && finish !== 'RECITATION') {
        aiResponse = text;
        console.log(`✅ Gemini ${model} نجح!`);
        break;
      } else {
        lastError = JSON.stringify({
          provider: 'gemini',
          model,
          reason: 'empty_or_blocked',
          finishReason: finish,
          promptFeedback: feedback,
        });
        console.warn(`⚠️ Gemini ${model} محظور أو فارغ`);
        continue;
      }
    } catch (e: any) {
      lastError = JSON.stringify({
        provider: 'gemini',
        model,
        error: e?.message || String(e),
      });
      console.error(`❌ Gemini ${model} خطأ:`, e?.message);
    }
  }

  if (!aiResponse) {
    const err = lastError || 'unknown';
    throw new Error(`Gemini returned no content: ${err}`);
  }

  try {
    aiResponse = aiResponse
      .replace(/^```json\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .trim();

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('فشل في استخراج JSON من الرد');
    }

    const result = JSON.parse(jsonMatch[0]);
    const actualWordCount = result.content.split(/\s+/).length;

    return {
      content: result.content,
      title: result.title,
      metaTitle: result.metaTitle,
      metaDescription: result.metaDescription,
      keywords: result.keywords || [],
      wordCount: actualWordCount,
      provider: 'gemini',
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
}

// إعادة صياغة محتوى باستخدام Gemini مع آلية fallback
export async function rewriteContent(
  request: GeminiRewriteRequest
): Promise<GeminiRewriteResponse> {
  let apiKey: string;
  try {
    apiKey = await import('@/lib/config/api-keys').then((module) =>
      module.getApiKey('gemini')
    );
  } catch (error: any) {
    console.error('❌ Gemini: خطأ في الحصول على مفتاح API:', error.message);
    throw new Error(error.message);
  }

  const styleDesc = getStyleDescription(request.style);

  const prompt = `أنت كاتب محتوى عربي محترف متخصص في إعادة الصياغة الكاملة.

مهمتك: إعادة كتابة النص التالي بأسلوب ${styleDesc} مع تغيير كامل للتراكيب.

النص الأصلي:
"${request.content}"

تعليمات صارمة:
1. أعد كتابة النص بالكامل - لا تنسخ أي جملة كما هي
2. غير جميع التراكيب والعبارات مع الحفاظ على المعنى
3. استخدم مرادفات ومصطلحات مختلفة تماماً
4. اجعل النص أطول وأكثر تفصيلاً
5. احتفظ بجميع الحقائق والمعلومات المهمة
6. حافظ على التنسيق والروابط إن وجدت

مهم جداً:
- لا تبدأ بعبارات مثل "إعادة صياغة" أو "النص المعاد كتابته"
- ابدأ مباشرة بالمحتوى المُعاد صياغته
- تأكد من أن كل جملة مختلفة عن الأصل
- اجعل النص يتدفق بطريقة طبيعية ومنطقية

ابدأ إعادة الصياغة الآن:`;

  const models = [DEFAULT_MODEL, ...FALLBACK_MODELS];
  let lastError = '';

  for (const model of models) {
    try {
      console.log(`🔄 محاولة إعادة الصياغة باستخدام ${model}...`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        lastError = `${model}: HTTP ${response.status} - ${errorText}`;
        console.warn(`⚠️ ${model} فشل:`, response.status);
        continue;
      }

      const data = await response.json();
      const rewritten = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rewritten) {
        lastError = `${model}: لا يوجد محتوى في الرد`;
        console.warn(`⚠️ ${model} لم يرجع محتوى`);
        continue;
      }

      console.log(`✅ نجحت إعادة الصياغة باستخدام ${model}`);
      return {
        original: request.content,
        rewritten: rewritten.trim(),
        wordCount: rewritten.split(/\s+/).length,
        provider: 'gemini',
      };
    } catch (error: any) {
      lastError = `${model}: ${error.message}`;
      console.error(`❌ خطأ في ${model}:`, error.message);
      continue;
    }
  }

  throw new Error(
    `فشل في إعادة الصياغة باستخدام جميع نماذج Gemini. آخر خطأ: ${lastError}`
  );
}

// توليد عناوين باستخدام Gemini
export async function generateTitles(
  topic: string,
  count: number = 10
): Promise<string[]> {
  let apiKey: string;
  try {
    apiKey = await import('@/lib/config/api-keys').then((module) =>
      module.getApiKey('gemini')
    );
  } catch (error: any) {
    console.error('❌ Gemini: خطأ في الحصول على مفتاح API:', error.message);
    throw new Error(error.message);
  }

  const prompt = `اقترح ${count} عناوين جذابة ومحسنة للسيو باللغة العربية لمقال عن: "${topic}"

المتطلبات:
- عناوين فريدة ومتنوعة
- محسنة لمحركات البحث
- جذابة للقارئ
- بين 40-60 حرف لكل عنوان

أرجع العناوين كقائمة JSON فقط:
["عنوان 1", "عنوان 2", ...]`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('لم يتم الحصول على رد من Gemini');
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('فشل في استخراج العناوين');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini titles error:', error);
    throw error;
  }
}

// توليد ميتا وكلمات مفتاحية
export async function generateMeta(content: string): Promise<{
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}> {
  let apiKey: string;
  try {
    apiKey = await import('@/lib/config/api-keys').then((module) =>
      module.getApiKey('gemini')
    );
  } catch (error: any) {
    console.error('❌ Gemini: خطأ في الحصول على مفتاح API:', error.message);
    throw new Error(error.message);
  }

  const prompt = `حلل المحتوى التالي واستخرج منه:

المحتوى:
${content.substring(0, 2000)}

المطلوب:
1. عنوان ميتا (60 حرف كحد أقصى)
2. وصف ميتا (160 حرف كحد أقصى)
3. 10-15 كلمة مفتاحية

أرجع بصيغة JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": ["...", "..."]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('لم يتم الحصول على رد من Gemini');
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('فشل في استخراج الميتا');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini meta error:', error);
    throw error;
  }
}

// إعادة صياغة عنوان فقط (قصير ومباشر)
export async function rewriteTitle(title: string): Promise<string> {
  let apiKey: string;
  try {
    apiKey = await import('@/lib/config/api-keys').then((module) =>
      module.getApiKey('gemini')
    );
  } catch (error: any) {
    console.error('❌ Gemini: خطأ في الحصول على مفتاح API:', error.message);
    throw new Error(error.message);
  }

  console.log('🔄 محاولة إعادة صياغة العنوان باستخدام Gemini...');

  const prompt = `اكتب عنوان بديل مختلف تماماً لهذا العنوان:
"${title}"

اكتب عنوان جديد فقط (8-12 كلمة) بدون أي شرح:`;

  const models = [DEFAULT_MODEL, ...FALLBACK_MODELS];

  for (const model of models) {
    try {
      console.log(`🔄 محاولة النموذج ${model}...`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 150,
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn(`⚠️ ${model} فشل: HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (result) {
        console.log(`✅ نجح ${model}:`, result.substring(0, 50));
        const cleanedTitle = result
          .replace(/["""*]/g, '')
          .replace(/^(العنوان|عنوان|البديل|الجديد|المقترح)[:\-\s]*/gi, '')
          .split('\n')[0]
          .trim();

        if (cleanedTitle && cleanedTitle !== title) {
          return cleanedTitle;
        }
      }
    } catch (error: any) {
      console.error(`❌ خطأ في ${model}:`, error.message);
      continue;
    }
  }

  console.warn('⚠️ فشلت جميع المحاولات، إرجاع العنوان الأصلي');
  return title;
}

export default {
  generateArticle,
  rewriteContent,
  rewriteTitle,
  generateTitles,
  generateMeta,
};
