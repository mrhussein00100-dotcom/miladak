/**
 * SONA v6 - Usage Tracking
 * تتبع الاستخدام والتكلفة
 */

import {
  AIProviderName,
  UsageStats,
  UsageLog,
  ProviderUsage,
  TopicCategory,
} from './types';

// حدود الاستخدام اليومية
const DAILY_LIMITS = {
  groq: { tokens: 100000, cost: 1.0 }, // $1/day
  gemini: { tokens: 1000000, cost: 0 }, // مجاني
  openai: { tokens: 50000, cost: 0.5 }, // $0.50/day
};

// سجل الاستخدام
const usageLogs: UsageLog[] = [];
const providerUsage: Record<AIProviderName, ProviderUsage> = {
  groq: {
    provider: 'groq',
    tokensUsed: 0,
    costToday: 0,
    requestsToday: 0,
    lastRequest: new Date(),
  },
  gemini: {
    provider: 'gemini',
    tokensUsed: 0,
    costToday: 0,
    requestsToday: 0,
    lastRequest: new Date(),
  },
  openai: {
    provider: 'openai',
    tokensUsed: 0,
    costToday: 0,
    requestsToday: 0,
    lastRequest: new Date(),
  },
};

// إحصائيات عامة
let totalRequests = 0;
let totalTokens = 0;
let totalCost = 0;
let cacheHits = 0;
let cacheMisses = 0;

/**
 * تسجيل استخدام
 */
export function trackUsage(
  provider: AIProviderName,
  tokens: number,
  cost: number,
  topic: string,
  category: TopicCategory,
  cached: boolean = false
): void {
  const now = new Date();

  // تحديث إحصائيات المزود
  const usage = providerUsage[provider];

  // إعادة تعيين إذا يوم جديد
  if (isNewDay(usage.lastRequest)) {
    usage.tokensUsed = 0;
    usage.costToday = 0;
    usage.requestsToday = 0;
  }

  usage.tokensUsed += tokens;
  usage.costToday += cost;
  usage.requestsToday++;
  usage.lastRequest = now;

  // تحديث الإحصائيات العامة
  totalRequests++;
  totalTokens += tokens;
  totalCost += cost;

  if (cached) {
    cacheHits++;
  } else {
    cacheMisses++;
  }

  // إضافة للسجل
  usageLogs.push({
    timestamp: now,
    provider,
    tokens,
    cost,
    cached,
    topic,
    category,
  });

  // الاحتفاظ بآخر 1000 سجل فقط
  if (usageLogs.length > 1000) {
    usageLogs.shift();
  }
}

/**
 * التحقق من توفر المزود (لم يتجاوز الحد)
 */
export function isProviderAvailable(provider: AIProviderName): boolean {
  const usage = providerUsage[provider];
  const limits = DAILY_LIMITS[provider];

  // إعادة تعيين إذا يوم جديد
  if (isNewDay(usage.lastRequest)) {
    return true;
  }

  return usage.tokensUsed < limits.tokens && usage.costToday < limits.cost;
}

/**
 * الحصول على المزود المتاح الأرخص
 */
export function getCheapestAvailableProvider(): AIProviderName | null {
  // الترتيب: gemini (مجاني) -> groq (رخيص) -> openai (غالي)
  const order: AIProviderName[] = ['gemini', 'groq', 'openai'];

  for (const provider of order) {
    if (isProviderAvailable(provider)) {
      return provider;
    }
  }

  return null;
}

/**
 * الحصول على إحصائيات الاستخدام
 */
export function getStats(): UsageStats {
  return {
    totalRequests,
    totalTokens,
    totalCost,
    byProvider: { ...providerUsage },
    cacheHits,
    cacheMisses,
  };
}

/**
 * الحصول على استخدام مزود معين
 */
export function getProviderUsage(provider: AIProviderName): ProviderUsage {
  return { ...providerUsage[provider] };
}

/**
 * الحصول على سجل الاستخدام
 */
export function getLogs(limit: number = 100): UsageLog[] {
  return usageLogs.slice(-limit);
}

/**
 * الحصول على سجل اليوم
 */
export function getTodayLogs(): UsageLog[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return usageLogs.filter((log) => log.timestamp >= today);
}

/**
 * الحصول على تكلفة اليوم
 */
export function getTodayCost(): number {
  return getTodayLogs().reduce((sum, log) => sum + log.cost, 0);
}

/**
 * الحصول على الحد المتبقي لمزود
 */
export function getRemainingLimit(provider: AIProviderName): {
  tokens: number;
  cost: number;
} {
  const usage = providerUsage[provider];
  const limits = DAILY_LIMITS[provider];

  // إعادة تعيين إذا يوم جديد
  if (isNewDay(usage.lastRequest)) {
    return { tokens: limits.tokens, cost: limits.cost };
  }

  return {
    tokens: Math.max(0, limits.tokens - usage.tokensUsed),
    cost: Math.max(0, limits.cost - usage.costToday),
  };
}

/**
 * إعادة تعيين الإحصائيات
 */
export function reset(): void {
  totalRequests = 0;
  totalTokens = 0;
  totalCost = 0;
  cacheHits = 0;
  cacheMisses = 0;
  usageLogs.length = 0;

  for (const provider of Object.keys(providerUsage) as AIProviderName[]) {
    providerUsage[provider] = {
      provider,
      tokensUsed: 0,
      costToday: 0,
      requestsToday: 0,
      lastRequest: new Date(),
    };
  }
}

/**
 * التحقق من يوم جديد
 */
function isNewDay(lastDate: Date): boolean {
  const now = new Date();
  return (
    now.getDate() !== lastDate.getDate() ||
    now.getMonth() !== lastDate.getMonth() ||
    now.getFullYear() !== lastDate.getFullYear()
  );
}

export default {
  trackUsage,
  isProviderAvailable,
  getCheapestAvailableProvider,
  getStats,
  getProviderUsage,
  getLogs,
  getTodayLogs,
  getTodayCost,
  getRemainingLimit,
  reset,
};
