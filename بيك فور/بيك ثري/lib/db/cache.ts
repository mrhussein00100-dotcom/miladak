// نظام Cache بسيط للبيانات المستخدمة بكثرة
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number = 100; // Maximum number of entries

  set<T>(key: string, data: T, ttl: number = 300000): void {
    // Default 5 minutes
    // إذا وصل الحجم للحد الأقصى، احذف أقدم عنصر
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // تحقق من انتهاء الصلاحية
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // تحقق من انتهاء الصلاحية
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // حذف العناصر المنتهية الصلاحية
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// إنشاء instance واحد
export const dbCache = new SimpleCache();

// تنظيف الـ cache كل 10 دقائق
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    dbCache.cleanup();
  }, 600000); // 10 minutes
}

// دالة مساعدة للحصول على البيانات مع Cache
export async function getCached<T>(
  key: string,
  fetcher: () => T | Promise<T>,
  ttl: number = 300000
): Promise<T> {
  // تحقق من الـ cache أولاً
  const cached = dbCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // إذا لم يكن موجود، احصل على البيانات
  const data = await fetcher();

  // احفظ في الـ cache
  dbCache.set(key, data, ttl);

  return data;
}

export default dbCache;
