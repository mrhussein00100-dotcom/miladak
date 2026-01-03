/**
 * مزود Gemini API للذكاء الاصطناعي
 * مجاني ويدعم اللغة العربية
 * تم التحديث: ديسمبر 2025
 * يدعم مفاتيح API متعددة مع التبديل التلقائي عند انتهاء الحصة
 */

// النموذج الافتراضي - تم التحديث يناير 2026
// v6.4: استخدام gemini-2.5-flash كنموذج افتراضي (الأحدث والأسرع)
// ملاحظة: نماذج 1.5 تم إزالتها من Google API
const DEFAULT_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODELS = [
  // نماذج 2.5 - الأحدث والأكثر استقراراً
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  // نماذج 2.0 - احتياطية
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  // نماذج تجريبية
  'gemini-flash-latest',
];

// الحصول على جميع مفاتيح Gemini API المتاحة
// v6.4: تحسين ترتيب المفاتيح - المفاتيح الإضافية أولاً لأن الأساسي غالباً مستنفد
function getAllGeminiApiKeys(): string[] {
  const keys: string[] = [];

  // المفاتيح الإضافية أولاً (GEMINI_API_KEY_2, GEMINI_API_KEY_3, ...)
  // لأن المفتاح الأساسي غالباً ما يكون مستنفداً
  for (let i = 2; i <= 10; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`];
    if (key) keys.push(key);
  }

  // المفتاح الأساسي في النهاية
  const primaryKey =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (primaryKey) keys.push(primaryKey);

  return keys;
}

// تتبع المفاتيح المستنفدة مؤقتاً (في الذاكرة)
const exhaustedKeys: Map<string, number> = new Map();
const EXHAUSTION_TIMEOUT = 60 * 60 * 1000; // ساعة واحدة

// التحقق مما إذا كان المفتاح مستنفداً
function isKeyExhausted(key: string): boolean {
  const exhaustedAt = exhaustedKeys.get(key);
  if (!exhaustedAt) return false;

  // إذا مر أكثر من ساعة، أعد تفعيل المفتاح
  if (Date.now() - exhaustedAt > EXHAUSTION_TIMEOUT) {
    exhaustedKeys.delete(key);
    return false;
  }
  return true;
}

// تحديد المفتاح كمستنفد
function markKeyAsExhausted(key: string): void {
  exhaustedKeys.set(key, Date.now());
  console.log(
    `⚠️ Gemini: تم تحديد المفتاح كمستنفد (${key.substring(0, 8)}...)`
  );
}

// الحصول على المفاتيح المتاحة (غير المستنفدة)
function getAvailableApiKeys(): string[] {
  return getAllGeminiApiKeys().filter((key) => !isKeyExhausted(key));
}

// دالة للتحقق من صحة مفتاح Gemini API
export async function validateGeminiApiKey(
  apiKey: string
): Promise<{ valid: boolean; error?: string; errorCode?: string }> {
  try {
    // جرب استدعاء بسيط للتحقق من المفتاح
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(testUrl, { method: 'GET' });

    if (response.ok) {
      return { valid: true };
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData?.error?.message || `HTTP ${response.status}`;

    if (response.status === 400 && errorMessage.includes('API key not valid')) {
      return {
        valid: false,
        error: 'مفتاح API غير صالح. يرجى التحقق من المفتاح.',
        errorCode: 'INVALID_KEY',
      };
    }

    if (response.status === 403) {
      return {
        valid: false,
        error:
          'Generative Language API غير مفعّل. يرجى تفعيله من: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com أو إنشاء مفتاح جديد من: https://aistudio.google.com/app/apikey',
        errorCode: 'API_NOT_ENABLED',
      };
    }

    if (response.status === 404) {
      return {
        valid: false,
        error:
          'Generative Language API غير مفعّل أو النموذج غير موجود. يرجى إنشاء مفتاح جديد من: https://aistudio.google.com/app/apikey',
        errorCode: 'API_NOT_ENABLED',
      };
    }

    return { valid: false, error: errorMessage, errorCode: 'UNKNOWN' };
  } catch (error: any) {
    return { valid: false, error: error.message, errorCode: 'NETWORK_ERROR' };
  }
}

// تم إزالة الـ cache لأنه كان يسبب مشاكل
// الآن كل طلب يتم التحقق منه مباشرة مثل SONA

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

// توليد مقال باستخدام Gemini مع دعم مفاتيح API متعددة
export async function generateArticle(
  request: GeminiGenerationRequest
): Promise<GeminiGenerationResponse> {
  const startTime = Date.now();

  // الحصول على جميع المفاتيح المتاحة (غير المستنفدة)
  const availableKeys = getAvailableApiKeys();
  const allKeys = getAllGeminiApiKeys();

  console.log(
    `🔑 Gemini: ${allKeys.length} مفتاح متاح، ${availableKeys.length} غير مستنفد`
  );

  if (availableKeys.length === 0) {
    if (allKeys.length === 0) {
      throw new Error(
        'لم يتم تكوين أي مفتاح Gemini API. يرجى إضافة GEMINI_API_KEY في متغيرات البيئة.'
      );
    }
    // إذا كانت جميع المفاتيح مستنفدة، أعد تعيينها وحاول مرة أخرى
    console.warn('⚠️ جميع مفاتيح Gemini مستنفدة، سيتم إعادة المحاولة...');
    exhaustedKeys.clear();
  }

  const keysToTry = availableKeys.length > 0 ? availableKeys : allKeys;

  const wordCount = getWordCount(request.length);
  const styleDesc = getStyleDescription(request.style || 'formal');
  const keywordsText = request.includeKeywords?.length
    ? `استخدم الكلمات المفتاحية التالية: ${request.includeKeywords.join(', ')}`
    : '';

  // v6.1 - تحسين البرومبت لضمان توليد مقالات طويلة
  const prompt = `أنت كاتب محتوى عربي محترف ومتخصص. مهمتك كتابة مقال شامل ومفصل.

الموضوع: ${request.topic}
التصنيف: ${request.category || 'عام'}
الأسلوب: ${styleDesc}
${keywordsText}

⚠️ تعليمات صارمة جداً - يجب الالتزام بها:

1. الطول المطلوب: ${wordCount.min} كلمة على الأقل (هذا إلزامي!)
2. لا تتوقف حتى تكتب ${wordCount.min}+ كلمة

هيكل المقال المطلوب:
- عنوان رئيسي جذاب
- مقدمة شاملة (4-5 فقرات طويلة)
- 8-10 أقسام رئيسية بعناوين <h2>
- كل قسم يحتوي على 4-6 فقرات مفصلة
- قوائم نقطية <ul> أو مرقمة <ol> في كل قسم
- خاتمة شاملة (3-4 فقرات)

قواعد HTML:
- استخدم: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>
- كل فقرة في <p>...</p>
- أغلق كل التاغات

مهم للغاية:
- اكتب محتوى غني ومفصل
- لا تختصر - اشرح كل نقطة بالتفصيل
- أضف أمثلة وتفاصيل في كل قسم
- المقال يجب أن يكون ${wordCount.min}+ كلمة (إلزامي!)

⚠️ تعليمات الإخراج (مهمة جداً):
- أرجع JSON فقط بدون أي نص أو شرح قبله أو بعده
- لا تكتب أي كلمة قبل علامة {
- لا تستخدم علامات الكود \`\`\`
- ابدأ مباشرة بـ { وانتهِ بـ }

الصيغة المطلوبة:
{"title":"العنوان الرئيسي","content":"<p>المحتوى الكامل بHTML</p>","metaTitle":"عنوان الميتا","metaDescription":"وصف الميتا","keywords":["كلمة1","كلمة2","كلمة3"]}`;

  const models = [DEFAULT_MODEL, ...FALLBACK_MODELS];
  let lastError = '';
  let aiResponse = '';
  let attemptedModels: string[] = [];
  let successfulModel = '';
  let successfulKey = '';

  console.log(
    `🔍 Gemini: سيتم تجربة ${keysToTry.length} مفتاح × ${models.length} نموذج...`
  );

  // حلقة على المفاتيح
  keyLoop: for (const apiKey of keysToTry) {
    const keyPrefix = apiKey.substring(0, 8);
    console.log(`\n🔑 تجربة المفتاح: ${keyPrefix}...`);

    // حلقة على النماذج
    for (const model of models) {
      attemptedModels.push(`${keyPrefix}:${model}`);
      // إضافة timeout للطلب (45 ثانية)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      try {
        console.log(`🔄 Gemini: ${keyPrefix}... + ${model}`);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192, // v6.3: تقليل التوكنز لتسريع الاستجابة
              topP: 0.95,
              topK: 40,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log(`📊 Gemini ${model} Response Status: ${response.status}`);

        if (!response.ok) {
          let errText = `HTTP ${response.status}`;
          try {
            const asJson = await response.json();
            errText = JSON.stringify(asJson);

            // التحقق من تجاوز الحصة - انتقل للمفتاح التالي
            if (response.status === 429) {
              const quotaError = asJson?.error?.message || '';
              if (
                quotaError.includes('quota') ||
                quotaError.includes('exceeded') ||
                quotaError.includes('RESOURCE_EXHAUSTED')
              ) {
                console.warn(
                  `⚠️ المفتاح ${keyPrefix}... استنفد الحصة - الانتقال للمفتاح التالي`
                );
                markKeyAsExhausted(apiKey);
                continue keyLoop; // انتقل للمفتاح التالي
              }
            }
          } catch {}
          lastError = JSON.stringify({
            provider: 'gemini',
            model,
            key: keyPrefix,
            http_status: response.status,
            error: errText,
          });
          console.warn(`⚠️ Gemini ${model} فشل: HTTP ${response.status}`);
          continue; // جرب النموذج التالي
        }

        const data = await response.json();
        const cand = data?.candidates?.[0] || {};
        const parts = cand?.content?.parts || [];
        const text = parts.map((p: any) => p.text || '').join('');
        const finish = cand?.finishReason;
        const feedback = data?.promptFeedback;

        if (text && finish !== 'SAFETY' && finish !== 'RECITATION') {
          aiResponse = text;
          successfulModel = model;
          successfulKey = keyPrefix;
          console.log(
            `✅ Gemini نجح! المفتاح: ${keyPrefix}... النموذج: ${model}`
          );
          break keyLoop; // خروج من كلا الحلقتين
        } else {
          lastError = JSON.stringify({
            provider: 'gemini',
            model,
            key: keyPrefix,
            reason: 'empty_or_blocked',
            finishReason: finish,
            promptFeedback: feedback,
          });
          console.warn(
            `⚠️ Gemini ${model} محظور أو فارغ (finishReason: ${finish})`
          );
          continue;
        }
      } catch (e: any) {
        clearTimeout(timeoutId);

        // التحقق من خطأ timeout
        if (e.name === 'AbortError') {
          lastError = JSON.stringify({
            provider: 'gemini',
            model,
            key: keyPrefix,
            error: 'Request timeout after 45 seconds',
          });
          console.warn(`⚠️ Gemini ${model} timeout - جرب النموذج التالي`);
          continue;
        }

        lastError = JSON.stringify({
          provider: 'gemini',
          model,
          key: keyPrefix,
          error: e?.message || String(e),
        });
        console.error(`❌ Gemini ${model} خطأ:`, e?.message);
      }
    }
  }

  if (!aiResponse) {
    const errorSummary = `Gemini فشل مع جميع المفاتيح والنماذج (${attemptedModels.length} محاولة). آخر خطأ: ${lastError}`;
    console.error(`❌ ${errorSummary}`);
    throw new Error(errorSummary);
  }

  console.log(
    `✅ Gemini نجح باستخدام: ${successfulKey}... + ${successfulModel}`
  );

  try {
    // v6.5: تحسين استخراج JSON من الرد
    console.log('📝 Gemini: طول الرد الخام:', aiResponse.length);

    // تنظيف الرد من علامات الكود
    let cleanedResponse = aiResponse
      .replace(/^```json\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    // محاولة 1: البحث عن JSON كامل
    let jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);

    // محاولة 2: إذا لم يُعثر على JSON، جرب تنظيف أكثر
    if (!jsonMatch) {
      // إزالة أي نص قبل أول {
      const firstBrace = cleanedResponse.indexOf('{');
      if (firstBrace !== -1) {
        cleanedResponse = cleanedResponse.substring(firstBrace);
        jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      }
    }

    // محاولة 3: إذا كان الرد يحتوي على JSON متعدد، خذ الأول
    if (!jsonMatch) {
      const jsonObjects = cleanedResponse.match(
        /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g
      );
      if (jsonObjects && jsonObjects.length > 0) {
        // ابحث عن أكبر JSON (الأكثر احتمالاً أن يكون المحتوى)
        jsonMatch = [
          jsonObjects.reduce((a, b) => (a.length > b.length ? a : b)),
        ];
      }
    }

    if (!jsonMatch) {
      console.error('❌ Gemini: فشل في استخراج JSON');
      console.error(
        '📄 الرد المنظف (أول 500 حرف):',
        cleanedResponse.substring(0, 500)
      );
      throw new Error(
        'فشل في استخراج JSON من الرد - الرد لا يحتوي على JSON صالح'
      );
    }

    let jsonString = jsonMatch[0];

    // إصلاح مشاكل JSON الشائعة
    // 1. إزالة الفواصل الزائدة قبل }
    jsonString = jsonString.replace(/,\s*}/g, '}');
    // 2. إزالة الفواصل الزائدة قبل ]
    jsonString = jsonString.replace(/,\s*]/g, ']');
    // 3. إصلاح علامات الاقتباس المزدوجة داخل النص
    // هذا معقد، لذا نتركه للـ JSON.parse

    let result;
    try {
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('❌ Gemini: فشل في تحليل JSON:', parseError);
      console.error(
        '📄 JSON المستخرج (أول 500 حرف):',
        jsonString.substring(0, 500)
      );

      // محاولة إصلاح JSON المكسور
      try {
        // إزالة أي أحرف غير صالحة
        const sanitizedJson = jsonString
          .replace(/[\x00-\x1F\x7F]/g, '') // إزالة أحرف التحكم
          .replace(/\n/g, '\\n') // تحويل الأسطر الجديدة
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        result = JSON.parse(sanitizedJson);
      } catch (secondError) {
        throw new Error(`فشل في تحليل JSON من الرد: ${parseError}`);
      }
    }
    const actualWordCount = result.content.split(/\s+/).length;

    // v6.1: التحقق من طول المحتوى
    const minRequired = wordCount.min * 0.5; // على الأقل 50% من الحد الأدنى
    if (actualWordCount < minRequired) {
      console.warn(
        `⚠️ Gemini: المحتوى قصير جداً (${actualWordCount} كلمة، المطلوب ${wordCount.min}+)`
      );
      console.warn(
        `⚠️ Gemini: قد يكون النموذج ${successfulModel} محدوداً - جرب نموذجاً آخر`
      );
    }

    console.log(
      `📊 Gemini: تم توليد ${actualWordCount} كلمة (المطلوب: ${wordCount.min}-${wordCount.max})`
    );

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

// إعادة صياغة محتوى باستخدام Gemini مع دعم مفاتيح متعددة
export async function rewriteContent(
  request: GeminiRewriteRequest
): Promise<GeminiRewriteResponse> {
  const availableKeys = getAvailableApiKeys();
  const allKeys = getAllGeminiApiKeys();
  const keysToTry = availableKeys.length > 0 ? availableKeys : allKeys;

  if (keysToTry.length === 0) {
    throw new Error('لم يتم تكوين أي مفتاح Gemini API');
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

  keyLoop: for (const apiKey of keysToTry) {
    const keyPrefix = apiKey.substring(0, 8);

    for (const model of models) {
      try {
        console.log(`🔄 إعادة الصياغة: ${keyPrefix}... + ${model}`);

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

          // التحقق من تجاوز الحصة
          if (response.status === 429) {
            console.warn(`⚠️ المفتاح ${keyPrefix}... استنفد الحصة`);
            markKeyAsExhausted(apiKey);
            continue keyLoop;
          }

          lastError = `${keyPrefix}:${model}: HTTP ${response.status}`;
          console.warn(`⚠️ ${model} فشل:`, response.status);
          continue;
        }

        const data = await response.json();
        const rewritten = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rewritten) {
          lastError = `${keyPrefix}:${model}: لا يوجد محتوى في الرد`;
          continue;
        }

        console.log(`✅ نجحت إعادة الصياغة: ${keyPrefix}... + ${model}`);
        return {
          original: request.content,
          rewritten: rewritten.trim(),
          wordCount: rewritten.split(/\s+/).length,
          provider: 'gemini',
        };
      } catch (error: any) {
        lastError = `${keyPrefix}:${model}: ${error.message}`;
        console.error(`❌ خطأ:`, error.message);
        continue;
      }
    }
  }

  throw new Error(
    `فشل في إعادة الصياغة باستخدام جميع مفاتيح ونماذج Gemini. آخر خطأ: ${lastError}`
  );
}

// توليد عناوين باستخدام Gemini مع دعم مفاتيح متعددة
export async function generateTitles(
  topic: string,
  count: number = 10
): Promise<string[]> {
  const availableKeys = getAvailableApiKeys();
  const allKeys = getAllGeminiApiKeys();
  const keysToTry = availableKeys.length > 0 ? availableKeys : allKeys;

  if (keysToTry.length === 0) {
    throw new Error('لم يتم تكوين أي مفتاح Gemini API');
  }

  const prompt = `اقترح ${count} عناوين جذابة ومحسنة للسيو باللغة العربية لمقال عن: "${topic}"

المتطلبات:
- عناوين فريدة ومتنوعة
- محسنة لمحركات البحث
- جذابة للقارئ
- بين 40-60 حرف لكل عنوان

أرجع العناوين كقائمة JSON فقط:
["عنوان 1", "عنوان 2", ...]`;

  const models = [DEFAULT_MODEL, ...FALLBACK_MODELS.slice(0, 2)];
  let lastError = '';

  keyLoop: for (const apiKey of keysToTry) {
    const keyPrefix = apiKey.substring(0, 8);

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
          if (response.status === 429) {
            markKeyAsExhausted(apiKey);
            continue keyLoop;
          }
          lastError = `${keyPrefix}:${model}: HTTP ${response.status}`;
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          lastError = `${keyPrefix}:${model}: لم يتم الحصول على رد`;
          continue;
        }

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          lastError = `${keyPrefix}:${model}: فشل في استخراج العناوين`;
          continue;
        }

        return JSON.parse(jsonMatch[0]);
      } catch (error: any) {
        lastError = `${keyPrefix}:${model}: ${error.message}`;
        continue;
      }
    }
  }

  throw new Error(`فشل توليد العناوين: ${lastError}`);
}

// توليد ميتا وكلمات مفتاحية مع دعم مفاتيح متعددة
export async function generateMeta(content: string): Promise<{
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}> {
  const availableKeys = getAvailableApiKeys();
  const allKeys = getAllGeminiApiKeys();
  const keysToTry = availableKeys.length > 0 ? availableKeys : allKeys;

  if (keysToTry.length === 0) {
    throw new Error('لم يتم تكوين أي مفتاح Gemini API');
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

  const models = [DEFAULT_MODEL, ...FALLBACK_MODELS.slice(0, 2)];
  let lastError = '';

  keyLoop: for (const apiKey of keysToTry) {
    const keyPrefix = apiKey.substring(0, 8);

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
          if (response.status === 429) {
            markKeyAsExhausted(apiKey);
            continue keyLoop;
          }
          lastError = `${keyPrefix}:${model}: HTTP ${response.status}`;
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          lastError = `${keyPrefix}:${model}: لم يتم الحصول على رد`;
          continue;
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          lastError = `${keyPrefix}:${model}: فشل في استخراج الميتا`;
          continue;
        }

        return JSON.parse(jsonMatch[0]);
      } catch (error: any) {
        lastError = `${keyPrefix}:${model}: ${error.message}`;
        continue;
      }
    }
  }

  throw new Error(`فشل توليد الميتا: ${lastError}`);
}

// إعادة صياغة عنوان فقط مع دعم مفاتيح متعددة
export async function rewriteTitle(title: string): Promise<string> {
  const availableKeys = getAvailableApiKeys();
  const allKeys = getAllGeminiApiKeys();
  const keysToTry = availableKeys.length > 0 ? availableKeys : allKeys;

  if (keysToTry.length === 0) {
    console.warn('⚠️ لا توجد مفاتيح Gemini، إرجاع العنوان الأصلي');
    return title;
  }

  console.log('🔄 محاولة إعادة صياغة العنوان باستخدام Gemini...');

  const prompt = `اكتب عنوان بديل مختلف تماماً لهذا العنوان:
"${title}"

اكتب عنوان جديد فقط (8-12 كلمة) بدون أي شرح:`;

  const models = [DEFAULT_MODEL, ...FALLBACK_MODELS.slice(0, 2)];

  keyLoop: for (const apiKey of keysToTry) {
    const keyPrefix = apiKey.substring(0, 8);

    for (const model of models) {
      try {
        console.log(`🔄 ${keyPrefix}... + ${model}`);

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
          if (response.status === 429) {
            markKeyAsExhausted(apiKey);
            continue keyLoop;
          }
          console.warn(`⚠️ ${model} فشل: HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (result) {
          console.log(`✅ نجح ${keyPrefix}... + ${model}`);
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
        console.error(`❌ خطأ:`, error.message);
        continue;
      }
    }
  }

  console.warn('⚠️ فشلت جميع المحاولات، إرجاع العنوان الأصلي');
  return title;
}

// دالة للحصول على حالة المفاتيح (للـ API)
export function getGeminiKeysStatus(): {
  total: number;
  available: number;
  exhausted: number;
  keys: Array<{ prefix: string; exhausted: boolean; exhaustedAt?: number }>;
} {
  const allKeys = getAllGeminiApiKeys();
  const available = getAvailableApiKeys();

  return {
    total: allKeys.length,
    available: available.length,
    exhausted: allKeys.length - available.length,
    keys: allKeys.map((key) => ({
      prefix: key.substring(0, 8) + '...',
      exhausted: isKeyExhausted(key),
      exhaustedAt: exhaustedKeys.get(key),
    })),
  };
}

export default {
  generateArticle,
  rewriteContent,
  rewriteTitle,
  generateTitles,
  generateMeta,
  validateGeminiApiKey,
  getGeminiKeysStatus,
  getAllGeminiApiKeys,
};
