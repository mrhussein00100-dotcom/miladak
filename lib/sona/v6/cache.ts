/**
 * SONA v6 - Cache System
 * نظام التخزين المؤقت لتقليل التكلفة
 */

import {
  CacheEntry,
  CacheMetadata,
  TopicCategory,
  AIProviderName,
} from './types';

// Cache في الذاكرة (يمكن استبداله بـ Redis لاحقاً)
const memoryCache = new Map<string, CacheEntry>();

// إعدادات Cache
const CACHE_CONFIG = {
  ttlHours: 24,
  maxSize: 1000,
  cleanupInterval: 60 * 60 * 1000, // ساعة
};

/**
 * توليد مفتاح Cache
 */
export function generateCacheKey(
  topic: string,
  category: TopicCategory,
  length?: string
): string {
  const normalized = topic.toLowerCase().trim().replace(/\s+/g, '_');
  return `sona_v6_${category}_${length || 'medium'}_${hashString(normalized)}`;
}

/**
 * الحصول من Cache
 */
export function get(key: string): CacheEntry | null {
  const entry = memoryCache.get(key);

  if (!entry) return null;

  // التحقق من انتهاء الصلاحية
  if (new Date() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return entry;
}

/**
 * الحفظ في Cache
 */
export function set(
  key: string,
  content: string,
  metadata: CacheMetadata
): void {
  // تنظيف إذا وصلنا للحد الأقصى
  if (memoryCache.size >= CACHE_CONFIG.maxSize) {
    cleanup();
  }

  const now = new Date();
  const entry: CacheEntry = {
    key,
    content,
    metadata,
    createdAt: now,
    expiresAt: new Date(now.getTime() + CACHE_CONFIG.ttlHours * 60 * 60 * 1000),
  };

  memoryCache.set(key, entry);
}

/**
 * حذف من Cache
 */
export function remove(key: string): boolean {
  return memoryCache.delete(key);
}

/**
 * مسح كل Cache
 */
export function clear(): void {
  memoryCache.clear();
}

/**
 * تنظيف المنتهية الصلاحية
 */
export function cleanup(): number {
  const now = new Date();
  let removed = 0;

  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.expiresAt) {
      memoryCache.delete(key);
      removed++;
    }
  }

  // إذا لا زال ممتلئ، احذف الأقدم
  if (memoryCache.size >= CACHE_CONFIG.maxSize) {
    const entries = Array.from(memoryCache.entries()).sort(
      (a, b) => a[1].createdAt.getTime() - b[1].createdAt.getTime()
    );

    const toRemove = Math.floor(CACHE_CONFIG.maxSize * 0.2); // احذف 20%
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      memoryCache.delete(entries[i][0]);
      removed++;
    }
  }

  return removed;
}

/**
 * إحصائيات Cache
 */
export function getStats(): {
  size: number;
  maxSize: number;
  hitRate: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
} {
  let oldest: Date | null = null;
  let newest: Date | null = null;

  for (const entry of memoryCache.values()) {
    if (!oldest || entry.createdAt < oldest) oldest = entry.createdAt;
    if (!newest || entry.createdAt > newest) newest = entry.createdAt;
  }

  return {
    size: memoryCache.size,
    maxSize: CACHE_CONFIG.maxSize,
    hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0,
    oldestEntry: oldest,
    newestEntry: newest,
  };
}

// إحصائيات الاستخدام
const cacheStats = {
  hits: 0,
  misses: 0,
};

/**
 * تسجيل hit
 */
export function recordHit(): void {
  cacheStats.hits++;
}

/**
 * تسجيل miss
 */
export function recordMiss(): void {
  cacheStats.misses++;
}

/**
 * البحث في Cache بالفئة
 */
export function findByCategory(category: TopicCategory): CacheEntry[] {
  const results: CacheEntry[] = [];

  for (const entry of memoryCache.values()) {
    if (entry.metadata.category === category) {
      results.push(entry);
    }
  }

  return results;
}

/**
 * البحث في Cache بالمزود
 */
export function findByProvider(provider: AIProviderName): CacheEntry[] {
  const results: CacheEntry[] = [];

  for (const entry of memoryCache.values()) {
    if (entry.metadata.provider === provider) {
      results.push(entry);
    }
  }

  return results;
}

/**
 * Hash بسيط للنصوص
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// تنظيف دوري
if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, CACHE_CONFIG.cleanupInterval);
}

export default {
  generateCacheKey,
  get,
  set,
  remove,
  clear,
  cleanup,
  getStats,
  recordHit,
  recordMiss,
  findByCategory,
  findByProvider,
};
