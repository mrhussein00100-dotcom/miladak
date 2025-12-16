# Design Document: Tools Page Enhancement

## Overview

تحسين شامل لصفحة الأدوات الرئيسية وجميع صفحات الأدوات الفرعية في موقع ميلادك يهدف إلى:

- إزالة التكرار والعناصر الزائدة
- توحيد التصميم عبر جميع صفحات الأدوات
- تحسين الهيدر والتصميم العام مع مرونة للثيمات المختلفة
- إضافة نظام إدخال تاريخ مزدوج (بسيط + كاليندر مرئي)
- إضافة 100 كلمة مفتاحية خاصة بكل صفحة أداة
- تحسين SEO والميتاتاج وصداقة محركات البحث
- إضافة مقالات عشوائية مخصصة لكل صفحة أداة
- مراعاة اسم الموقع "ميلادك" في جميع الكلمات المفتاحية والسيو

## Architecture

```mermaid
graph TB
    subgraph "Main Tools Page"
        A[app/tools/page.tsx] --> B[ToolsPageClient]
        A --> C[RandomArticlesSection]
        A --> D[KeywordsSection]
        A --> E[SEOContentSection]
    end

    subgraph "Tool Detail Pages"
        F[app/tools/[slug]/page.tsx] --> G[ToolCalculator]
        F --> H[DualDateInput]
        F --> I[ToolKeywordsSection]
        F --> J[ToolRandomArticles]
        F --> K[ToolSEOMetadata]
    end

    subgraph "Shared Components"
        B --> L[ToolCard]
        B --> M[CategoryFilter]
        B --> N[SearchInput]
        C --> O[ArticleCard]
        D --> P[KeywordTag]
        H --> Q[SimpleInput]
        H --> R[VisualCalendar]
    end

    subgraph "Theme System"
        S[ThemeProvider] --> A
        S --> F
    end

    subgraph "Data Sources"
        K[Database - Tools]
        L[Database - Articles]
        M[Keywords Config]
    end

    A --> K
    C --> L
    D --> M
```

## Components and Interfaces

### 1. Enhanced Tools Page (app/tools/page.tsx)

```typescript
// Server Component - الصفحة الرئيسية
interface ToolsPageProps {
  tools: Tool[];
  categories: ToolCategory[];
}

// الهيدر الموحد - بدون تكرار
const UnifiedHeroSection = ({ toolsCount }: { toolsCount: number }) => {
  // هيدر واحد فقط بدون العناصر المكررة
};
```

### 2. ToolsPageClient Component (Enhanced)

```typescript
interface ToolsPageClientProps {
  tools: Tool[];
  categories: ToolCategory[];
}

// إزالة الهيدر المكرر من هذا المكون
// الاحتفاظ فقط بـ: البحث، الفلاتر، عرض الأدوات
```

### 3. RandomArticlesSection Component (New)

```typescript
interface RandomArticlesSectionProps {
  keywords: string[]; // كلمات مفتاحية من الأدوات
  count?: number; // عدد المقالات (افتراضي: 6)
}

interface RandomArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
}
```

### 4. KeywordsSection Component (New)

```typescript
interface KeywordsSectionProps {
  onKeywordClick?: (keyword: string) => void;
  toolSlug?: string; // لتحديد الكلمات المفتاحية الخاصة بالأداة
}

interface KeywordGroup {
  name: string;
  icon: string;
  keywords: string[];
}

// 100 كلمة مفتاحية موزعة على 6 مجموعات
const keywordGroups: KeywordGroup[] = [
  { name: 'حسابات العمر', icon: '🎂', keywords: [...] },
  { name: 'الصحة واللياقة', icon: '💪', keywords: [...] },
  { name: 'التواريخ والأوقات', icon: '📅', keywords: [...] },
  { name: 'الحمل والأطفال', icon: '👶', keywords: [...] },
  { name: 'المناسبات والأعياد', icon: '🎉', keywords: [...] },
  { name: 'أدوات متنوعة', icon: '🔧', keywords: [...] },
];
```

### 5. DualDateInput Component (New)

```typescript
interface DualDateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  supportHijri?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// نظام إدخال التاريخ المزدوج
// - حقل نصي بسيط للإدخال السريع
// - كاليندر مرئي للاختيار البصري
// - تزامن تلقائي بين الاثنين
```

### 6. ToolSEOMetadata Component (New)

```typescript
interface ToolSEOMetadataProps {
  tool: Tool;
  keywords: string[];
}

// يولد:
// - meta title مع اسم "ميلادك"
// - meta description محسن
// - Open Graph tags
// - Twitter Card tags
// - JSON-LD structured data
// - canonical URL
```

### 7. ToolPageLayout Component (New)

```typescript
interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  keywords: string[];
  relatedArticles: RandomArticle[];
}

// تخطيط موحد لجميع صفحات الأدوات يشمل:
// - الهيدر الموحد
// - الحاسبة (children)
// - قسم المقالات العشوائية
// - قسم الكلمات المفتاحية
// - محتوى SEO
```

## Data Models

### Tool (Existing)

```typescript
interface Tool {
  id: number;
  slug: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category_id: number;
  category_name?: string;
  href: string;
  featured: boolean;
  active: boolean;
}
```

### ToolCategory (Existing)

```typescript
interface ToolCategory {
  id: number;
  name: string;
  slug: string;
  title: string;
  icon: string;
  sort_order: number;
  tools_count?: number;
}
```

### RandomArticle (New)

```typescript
interface RandomArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  keywords: string[];
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Tools count display accuracy

_For any_ set of active tools in the database, the displayed tools count in the hero section should exactly match the actual number of tools returned from the query.
**Validates: Requirements 2.4**

### Property 2: Featured tools ordering

_For any_ tools list containing featured and non-featured tools, all featured tools should appear before non-featured tools in the rendered output.
**Validates: Requirements 3.4**

### Property 3: Search filter correctness

_For any_ non-empty search query, all tools in the filtered results should contain the search term in either their name or description (case-insensitive).
**Validates: Requirements 3.6**

### Property 4: Random articles relevance

_For any_ set of tool keywords, the returned random articles should have at least one matching keyword or category tag when matching articles exist.
**Validates: Requirements 4.2**

### Property 5: Article card completeness

_For any_ article displayed in the random articles section, the rendered card should contain a non-empty title, excerpt, and image URL.
**Validates: Requirements 4.3**

### Property 6: Article link correctness

_For any_ article card in the random articles section, the link href should follow the pattern `/articles/{slug}` where slug matches the article's slug.
**Validates: Requirements 4.4**

### Property 7: Random articles variation

_For any_ two consecutive calls to get random articles with the same parameters, the returned articles should differ with probability greater than 0.9.
**Validates: Requirements 4.5**

### Property 8: Keywords grouping completeness

_For any_ keyword displayed in the keywords section, it should belong to exactly one of the predefined keyword groups.
**Validates: Requirements 5.2**

### Property 9: Keyword click handler

_For any_ keyword tag clicked by the user, the search/filter function should be called with that exact keyword as the parameter.
**Validates: Requirements 5.4**

### Property 10: Category description presence

_For any_ category displayed on the tools page, it should have a non-empty description string.
**Validates: Requirements 6.2**

### Property 11: Reduced motion respect

_For any_ animation on the page, when the user has `prefers-reduced-motion: reduce` enabled, the animation should be disabled or significantly reduced.
**Validates: Requirements 7.3**

### Property 12: Dual date input synchronization

_For any_ date entered in the simple text input, the visual calendar picker should display the same date, and vice versa.
**Validates: Requirements 9.2, 9.3**

### Property 13: Tool-specific keywords count

_For any_ tool detail page, the keywords section should contain exactly 100 keywords specific to that tool.
**Validates: Requirements 8.2**

### Property 14: Brand name in SEO

_For any_ tool page meta tags, the brand name "ميلادك" should appear in either the title or description.
**Validates: Requirements 8.5, 10.5**

### Property 15: Theme consistency

_For any_ theme change (light/dark), all tool pages should maintain consistent color contrast ratios meeting WCAG AA standards.
**Validates: Requirements 11.3**

### Property 16: Tool-specific random articles

_For any_ tool detail page, the random articles displayed should be related to that specific tool's category or keywords.
**Validates: Requirements 8.3**

## Error Handling

### Database Errors

- إذا فشل الاتصال بقاعدة البيانات، يتم عرض رسالة خطأ ودية
- يتم تسجيل الخطأ في console للتصحيح

### Empty States

- إذا لم توجد أدوات، يتم عرض رسالة "لا توجد أدوات متاحة حالياً"
- إذا لم توجد مقالات مطابقة، يتم عرض مقالات شائعة كبديل

### Search No Results

- إذا لم يجد البحث نتائج، يتم عرض رسالة مع اقتراح إعادة البحث

## Testing Strategy

### Unit Tests

- اختبار دالة فلترة الأدوات
- اختبار دالة اختيار المقالات العشوائية
- اختبار تجميع الكلمات المفتاحية

### Property-Based Tests

سيتم استخدام مكتبة `fast-check` لاختبار الخصائص:

1. **Property 1**: اختبار دقة عرض عدد الأدوات
2. **Property 2**: اختبار ترتيب الأدوات المميزة
3. **Property 3**: اختبار صحة فلترة البحث
4. **Property 4**: اختبار ملاءمة المقالات العشوائية
5. **Property 5**: اختبار اكتمال بطاقة المقال
6. **Property 6**: اختبار صحة روابط المقالات
7. **Property 7**: اختبار تنوع المقالات العشوائية
8. **Property 8**: اختبار اكتمال تجميع الكلمات المفتاحية
9. **Property 9**: اختبار معالج النقر على الكلمة المفتاحية
10. **Property 10**: اختبار وجود وصف التصنيف
11. **Property 11**: اختبار احترام تقليل الحركة

كل اختبار خاصية يجب أن يعمل 100 تكرار على الأقل.

### Test Annotations

كل اختبار خاصية يجب أن يحتوي على تعليق بالصيغة:

```typescript
// **Feature: tools-page-enhancement, Property {number}: {property_text}**
```

## Keywords List (100 Keywords)

### مجموعة 1: حسابات العمر (17 كلمة)

حاسبة العمر، حساب العمر، كم عمري، عمري بالأيام، عمري بالساعات، عمري بالثواني، حاسبة العمر الدقيقة، احسب عمرك، العمر بالهجري، العمر بالميلادي، حاسبة السن، معرفة العمر، حساب تاريخ الميلاد، عمري بالدقائق، العمر الدقيق، حساب عمري، كم عمري بالضبط

### مجموعة 2: الصحة واللياقة (17 كلمة)

حاسبة BMI، مؤشر كتلة الجسم، حاسبة السعرات الحرارية، حاسبة الوزن المثالي، حاسبة السعرات، حساب السعرات الحرارية، وزن مثالي، حرق السعرات، نظام غذائي، لياقة بدنية، صحة ولياقة، تغذية صحية، حاسبة الوزن، مؤشر الكتلة، حساب الوزن، صحة عامة، رشاقة

### مجموعة 3: التواريخ والأوقات (17 كلمة)

حاسبة الأيام، الفرق بين تاريخين، حاسبة الأيام بين تاريخين، يوم الأسبوع، العد التنازلي، عد تنازلي لعيد الميلاد، كم يوم باقي، حاسبة التواريخ، حاسبة الوقت، فرق التوقيت، المناطق الزمنية، حاسبة المناطق الزمنية، تحويل التاريخ، التقويم الهجري، التقويم الميلادي، حساب الأيام، عدد الأيام

### مجموعة 4: الحمل والأطفال (17 كلمة)

حاسبة الحمل، مراحل الحمل، حاسبة نمو الطفل، عمر الطفل، تطور الطفل، حاسبة الحمل بالأسابيع، متابعة الحمل، نمو الجنين، صحة الحامل، رعاية الحامل، حاسبة عمر الطفل، صحة الأطفال، تربية الأطفال، نصائح للحامل، مراحل نمو الطفل، حاسبة الولادة، موعد الولادة

### مجموعة 5: المناسبات والأعياد (16 كلمة)

مخطط الاحتفالات، الأعياد الإسلامية، مواعيد الأعياد، حاسبة الأعياد، تخطيط حفلة عيد ميلاد، مناسبات، أعياد، احتفالات، عيد الفطر، عيد الأضحى، رمضان، مناسبات إسلامية، تخطيط احتفال، حفلة عيد ميلاد، مناسبات سعيدة، تهنئة عيد ميلاد

### مجموعة 6: أدوات متنوعة وميلادك (16 كلمة)

حاسبة الأجيال، إحصائيات الحياة، مقارنة الأعمار، العمر النسبي، حاسبة الإحصائيات، موقع ميلادك، ميلادك حاسبة العمر، ميلادك أدوات، حاسبة ميلادك، أدوات ميلادك المجانية، ميلادك للحسابات، حاسبات ميلادك، ميلادك الحاسبة الذكية، أدوات ميلادك الحسابية، ميلادك أونلاين، ميلادك العربي

## Tool-Specific Keywords Examples

### حاسبة BMI - 100 كلمة مفتاحية خاصة

حاسبة BMI ميلادك، مؤشر كتلة الجسم، حساب BMI، BMI calculator، حاسبة الوزن المثالي، معرفة وزني المثالي، هل وزني مثالي، حاسبة السمنة، مؤشر السمنة، حساب مؤشر الكتلة، BMI للأطفال، BMI للكبار، حاسبة BMI بالعربي، حاسبة BMI مجانية، حاسبة BMI دقيقة، الوزن الصحي، الوزن الطبيعي، حساب الوزن والطول، نسبة الدهون، حاسبة الدهون، مؤشر الصحة، صحة الجسم، لياقة بدنية، رشاقة، حمية، دايت، تخسيس، إنقاص الوزن، زيادة الوزن، وزن مثالي للطول، جدول BMI، تصنيف BMI، BMI طبيعي، BMI مرتفع، BMI منخفض، نحافة، سمنة مفرطة، وزن زائد، وزن ناقص، حاسبة الطول والوزن، معادلة BMI، صيغة BMI، كيف أحسب BMI، طريقة حساب BMI، BMI للرجال، BMI للنساء، BMI للحوامل، BMI للرياضيين، مؤشر كتلة الجسم ميلادك، حاسبة ميلادك BMI، أدوات ميلادك الصحية، ميلادك للصحة، حاسبة الصحة ميلادك، وزني المثالي ميلادك، حساب BMI ميلادك، مؤشر الكتلة ميلادك، صحتي ميلادك، لياقتي ميلادك، جسمي المثالي، الوزن الأمثل، حساب السعرات، حرق الدهون، بناء العضلات، تمارين رياضية، نظام غذائي صحي، حمية غذائية، تغذية سليمة، أكل صحي، رجيم، كيتو، صيام متقطع، حساب السعرات الحرارية، معدل الأيض، BMI calculator arabic، BMI حاسبة، مؤشر BMI، قياس BMI، فحص BMI، اختبار BMI، نتيجة BMI، تحليل BMI، تقييم BMI، BMI صحي، BMI غير صحي، تحسين BMI، خفض BMI، رفع BMI، BMI مناسب، BMI جيد، BMI ممتاز، BMI سيء، BMI خطير

### حاسبة العد التنازلي لعيد الميلاد - 100 كلمة مفتاحية خاصة

العد التنازلي لعيد الميلاد ميلادك، كم باقي على عيد ميلادي، متى عيد ميلادي، حاسبة عيد الميلاد، countdown birthday، عداد عيد الميلاد، أيام لعيد الميلاد، ساعات لعيد الميلاد، دقائق لعيد الميلاد، ثواني لعيد الميلاد، عيد ميلاد سعيد، تهنئة عيد ميلاد، هدية عيد ميلاد، حفلة عيد ميلاد، كيكة عيد ميلاد، شموع عيد ميلاد، أغنية عيد ميلاد، بطاقة عيد ميلاد، دعوة عيد ميلاد، تخطيط عيد ميلاد، أفكار عيد ميلاد، ديكور عيد ميلاد، بالونات عيد ميلاد، زينة عيد ميلاد، عيد ميلاد أطفال، عيد ميلاد كبار، عيد ميلاد صديق، عيد ميلاد حبيب، عيد ميلاد أم، عيد ميلاد أب، عيد ميلاد أخ، عيد ميلاد أخت، عيد ميلاد زوج، عيد ميلاد زوجة، عيد ميلاد ابن، عيد ميلاد ابنة، احتفال عيد ميلاد، مفاجأة عيد ميلاد، عيد ميلاد مميز، عيد ميلاد رومانسي، عيد ميلاد عائلي، عيد ميلاد أصدقاء، موعد عيد ميلادي، تاريخ عيد ميلادي، يوم عيد ميلادي، شهر عيد ميلادي، سنة عيد ميلادي، عمري في عيد ميلادي، كم سأبلغ، العمر القادم، السنة القادمة، الشهر القادم، الأسبوع القادم، غداً عيد ميلادي، اليوم عيد ميلادي، عيد ميلاد قريب، عيد ميلاد بعيد، حاسبة ميلادك للعد التنازلي، ميلادك عيد الميلاد، أدوات ميلادك للاحتفال، ميلادك تهنئة، ميلادك بطاقات، ميلادك احتفال، ميلادك مناسبات، ميلادك أعياد، حاسبة الأيام ميلادك، عداد ميلادك، countdown ميلادك، timer ميلادك، ساعة ميلادك، دقائق ميلادك، ثواني ميلادك، لحظات ميلادك، ذكريات ميلادك، أمنيات عيد ميلاد، رسائل عيد ميلاد، كلمات عيد ميلاد، عبارات عيد ميلاد، صور عيد ميلاد، فيديو عيد ميلاد، ستوري عيد ميلاد، بوست عيد ميلاد، تغريدة عيد ميلاد، حالة عيد ميلاد، birthday countdown arabic، حاسبة عربية عيد ميلاد، عد تنازلي عربي، كم يوم باقي، كم ساعة باقية، كم دقيقة باقية، الوقت المتبقي، المدة المتبقية، الفترة المتبقية
