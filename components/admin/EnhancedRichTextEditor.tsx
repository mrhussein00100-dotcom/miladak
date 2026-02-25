'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Code,
  Undo,
  Redo,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
  Type,
  Search,
  X,
  Loader2,
  Globe,
  Upload,
  TableOfContents,
  Sparkles,
  Palette,
  IndentIncrease,
  IndentDecrease,
  RotateCcw,
  Save,
  Zap,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
  Sliders,
} from 'lucide-react';
import ImageToolbar from './ImageToolbar';

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  autoFormat?: boolean;
  addTOC?: boolean;
  enableAutoImages?: boolean;
}

interface HistoryState {
  past: string[];
  present: string;
  future: string[];
}

interface FormattingState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  fontSize: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  currentHeading: string;
}

interface ContentStats {
  wordCount: number;
  characterCount: number;
  headingCount: number;
  readTime: number;
}

// تعريف معرفات الأدوات الفردية
type ToolId =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'paragraph'
  | 'unorderedList'
  | 'orderedList'
  | 'indent'
  | 'outdent'
  | 'alignRight'
  | 'alignCenter'
  | 'alignLeft'
  | 'alignJustify'
  | 'link'
  | 'image'
  | 'quote'
  | 'code'
  | 'toc'
  | 'autoFormat'
  | 'autoImages'
  | 'removeFormat'
  | 'undo'
  | 'redo';

// تعريف مجموعات الأدوات للعرض فقط
type ToolGroupId =
  | 'formatting'
  | 'headings'
  | 'lists'
  | 'alignment'
  | 'insert'
  | 'advanced'
  | 'history';

interface ToolbarPreferences {
  enabledTools: ToolId[];
  compactMode: boolean;
}

// قائمة كل الأدوات الافتراضية
const ALL_TOOLS: ToolId[] = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'h1',
  'h2',
  'h3',
  'paragraph',
  'unorderedList',
  'orderedList',
  'indent',
  'outdent',
  'alignRight',
  'alignCenter',
  'alignLeft',
  'alignJustify',
  'link',
  'image',
  'quote',
  'code',
  'toc',
  'autoFormat',
  'autoImages',
  'removeFormat',
  'undo',
  'redo',
];

export default function EnhancedRichTextEditor({
  value,
  onChange,
  placeholder = 'ابدأ الكتابة هنا...',
  minHeight = '500px',
  autoFormat = true,
  addTOC = true,
  enableAutoImages = true,
}: EnhancedRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // حالة الصور
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'search'>(
    'search'
  );
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // حالة الروابط
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // حفظ موضع المؤشر للإدراج
  const savedSelectionRef = useRef<Range | null>(null);

  // حالة التنسيق
  const [formattingState, setFormattingState] = useState<FormattingState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    fontSize: '16px',
    fontFamily: 'Arial',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    alignment: 'right',
    currentHeading: 'p',
  });

  // نظام التراجع والإعادة
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: value,
    future: [],
  });
  const isUndoRedo = useRef(false);

  // حالة الحفظ التلقائي
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'saved' | 'saving' | 'error'
  >('saved');

  // حالة شريط أدوات الصور
  const [selectedImageElement, setSelectedImageElement] =
    useState<HTMLImageElement | null>(null);

  // حالة تخصيص شريط الأدوات
  const [showToolbarCustomizer, setShowToolbarCustomizer] = useState(false);
  const [toolbarPreferences, setToolbarPreferences] =
    useState<ToolbarPreferences>(() => {
      // تحميل التفضيلات من localStorage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('editor-toolbar-preferences-v2');
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            // تجاهل الأخطاء
          }
        }
      }
      // الإعدادات الافتراضية - كل الأدوات مفعلة
      return {
        enabledTools: [...ALL_TOOLS],
        compactMode: false,
      };
    });

  // حفظ تفضيلات شريط الأدوات
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'editor-toolbar-preferences-v2',
        JSON.stringify(toolbarPreferences)
      );
    }
  }, [toolbarPreferences]);

  // تبديل أداة فردية
  const toggleTool = (toolId: ToolId) => {
    setToolbarPreferences((prev) => {
      const isEnabled = prev.enabledTools.includes(toolId);
      return {
        ...prev,
        enabledTools: isEnabled
          ? prev.enabledTools.filter((id) => id !== toolId)
          : [...prev.enabledTools, toolId],
      };
    });
  };

  // تفعيل/إلغاء كل أدوات مجموعة
  const toggleGroupTools = (groupTools: ToolId[], enable: boolean) => {
    setToolbarPreferences((prev) => {
      if (enable) {
        const newTools = [...new Set([...prev.enabledTools, ...groupTools])];
        return { ...prev, enabledTools: newTools };
      } else {
        return {
          ...prev,
          enabledTools: prev.enabledTools.filter(
            (t) => !groupTools.includes(t)
          ),
        };
      }
    });
  };

  // تبديل الوضع المضغوط
  const toggleCompactMode = () => {
    setToolbarPreferences((prev) => ({
      ...prev,
      compactMode: !prev.compactMode,
    }));
  };

  // إعادة تعيين التفضيلات
  const resetToolbarPreferences = () => {
    setToolbarPreferences({
      enabledTools: [...ALL_TOOLS],
      compactMode: false,
    });
  };

  // إحصائيات المحتوى
  const contentStats = useMemo((): ContentStats => {
    const text = value.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean);
    const headings = (value.match(/<h[1-6][^>]*>/gi) || []).length;

    return {
      wordCount: words.length,
      characterCount: text.length,
      headingCount: headings,
      readTime: Math.ceil(words.length / 200), // متوسط 200 كلمة في الدقيقة
    };
  }, [value]);

  // تحديث التاريخ عند تغيير القيمة
  useEffect(() => {
    if (!isUndoRedo.current && value !== history.present) {
      setHistory((prev) => ({
        past: [...prev.past.slice(-50), prev.present],
        present: value,
        future: [],
      }));
    }
    isUndoRedo.current = false;
  }, [value]);

  // الحفظ التلقائي
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (value && value !== history.present) {
        setAutoSaveStatus('saving');
        localStorage.setItem(
          'editor-autosave',
          JSON.stringify({
            content: value,
            timestamp: Date.now(),
          })
        );
        setTimeout(() => setAutoSaveStatus('saved'), 500);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [value]);

  // مزامنة المحتوى مع المحرر - مع منع الكتابة فوق التغييرات الجديدة
  const lastUpdateRef = useRef<number>(0);
  // علم لمنع المزامنة أثناء عمليات استبدال الصور
  const isImageReplacingRef = useRef<boolean>(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // تجنب الكتابة فوق التغييرات أثناء استبدال الصور
      if (isImageReplacingRef.current) {
        console.log('[Sync] Skipping sync - image replacement in progress');
        return;
      }

      // تجنب الكتابة فوق التغييرات الحديثة (خلال 1000ms)
      const now = Date.now();
      if (now - lastUpdateRef.current < 1000) {
        console.log('[Sync] Skipping sync - recent update detected');
        return;
      }

      // حفظ موضع المؤشر
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

      editorRef.current.innerHTML = value;

      // استعادة موضع المؤشر إذا كان المحرر مركزاً
      if (range && editorRef.current.contains(document.activeElement)) {
        try {
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch (e) {
          // تجاهل الأخطاء في استعادة المؤشر
        }
      }
    }
  }, [value]);

  // التراجع
  const handleUndo = useCallback(() => {
    if (history.past.length === 0) return;
    isUndoRedo.current = true;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    setHistory({
      past: newPast,
      present: previous,
      future: [history.present, ...history.future],
    });
    onChange(previous);
  }, [history, onChange]);

  // الإعادة
  const handleRedo = useCallback(() => {
    if (history.future.length === 0) return;
    isUndoRedo.current = true;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory({
      past: [...history.past, history.present],
      present: next,
      future: newFuture,
    });
    onChange(next);
  }, [history, onChange]);

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault();
              handleUndo();
            }
            break;
          case 'y':
          case 'Z':
            if (e.shiftKey) {
              e.preventDefault();
              handleRedo();
            }
            break;
          case 'b':
            e.preventDefault();
            execCommand('bold');
            break;
          case 'i':
            e.preventDefault();
            execCommand('italic');
            break;
          case 'u':
            e.preventDefault();
            execCommand('underline');
            break;
          case 'k':
            e.preventDefault();
            saveSelection();
            setShowLinkModal(true);
            break;
        }
      }

      // اختصارات العناوين
      if (e.ctrlKey && e.altKey) {
        const headingMap: { [key: string]: string } = {
          '1': 'h1',
          '2': 'h2',
          '3': 'h3',
          '4': 'h4',
          '5': 'h5',
          '6': 'h6',
        };

        if (headingMap[e.key]) {
          e.preventDefault();
          execCommand('formatBlock', `<${headingMap[e.key]}>`);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // البحث عن صور - محسّن لإرجاع نتائج أكثر
  const handleImageSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/search-images?q=${encodeURIComponent(searchQuery)}&count=24`
      );
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.images || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setSearchLoading(false);
  };

  // رفع صورة من الكمبيوتر
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة');
      return;
    }

    // التحقق من حجم الملف (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setSelectedImage(data.url);
      } else {
        alert(data.error || 'فشل في رفع الصورة');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('حدث خطأ أثناء رفع الصورة');
    }
    setUploading(false);
  };

  // تنفيذ أمر التنسيق
  const execCommand = useCallback(
    (command: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, val);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
        updateFormattingState();
      }
    },
    [onChange]
  );

  // تحديث حالة التنسيق
  const updateFormattingState = useCallback(() => {
    if (!editorRef.current) return;

    setFormattingState({
      isBold: document.queryCommandState('bold'),
      isItalic: document.queryCommandState('italic'),
      isUnderline: document.queryCommandState('underline'),
      isStrikethrough: document.queryCommandState('strikeThrough'),
      fontSize: document.queryCommandValue('fontSize') || '16px',
      fontFamily: document.queryCommandValue('fontName') || 'Arial',
      textColor: document.queryCommandValue('foreColor') || '#000000',
      backgroundColor: document.queryCommandValue('backColor') || '#ffffff',
      alignment: 'right', // افتراضي للعربية
      currentHeading: 'p',
    });
  }, []);

  // حفظ موضع المؤشر الحالي
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // التأكد من أن المؤشر داخل المحرر
      if (
        editorRef.current &&
        editorRef.current.contains(range.commonAncestorContainer)
      ) {
        savedSelectionRef.current = range.cloneRange();
      }
    }
  }, []);

  // استعادة موضع المؤشر المحفوظ
  const restoreSelection = useCallback(() => {
    if (savedSelectionRef.current && editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        try {
          selection.addRange(savedSelectionRef.current);
        } catch (e) {
          // إذا فشلت الاستعادة، ضع المؤشر في نهاية المحرر
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          selection.addRange(range);
        }
      }
    }
  }, []);

  // إدراج HTML في موضع المؤشر
  const insertHTML = useCallback(
    (html: string) => {
      // استعادة موضع المؤشر أولاً
      restoreSelection();

      // محاولة الإدراج باستخدام execCommand
      const success = document.execCommand('insertHTML', false, html);

      // إذا فشل execCommand، استخدم طريقة بديلة
      if (!success && editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();

          // إنشاء عنصر مؤقت لتحويل HTML إلى عقد DOM
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;

          // إدراج كل العقد
          const fragment = document.createDocumentFragment();
          while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
          }
          range.insertNode(fragment);

          // تحريك المؤشر بعد المحتوى المدرج
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // إذا لم يكن هناك تحديد، أضف في النهاية
          editorRef.current.innerHTML += html;
        }
      }

      editorRef.current?.focus();
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }

      // مسح المؤشر المحفوظ
      savedSelectionRef.current = null;
    },
    [onChange, restoreSelection]
  );

  // إدراج صورة
  const handleInsertImage = () => {
    const url = imageMode === 'url' ? imageUrl : selectedImage;
    if (url) {
      // إدراج الصورة بدون figcaption - فقط alt للسيو والوصول
      const html = `<figure class="my-6 text-center">
        <img src="${url}" alt="${
        imageAlt || 'صورة'
      }" class="max-w-full h-auto rounded-xl mx-auto shadow-lg" loading="lazy" />
      </figure>`;
      insertHTML(html);
      resetImageModal();
    }
  };

  const resetImageModal = () => {
    setImageUrl('');
    setImageAlt('');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedImage('');
    setShowImageModal(false);
  };

  // إدراج رابط
  const handleInsertLink = () => {
    if (linkUrl) {
      const text = linkText || linkUrl;
      const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 font-medium transition-colors">${text}</a>`;
      insertHTML(html);
      setLinkUrl('');
      setLinkText('');
      setShowLinkModal(false);
    }
  };

  // توليد جدول المحتويات
  const generateTOC = useCallback(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');

    if (headings.length === 0) {
      alert('لا توجد عناوين لإنشاء جدول المحتويات');
      return;
    }

    let tocHTML = `
<nav class="toc-container not-prose my-8 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-card dark:to-background rounded-2xl p-6 border border-primary/20 dark:border-border shadow-lg">
  <div class="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20 dark:border-border">
    <div class="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-md text-primary-foreground">
      <svg class="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
      </svg>
    </div>
    <div>
      <h3 class="text-xl font-bold text-foreground">📑 جدول المحتويات</h3>
      <p class="text-sm text-muted-foreground">${headings.length} قسم</p>
    </div>
  </div>
  <ul class="space-y-3">`;

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      const level = parseInt(heading.tagName.substring(1));
      const indent = (level - 1) * 20;
      const icons = ['📌', '📍', '🔸', '▪️', '•', '◦'];
      const icon = icons[level - 1] || '•';
      const textSize =
        level <= 2 ? 'text-base font-semibold' : 'text-sm font-medium';
      const textColor =
        level <= 2
          ? 'text-primary dark:text-primary'
          : 'text-muted-foreground';

      tocHTML += `
    <li style="padding-right: ${indent}px;" class="group">
      <a href="#${id}" class="${textSize} ${textColor} hover:text-primary/80 dark:hover:text-primary/80 flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-primary/10 dark:hover:bg-muted transition-all duration-200">
        <span class="opacity-70 group-hover:opacity-100 transition-opacity">${icon}</span>
        <span class="flex-1">${heading.textContent}</span>
      </a>
    </li>`;
    });

    tocHTML += `
  </ul>
</nav>`;

    // إضافة جدول المحتويات في البداية
    const newContent = tocHTML + tempDiv.innerHTML;
    onChange(newContent);
  }, [value, onChange]);

  // تطبيق التنسيق التلقائي الذكي
  const applyAutoFormat = useCallback(async () => {
    if (!value) return;

    try {
      // استيراد المنسق الذكي الجديد
      const { applyCompleteFormatting } = await import(
        '@/lib/utils/smartFormatter'
      );

      const formatted = applyCompleteFormatting(value, {
        addTOC,
      });

      onChange(formatted);
    } catch (error) {
      console.error('Auto format error:', error);
      // العودة للطريقة القديمة في حالة الخطأ
      try {
        const { processContent } = await import('@/lib/utils/contentFormatter');
        const formatted = processContent(value, {
          addTOC,
          formatStyles: autoFormat,
        });
        onChange(formatted);
      } catch (fallbackError) {
        console.error('Fallback format error:', fallbackError);
      }
    }
  }, [value, onChange, addTOC]);

  // إضافة صور تلقائية
  const addAutoImages = useCallback(async () => {
    if (!value || !enableAutoImages) return;

    try {
      // استخراج موضوع من المحتوى
      const text = value.replace(/<[^>]*>/g, '');
      const topic = text.substring(0, 100);

      const res = await fetch(
        `/api/search-images?q=${encodeURIComponent(topic)}&count=5`
      );
      const data = await res.json();

      if (data.success && data.images && data.images.length > 0) {
        const { insertImagesInContent } = await import(
          '@/lib/utils/contentFormatter'
        );
        const contentWithImages = insertImagesInContent(
          value,
          data.images,
          topic
        );
        onChange(contentWithImages);
      }
    } catch (error) {
      console.error('Auto images error:', error);
    }
  }, [value, onChange, enableAutoImages]);

  // تحديث المحتوى
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateFormattingState();
    }
  };

  // معالجة النقر على الصور في المحرر
  const handleEditorClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;

      // التحقق إذا كان العنصر المنقور عليه صورة
      if (target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();

        const imgElement = target as HTMLImageElement;

        // إزالة التحديد من الصورة السابقة إن وجدت
        if (selectedImageElement && selectedImageElement !== imgElement) {
          selectedImageElement.style.outline = '';
          selectedImageElement.style.outlineOffset = '';
        }

        // إضافة تأثير التحديد للصورة الجديدة
        imgElement.style.outline = '3px solid #3b82f6';
        imgElement.style.outlineOffset = '2px';
        imgElement.style.borderRadius = '8px';

        setSelectedImageElement(imgElement);
      } else {
        // إذا نقر على مكان آخر، إزالة التحديد
        if (selectedImageElement) {
          selectedImageElement.style.outline = '';
          selectedImageElement.style.outlineOffset = '';
          setSelectedImageElement(null);
        }
      }
    },
    [selectedImageElement]
  );

  // إغلاق شريط أدوات الصور
  const handleCloseImageToolbar = useCallback(() => {
    if (selectedImageElement) {
      selectedImageElement.style.outline = '';
      selectedImageElement.style.outlineOffset = '';
      setSelectedImageElement(null);
    }
  }, [selectedImageElement]);

  // مرجع للصورة المحددة حالياً - للحفاظ عليها أثناء عمليات الاستبدال
  const selectedImageRef = useRef<HTMLImageElement | null>(null);

  // تحديث المرجع عند تغيير الصورة المحددة
  useEffect(() => {
    selectedImageRef.current = selectedImageElement;
  }, [selectedImageElement]);

  // تحديث المحتوى بعد تعديل الصورة - حل جذري لمشكلة استبدال الصور
  const handleImageUpdate = useCallback(
    (newImageUrl?: string) => {
      if (!editorRef.current) return;

      try {
        // تفعيل علم منع المزامنة
        isImageReplacingRef.current = true;

        // استخدام المرجع المحفوظ للصورة
        const imgElement = selectedImageRef.current || selectedImageElement;

        console.log('[ImageUpdate] Called with:', {
          hasNewUrl: !!newImageUrl,
          newUrl: newImageUrl?.substring(0, 80),
          hasSelectedImage: !!imgElement,
          imgSrc: imgElement?.src?.substring(0, 80),
        });

        // تحديث وقت آخر تعديل لمنع الكتابة فوق التغييرات
        lastUpdateRef.current = Date.now();

        // إذا كان لدينا URL جديد وصورة محددة، نحدث الصورة مباشرة في DOM
        if (newImageUrl && imgElement) {
          console.log('[ImageUpdate] Updating image src directly in DOM');
          // حفظ الـ src القديم قبل التحديث
          const oldSrc = imgElement.src;
          imgElement.setAttribute('data-old-src', oldSrc);
          imgElement.src = newImageUrl;

          // التأكد من تحديث DOM
          console.log(
            '[ImageUpdate] DOM updated, new src:',
            imgElement.src?.substring(0, 80)
          );
        }

        // انتظار لضمان تحديث DOM
        setTimeout(() => {
          if (!editorRef.current) {
            isImageReplacingRef.current = false;
            return;
          }

          // تحديث وقت آخر تعديل مرة أخرى
          lastUpdateRef.current = Date.now();

          // قراءة المحتوى من DOM
          let finalContent = editorRef.current.innerHTML;

          console.log('[ImageUpdate] Content from DOM:', {
            length: finalContent.length,
            hasNewUrl: newImageUrl ? finalContent.includes(newImageUrl) : 'N/A',
          });

          // التحقق من أن الصورة الجديدة موجودة في المحتوى
          if (newImageUrl && !finalContent.includes(newImageUrl)) {
            console.warn(
              '[ImageUpdate] New URL not found in DOM, forcing update'
            );

            // البحث عن الصورة القديمة واستبدالها
            if (imgElement) {
              const oldSrc = imgElement.getAttribute('data-old-src') || '';
              if (oldSrc && finalContent.includes(oldSrc)) {
                finalContent = finalContent.replace(
                  new RegExp(
                    oldSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                    'g'
                  ),
                  newImageUrl
                );
                console.log(
                  '[ImageUpdate] Replaced old src with new src using regex'
                );
              } else {
                // محاولة البحث عن أي صورة وتحديثها
                const imgRegex = /<img([^>]*?)src="([^"]*)"([^>]*?)>/gi;
                let found = false;
                finalContent = finalContent.replace(
                  imgRegex,
                  (match, before, src, after) => {
                    if (!found && src !== newImageUrl) {
                      found = true;
                      console.log(
                        '[ImageUpdate] Replacing image src:',
                        src?.substring(0, 50),
                        '->',
                        newImageUrl?.substring(0, 50)
                      );
                      return `<img${before}src="${newImageUrl}"${after}>`;
                    }
                    return match;
                  }
                );
              }
            }
          }

          // تحديث React state
          console.log('[ImageUpdate] Calling onChange with updated content');
          onChange(finalContent);

          // تحديث التاريخ للتراجع
          setHistory((prev) => ({
            past: [...prev.past.slice(-50), prev.present],
            present: finalContent,
            future: [],
          }));

          // إزالة تحديد الصورة
          if (imgElement) {
            imgElement.style.outline = '';
            imgElement.style.outlineOffset = '';
            imgElement.removeAttribute('data-old-src');
          }
          setSelectedImageElement(null);
          selectedImageRef.current = null;

          console.log('[ImageUpdate] Update completed successfully');

          // إلغاء تفعيل علم منع المزامنة بعد فترة كافية
          setTimeout(() => {
            isImageReplacingRef.current = false;
            lastUpdateRef.current = Date.now();
          }, 500);
        }, 150);
      } catch (error) {
        console.error('[ImageUpdate] Error:', error);
        isImageReplacingRef.current = false;
        alert('حدث خطأ أثناء تحديث الصورة. يرجى المحاولة مرة أخرى.');
      }
    },
    [onChange, selectedImageElement]
  );

  // أزرار شريط الأدوات المحسن مع معرفات فردية
  const toolbarGroups = [
    {
      id: 'formatting' as ToolGroupId,
      name: 'تنسيق النص',
      toolIds: ['bold', 'italic', 'underline', 'strikethrough'] as ToolId[],
      buttons: [
        {
          toolId: 'bold' as ToolId,
          icon: Bold,
          command: 'bold',
          title: 'عريض (Ctrl+B)',
          active: formattingState.isBold,
        },
        {
          toolId: 'italic' as ToolId,
          icon: Italic,
          command: 'italic',
          title: 'مائل (Ctrl+I)',
          active: formattingState.isItalic,
        },
        {
          toolId: 'underline' as ToolId,
          icon: Underline,
          command: 'underline',
          title: 'تسطير (Ctrl+U)',
          active: formattingState.isUnderline,
        },
        {
          toolId: 'strikethrough' as ToolId,
          icon: Strikethrough,
          command: 'strikeThrough',
          title: 'يتوسطه خط',
          active: formattingState.isStrikethrough,
        },
      ],
    },
    {
      id: 'headings' as ToolGroupId,
      name: 'العناوين',
      toolIds: ['h1', 'h2', 'h3', 'paragraph'] as ToolId[],
      buttons: [
        {
          toolId: 'h1' as ToolId,
          icon: Heading1,
          command: 'formatBlock',
          value: 'h1',
          title: 'عنوان رئيسي (Ctrl+Alt+1)',
        },
        {
          toolId: 'h2' as ToolId,
          icon: Heading2,
          command: 'formatBlock',
          value: 'h2',
          title: 'عنوان فرعي (Ctrl+Alt+2)',
        },
        {
          toolId: 'h3' as ToolId,
          icon: Heading3,
          command: 'formatBlock',
          value: 'h3',
          title: 'عنوان صغير (Ctrl+Alt+3)',
        },
        {
          toolId: 'paragraph' as ToolId,
          icon: Type,
          command: 'formatBlock',
          value: 'p',
          title: 'فقرة عادية',
        },
      ],
    },
    {
      id: 'lists' as ToolGroupId,
      name: 'القوائم',
      toolIds: [
        'unorderedList',
        'orderedList',
        'indent',
        'outdent',
      ] as ToolId[],
      buttons: [
        {
          toolId: 'unorderedList' as ToolId,
          icon: List,
          command: 'insertUnorderedList',
          title: 'قائمة نقطية',
        },
        {
          toolId: 'orderedList' as ToolId,
          icon: ListOrdered,
          command: 'insertOrderedList',
          title: 'قائمة مرقمة',
        },
        {
          toolId: 'indent' as ToolId,
          icon: IndentIncrease,
          command: 'indent',
          title: 'زيادة المسافة البادئة',
        },
        {
          toolId: 'outdent' as ToolId,
          icon: IndentDecrease,
          command: 'outdent',
          title: 'تقليل المسافة البادئة',
        },
      ],
    },
    {
      id: 'alignment' as ToolGroupId,
      name: 'المحاذاة',
      toolIds: [
        'alignRight',
        'alignCenter',
        'alignLeft',
        'alignJustify',
      ] as ToolId[],
      buttons: [
        {
          toolId: 'alignRight' as ToolId,
          icon: AlignRight,
          command: 'justifyRight',
          title: 'محاذاة يمين',
        },
        {
          toolId: 'alignCenter' as ToolId,
          icon: AlignCenter,
          command: 'justifyCenter',
          title: 'توسيط',
        },
        {
          toolId: 'alignLeft' as ToolId,
          icon: AlignLeft,
          command: 'justifyLeft',
          title: 'محاذاة يسار',
        },
        {
          toolId: 'alignJustify' as ToolId,
          icon: AlignJustify,
          command: 'justifyFull',
          title: 'ضبط',
        },
      ],
    },
    {
      id: 'insert' as ToolGroupId,
      name: 'إدراج',
      toolIds: ['link', 'image', 'quote', 'code'] as ToolId[],
      buttons: [
        {
          toolId: 'link' as ToolId,
          icon: Link,
          action: () => {
            saveSelection();
            setShowLinkModal(true);
          },
          title: 'إدراج رابط (Ctrl+K)',
        },
        {
          toolId: 'image' as ToolId,
          icon: Image,
          action: () => {
            saveSelection();
            setShowImageModal(true);
          },
          title: 'إدراج صورة',
        },
        {
          toolId: 'quote' as ToolId,
          icon: Quote,
          command: 'formatBlock',
          value: 'blockquote',
          title: 'اقتباس',
        },
        {
          toolId: 'code' as ToolId,
          icon: Code,
          command: 'formatBlock',
          value: 'pre',
          title: 'كود',
        },
      ],
    },
    {
      id: 'advanced' as ToolGroupId,
      name: 'أدوات متقدمة',
      toolIds: ['toc', 'autoFormat', 'autoImages', 'removeFormat'] as ToolId[],
      buttons: [
        {
          toolId: 'toc' as ToolId,
          icon: TableOfContents,
          action: generateTOC,
          title: 'إنشاء جدول محتويات',
        },
        {
          toolId: 'autoFormat' as ToolId,
          icon: Sparkles,
          action: applyAutoFormat,
          title: 'تنسيق تلقائي',
        },
        {
          toolId: 'autoImages' as ToolId,
          icon: Zap,
          action: addAutoImages,
          title: 'إضافة صور تلقائية',
        },
        {
          toolId: 'removeFormat' as ToolId,
          icon: RotateCcw,
          command: 'removeFormat',
          title: 'إزالة التنسيق',
        },
      ],
    },
    {
      id: 'history' as ToolGroupId,
      name: 'التراجع والإعادة',
      toolIds: ['undo', 'redo'] as ToolId[],
      buttons: [
        {
          toolId: 'undo' as ToolId,
          icon: Undo,
          action: handleUndo,
          title: 'تراجع (Ctrl+Z)',
          disabled: history.past.length === 0,
        },
        {
          toolId: 'redo' as ToolId,
          icon: Redo,
          action: handleRedo,
          title: 'إعادة (Ctrl+Y)',
          disabled: history.future.length === 0,
        },
      ],
    },
  ];

  // تصفية الأدوات المفعلة فقط لكل مجموعة
  const getEnabledButtonsForGroup = (group: (typeof toolbarGroups)[0]) => {
    return group.buttons.filter((btn) =>
      toolbarPreferences.enabledTools.includes(btn.toolId)
    );
  };

  // التحقق إذا كانت المجموعة تحتوي على أدوات مفعلة
  const hasEnabledTools = (group: (typeof toolbarGroups)[0]) => {
    return group.buttons.some((btn) =>
      toolbarPreferences.enabledTools.includes(btn.toolId)
    );
  };

  // التحقق إذا كانت كل أدوات المجموعة مفعلة
  const isGroupFullyEnabled = (group: (typeof toolbarGroups)[0]) => {
    return group.buttons.every((btn) =>
      toolbarPreferences.enabledTools.includes(btn.toolId)
    );
  };

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4 flex flex-col'
    : 'relative';

  return (
    <div className={containerClass}>
      {/* شريط الأدوات المحسن */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-xl border border-gray-200 dark:border-gray-700 p-2 sm:p-3">
        {/* زر تخصيص شريط الأدوات + الأدوات */}
        <div className="flex flex-wrap items-center gap-1">
          {/* زر تخصيص الأدوات */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowToolbarCustomizer(!showToolbarCustomizer)}
              onMouseDown={(e) => e.preventDefault()}
              title="تخصيص شريط الأدوات"
              className={`p-2 rounded-lg transition-all duration-200 ${
                showToolbarCustomizer
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* قائمة تخصيص الأدوات */}
            {showToolbarCustomizer && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 p-3 max-h-[70vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    تخصيص الأدوات
                  </h4>
                  <button
                    onClick={() => setShowToolbarCustomizer(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {toolbarGroups.map((group) => {
                    const enabledCount = group.buttons.filter((btn) =>
                      toolbarPreferences.enabledTools.includes(btn.toolId)
                    ).length;
                    const isAllEnabled = enabledCount === group.buttons.length;
                    const isPartialEnabled = enabledCount > 0 && !isAllEnabled;

                    return (
                      <div
                        key={group.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        {/* رأس المجموعة */}
                        <div
                          className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() =>
                            toggleGroupTools(group.toolIds, !isAllEnabled)
                          }
                        >
                          <input
                            type="checkbox"
                            checked={isAllEnabled}
                            ref={(el) => {
                              if (el) el.indeterminate = isPartialEnabled;
                            }}
                            onChange={() =>
                              toggleGroupTools(group.toolIds, !isAllEnabled)
                            }
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">
                            {group.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {enabledCount}/{group.buttons.length}
                          </span>
                        </div>

                        {/* أدوات المجموعة */}
                        <div className="p-2 grid grid-cols-2 gap-1">
                          {group.buttons.map((btn) => {
                            const Icon = btn.icon;
                            const isEnabled =
                              toolbarPreferences.enabledTools.includes(
                                btn.toolId
                              );
                            return (
                              <label
                                key={btn.toolId}
                                className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                                  isEnabled
                                    ? 'bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary'
                                    : 'hover:bg-muted dark:hover:bg-muted/50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isEnabled}
                                  onChange={() => toggleTool(btn.toolId)}
                                  className="w-3.5 h-3.5 text-primary rounded focus:ring-primary"
                                />
                                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-foreground truncate">
                                  {btn.title.split(' (')[0]}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toolbarPreferences.compactMode}
                      onChange={toggleCompactMode}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      الوضع المضغوط
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setToolbarPreferences((prev) => ({
                          ...prev,
                          enabledTools: [],
                        }))
                      }
                      className="flex-1 text-xs text-center py-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      إخفاء الكل
                    </button>
                    <button
                      onClick={resetToolbarPreferences}
                      className="flex-1 text-xs text-center py-2 text-primary hover:text-primary/80 hover:bg-primary/10 dark:hover:bg-primary/20 rounded"
                    >
                      إظهار الكل
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* عرض الأدوات المفعلة فقط مجمعة حسب المجموعات */}
          {toolbarGroups.map((group, groupIdx) => {
            const enabledButtons = getEnabledButtonsForGroup(group);
            if (enabledButtons.length === 0) return null;

            return (
              <div
                key={group.id}
                className="flex items-center gap-0.5 sm:gap-1"
              >
                {enabledButtons.map((btn) => {
                  const Icon = btn.icon;
                  const isDisabled = 'disabled' in btn ? btn.disabled : false;
                  const isActive = 'active' in btn ? btn.active : false;
                  return (
                    <button
                      key={btn.toolId}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if ('action' in btn && btn.action) {
                          btn.action();
                        } else if ('command' in btn && btn.command) {
                          if ('value' in btn && btn.value) {
                            execCommand(btn.command, `<${btn.value}>`);
                          } else {
                            execCommand(btn.command);
                          }
                        }
                      }}
                      disabled={isDisabled}
                      title={btn.title}
                      className={`${
                        toolbarPreferences.compactMode ? 'p-1' : 'p-1.5 sm:p-2'
                      } rounded-lg transition-all duration-200 ${
                        isDisabled
                          ? 'opacity-30 cursor-not-allowed'
                          : isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'hover:bg-muted dark:hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <Icon
                        className={
                          toolbarPreferences.compactMode
                            ? 'w-3.5 h-3.5'
                            : 'w-3.5 h-3.5 sm:w-4 sm:h-4'
                        }
                      />
                    </button>
                  );
                })}
                {/* فاصل بين المجموعات */}
                {groupIdx < toolbarGroups.length - 1 &&
                  toolbarGroups
                    .slice(groupIdx + 1)
                    .some((g) => hasEnabledTools(g)) && (
                    <div className="w-px h-5 sm:h-6 bg-gray-300 dark:bg-gray-600 mx-1 sm:mx-2" />
                  )}
              </div>
            );
          })}

          <div className="flex-1" />

          {/* أزرار التحكم */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              onMouseDown={(e) => e.preventDefault()}
              title="إعدادات المحرر"
              className={`${
                toolbarPreferences.compactMode ? 'p-1' : 'p-1.5 sm:p-2'
              } rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors`}
            >
              <Settings
                className={
                  toolbarPreferences.compactMode
                    ? 'w-3.5 h-3.5'
                    : 'w-3.5 h-3.5 sm:w-4 sm:h-4'
                }
              />
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              onMouseDown={(e) => e.preventDefault()}
              title={isPreview ? 'تحرير' : 'معاينة'}
              className={`${
                toolbarPreferences.compactMode ? 'p-1' : 'p-1.5 sm:p-2'
              } rounded-lg transition-colors ${
                isPreview
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isPreview ? (
                <Edit3
                  className={
                    toolbarPreferences.compactMode
                      ? 'w-3.5 h-3.5'
                      : 'w-3.5 h-3.5 sm:w-4 sm:h-4'
                  }
                />
              ) : (
                <Eye
                  className={
                    toolbarPreferences.compactMode
                      ? 'w-3.5 h-3.5'
                      : 'w-3.5 h-3.5 sm:w-4 sm:h-4'
                  }
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              onMouseDown={(e) => e.preventDefault()}
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
              className={`${
                toolbarPreferences.compactMode ? 'p-1' : 'p-1.5 sm:p-2'
              } rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors`}
            >
              {isFullscreen ? (
                <Minimize2
                  className={
                    toolbarPreferences.compactMode
                      ? 'w-3.5 h-3.5'
                      : 'w-3.5 h-3.5 sm:w-4 sm:h-4'
                  }
                />
              ) : (
                <Maximize2
                  className={
                    toolbarPreferences.compactMode
                      ? 'w-3.5 h-3.5'
                      : 'w-3.5 h-3.5 sm:w-4 sm:h-4'
                  }
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* منطقة التحرير */}
      {isPreview ? (
        <div
          className="bg-white dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl p-6 prose prose-lg dark:prose-invert max-w-none overflow-auto flex-1"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onClick={handleEditorClick}
          onMouseUp={updateFormattingState}
          onKeyUp={updateFormattingState}
          onFocus={updateFormattingState}
          onBlur={updateFormattingState}
          onSelect={updateFormattingState}
          className="bg-white dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl p-6 prose prose-lg dark:prose-invert max-w-none focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto flex-1"
          style={{
            minHeight,
            cursor: 'text',
            userSelect: 'text',
            WebkitUserSelect: 'text',
            MozUserSelect: 'text',
          }}
          data-placeholder={placeholder}
          dir="rtl"
        />
      )}

      {/* شريط الحالة والإحصائيات */}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-medium">{contentStats.wordCount}</span>
            <span>كلمة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{contentStats.characterCount}</span>
            <span>حرف</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{contentStats.headingCount}</span>
            <span>عنوان</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{contentStats.readTime}</span>
            <span>دقيقة قراءة</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* حالة الحفظ التلقائي */}
          <div className="flex items-center gap-2">
            {autoSaveStatus === 'saving' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : autoSaveStatus === 'saved' ? (
              <>
                <Save className="w-4 h-4 text-green-500" />
                <span>تم الحفظ</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-500" />
                <span>خطأ في الحفظ</span>
              </>
            )}
          </div>

          {/* عدد التراجعات المتاحة */}
          {history.past.length > 0 && (
            <div className="flex items-center gap-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              <Undo className="w-3 h-3" />
              <span>{history.past.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal إدراج صورة محسن - مع دعم الرفع */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Image className="w-6 h-6 text-primary" />
                إدراج صورة
              </h3>
              <button
                onClick={resetImageModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* تبويبات - مع إضافة تبويب الرفع */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setImageMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  imageMode === 'upload'
                    ? 'text-primary border-b-2 border-primary bg-primary/5 dark:bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload className="w-4 h-4" />
                رفع من الجهاز
              </button>
              <button
                onClick={() => setImageMode('search')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  imageMode === 'search'
                    ? 'text-primary border-b-2 border-primary bg-primary/5 dark:bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Globe className="w-4 h-4" />
                بحث Pexels
              </button>
              <button
                onClick={() => setImageMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  imageMode === 'url'
                    ? 'text-primary border-b-2 border-primary bg-primary/5 dark:bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Link className="w-4 h-4" />
                رابط مباشر
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[60vh]">
              {/* تبويب الرفع من الجهاز */}
              {imageMode === 'upload' && (
                <div className="space-y-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex flex-col items-center justify-center gap-3 px-4 py-12 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors bg-muted/20"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-gray-500">جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                          اضغط لاختيار صورة من جهازك
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG, GIF, WebP حتى 5MB
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* تبويب البحث من Pexels */}
              {imageMode === 'search' && (
                <div className="space-y-6">
                  {/* حقل البحث */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleImageSearch()
                      }
                      placeholder="ابحث عن صور... (مثال: طبيعة، تكنولوجيا، طعام، عيد ميلاد)"
                      className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={handleImageSearch}
                      disabled={searchLoading || !searchQuery.trim()}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                      {searchLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      بحث
                    </button>
                  </div>

                  {/* نتائج البحث - شبكة أكبر */}
                  {searchResults.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {searchResults.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(url)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            selectedImage === url
                              ? 'border-primary ring-4 ring-primary/30 scale-105'
                              : 'border-transparent hover:border-muted-foreground/30 hover:scale-102'
                          }`}
                        >
                          <img
                            src={url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.length === 0 &&
                    searchQuery &&
                    !searchLoading && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">
                          لم يتم العثور على نتائج
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          جرب كلمات بحث مختلفة باللغة العربية أو الإنجليزية
                        </p>
                      </div>
                    )}
                </div>
              )}

              {/* تبويب الرابط المباشر */}
              {imageMode === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رابط الصورة *
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setSelectedImage(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* النص البديل */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  النص البديل (للسيو والوصول)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="وصف الصورة للقراء ومحركات البحث"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* معاينة الصورة المختارة */}
              {(selectedImage || imageUrl) && (
                <div className="mt-6 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    معاينة الصورة:
                  </p>
                  <img
                    src={selectedImage || imageUrl}
                    alt="معاينة"
                    className="max-h-48 mx-auto rounded-lg shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                type="button"
                onClick={resetImageModal}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!selectedImage && !imageUrl}
                className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
              >
                إدراج الصورة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal إدراج رابط */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Link className="w-5 h-5 text-primary" />
                إدراج رابط
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الرابط *
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نص الرابط
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="اضغط هنا"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl}
                className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
              >
                إدراج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal الإعدادات */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                إعدادات المحرر
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    التنسيق التلقائي
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    تطبيق تنسيق شامل على المحتوى تلقائياً
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoFormat}
                  onChange={(e) => {
                    // يمكن إضافة callback للتحديث
                  }}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    جدول المحتويات
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    إضافة جدول محتويات تلقائي للمقالات
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={addTOC}
                  onChange={(e) => {
                    // يمكن إضافة callback للتحديث
                  }}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    الصور التلقائية
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    إضافة صور مناسبة للموضوع تلقائياً
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableAutoImages}
                  onChange={(e) => {
                    // يمكن إضافة callback للتحديث
                  }}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* شريط أدوات الصور */}
      {selectedImageElement && !isPreview && (
        <ImageToolbar
          imageElement={selectedImageElement}
          onClose={handleCloseImageToolbar}
          onUpdate={handleImageUpdate}
        />
      )}
    </div>
  );
}
