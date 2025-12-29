/**
 * SONA v6 - Gemini Provider
 * مزود Gemini - الأفضل للعربية ومجاني
 */

import { AIProviderName, AIProviderResponse } from '../types';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';
// قائمة محدثة من نماذج Gemini - ديسمبر 2025
// النماذج مرتبة حسب الأولوية: الأحدث والأكثر استقراراً أولاً
const DEFAULT_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODELS = [
  // نماذج 2.5 الجديدة (الأحدث والأكثر استقراراً)
  'gemini-2.5-pro',
  'gemini-2.5-flash-8b',
  // نماذج 2.0
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-exp',
  // نماذج 1.5 (للتوافق)
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
];

export interface GeminiOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * توليد محتوى باستخدام Gemini
 */
export async function generate(
  prompt: string,
  systemPrompt: string,
  options: GeminiOptions = {}
): Promise<AIProviderResponse> {
  const startTime = Date.now();

  const apiKey = await getApiKey();
  console.log(
    `🔑 SONA Gemini: API Key loaded: ${
      apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO'
    }`
  );

  if (!apiKey) {
    console.error('❌ SONA Gemini: مفتاح API فارغ!');
    throw new Error('Gemini API key not configured');
  }

  const fullPrompt = `${systemPrompt}\n\n${prompt}`;
  const models = [options.model || DEFAULT_MODEL, ...FALLBACK_MODELS];

  let lastError = '';

  for (const model of models) {
    try {
      console.log(`🔄 SONA Gemini: محاولة النموذج ${model}...`);
      const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: options.temperature ?? 0.7,
            maxOutputTokens: options.maxTokens ?? 8192,
          },
        }),
      });

      console.log(
        `📊 SONA Gemini ${model} Response Status: ${response.status}`
      );

      if (!response.ok) {
        let errText = `HTTP ${response.status}`;
        try {
          const asJson = await response.json();
          errText = JSON.stringify(asJson);
          console.error(`❌ SONA Gemini ${model} Error Response:`, errText);
        } catch {}
        lastError = `${model}: ${errText}`;
        continue;
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];
      const content = candidate?.content?.parts?.[0]?.text || '';
      const finishReason = candidate?.finishReason;

      if (
        content &&
        finishReason !== 'SAFETY' &&
        finishReason !== 'RECITATION'
      ) {
        console.log(`✅ SONA Gemini ${model} نجح!`);
        // تقدير عدد التوكنز (Gemini لا يرجعها مباشرة)
        const tokens = Math.ceil(content.length / 4);

        return {
          content,
          provider: 'gemini' as AIProviderName,
          tokens,
          cost: 0, // مجاني
          latency: Date.now() - startTime,
        };
      }

      lastError = `${model}: blocked or empty (finishReason: ${finishReason})`;
      console.warn(`⚠️ SONA Gemini ${model}: ${lastError}`);
    } catch (error: any) {
      lastError = `${model}: ${error.message}`;
      console.error(`❌ SONA Gemini ${model} خطأ:`, error.message);
    }
  }

  throw new Error(`Gemini failed: ${lastError}`);
}

/**
 * تحسين محتوى باستخدام Gemini
 */
export async function enhance(
  content: string,
  instructions: string,
  options: GeminiOptions = {}
): Promise<AIProviderResponse> {
  const systemPrompt = `أنت محرر محتوى عربي محترف متخصص في تحسين النصوص.
مهمتك تحسين النص مع الحفاظ على المعنى الأصلي.`;

  const prompt = `${instructions}

النص:
${content}

أرجع النص المحسن فقط بدون أي تعليقات.`;

  return generate(prompt, systemPrompt, {
    ...options,
    temperature: 0.6,
  });
}

/**
 * تقييم جودة المحتوى
 */
export async function evaluateQuality(content: string): Promise<{
  score: number;
  issues: string[];
  suggestions: string[];
}> {
  const systemPrompt = `أنت محلل جودة محتوى عربي خبير.`;

  const prompt = `قيم جودة هذا النص العربي من 0-100:

${content.substring(0, 3000)}

أرجع JSON فقط:
{
  "score": رقم,
  "issues": ["مشكلة"],
  "suggestions": ["اقتراح"]
}`;

  const response = await generate(prompt, systemPrompt, {
    temperature: 0.3,
    maxTokens: 1000,
  });

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return { score: 70, issues: [], suggestions: [] };
}

/**
 * التحقق من توفر Gemini
 */
export async function isAvailable(): Promise<boolean> {
  try {
    const apiKey = await getApiKey();
    return !!apiKey;
  } catch {
    return false;
  }
}

/**
 * الحصول على مفتاح API
 */
async function getApiKey(): Promise<string> {
  try {
    const { getApiKey } = await import('@/lib/config/api-keys');
    return getApiKey('gemini');
  } catch {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
  }
}

export default {
  generate,
  enhance,
  evaluateQuality,
  isAvailable,
  name: 'gemini' as AIProviderName,
  priority: 1, // الأولوية الأعلى (مجاني)
  costPerToken: 0,
};
