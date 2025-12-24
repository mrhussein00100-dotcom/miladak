# Implementation Plan

## تحسين أداء موقع ميلادك

- [x] 1. تحسين تحميل الخطوط (إصلاح CLS)

  - [x] 1.1 إزالة @import المكرر للخطوط من globals.css

    - إزالة السطر الأول `@import url('https://fonts.googleapis.com/css2?family=Cairo...')`
    - الخط يُحمّل بالفعل من next/font في layout.tsx
    - _Requirements: 1.1, 1.2, 2.4_

  - [x] 1.2 تحسين إعدادات خط Cairo في layout.tsx

    - تقليل الأوزان من 5 إلى 3 (400, 600, 700)
    - إضافة adjustFontFallback: true لمنع CLS
    - إضافة fallback fonts مناسبة
    - _Requirements: 1.1, 1.2_

  - [x] 1.3 إزالة تحميل الخطوط من head في layout.tsx

    - إزالة link tags لـ Google Fonts (مكررة)
    - _Requirements: 2.4_

  - [x] 1.4 تحسين تحميل خطوط صفحة البطاقات (Cards Page)

    - التأكد من أن خطوط البطاقات (8 خطوط) تُحمّل بشكل كسول عند الحاجة فقط
    - تحديث FontSelector.tsx لتحميل الخط المختار فقط (لا تحميل جميع الخطوط مرة واحدة)
    - الحفاظ على تنوع الخطوط للمستخدم (Cairo, Amiri, Noto Sans, Tajawal, IBM Plex, Almarai, Harmattan, Changa)
    - استخدام loadGoogleFont من arabicFonts.ts عند اختيار خط جديد
    - _Requirements: 1.1, 3.2_

  - [ ]\* 1.5 كتابة اختبار للتحقق من عدم وجود تحميل مكرر للخطوط
    - **Property 1: Font loading is not duplicated**
    - **Validates: Requirements 2.4**

- [x] 2. تحسين CSS (توفير 21 KiB)

  - [x] 2.1 إزالة أنماط وضع miladak غير المستخدمة من globals.css

    - إزالة جميع الأنماط التي تبدأ بـ `html.miladak` أو `.miladak`
    - توفير ~800 سطر من CSS
    - _Requirements: 4.1, 4.4_

  - [x] 2.2 إزالة الأنماط المكررة والغير مستخدمة

    - مراجعة وإزالة animations غير مستخدمة
    - إزالة utility classes غير مستخدمة
    - _Requirements: 4.1_

  - [ ]\* 2.3 كتابة اختبار للتحقق من حجم CSS
    - التحقق من أن حجم globals.css أقل من 50 KiB
    - _Requirements: 4.1_

- [ ] 3. Checkpoint - التحقق من التحسينات الأولية

  - Ensure all tests pass, ask the user if questions arise.

- [-] 4. تحسين JavaScript (توفير 189 KiB)

  - [x] 4.1 تحديث next.config.mjs لتحسين imports

    - إضافة optimizePackageImports لـ framer-motion و lucide-react
    - _Requirements: 3.1, 3.4_

  - [ ] 4.2 تحويل framer-motion إلى dynamic import
    - استخدام next/dynamic للمكونات التي تستخدم framer-motion
    - _Requirements: 3.2_
  - [x] 4.3 تحديث browserslist لاستهداف متصفحات حديثة

    - إضافة .browserslistrc لاستهداف ES2020+
    - إزالة polyfills غير ضرورية
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]\* 4.4 كتابة اختبار للتحقق من إعدادات البناء
    - التحقق من وجود optimizePackageImports
    - _Requirements: 3.1_

- [x] 5. تحسين AdSense (تقليل Render Blocking)

  - [x] 5.1 إنشاء مكون AdSenseLoader للتحميل الكسول

    - تحميل AdSense بعد requestIdleCallback أو بعد 2 ثانية
    - _Requirements: 6.1, 6.2_

  - [x] 5.2 تحديث layout.tsx لاستخدام AdSenseLoader

    - إزالة script tag المباشر من head
    - استخدام المكون الجديد
    - _Requirements: 6.1, 6.4_

  - [x] 5.3 إضافة معالجة أخطاء لـ AdSense

    - إخفاء مساحة الإعلان عند الفشل
    - منع أخطاء console
    - _Requirements: 6.3_

  - [ ]\* 5.4 كتابة اختبار لتحميل AdSense الكسول
    - التحقق من أن AdSense لا يُحمّل مباشرة
    - _Requirements: 6.1_

- [ ] 6. Checkpoint - التحقق من تحسينات JavaScript

  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. تحسين Accessibility

  - [x] 7.1 إضافة aria-label للأزرار بدون نص

    - البحث عن الأزرار التي تحتوي على أيقونات فقط
    - إضافة aria-label مناسب
    - _Requirements: 8.1_

  - [x] 7.2 إضافة labels لعناصر select

    - إضافة label elements أو aria-label لجميع select elements
    - _Requirements: 8.2_

  - [x] 7.3 تحسين تباين الألوان

    - مراجعة الألوان في الوضع الفاتح
    - التأكد من نسبة تباين 4.5:1 على الأقل
    - _Requirements: 8.3_

  - [ ]\* 7.4 كتابة property test للتحقق من accessibility
    - **Property 2: Buttons have accessible names**
    - **Property 3: Select elements have labels**
    - **Validates: Requirements 8.1, 8.2**

- [x] 8. تحسين LCP

  - [x] 8.1 إضافة priority للخطوط الحرجة

    - إضافة preload مع fetchpriority="high" للخط الرئيسي

    - _Requirements: 5.3_

  - [x] 8.2 تحسين Hero component للتحميل السريع

    - إزالة أي animations تؤخر عرض h1
    - التأكد من أن h1 يظهر فوراً
    - _Requirements: 5.1, 5.2_

  - [ ]\* 8.3 كتابة اختبار للتحقق من وجود preload للخطوط
    - التحقق من وجود link rel="preload" للخط
    - _Requirements: 5.3_

- [ ] 9. Final Checkpoint - التحقق النهائي
  - Ensure all tests pass, ask the user if questions arise.
  - قياس الأداء على PageSpeed Insights
  - التحقق من تحقيق الأهداف (Mobile 70+, Desktop 90+)
