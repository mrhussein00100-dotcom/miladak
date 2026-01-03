'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
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
} from 'lucide-react';
import ImageToolbar from './ImageToolbar';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// نظام التراجع والإعادة
interface HistoryState {
  past: string[];
  present: string;
  future: string[];
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'اكتب المحتوى هنا...',
  minHeight = '400px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

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

  // حالة شريط أدوات الصور
  const [selectedImageElement, setSelectedImageElement] =
    useState<HTMLImageElement | null>(null);

  // نظام التراجع والإعادة
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: value,
    future: [],
  });
  const isUndoRedo = useRef(false);

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
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          handleRedo();
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
        `/api/search-images?q=${encodeURIComponent(searchQuery)}`
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
      editorRef.current?.focus();
      document.execCommand(command, false, val);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    },
    [onChange]
  );

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
      // إدراج الصورة بدون figcaption - فقط alt للسيو والوصول
      const html = `<figure class="my-4"><img src="${url}" alt="${
        imageAlt || 'صورة'
      }" class="max-w-full h-auto rounded-lg mx-auto" /></figure>`;
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
      const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${text}</a>`;
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
    const headings = tempDiv.querySelectorAll('h1, h2, h3');

    if (headings.length === 0) {
      alert('لا توجد عناوين لإنشاء جدول المحتويات');
      return;
    }

    let tocHTML =
      '<nav class="toc bg-gray-50 dark:bg-gray-800 rounded-xl p-4 my-6 border border-gray-200 dark:border-gray-700"><h4 class="font-bold text-lg mb-3">📑 جدول المحتويات</h4><ul class="space-y-2">';

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      const level = heading.tagName.toLowerCase();
      const indent = level === 'h1' ? '' : level === 'h2' ? 'mr-4' : 'mr-8';
      tocHTML += `<li class="${indent}"><a href="#${id}" class="text-blue-500 hover:underline">${heading.textContent}</a></li>`;
    });

    tocHTML += '</ul></nav>';

    // إضافة جدول المحتويات في البداية
    const newContent = tocHTML + tempDiv.innerHTML;
    onChange(newContent);
  }, [value, onChange]);

  // تحديث المحتوى
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // معالجة النقر على الصور
  const handleEditorClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;

      // التحقق إذا كان العنصر المنقور عليه صورة
      if (target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();

        const imgElement = target as HTMLImageElement;

        // إضافة تأثير التحديد
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

  // تحديث المحتوى بعد تعديل الصورة
  const handleImageUpdate = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // أزرار شريط الأدوات
  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'عريض' },
    { icon: Italic, command: 'italic', title: 'مائل' },
    { icon: Underline, command: 'underline', title: 'تسطير' },
    { type: 'divider' },
    {
      icon: Heading1,
      command: 'formatBlock',
      value: 'h1',
      title: 'عنوان رئيسي',
    },
    {
      icon: Heading2,
      command: 'formatBlock',
      value: 'h2',
      title: 'عنوان فرعي',
    },
    {
      icon: Heading3,
      command: 'formatBlock',
      value: 'h3',
      title: 'عنوان صغير',
    },
    { icon: Type, command: 'formatBlock', value: 'p', title: 'فقرة' },
    { type: 'divider' },
    { icon: List, command: 'insertUnorderedList', title: 'قائمة نقطية' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'قائمة مرقمة' },
    { type: 'divider' },
    { icon: AlignRight, command: 'justifyRight', title: 'محاذاة يمين' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'توسيط' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'محاذاة يسار' },
    { type: 'divider' },
    {
      icon: Quote,
      command: 'formatBlock',
      value: 'blockquote',
      title: 'اقتباس',
    },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'كود' },
    { type: 'divider' },
    { icon: Link, action: () => setShowLinkModal(true), title: 'إدراج رابط' },
    { icon: Image, action: () => setShowImageModal(true), title: 'إدراج صورة' },
    { icon: TableOfContents, action: generateTOC, title: 'جدول محتويات' },
    { type: 'divider' },
    {
      icon: Undo,
      action: handleUndo,
      title: 'تراجع',
      disabled: history.past.length === 0,
    },
    {
      icon: Redo,
      action: handleRedo,
      title: 'إعادة',
      disabled: history.future.length === 0,
    },
  ];

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4 flex flex-col'
    : 'relative';

  return (
    <div className={containerClass}>
      {/* شريط الأدوات */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-t-xl border border-gray-200 dark:border-gray-700 p-2 flex flex-wrap items-center gap-1">
        {toolbarButtons.map((btn, idx) => {
          if (btn.type === 'divider') {
            return (
              <div
                key={idx}
                className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"
              />
            );
          }
          const Icon = btn.icon!;
          return (
            <button
              key={idx}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (btn.action) btn.action();
                else if (btn.command) {
                  if (btn.value) execCommand(btn.command, `<${btn.value}>`);
                  else execCommand(btn.command);
                }
              }}
              disabled={btn.disabled}
              title={btn.title}
              className={`p-2 rounded-lg transition-colors ${
                btn.disabled
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              } text-gray-700 dark:text-gray-300`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}

        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          onMouseDown={(e) => e.preventDefault()}
          title={isPreview ? 'تحرير' : 'معاينة'}
          className={`p-2 rounded-lg transition-colors ${
            isPreview
              ? 'bg-blue-500 text-white'
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
          onMouseDown={(e) => e.preventDefault()}
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
          onClick={handleEditorClick}
          dangerouslySetInnerHTML={{ __html: value }}
          className="bg-white dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl p-6 prose prose-lg dark:prose-invert max-w-none focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto flex-1"
          style={{ minHeight }}
          data-placeholder={placeholder}
          dir="rtl"
        />
      )}

      {/* Modal إدراج صورة محسن */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                إدراج صورة
              </h3>
              <button
                onClick={resetImageModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* تبويبات */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setImageMode('search')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium ${
                  imageMode === 'search'
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                بحث من الإنترنت
              </button>
              <button
                onClick={() => setImageMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium ${
                  imageMode === 'url'
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Upload className="w-4 h-4" />
                رابط مباشر
              </button>
            </div>

            <div className="p-4 overflow-auto max-h-[60vh]">
              {imageMode === 'search' ? (
                <div className="space-y-4">
                  {/* حقل البحث */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleImageSearch()
                      }
                      placeholder="ابحث بالعربية أو الإنجليزية... (مثال: طبيعة، nature)"
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                    />
                    <button
                      onClick={handleImageSearch}
                      disabled={searchLoading || !searchQuery.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
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
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {searchResults.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(url)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === url
                              ? 'border-blue-500 ring-2 ring-blue-300'
                              : 'border-transparent hover:border-gray-300'
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
                      <p className="text-center text-gray-500 py-8">
                        لم يتم العثور على نتائج. جرب كلمات بحث مختلفة.
                      </p>
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
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                  </div>
                </div>
              )}

              {/* النص البديل */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  النص البديل (للسيو)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="وصف الصورة للقراء ومحركات البحث"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                />
              </div>

              {/* معاينة الصورة المختارة */}
              {(selectedImage || imageUrl) && (
                <div className="mt-4 border rounded-xl p-2 bg-gray-50 dark:bg-gray-900">
                  <img
                    src={selectedImage || imageUrl}
                    alt="معاينة"
                    className="max-h-48 mx-auto rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={resetImageModal}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!selectedImage && !imageUrl}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                إدراج الصورة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal إدراج رابط */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              إدراج رابط
            </h3>
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
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
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
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                إدراج
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

      {/* إحصائيات */}
      <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>
            {
              value
                .replace(/<[^>]*>/g, '')
                .split(/\s+/)
                .filter(Boolean).length
            }{' '}
            كلمة
          </span>
          <span>{value.replace(/<[^>]*>/g, '').length} حرف</span>
        </div>
        <div className="flex items-center gap-2">
          {history.past.length > 0 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {history.past.length} تراجع متاح
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// دالة مساعدة لتنسيق المحتوى المولد بالذكاء الاصطناعي
export function formatAIContent(content: string): string {
  // تنظيف المحتوى
  let formatted = content.replace(/\n{3,}/g, '\n\n').trim();

  // إذا لم يكن HTML، حوله
  if (!formatted.includes('<')) {
    const paragraphs = formatted.split('\n\n');
    formatted = paragraphs
      .map((p) => {
        p = p.trim();
        if (!p) return '';
        // تحويل العناوين
        if (p.startsWith('# ')) return `<h1>${p.slice(2)}</h1>`;
        if (p.startsWith('## ')) return `<h2>${p.slice(3)}</h2>`;
        if (p.startsWith('### ')) return `<h3>${p.slice(4)}</h3>`;
        // تحويل القوائم
        if (p.startsWith('- ') || p.startsWith('* ')) {
          const items = p
            .split('\n')
            .map((item) => `<li>${item.slice(2)}</li>`)
            .join('');
          return `<ul>${items}</ul>`;
        }
        // فقرة عادية
        return `<p>${p}</p>`;
      })
      .filter(Boolean)
      .join('\n');
  }

  return formatted;
}

// دالة لإنشاء جدول محتويات من HTML
export function generateTableOfContents(html: string): {
  toc: string;
  contentWithIds: string;
} {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const headings = tempDiv.querySelectorAll('h1, h2, h3');

  if (headings.length === 0) {
    return { toc: '', contentWithIds: html };
  }

  let tocHTML =
    '<nav class="toc bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 my-6 border border-blue-100 dark:border-gray-600">';
  tocHTML +=
    '<h4 class="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white">📑 جدول المحتويات</h4>';
  tocHTML += '<ul class="space-y-2">';

  headings.forEach((heading, index) => {
    const id = `section-${index + 1}`;
    heading.id = id;
    const level = heading.tagName.toLowerCase();
    const indent = level === 'h1' ? '' : level === 'h2' ? 'mr-4' : 'mr-8';
    const icon = level === 'h1' ? '📌' : level === 'h2' ? '📍' : '•';
    tocHTML += `<li class="${indent}"><a href="#${id}" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">${icon} ${heading.textContent}</a></li>`;
  });

  tocHTML += '</ul></nav>';

  return { toc: tocHTML, contentWithIds: tempDiv.innerHTML };
}
