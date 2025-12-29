# Implementation Plan - Featured Image Display Fix

## Overview

هذه الخطة تحدد المهام المطلوبة لإصلاح مشكلة عدم ظهور الصور البارزة في صفحات المقالات.

## Tasks

- [x] 1. إنشاء أدوات معالجة الصور (Image Utilities)

  - إنشاء ملف `lib/utils/imageUtils.ts` مع دوال معالجة مسارات الصور
  - تنفيذ `parseImageSource()` للتحقق من نوع الصورة (محلية/خارجية)
  - تنفيذ `getImageSrc()` لاختيار الصورة الصحيحة (featured_image أو image)
  - _Requirements: 1.1, 1.3, 2.2, 3.1, 3.5_

- [x] 2. إنشاء مكون SafeImage للتعامل مع الأخطاء

  - إنشاء ملف `components/ui/SafeImage.tsx`
  - تنفيذ معالجة أخطاء تحميل الصور
  - إضافة fallback للصور الفاشلة
  - دعم الصور المحلية والخارجية
  - _Requirements: 2.3, 3.4, 4.4_

- [x] 3. تحديث إعدادات Next.js للصور

  - تحديث `next.config.mjs` لإضافة نطاقات الصور الخارجية المحددة
  - إضافة Pexels و Unsplash و Pixabay إلى remotePatterns
  - تحسين إعدادات الأداء (deviceSizes, imageSizes)
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 4. تحديث ArticlePageClient لاستخدام الأدوات الجديدة

  - استيراد `getImageSrc` و `SafeImage`
  - استبدال Image component بـ SafeImage
  - تطبيق معالجة الصور البارزة بشكل صحيح
  - التأكد من عرض الصورة بالأولوية الصحيحة (featured_image > image)
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.1, 3.2, 3.3, 4.1_

- [x] 5. تحديث صفحة المقال الرئيسية (Server Component)

  - تحديث `app/articles/[slug]/page.tsx`
  - التأكد من تمرير featured_image في metadata
  - تحديث OpenGraph و Twitter metadata للصور
  - _Requirements: 1.1, 2.1, 4.1_

- [x] 6. تحديث قائمة المقالات والمقالات ذات الصلة

  - تحديث `ArticlesPageClient.tsx` لاستخدام SafeImage
  - تحديث عرض المقالات ذات الصلة في ArticlePageClient
  - التأكد من عمل الصور في جميع قوائم المقالات
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 7. اختبار الصور المحلية

  - رفع صورة محلية جديدة كصورة بارزة
  - التحقق من ظهورها في صفحة التحرير
  - نشر المقال والتحقق من ظهور الصورة في الصفحة العامة
  - اختبار مع أسماء ملفات عربية
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 8. اختبار الصور الخارجية

  - اختيار صورة من Pexels كصورة بارزة
  - التحقق من ظهورها في صفحة التحرير
  - نشر المقال والتحقق من ظهور الصورة
  - اختبار مع روابط من مصادر مختلفة (Unsplash, Pixabay)
  - _Requirements: 2.1, 2.2, 5.1_

- [x] 9. اختبار حالات الخطأ والحالات الخاصة

  - اختبار مقال بدون صورة بارزة (يجب إخفاء قسم الصورة)
  - اختبار مقال مع featured_image و image معاً (يجب عرض featured_image)
  - اختبار رابط صورة خارجي غير صالح (يجب معالجة الخطأ)
  - حذف ملف صورة محلية والتحقق من معالجة الخطأ
  - _Requirements: 2.3, 3.1, 3.2, 3.3, 3.4, 4.4_

- [x] 10. التحقق من الأداء والتحسينات

  - قياس وقت تحميل صفحة المقال قبل وبعد التحديث
  - التحقق من تحسين الصور (WebP/AVIF)
  - اختبار على أجهزة مختلفة (Desktop, Mobile, Tablet)
  - التأكد من عمل lazy loading للصور
  - _Requirements: 4.1, 4.2, 4.3_
