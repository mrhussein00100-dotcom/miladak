/**
 * SONA v6 - Gemini Provider
 * مزود Gemini - الأفضل للعربية ومجاني
 */

import { AIProviderName, AIProviderResponse } from '../types';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';
// قائمة شاملة جداً من نماذج Gemini - ديسمبر 2025
const DEFAULT_MODEL = 'gemini-1.5-flash';
const FALLBACK_MODELS = [
  // نماذج Flash (الأسرع والأكثر استقراراً)
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-8b-001',
  'gemini-1.5-flash-8b-latest',
  // نماذج Pro (أقوى)
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro-002',
  // نماذج 2.0 التجريبية
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-exp-1206',
  'gemini-exp-1121',
  // نماذج 1.0 القديمة (أكثر استقراراً)
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-1.0-pro-001',
  'gemini-1.0-pro-002',
  'gemini-1.0-pro-latest',
  'gemini-1.0-pro-vision-latest',
  // نماذج PaLM القديمة (للتوافق)
  'text-bison-001',
  'text-bison-002',
  'chat-bison-001',
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
