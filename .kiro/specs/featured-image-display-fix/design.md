# Design Document - Featured Image Display Fix

## Overview

هذا المستند يحدد التصميم التقني لإصلاح مشكلة عدم ظهور الصور البارزة في صفحات المقالات. المشكلة الحالية هي أن Next.js Image component يتطلب إعدادات خاصة للصور المحلية والخارجية، والكود الحالي لا يتعامل مع جميع الحالات بشكل صحيح.

## Root Cause Analysis

بعد فحص الكود الحالي، تم تحديد الأسباب التالية:

1. **إعدادات Next.js**: الإعدادات الحالية تسمح بجميع النطاقات الخارجية (`hostname: '**'`) لكن هذا قد يسبب مشاكل في بعض الحالات
2. **معالجة المسارات**: الكود الحالي لا يتحقق من نوع المسار (محلي vs خارجي) قبل تمريره إلى Image component
3. **الصور المحلية**: المسارات المحلية مثل `/uploads/file.png` تعمل بشكل صحيح نظرياً، لكن قد تكون هناك مشاكل في التحميل
4. **Error Handling**: لا يوجد معالجة للأخطاء عند فشل تحميل الصورة

## Architecture

### Component Structure

```
ArticlePageClient (Client Component)
├── Featured Image Section
│   ├── Image Component (Next.js)
│   └── Error Boundary / Fallback
├── Article Content
└── Related Articles
    └── Article Cards with Images
```

### Data Flow

```
Database (featured_image field)
    ↓
Server Component (app/articles/[slug]/page.tsx)
    ↓
ArticlePageClient (receives article data)
    ↓
Image Component (renders with proper config)
```

## Components and Interfaces

### 1. Image Utility Helper

سننشئ utility function لمعالجة مسارات الصور:

```typescript
// lib/utils/imageUtils.ts

export interface ImageSource {
  src: string;
  isExternal: boolean;
  isValid: boolean;
}

export function parseImageSource(
  imagePath: string | null | undefined
): ImageSource {
  if (!imagePath) {
    return { src: '', isExternal: false, isValid: false };
  }

  const trimmedPath = imagePath.trim();

  // Check if external URL
  const isExternal =
    trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://');

  // Check if valid local path
  const isValidLocal = trimmedPath.startsWith('/');

  return {
    src: trimmedPath,
    isExternal,
    isValid: isExternal || isValidLocal,
  };
}

export function getImageSrc(article: {
  featured_image?: string;
  image?: string;
}): string | null {
  // Priority: featured_image > image
  const imagePath = article.featured_image || article.image;
  const parsed = parseImageSource(imagePath);

  return parsed.isValid ? parsed.src : null;
}
```

### 2. Enhanced Image Component

سننشئ wrapper component للتعامل مع الأخطاء:

```typescript
// components/ui/SafeImage.tsx

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
  sizes,
  fallbackSrc = '/images/placeholder.jpg',
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    console.error(`Failed to load image: ${imgSrc}`);
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return null; // أو يمكن عرض placeholder
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      unoptimized={false}
    />
  );
}
```

### 3. Updated ArticlePageClient

سنحدث المكون لاستخدام الأدوات الجديدة:

```typescript
// في ArticlePageClient.tsx

import { getImageSrc } from '@/lib/utils/imageUtils';
import { SafeImage } from '@/components/ui/SafeImage';

// في الكود:
const featuredImageSrc = getImageSrc(article);

{
  featuredImageSrc && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative aspect-video rounded-2xl overflow-hidden mb-8 shadow-xl"
    >
      <SafeImage
        src={featuredImageSrc}
        alt={article.title}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </motion.div>
  );
}
```

## Data Models

لا حاجة لتغيير نموذج البيانات. الحقول الموجودة كافية:

```typescript
interface Article {
  // ... existing fields
  image?: string; // الصورة العادية
  featured_image?: string; // الصورة البارزة (أولوية أعلى)
}
```

## Configuration Changes

### Next.js Config Updates

سنحسن إعدادات الصور في `next.config.mjs`:

```javascript
const nextConfig = {
  // ... existing config
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Pexels
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Unsplash (if needed)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Pixabay (if needed)
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
      // Allow other HTTPS sources (fallback)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // تحسين الأداء
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};
```

## Error Handling

### Error Scenarios and Solutions

1. **الصورة المحلية غير موجودة**

   - Solution: استخدام SafeImage component مع fallback
   - Fallback: إخفاء قسم الصورة أو عرض placeholder

2. **الصورة الخارجية فشلت في التحميل**

   - Solution: معالجة onError في SafeImage
   - Fallback: محاولة تحميل صورة بديلة أو إخفاء القسم

3. **مسار الصورة غير صالح**

   - Solution: التحقق من صحة المسار في parseImageSource
   - Fallback: عدم عرض قسم الصورة

4. **النطاق الخارجي غير مسموح**
   - Solution: إضافة النطاق إلى remotePatterns
   - Fallback: عرض رسالة خطأ في console

### Error Logging

```typescript
// lib/utils/errorLogger.ts

export function logImageError(context: string, error: any, imageSrc?: string) {
  console.error(`[Image Error] ${context}`, {
    error,
    imageSrc,
    timestamp: new Date().toISOString(),
  });

  // يمكن إضافة إرسال إلى خدمة مراقبة الأخطاء هنا
}
```

## Testing Strategy

### Manual Testing Checklist

1. **الصور المحلية**

   - [ ] رفع صورة محلية جديدة
   - [ ] التحقق من ظهورها في صفحة التحرير
   - [ ] نشر المقال والتحقق من ظهور الصورة
   - [ ] اختبار مع أسماء ملفات عربية

2. **الصور الخارجية**

   - [ ] اختيار صورة من Pexels
   - [ ] التحقق من ظهورها في صفحة التحرير
   - [ ] نشر المقال والتحقق من ظهور الصورة
   - [ ] اختبار مع روابط من مصادر مختلفة

3. **حالات الخطأ**

   - [ ] حذف ملف صورة محلية والتحقق من معالجة الخطأ
   - [ ] استخدام رابط صورة خارجي غير صالح
   - [ ] مقال بدون صورة بارزة
   - [ ] مقال مع featured_image و image معاً

4. **الأداء**
   - [ ] قياس وقت تحميل الصفحة
   - [ ] التحقق من تحسين الصور (WebP/AVIF)
   - [ ] اختبار على أجهزة مختلفة (Desktop, Mobile)

### Test Cases

```typescript
// __tests__/utils/imageUtils.test.ts

describe('parseImageSource', () => {
  it('should identify external URLs', () => {
    const result = parseImageSource('https://example.com/image.jpg');
    expect(result.isExternal).toBe(true);
    expect(result.isValid).toBe(true);
  });

  it('should identify local paths', () => {
    const result = parseImageSource('/uploads/image.jpg');
    expect(result.isExternal).toBe(false);
    expect(result.isValid).toBe(true);
  });

  it('should handle null/undefined', () => {
    const result = parseImageSource(null);
    expect(result.isValid).toBe(false);
  });
});

describe('getImageSrc', () => {
  it('should prioritize featured_image', () => {
    const article = {
      featured_image: '/uploads/featured.jpg',
      image: '/uploads/regular.jpg',
    };
    expect(getImageSrc(article)).toBe('/uploads/featured.jpg');
  });

  it('should fallback to image', () => {
    const article = {
      image: '/uploads/regular.jpg',
    };
    expect(getImageSrc(article)).toBe('/uploads/regular.jpg');
  });
});
```

## Implementation Plan

### Phase 1: Core Utilities (Priority: High)

1. إنشاء `lib/utils/imageUtils.ts`
2. إنشاء `components/ui/SafeImage.tsx`
3. تحديث `next.config.mjs`

### Phase 2: Component Updates (Priority: High)

1. تحديث `ArticlePageClient.tsx`
2. تحديث `app/articles/[slug]/page.tsx` (metadata)
3. اختبار يدوي للتأكد من عمل الصور

### Phase 3: Related Components (Priority: Medium)

1. تحديث `ArticlesPageClient.tsx` (قائمة المقالات)
2. تحديث المقالات ذات الصلة في `ArticlePageClient`
3. التأكد من تطبيق الإصلاح في جميع الأماكن

### Phase 4: Error Handling & Logging (Priority: Low)

1. إضافة error logging
2. إنشاء placeholder images
3. تحسين رسائل الأخطاء

## Performance Considerations

1. **Image Optimization**

   - استخدام Next.js Image component للتحسين التلقائي
   - تحويل الصور إلى WebP/AVIF
   - Lazy loading للصور خارج viewport

2. **Caching**

   - تفعيل cache للصور المحلية والخارجية
   - استخدام CDN للصور الخارجية عند الإمكان

3. **Bundle Size**
   - الأدوات الجديدة صغيرة الحجم (<2KB)
   - لا تأثير ملحوظ على حجم Bundle

## Security Considerations

1. **External Images**

   - تحديد النطاقات المسموحة بدقة
   - عدم السماح بجميع النطاقات إلا كـ fallback

2. **Local Images**

   - التحقق من المسارات لمنع Path Traversal
   - التأكد من أن الصور في مجلد `/public/uploads` فقط

3. **Content Security Policy**
   - تحديث CSP headers إذا لزم الأمر
   - السماح بتحميل الصور من النطاقات المحددة

## Rollback Plan

في حالة حدوث مشاكل:

1. **Quick Rollback**: العودة إلى الكود القديم عبر Git
2. **Partial Rollback**: إزالة SafeImage واستخدام Image مباشرة
3. **Config Rollback**: العودة إلى إعدادات next.config.mjs القديمة

## Monitoring and Metrics

بعد التطبيق، يجب مراقبة:

1. **Error Rate**: عدد أخطاء تحميل الصور
2. **Load Time**: وقت تحميل الصفحات مع الصور
3. **User Reports**: تقارير المستخدمين عن مشاكل الصور
4. **Console Errors**: أخطاء في console المتصفح

## Future Enhancements

1. **Image Placeholder**: إضافة blur placeholder أثناء التحميل
2. **Progressive Loading**: تحميل تدريجي للصور الكبيرة
3. **Image CDN**: استخدام CDN مخصص للصور المحلية
4. **Automatic Optimization**: ضغط الصور تلقائياً عند الرفع
