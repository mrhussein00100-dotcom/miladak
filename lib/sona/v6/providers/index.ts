/**
 * SONA v6 - AI Providers Manager
 * إدارة مزودي AI مع fallback تلقائي
 */

import { AIProviderName, AIProviderResponse, SONAError } from '../types';
import groqProvider from './groq';
import geminiProvider from './gemini';
import openaiProvider from './openai';

export interface ProviderManager {
  generate: (
    prompt: string,
    systemPrompt: string
  ) => Promise<AIProviderResponse>;
  enhance: (
    content: string,
    instructions: string
  ) => Promise<AIProviderResponse>;
  evaluateQuality: (
    content: string
  ) => Promise<{ score: number; issues: string[]; suggestions: string[] }>;
  getAvailableProviders: () => Promise<AIProviderName[]>;
}

// ترتيب المزودين حسب الأولوية (الأرخص أولاً)
const PROVIDERS = [
  geminiProvider, // مجاني
  groqProvider, // رخيص جداً
  openaiProvider, // الأغلى
];

// إعداد لتعطيل الـ fallback (يمكن تغييره من الخارج)
let enableFallback = false; // تم تعطيل الـ fallback افتراضياً

/**
 * تعيين حالة الـ fallback
 */
export function setFallbackEnabled(enabled: boolean): void {
  enableFallback = enabled;
  console.log(`🔧 SONA v6: Fallback ${enabled ? 'مفعّل' : 'معطّل'}`);
}

/**
 * توليد محتوى مع fallback تلقائي (إذا كان مفعّلاً)
 */
export async function generate(
  prompt: string,
  systemPrompt: string,
  preferredProvider?: AIProviderName
): Promise<AIProviderResponse> {
  const providers = getOrderedProviders(preferredProvider);
  const errors: string[] = [];

  // إذا كان الـ fallback معطّلاً، استخدم المزود الأول فقط
  const providersToTry = enableFallback ? providers : [providers[0]];

  for (const provider of providersToTry) {
    try {
      const isAvailable = await provider.isAvailable();
      if (!isAvailable) {
        errors.push(`${provider.name}: not available`);
        if (!enableFallback) {
          throw new SONAError(
            `${provider.name} غير متاح`,
            'PROVIDER_UNAVAILABLE',
            provider.name,
            false
          );
        }
        continue;
      }

      console.log(`🔄 SONA v6: محاولة ${provider.name}...`);
      const result = await provider.generate(prompt, systemPrompt);
      console.log(`✅ SONA v6: نجح ${provider.name}`);
      return result;
    } catch (error: any) {
      errors.push(`${provider.name}: ${error.message}`);
      console.warn(`⚠️ SONA v6: فشل ${provider.name}:`, error.message);

      // إذا كان الـ fallback معطّلاً، ارمِ الخطأ مباشرة
      if (!enableFallback) {
        throw new SONAError(
          `فشل ${provider.name}: ${error.message}`,
          'ALL_PROVIDERS_FAILED',
          provider.name,
          false
        );
      }
    }
  }

  throw new SONAError(
    `All providers failed: ${errors.join('; ')}`,
    'ALL_PROVIDERS_FAILED',
    undefined,
    false
  );
}

/**
 * تحسين محتوى مع fallback
 */
export async function enhance(
  content: string,
  instructions: string,
  preferredProvider?: AIProviderName
): Promise<AIProviderResponse> {
  const providers = getOrderedProviders(preferredProvider);

  for (const provider of providers) {
    try {
      const isAvailable = await provider.isAvailable();
      if (!isAvailable) continue;

      return await provider.enhance(content, instructions);
    } catch (error: any) {
      console.warn(`⚠️ SONA v6 enhance: فشل ${provider.name}:`, error.message);
    }
  }

  throw new SONAError(
    'All providers failed to enhance content',
    'ALL_PROVIDERS_FAILED'
  );
}

/**
 * تقييم جودة المحتوى
 */
export async function evaluateQuality(
  content: string,
  preferredProvider?: AIProviderName
): Promise<{ score: number; issues: string[]; suggestions: string[] }> {
  const providers = getOrderedProviders(preferredProvider);

  for (const provider of providers) {
    try {
      const isAvailable = await provider.isAvailable();
      if (!isAvailable) continue;

      return await provider.evaluateQuality(content);
    } catch (error: any) {
      console.warn(`⚠️ SONA v6 quality: فشل ${provider.name}:`, error.message);
    }
  }

  // fallback محلي
  return {
    score: 70,
    issues: [],
    suggestions: [],
  };
}

/**
 * الحصول على المزودين المتاحين
 */
export async function getAvailableProviders(): Promise<AIProviderName[]> {
  const available: AIProviderName[] = [];

  for (const provider of PROVIDERS) {
    try {
      if (await provider.isAvailable()) {
        available.push(provider.name);
      }
    } catch {
      // skip
    }
  }

  return available;
}

/**
 * ترتيب المزودين حسب الأولوية
 */
function getOrderedProviders(preferred?: AIProviderName) {
  if (!preferred) return PROVIDERS;

  const preferredProvider = PROVIDERS.find((p) => p.name === preferred);
  if (!preferredProvider) return PROVIDERS;

  return [preferredProvider, ...PROVIDERS.filter((p) => p.name !== preferred)];
}

export { groqProvider, geminiProvider, openaiProvider };

export default {
  generate,
  enhance,
  evaluateQuality,
  getAvailableProviders,
  setFallbackEnabled,
};
