# Implementation Plan

## Phase 1: Foundation - نظام الألوان والمتغيرات

- [x] 1. إنشاء نظام الألوان الجديد في globals.css




  - [ ] 1.1 تعريف متغيرات CSS للوضع الفاتح (Light Mode)
    - إضافة الألوان الأساسية: coral rose, lavender, aqua mint

    - تعريف ألوان الخلفية والنص والبطاقات
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 تعريف متغيرات CSS للوضع الليلي (Dark Mode)

    - إضافة ألوان الفضاء العميق والنيون
    - تعريف متغيرات التوهج (glow)
    - _Requirements: 1.3, 1.6, 8.1-8.8_

  - [ ] 1.3 تعريف متغيرات CSS لوضع ميلادك (Miladak Mode)
    - إضافة ألوان البنفسجي الغامق والماجنتا
    - تعريف متغيرات قوس قزح والكونفيتي
    - _Requirements: 9.1-9.8_




  - [ ] 1.4 إضافة نظام التباعد والأحجام
    - تعريف spacing system (4px base)
    - تعريف border-radius values

    - تعريف shadow values
    - _Requirements: 10.8_



- [ ] 2. تحديث ThemeProvider لدعم الأوضاع الثلاثة
  - [ ] 2.1 إضافة وضع 'miladak' للـ ThemeProvider
    - تحديث type definitions
    - إضافة logic للتبديل بين الأوضاع الثلاثة
    - _Requirements: 1.4_
  - [ ] 2.2 إضافة حفظ التفضيل في localStorage
    - حفظ واسترجاع تفضيل المستخدم
    - _Requirements: 1.4_
  - [ ] 2.3 كتابة property test للتحقق من تناسق الثيم
    - **Property 3: Theme Transition Consistency**
    - **Validates: Requirements 1.4**

## Phase 2: Components - تحديث المكونات الأساسية

- [ ] 3. إعادة تصميم البطاقات (Cards)
  - [ ] 3.1 تحديث مكون Card.tsx بالتصميم الجديد
    - إضافة rounded corners (20px)
    - إضافة soft shadows
    - إضافة hover effects
    - _Requirements: 2.1, 2.2, 2.3, 10.3_
  - [ ] 3.2 إضافة glass effect للبطاقات
    - backdrop-filter blur
    - semi-transparent backgrounds
    - _Requirements: 2.2_
  - [ ] 3.3 إضافة gradient borders للوضع الليلي وميلادك
    - حدود متوهجة للوضع الليلي
    - حدود قوس قزح لوضع ميلادك
    - _Requirements: 2.4, 8.3, 9.5_

- [ ] 4. إعادة تصميم الأزرار (Buttons)
  - [ ] 4.1 تحديث مكون Button.tsx بالتصميم الجديد
    - gradient backgrounds
    - hover scale effects
    - glow shadows
    - _Requirements: 2.5, 8.7, 9.7_
  - [ ] 4.2 إضافة أنماط مختلفة للأزرار
    - primary, secondary, outline, ghost
    - _Requirements: 10.7_

- [ ] 5. إعادة تصميم حقول الإدخال (Inputs)
  - [ ] 5.1 تحديث مكون Input.tsx بالتصميم الجديد
    - warm colored focus states
    - animated labels
    - _Requirements: 6.2_

## Phase 3: Layout - تحديث التخطيط العام


- [x] 6. إعادة تصميم النافبار (Navbar)

  - [ ] 6.1 تحديث Navbar.tsx بالتصميم الجديد
    - gradient background مع glass effect
    - pill-shaped navigation links
    - smooth transitions
    - _Requirements: 5.1, 5.3, 5.4, 10.4_
  - [ ] 6.2 إضافة تأثير الشفافية عند التمرير
    - زيادة opacity عند scroll
    - _Requirements: 5.5_



  - [ ] 6.3 إضافة logo animation
    - subtle bounce on hover
    - _Requirements: 5.2_


- [ ] 7. إعادة تصميم الفوتر (Footer)
  - [ ] 7.1 تحديث Footer.tsx بالتصميم الجديد
    - wave pattern background

    - warm gradient
    - _Requirements: 5.4_




- [ ] 8. Checkpoint - التأكد من عمل الأساسيات
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Hero & Calculator - الأقسام الرئيسية


- [ ] 9. إعادة تصميم Hero Section
  - [ ] 9.1 تحديث Hero.tsx بالتصميم الجديد
    - elegant animations

    - clear CTA buttons
    - minimal and clean layout
    - _Requirements: 10.5_


  - [ ] 9.2 إضافة العناصر الزخرفية
    - floating balloons and stars


    - subtle confetti rain
    - _Requirements: 4.1, 4.2_
  - [x] 9.3 إضافة sparkle burst عند التحميل

    - welcoming animation
    - _Requirements: 4.4_


- [x] 10. إعادة تصميم حاسبة العمر (AgeCalculator)

  - [ ] 10.1 تحديث AgeCalculator.tsx بالتصميم الجديد
    - card-based layout

    - celebration card style
    - decorative borders

    - _Requirements: 6.1, 10.6_
  - [ ] 10.2 تحديث عرض النتائج
    - colorful stat cards


    - unique icons for each metric
    - sequential animation
    - _Requirements: 6.3, 6.4_
  - [ ] 10.3 إضافة celebration animation عند الحساب
    - confetti trigger
    - _Requirements: 3.3, 6.5_

## Phase 5: Effects - التأثيرات البصرية

- [ ] 11. إنشاء مكونات التأثيرات
  - [ ] 11.1 إنشاء مكون Confetti للكونفيتي
    - particle system
    - color variations
    - _Requirements: 3.3, 9.3_
  - [ ] 11.2 إنشاء مكون Sparkles للتألق
    - random sparkle effects
    - _Requirements: 3.2, 9.6_
  - [ ] 11.3 إنشاء مكون FloatingElements للعناصر العائمة
    - balloons, stars, emojis
    - _Requirements: 3.1, 4.1, 4.3, 4.5_
  - [ ] 11.4 إنشاء مكون StarfieldBackground للخلفية النجمية
    - للوضع الليلي
    - _Requirements: 8.1_
  - [ ] 11.5 إنشاء مكون AuroraBackground للأورورا
    - للوضع الليلي
    - _Requirements: 8.6_
  - [ ] 11.6 إنشاء مكون RainbowBorder للحدود الملونة
    - لوضع ميلادك
    - _Requirements: 9.5_

- [ ] 12. إضافة دعم prefers-reduced-motion
  - [ ] 12.1 تعطيل الأنيميشن للمستخدمين الذين يفضلون تقليل الحركة
    - media query implementation
    - _Requirements: 3.5_
  - [ ] 12.2 كتابة property test للتحقق من احترام reduced motion
    - **Property 4: Reduced Motion Respect**
    - **Validates: Requirements 3.5**

## Phase 6: Performance - تحسين الأداء

- [ ] 13. تحسين أداء الأنيميشن
  - [ ] 13.1 استخدام CSS transforms و opacity فقط
    - hardware acceleration
    - _Requirements: 7.4_
  - [ ] 13.2 تقليل تعقيد الأنيميشن على الموبايل
    - conditional rendering
    - _Requirements: 7.3_
  - [ ] 13.3 lazy-load للعناصر الزخرفية
    - intersection observer
    - _Requirements: 7.2_
  - [ ] 13.4 إضافة fallback للمتصفحات القديمة
    - backdrop-filter fallback
    - _Requirements: 7.5_
  - [ ] 13.5 كتابة property test للتحقق من الأداء
    - **Property 2: Animation Performance**
    - **Validates: Requirements 7.1**

## Phase 7: Accessibility - إمكانية الوصول

- [ ] 14. التحقق من تباين الألوان
  - [ ] 14.1 التأكد من تباين WCAG AA لجميع النصوص
    - contrast ratio verification
    - _Requirements: 1.5_
  - [ ] 14.2 كتابة property test للتحقق من التباين
    - **Property 1: WCAG Contrast Compliance**
    - **Validates: Requirements 1.5**

## Phase 8: Polish - اللمسات النهائية

- [ ] 15. تحديث باقي الصفحات والمكونات
  - [ ] 15.1 تحديث صفحة الأدوات (Tools)
    - تطبيق التصميم الجديد
    - _Requirements: 10.1, 10.9_
  - [ ] 15.2 تحديث صفحة المقالات (Articles)
    - تطبيق التصميم الجديد
    - _Requirements: 10.1, 10.9_
  - [ ] 15.3 تحديث الصفحات الثانوية
    - About, Privacy, Terms, Contact
    - _Requirements: 10.1_

- [ ] 16. إضافة page transitions
  - [ ] 16.1 إضافة smooth scroll
    - _Requirements: 10.10_
  - [ ] 16.2 إضافة fade transitions بين الصفحات
    - _Requirements: 3.4_

- [ ] 17. Final Checkpoint - التأكد من اكتمال كل شيء
  - Ensure all tests pass, ask the user if questions arise.
