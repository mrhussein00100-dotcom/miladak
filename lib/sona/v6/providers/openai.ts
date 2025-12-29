/**
 * SONA v6 - OpenAI Provider
 * مزود OpenAI - الأكثر موثوقية
 */

import { AIProviderName, AIProviderResponse } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

export interface OpenAIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * توليد محتوى باستخدام OpenAI
 */
export async function generate(
  prompt: string,
  systemPrompt: string,
  options: OpenAIOptions = {}
): Promise<AIProviderResponse> {
  const startTime = Date.now();

  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  const tokens = data.usage?.total_tokens || 0;

  return {
    content,
    provider: 'openai' as AIProviderName,
    tokens,
    cost: calculateCost(tokens, options.model || DEFAULT_MODEL),
    latency: Date.now() - startTime,
  };
}

/**
 * تحسين محتوى باستخدام OpenAI
 */
export async function enhance(
  content: string,
  instructions: string,
  options: OpenAIOptions = {}
): Promise<AIProviderResponse> {
  const systemPrompt = `أنت محرر محتوى عربي محترف. حسّن النص المعطى مع الحفاظ على المعنى.`;

  const prompt = `${instructions}

النص:
${content}

أرجع النص المحسن فقط.`;

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
  const systemPrompt = `أنت محلل جودة محتوى عربي.`;

  const prompt = `قيم جودة هذا النص (0-100):

${content.substring(0, 3000)}

أرجع JSON:
{"score": رقم, "issues": [], "suggestions": []}`;

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
 * التحقق من توفر OpenAI
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
 * حساب التكلفة
 */
function calculateCost(tokens: number, model: string): number {
  // gpt-4o-mini: ~$0.15 per 1M input, $0.60 per 1M output
  // نستخدم متوسط تقريبي
  const costPer1K = model.includes('gpt-4') ? 0.003 : 0.0015;
  return (tokens / 1000) * costPer1K;
}

/**
 * الحصول على مفتاح API
 */
async function getApiKey(): Promise<string> {
  try {
    const { getApiKey } = await import('@/lib/config/api-keys');
    return getApiKey('openai');
  } catch {
    return process.env.OPENAI_API_KEY || '';
  }
}

export default {
  generate,
  enhance,
  evaluateQuality,
  isAvailable,
  name: 'openai' as AIProviderName,
  priority: 3, // أقل أولوية (الأغلى)
  costPerToken: 0.000003,
};
