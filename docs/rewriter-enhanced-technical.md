# التوثيق التقني - الواجهة المحسنة لإعادة الصياغة

## نظرة عامة تقنية

تم تطوير الواجهة المحسنة لإعادة الصياغة باستخدام أحدث تقنيات React و TypeScript مع التركيز على الأداء وسهولة الصيانة.

## البنية التقنية

### 🏗️ هيكل المشروع

```
components/admin/rewriter/enhanced/
├── RewriterHeader.tsx          # مكون العنوان والإحصائيات
├── RewriterTabs.tsx           # مكون التبويبات
├── UrlInput.tsx               # مكون إدخال الروابط
├── RewriterSettings.tsx       # مكون الإعدادات
├── ContentArea.tsx            # مكون منطقة المحتوى
├── ActionButtons.tsx          # مكون أزرار التحكم
├── StatusMessages.tsx         # مكون رسائل الحالة
└── PerformanceMonitor.tsx     # مكون مراقبة الأداء

hooks/
└── useRewriterState.ts        # Hook إدارة الحالة

types/
└── rewriter-enhanced.ts       # تعريفات TypeScript

styles/
└── rewriter-enhanced.css      # أنماط CSS مخصصة

lib/utils/
├── performance.ts             # أدوات تحسين الأداء
└── errorHandler.ts           # معالجة الأخطاء

__tests__/
└── components/
    └── rewriter-enhanced.test.tsx  # اختبارات المكونات
```

### 🔧 التقنيات المستخدمة

| التقنية             | الإصدار | الغرض                |
| ------------------- | ------- | -------------------- |
| **React**           | 18+     | مكتبة واجهة المستخدم |
| **TypeScript**      | 5+      | نظام الأنواع         |
| **Next.js**         | 14+     | إطار العمل           |
| **Tailwind CSS**    | 3+      | تصميم الواجهة        |
| **Lucide React**    | Latest  | الأيقونات            |
| **Jest**            | Latest  | الاختبارات           |
| **Testing Library** | Latest  | اختبار المكونات      |

## المكونات الرئيسية

### 1. RewriterHeader

**الغرض**: عرض العنوان والإحصائيات الأساسية

```typescript
interface RewriterHeaderProps {
  sourceWordCount: number;
  rewrittenWordCount: number;
  isProcessing: boolean;
}
```

**الميزات**:

- عرض عدد الكلمات في الوقت الفعلي
- مؤشر حالة المعالجة
- تصميم متجاوب

### 2. RewriterTabs

**الغرض**: التبديل بين أنماط الإدخال

```typescript
interface RewriterTabsProps {
  activeTab: 'text' | 'url';
  onTabChange: (tab: 'text' | 'url') => void;
  disabled: boolean;
}
```

**الميزات**:

- تبويبات تفاعلية
- دعم لوحة المفاتيح
- حالات التعطيل

### 3. ContentArea

**الغرض**: عرض وتحرير المحتوى

```typescript
interface ContentAreaProps {
  sourceContent: string;
  rewrittenContent: string;
  isTextMode: boolean;
  onSourceChange: (content: string) => void;
  isLoading: boolean;
}
```

**الميزات**:

- تخطيط جنباً إلى جنب
- تمرير مستقل
- معاينة HTML

### 4. useRewriterState Hook

**الغرض**: إدارة حالة التطبيق المركزية

```typescript
interface RewriterState {
  sourceContent: string;
  rewrittenContent: string;
  externalUrl: string;
  activeTab: 'text' | 'url';
  isLoading: boolean;
  isFetching: boolean;
  settings: RewriteSettings;
  error: string | null;
  success: string | null;
  sourceWordCount: number;
  rewrittenWordCount: number;
}
```

**الوظائف المتاحة**:

- `setSourceContent(content: string)`
- `setExternalUrl(url: string)`
- `setActiveTab(tab: TabType)`
- `updateSettings(settings: Partial<RewriteSettings>)`
- `fetchFromUrl()`
- `rewriteContent()`
- `copyToClipboard()`
- `resetAll()`

## APIs المستخدمة

### 1. جلب المحتوى من الروابط

```typescript
POST /api/ai/fetch-article
Content-Type: application/json

{
  "url": "https://example.com/article"
}

Response:
{
  "success": true,
  "content": "المحتوى المجلب",
  "title": "عنوان المقال",
  "metadata": {
    "word_count": 500,
    "char_count": 2500,
    "images_found": 3
  }
}
```

### 2. إعادة الصياغة

```typescript
POST /api/ai/rewrite-article
Content-Type: application/json

{
  "content": "المحتوى الأصلي",
  "style": "professional",
  "targetLength": "same",
  "provider": "groq"
}

Response:
{
  "success": true,
  "rewritten_content": "المحتوى المُعاد صياغته",
  "metadata": {
    "model_used": "groq",
    "processing_time": 1500,
    "word_count": 480
  }
}
```

## تحسينات الأداء

### 1. Memoization

```typescript
// استخدام useMemo لحساب عدد الكلمات
const wordCount = useMemo(() => {
  return content.split(/\s+/).filter((w) => w.length > 0).length;
}, [content]);

// استخدام useCallback للوظائف
const handleRewrite = useCallback(async () => {
  // منطق إعادة الصياغة
}, [dependencies]);
```

### 2. Debouncing

```typescript
// تأخير استدعاءات API للبحث
const debouncedSearch = useDebounce(searchFunction, 300);
```

### 3. Lazy Loading

```typescript
// تحميل المكونات عند الحاجة
const PerformanceMonitor = lazy(() => import('./PerformanceMonitor'));
```

## معالجة الأخطاء

### 1. Error Boundaries

```typescript
class RewriterErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Rewriter Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### 2. API Error Handling

```typescript
try {
  const response = await fetch('/api/ai/rewrite-article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Unknown error');
  }

  return data;
} catch (error) {
  console.error('API Error:', error);
  setError(error.message);
  throw error;
}
```

## الاختبارات

### 1. Unit Tests

```typescript
describe('RewriterHeader', () => {
  it('displays correct word counts', () => {
    render(
      <RewriterHeader
        sourceWordCount={100}
        rewrittenWordCount={95}
        isProcessing={false}
      />
    );

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

```typescript
describe('Rewriter Workflow', () => {
  it('completes full rewrite process', async () => {
    // Mock API
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          rewritten_content: 'Rewritten text',
        }),
    });

    render(<RewriterPage />);

    // Add content
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Original text' },
    });

    // Click rewrite
    fireEvent.click(screen.getByText('إعادة الصياغة'));

    // Wait for result
    await waitFor(() => {
      expect(screen.getByText('Rewritten text')).toBeInTheDocument();
    });
  });
});
```

### 3. Performance Tests

```typescript
describe('Performance', () => {
  it('renders within acceptable time', () => {
    const startTime = performance.now();
    render(<RewriterPage />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

## إمكانية الوصول

### 1. ARIA Labels

```typescript
<button
  aria-label="إعادة صياغة المحتوى"
  aria-describedby="rewrite-help"
  disabled={!canRewrite}
>
  إعادة الصياغة
</button>
```

### 2. Keyboard Navigation

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
      if (event.ctrlKey) {
        handleRewrite();
      }
      break;
    case 'Escape':
      handleReset();
      break;
  }
};
```

### 3. Focus Management

```typescript
useEffect(() => {
  if (error) {
    errorRef.current?.focus();
  }
}, [error]);
```

## التخصيص والتوسيع

### 1. إضافة نموذج AI جديد

```typescript
// في types/rewriter-enhanced.ts
export type ProviderType =
  | 'groq'
  | 'gemini'
  | 'cohere'
  | 'huggingface'
  | 'new-model';

// في PROVIDER_LABELS
export const PROVIDER_LABELS: Record<ProviderType, string> = {
  // ... existing providers
  'new-model': 'New Model (Description)',
};
```

### 2. إضافة أسلوب كتابة جديد

```typescript
// في types/rewriter-enhanced.ts
export type StyleType =
  | 'professional'
  | 'simple'
  | 'creative'
  | 'academic'
  | 'new-style';

// في STYLE_LABELS
export const STYLE_LABELS: Record<StyleType, string> = {
  // ... existing styles
  'new-style': 'أسلوب جديد',
};
```

### 3. إضافة مكون جديد

```typescript
// إنشاء مكون جديد
interface NewComponentProps {
  // تعريف الخصائص
}

export default function NewComponent({ ...props }: NewComponentProps) {
  // منطق المكون
  return <div>{/* محتوى المكون */}</div>;
}

// إضافة المكون للصفحة الرئيسية
import NewComponent from './enhanced/NewComponent';

// في RewriterPage
<NewComponent {...props} />;
```

## نصائح للتطوير

### 1. أفضل الممارسات

- استخدم TypeScript للتحقق من الأنواع
- اكتب اختبارات للمكونات الجديدة
- استخدم ESLint و Prettier للتنسيق
- اتبع مبادئ SOLID في التصميم

### 2. تحسين الأداء

- استخدم React.memo للمكونات الثقيلة
- تجنب إعادة العرض غير الضرورية
- استخدم lazy loading للمكونات الكبيرة
- راقب استهلاك الذاكرة

### 3. الأمان

- تحقق من صحة جميع المدخلات
- استخدم HTTPS للاتصالات
- تجنب تخزين البيانات الحساسة في localStorage
- استخدم Content Security Policy

## استكشاف الأخطاء

### 1. مشاكل شائعة

#### خطأ في التحميل

```bash
# تحقق من التبعيات
npm install

# تحقق من إصدار Node.js
node --version

# امسح cache
npm cache clean --force
```

#### مشاكل TypeScript

```bash
# تحقق من تكوين TypeScript
npx tsc --noEmit

# إعادة بناء الأنواع
npm run build
```

#### مشاكل الاختبارات

```bash
# تشغيل الاختبارات
npm test

# تشغيل اختبار محدد
npm test -- --testNamePattern="RewriterHeader"
```

### 2. أدوات التشخيص

```typescript
// تفعيل وضع التطوير
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', debugData);
}

// مراقبة الأداء
const monitor = PerformanceMonitor.getInstance();
const stopTimer = monitor.startTimer('rewrite-operation');
// ... العملية
stopTimer();
```

## الخلاصة

الواجهة المحسنة لإعادة الصياغة تستخدم أحدث التقنيات وأفضل الممارسات لتقديم تجربة مستخدم ممتازة مع كود قابل للصيانة والتوسيع.

للمزيد من المعلومات أو المساعدة في التطوير، راجع الكود المصدري أو تواصل مع فريق التطوير.
