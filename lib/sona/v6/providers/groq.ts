/**
 * SONA v6 - Groq Provider
 * مزود Groq للتوليد السريع والرخيص
 */

import { AIProviderName, AIProviderResponse, TopicCategory } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

export interface GroqOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * توليد محتوى باستخدام Groq
 */
export async function generate(
  prompt: string,
  systemPrompt: string,
  options: GroqOptions = {}
): Promise<AIProviderResponse> {
  const startTime = Date.now();

  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  const response = await fetch(GROQ_API_URL, {
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
      max_tokens: options.maxTokens ?? 8000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  const tokens = data.usage?.total_tokens || 0;

  return {
    content,
    provider: 'groq' as AIProviderName,
    tokens,
    cost: calculateCost(tokens),
    latency: Date.now() - startTime,
  };
}

/**
 * تحسين محتوى باستخدام Groq
 */
export async function enhance(
  content: string,
  instructions: string,
  options: GroqOptions = {}
): Promise<AIProviderResponse> {
  const systemPrompt = `أنت محرر محتوى عربي محترف. مهمتك تحسين النص المعطى.
حافظ على المعنى الأصلي مع تحسين الجودة والأسلوب.`;

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
  const systemPrompt = `أنت محلل جودة محتوى عربي. قيم النص وأعط درجة من 0-100.`;

  const prompt = `قيم جودة هذا النص العربي:

${content.substring(0, 3000)}

أرجع JSON فقط:
{
  "score": رقم من 0-100,
  "issues": ["مشكلة 1", "مشكلة 2"],
  "suggestions": ["اقتراح 1", "اقتراح 2"]
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
 * التحقق من توفر Groq
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
function calculateCost(tokens: number): number {
  // Groq: ~$0.05 per 1M tokens
  return (tokens / 1000000) * 0.05;
}

/**
 * الحصول على مفتاح API
 */
async function getApiKey(): Promise<string> {
  try {
    const { getApiKey } = await import('@/lib/config/api-keys');
    return getApiKey('groq');
  } catch {
    return process.env.GROQ_API_KEY || '';
  }
}

export default {
  generate,
  enhance,
  evaluateQuality,
  isAvailable,
  name: 'groq' as AIProviderName,
  priority: 2,
  costPerToken: 0.00000005,
};
