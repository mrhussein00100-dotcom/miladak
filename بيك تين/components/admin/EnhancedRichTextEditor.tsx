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
} from 'lucide-react';

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
  const [imageMode, setImageMode] = useState<'url' | 'search'>('search');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // حالة الروابط
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

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

  // البحث عن صور
  const handleImageSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/images/search?q=${encodeURIComponent(searchQuery)}&count=12`
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

  // تنفيذ أمر التنسيق
  const execCommand = useCallback(
    (command: string, val?: string) => {
      document.execCommand(command, false, val);
      editorRef.current?.focus();
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

  // إدراج HTML
  const insertHTML = useCallback(
    (html: string) => {
      document.execCommand('insertHTML', false, html);
      editorRef.current?.focus();
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    },
    [onChange]
  );

  // إدراج صورة
  const handleInsertImage = () => {
    const url = imageMode === 'url' ? imageUrl : selectedImage;
    if (url) {
      const html = `<figure class="my-6 text-center">
        <img src="${url}" alt="${
        imageAlt || 'صورة'
      }" class="max-w-full h-auto rounded-xl mx-auto shadow-lg" loading="lazy" />
        ${
          imageAlt
            ? `<figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 italic">${imageAlt}</figcaption>`
            : ''
        }
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
      const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 font-medium transition-colors">${text}</a>`;
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
<nav class="toc-container not-prose my-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700 shadow-lg">
  <div class="flex items-center gap-3 mb-6 pb-4 border-b border-blue-200 dark:border-gray-600">
    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
      </svg>
    </div>
    <div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">📑 جدول المحتويات</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">${headings.length} قسم</p>
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
          ? 'text-blue-700 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400';

      tocHTML += `
    <li style="padding-right: ${indent}px;" class="group">
      <a href="#${id}" class="${textSize} ${textColor} hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200">
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
        `/api/images/search?q=${encodeURIComponent(topic)}&count=5`
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

  // أزرار شريط الأدوات المحسن
  const toolbarGroups = [
    {
      name: 'تنسيق النص',
      buttons: [
        {
          icon: Bold,
          command: 'bold',
          title: 'عريض (Ctrl+B)',
          active: formattingState.isBold,
        },
        {
          icon: Italic,
          command: 'italic',
          title: 'مائل (Ctrl+I)',
          active: formattingState.isItalic,
        },
        {
          icon: Underline,
          command: 'underline',
          title: 'تسطير (Ctrl+U)',
          active: formattingState.isUnderline,
        },
        {
          icon: Strikethrough,
          command: 'strikeThrough',
          title: 'يتوسطه خط',
          active: formattingState.isStrikethrough,
        },
      ],
    },
    {
      name: 'العناوين',
      buttons: [
        {
          icon: Heading1,
          command: 'formatBlock',
          value: 'h1',
          title: 'عنوان رئيسي (Ctrl+Alt+1)',
        },
        {
          icon: Heading2,
          command: 'formatBlock',
          value: 'h2',
          title: 'عنوان فرعي (Ctrl+Alt+2)',
        },
        {
          icon: Heading3,
          command: 'formatBlock',
          value: 'h3',
          title: 'عنوان صغير (Ctrl+Alt+3)',
        },
        { icon: Type, command: 'formatBlock', value: 'p', title: 'فقرة عادية' },
      ],
    },
    {
      name: 'القوائم والمحاذاة',
      buttons: [
        { icon: List, command: 'insertUnorderedList', title: 'قائمة نقطية' },
        {
          icon: ListOrdered,
          command: 'insertOrderedList',
          title: 'قائمة مرقمة',
        },
        {
          icon: IndentIncrease,
          command: 'indent',
          title: 'زيادة المسافة البادئة',
        },
        {
          icon: IndentDecrease,
          command: 'outdent',
          title: 'تقليل المسافة البادئة',
        },
      ],
    },
    {
      name: 'المحاذاة',
      buttons: [
        { icon: AlignRight, command: 'justifyRight', title: 'محاذاة يمين' },
        { icon: AlignCenter, command: 'justifyCenter', title: 'توسيط' },
        { icon: AlignLeft, command: 'justifyLeft', title: 'محاذاة يسار' },
        { icon: AlignJustify, command: 'justifyFull', title: 'ضبط' },
      ],
    },
    {
      name: 'إدراج',
      buttons: [
        {
          icon: Link,
          action: () => setShowLinkModal(true),
          title: 'إدراج رابط (Ctrl+K)',
        },
        {
          icon: Image,
          action: () => setShowImageModal(true),
          title: 'إدراج صورة',
        },
        {
          icon: Quote,
          command: 'formatBlock',
          value: 'blockquote',
          title: 'اقتباس',
        },
        { icon: Code, command: 'formatBlock', value: 'pre', title: 'كود' },
      ],
    },
    {
      name: 'أدوات متقدمة',
      buttons: [
        {
          icon: TableOfContents,
          action: generateTOC,
          title: 'إنشاء جدول محتويات',
        },
        { icon: Sparkles, action: applyAutoFormat, title: 'تنسيق تلقائي' },
        { icon: Zap, action: addAutoImages, title: 'إضافة صور تلقائية' },
        { icon: RotateCcw, command: 'removeFormat', title: 'إزالة التنسيق' },
      ],
    },
    {
      name: 'التراجع والإعادة',
      buttons: [
        {
          icon: Undo,
          action: handleUndo,
          title: 'تراجع (Ctrl+Z)',
          disabled: history.past.length === 0,
        },
        {
          icon: Redo,
          action: handleRedo,
          title: 'إعادة (Ctrl+Y)',
          disabled: history.future.length === 0,
        },
      ],
    },
  ];

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4 flex flex-col'
    : 'relative';

  return (
    <div className={containerClass}>
      {/* شريط الأدوات المحسن */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-xl border border-gray-200 dark:border-gray-700 p-3">
        {/* الصف الأول - أدوات التنسيق الأساسية */}
        <div className="flex flex-wrap items-center gap-1 mb-2">
          {toolbarGroups.slice(0, 4).map((group, groupIdx) => (
            <div key={groupIdx} className="flex items-center gap-1">
              {group.buttons.map((btn, idx) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (btn.action) btn.action();
                      else if (btn.command) {
                        if (btn.value)
                          execCommand(btn.command, `<${btn.value}>`);
                        else execCommand(btn.command);
                      }
                    }}
                    disabled={btn.disabled}
                    title={btn.title}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      btn.disabled
                        ? 'opacity-30 cursor-not-allowed'
                        : btn.active
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
              {groupIdx < 3 && (
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* الصف الثاني - أدوات متقدمة وإعدادات */}
        <div className="flex flex-wrap items-center gap-1">
          {toolbarGroups.slice(4).map((group, groupIdx) => (
            <div key={groupIdx + 4} className="flex items-center gap-1">
              {group.buttons.map((btn, idx) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (btn.action) btn.action();
                      else if (btn.command) {
                        if (btn.value)
                          execCommand(btn.command, `<${btn.value}>`);
                        else execCommand(btn.command);
                      }
                    }}
                    disabled={btn.disabled}
                    title={btn.title}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      btn.disabled
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
              {groupIdx < 2 && (
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              )}
            </div>
          ))}

          <div className="flex-1" />

          {/* أزرار التحكم */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              title="إعدادات المحرر"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              title={isPreview ? 'تحرير' : 'معاينة'}
              className={`p-2 rounded-lg transition-colors ${
                isPreview
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isPreview ? (
                <Edit3 className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
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
          onInput={handleInput}
          onMouseUp={updateFormattingState}
          onKeyUp={updateFormattingState}
          dangerouslySetInnerHTML={{ __html: value }}
          className="bg-white dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl p-6 prose prose-lg dark:prose-invert max-w-none focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto flex-1"
          style={{ minHeight }}
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

      {/* Modal إدراج صورة محسن */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Image className="w-6 h-6 text-blue-500" />
                إدراج صورة
              </h3>
              <button
                onClick={resetImageModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* تبويبات */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setImageMode('search')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  imageMode === 'search'
                    ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                بحث من الإنترنت
              </button>
              <button
                onClick={() => setImageMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  imageMode === 'url'
                    ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Upload className="w-4 h-4" />
                رابط مباشر
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[60vh]">
              {imageMode === 'search' ? (
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
                      placeholder="ابحث عن صور... (مثال: طبيعة، تكنولوجيا، طعام)"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleImageSearch}
                      disabled={searchLoading || !searchQuery.trim()}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                      {searchLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      بحث
                    </button>
                  </div>

                  {/* نتائج البحث */}
                  {searchResults.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {searchResults.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(url)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            selectedImage === url
                              ? 'border-blue-500 ring-4 ring-blue-300 scale-105'
                              : 'border-transparent hover:border-gray-300 hover:scale-102'
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
                          جرب كلمات بحث مختلفة
                        </p>
                      </div>
                    )}
                </div>
              ) : (
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="flex-1 px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
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
                <Link className="w-5 h-5 text-blue-500" />
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
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
                <Settings className="w-5 h-5 text-blue-500" />
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
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
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
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
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
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
