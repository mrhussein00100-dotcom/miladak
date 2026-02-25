# تصميم نظام التحرير والتنسيق المحسن

## نظرة عامة

يهدف هذا التصميم إلى تطوير نظام تحرير وتنسيق شامل للمقالات يوفر تجربة مشابهة لـ Microsoft Word مع تحسينات SEO وإضافة تلقائية للصور وجدول المحتويات.

## البنية المعمارية

### 1. طبقة المكونات (Components Layer)

```
components/admin/
├── EnhancedRichTextEditor.tsx     # المحرر المحسن الرئيسي
├── FormattingToolbar.tsx          # شريط أدوات التنسيق المتقدم
├── ContentProcessor.tsx           # معالج المحتوى والتنسيق
├── AutoImageInserter.tsx          # مدرج الصور التلقائي
├── TOCGenerator.tsx               # مولد جدول المحتويات
└── SEOOptimizer.tsx               # محسن SEO
```

### 2. طبقة المرافق (Utils Layer)

```
lib/utils/
├── enhancedFormatter.ts           # التنسيق المحسن الشامل
├── seoFormatter.ts                # تنسيق SEO المتقدم
├── tocGenerator.ts                # مولد جدول المحتويات المحسن
├── autoImageProcessor.ts          # معالج الصور التلقائي
└── editorHelpers.ts               # مساعدات المحرر
```

### 3. طبقة الخدمات (Services Layer)

```
lib/services/
├── contentAnalyzer.ts             # محلل المحتوى
├── imageSearchService.ts          # خدمة البحث عن الصور
├── seoAnalyzer.ts                 # محلل SEO
└── performanceOptimizer.ts        # محسن الأداء
```

## المكونات الأساسية

### 1. EnhancedRichTextEditor

المحرر الرئيسي المحسن الذي يوفر:

- شريط أدوات شامل مع جميع خيارات التنسيق
- دعم العناوين من H1 إلى H6
- قوائم متداخلة ومرقمة
- تنسيق النصوص (عريض، مائل، تسطير، ألوان)
- إدراج الروابط والصور
- اختصارات لوحة المفاتيح
- معاينة فورية
- حفظ تلقائي

### 2. FormattingToolbar

شريط أدوات متقدم يحتوي على:

```typescript
interface ToolbarButton {
  id: string;
  icon: React.ComponentType;
  title: string;
  action: () => void;
  shortcut?: string;
  group: 'text' | 'paragraph' | 'insert' | 'format';
}

const toolbarGroups = {
  text: ['bold', 'italic', 'underline', 'strikethrough', 'color', 'highlight'],
  paragraph: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'paragraph'],
  list: ['bulletList', 'numberedList', 'indent', 'outdent'],
  align: ['alignLeft', 'alignCenter', 'alignRight', 'justify'],
  insert: ['link', 'image', 'table', 'blockquote', 'code'],
  format: ['clearFormat', 'undo', 'redo'],
};
```

### 3. ContentProcessor

معالج المحتوى الذكي:

```typescript
interface ProcessingOptions {
  autoFormat: boolean;
  addTOC: boolean;
  insertImages: boolean;
  optimizeSEO: boolean;
  imageCount: number;
  tocMinHeadings: number;
}

class ContentProcessor {
  async processContent(
    content: string,
    options: ProcessingOptions
  ): Promise<string>;
  analyzeContent(content: string): ContentAnalysis;
  addSmartHeadings(content: string): string;
  optimizeStructure(content: string): string;
}
```

## نماذج البيانات

### 1. ContentAnalysis

```typescript
interface ContentAnalysis {
  wordCount: number;
  characterCount: number;
  headings: HeadingInfo[];
  readabilityScore: number;
  seoScore: number;
  suggestedImages: number;
  estimatedReadTime: number;
}

interface HeadingInfo {
  level: number;
  text: string;
  id: string;
  position: number;
}
```

### 2. FormattingState

```typescript
interface FormattingState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  fontSize: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  currentHeading: string;
}
```

### 3. EditorHistory

```typescript
interface EditorHistory {
  past: string[];
  present: string;
  future: string[];
  maxHistorySize: number;
}
```

## خوارزميات التنسيق

### 1. التنسيق التلقائي الذكي

```typescript
function smartAutoFormat(content: string): string {
  // 1. تحليل بنية المحتوى
  const structure = analyzeContentStructure(content);

  // 2. إضافة عناوين تلقائية
  if (structure.headings.length < 2) {
    content = addSmartHeadings(content);
  }

  // 3. تحسين الفقرات والقوائم
  content = optimizeParagraphs(content);
  content = enhanceLists(content);

  // 4. تطبيق تنسيق CSS محسن
  content = applySEOFriendlyFormatting(content);

  return content;
}
```

### 2. مولد جدول المحتويات المحسن

```typescript
function generateEnhancedTOC(content: string): TOCResult {
  const headings = extractHeadings(content);

  if (headings.length < 2) {
    return { toc: '', contentWithIds: content };
  }

  // إنشاء هيكل هرمي للعناوين
  const tocStructure = buildTOCHierarchy(headings);

  // إنشاء HTML لجدول المحتويات
  const tocHTML = renderTOC(tocStructure);

  // إضافة IDs للعناوين
  const contentWithIds = addHeadingIds(content, headings);

  return { toc: tocHTML, contentWithIds };
}
```

### 3. إدراج الصور التلقائي

```typescript
async function autoInsertImages(
  content: string,
  topic: string,
  count: number
): Promise<string> {
  // 1. تحليل المحتوى لاستخراج الكلمات المفتاحية
  const keywords = extractKeywords(content, topic);

  // 2. البحث عن صور مناسبة
  const images = await searchRelevantImages(keywords, count);

  // 3. إدراج الصور في المواضع المناسبة
  const contentWithImages = insertImagesAtOptimalPositions(content, images);

  return contentWithImages;
}
```

## تحسين SEO

### 1. تحليل SEO

```typescript
interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: string[];
  metaOptimization: MetaOptimization;
}

interface SEOIssue {
  type: 'warning' | 'error';
  message: string;
  fix: string;
}
```

### 2. تحسين البنية

```typescript
function optimizeForSEO(content: string): string {
  // 1. إضافة Schema.org markup
  content = addSchemaMarkup(content);

  // 2. تحسين العناوين للSEO
  content = optimizeHeadingsForSEO(content);

  // 3. إضافة alt text للصور
  content = addImageAltText(content);

  // 4. تحسين الروابط الداخلية
  content = optimizeInternalLinks(content);

  return content;
}
```

## واجهة المستخدم

### 1. تخطيط المحرر

```
┌─────────────────────────────────────────────────────────┐
│ شريط الأدوات الرئيسي                                      │
├─────────────────────────────────────────────────────────┤
│ أدوات التنسيق السريع | معاينة | ملء الشاشة | إعدادات      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                منطقة التحرير                             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ إحصائيات المحتوى | حالة الحفظ | تحليل SEO                │
└─────────────────────────────────────────────────────────┘
```

### 2. شريط الأدوات المتقدم

```typescript
const advancedToolbar = {
  textFormatting: {
    bold: { icon: Bold, shortcut: 'Ctrl+B' },
    italic: { icon: Italic, shortcut: 'Ctrl+I' },
    underline: { icon: Underline, shortcut: 'Ctrl+U' },
    strikethrough: { icon: Strikethrough, shortcut: 'Ctrl+Shift+X' },
  },
  headings: {
    h1: { icon: Heading1, shortcut: 'Ctrl+Alt+1' },
    h2: { icon: Heading2, shortcut: 'Ctrl+Alt+2' },
    h3: { icon: Heading3, shortcut: 'Ctrl+Alt+3' },
  },
  lists: {
    bulletList: { icon: List, shortcut: 'Ctrl+Shift+8' },
    numberedList: { icon: ListOrdered, shortcut: 'Ctrl+Shift+7' },
  },
  insert: {
    link: { icon: Link, shortcut: 'Ctrl+K' },
    image: { icon: Image, shortcut: 'Ctrl+Shift+I' },
    table: { icon: Table, shortcut: 'Ctrl+Shift+T' },
  },
};
```

## معالجة الأخطاء

### 1. التعامل مع أخطاء التنسيق

```typescript
class FormattingErrorHandler {
  handleError(error: FormattingError): void {
    switch (error.type) {
      case 'INVALID_HTML':
        this.sanitizeContent(error.content);
        break;
      case 'MISSING_IMAGES':
        this.showImageSearchFallback();
        break;
      case 'SEO_ISSUES':
        this.showSEOSuggestions(error.issues);
        break;
    }
  }
}
```

### 2. استرداد المحتوى

```typescript
class ContentRecovery {
  autoSave(content: string): void {
    localStorage.setItem(
      'editor-autosave',
      JSON.stringify({
        content,
        timestamp: Date.now(),
      })
    );
  }

  recoverContent(): string | null {
    const saved = localStorage.getItem('editor-autosave');
    if (saved) {
      const { content, timestamp } = JSON.parse(saved);
      // استرداد المحتوى إذا كان أحدث من 5 دقائق
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return content;
      }
    }
    return null;
  }
}
```

## تحسين الأداء

### 1. التحميل التدريجي

```typescript
const LazyEditor = lazy(() => import('./EnhancedRichTextEditor'));

function EditorWrapper() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <LazyEditor />
    </Suspense>
  );
}
```

### 2. تحسين العمليات

```typescript
// استخدام debounce للعمليات المكلفة
const debouncedAutoSave = useMemo(
  () =>
    debounce((content: string) => {
      autoSave(content);
    }, 1000),
  []
);

// تحسين معالجة الصور
const optimizedImageProcessor = useMemo(
  () =>
    new ImageProcessor({
      maxConcurrentRequests: 3,
      cacheSize: 50,
      compressionQuality: 0.8,
    }),
  []
);
```

## الاختبار

### 1. اختبارات الوحدة

```typescript
describe('ContentProcessor', () => {
  test('should add smart headings to plain text', () => {
    const plainText = 'This is content without headings...';
    const result = addSmartHeadings(plainText);
    expect(result).toContain('<h2>');
  });

  test('should generate TOC for content with headings', () => {
    const content = '<h2>Section 1</h2><h3>Subsection</h3>';
    const { toc } = generateTOC(content);
    expect(toc).toContain('محتويات المقال');
  });
});
```

### 2. اختبارات التكامل

```typescript
describe('Enhanced Editor Integration', () => {
  test('should process content with all features enabled', async () => {
    const editor = new EnhancedRichTextEditor();
    const result = await editor.processContent(sampleContent, {
      autoFormat: true,
      addTOC: true,
      insertImages: true,
      optimizeSEO: true,
    });

    expect(result).toContain('toc-container');
    expect(result).toContain('<img');
    expect(result).toContain('itemProp=');
  });
});
```

## الأمان

### 1. تنظيف المحتوى

```typescript
import DOMPurify from 'dompurify';

function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'strong',
      'em',
      'u',
      'ol',
      'ul',
      'li',
      'a',
      'img',
      'blockquote',
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'class',
      'id',
      'itemProp',
      'itemScope',
      'itemType',
    ],
  });
}
```

### 2. التحقق من الصور

```typescript
function validateImageUrl(url: string): boolean {
  const allowedDomains = ['pexels.com', 'unsplash.com', 'pixabay.com'];
  try {
    const urlObj = new URL(url);
    return allowedDomains.some((domain) => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}
```

هذا التصميم يوفر أساساً قوياً لنظام تحرير وتنسيق شامل يلبي جميع المتطلبات المحددة مع التركيز على الأداء وتجربة المستخدم.
