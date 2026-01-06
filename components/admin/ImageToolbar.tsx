'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
  Minimize,
  Type,
  RefreshCw,
  X,
  Search,
  Upload,
  Globe,
  Loader2,
  Move,
} from 'lucide-react';

interface ImageToolbarProps {
  imageElement: HTMLImageElement;
  onClose: () => void;
  onUpdate: (newImageUrl?: string) => void;
}

type ImageSize = 'small' | 'medium' | 'large' | 'full';
type ImageAlign = 'left' | 'center' | 'right';

export default function ImageToolbar({
  imageElement,
  onClose,
  onUpdate,
}: ImageToolbarProps) {
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showAltModal, setShowAltModal] = useState(false);
  const [altText, setAltText] = useState(imageElement.alt || '');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  // حساب موقع شريط الأدوات
  useEffect(() => {
    const updatePosition = () => {
      const rect = imageElement.getBoundingClientRect();
      const toolbarHeight = 50;

      // موقع فوق الصورة
      let top = rect.top - toolbarHeight - 10;
      let left = rect.left + rect.width / 2;

      // إذا كان الشريط سيخرج من أعلى الشاشة، ضعه أسفل الصورة
      if (top < 10) {
        top = rect.bottom + 10;
      }

      // تأكد من عدم خروجه من الجوانب
      const toolbarWidth = 400;
      if (left - toolbarWidth / 2 < 10) {
        left = toolbarWidth / 2 + 10;
      }
      if (left + toolbarWidth / 2 > window.innerWidth - 10) {
        left = window.innerWidth - toolbarWidth / 2 - 10;
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [imageElement]);

  // إغلاق عند النقر خارج الشريط
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node) &&
        e.target !== imageElement &&
        !showReplaceModal &&
        !showAltModal
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [imageElement, onClose, showReplaceModal, showAltModal]);

  // تغيير حجم الصورة
  const handleResize = (size: ImageSize) => {
    const figure = imageElement.closest('figure');
    const target = figure || imageElement;

    // إزالة الأحجام السابقة
    imageElement.classList.remove(
      'w-1/4',
      'w-1/2',
      'w-3/4',
      'w-full',
      'max-w-xs',
      'max-w-sm',
      'max-w-md',
      'max-w-lg',
      'max-w-xl',
      'max-w-full'
    );
    imageElement.style.width = '';
    imageElement.style.maxWidth = '';

    switch (size) {
      case 'small':
        imageElement.style.maxWidth = '300px';
        break;
      case 'medium':
        imageElement.style.maxWidth = '500px';
        break;
      case 'large':
        imageElement.style.maxWidth = '700px';
        break;
      case 'full':
        imageElement.style.maxWidth = '100%';
        imageElement.style.width = '100%';
        break;
    }

    onUpdate();
  };

  // تغيير محاذاة الصورة
  const handleAlign = (align: ImageAlign) => {
    const figure = imageElement.closest('figure');
    const target = figure || imageElement;

    // إزالة المحاذاة السابقة
    (target as HTMLElement).classList.remove(
      'mx-auto',
      'mr-auto',
      'ml-auto',
      'float-left',
      'float-right'
    );
    (target as HTMLElement).style.marginLeft = '';
    (target as HTMLElement).style.marginRight = '';
    (target as HTMLElement).style.display = '';

    switch (align) {
      case 'left':
        (target as HTMLElement).style.marginRight = 'auto';
        (target as HTMLElement).style.marginLeft = '0';
        (target as HTMLElement).style.display = 'block';
        break;
      case 'center':
        (target as HTMLElement).style.marginLeft = 'auto';
        (target as HTMLElement).style.marginRight = 'auto';
        (target as HTMLElement).style.display = 'block';
        break;
      case 'right':
        (target as HTMLElement).style.marginLeft = 'auto';
        (target as HTMLElement).style.marginRight = '0';
        (target as HTMLElement).style.display = 'block';
        break;
    }

    onUpdate();
  };

  // حذف الصورة
  const handleDelete = () => {
    if (confirm('هل تريد حذف هذه الصورة؟')) {
      const figure = imageElement.closest('figure');
      if (figure) {
        figure.remove();
      } else {
        imageElement.remove();
      }
      onUpdate();
      onClose();
    }
  };

  // تحديث النص البديل
  const handleUpdateAlt = () => {
    imageElement.alt = altText;
    setShowAltModal(false);
    onUpdate();
  };

  return (
    <>
      {/* شريط الأدوات الرئيسي - متجاوب مع الموبايل */}
      <div
        ref={toolbarRef}
        className="fixed z-[100] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 max-w-[95vw] overflow-x-auto"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
        }}
      >
        {/* الصف الأول - الأزرار الرئيسية */}
        <div className="flex items-center gap-1 flex-wrap justify-center min-w-max">
          {/* أزرار الحجم */}
          <div className="flex items-center gap-0.5 sm:gap-1 border-l border-gray-200 dark:border-gray-700 pl-1 sm:pl-2 ml-0.5 sm:ml-1">
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 px-0.5 sm:px-1 hidden sm:inline">
              الحجم:
            </span>
            <button
              onClick={() => handleResize('small')}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs"
              title="صغير"
            >
              S
            </button>
            <button
              onClick={() => handleResize('medium')}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs"
              title="متوسط"
            >
              M
            </button>
            <button
              onClick={() => handleResize('large')}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs"
              title="كبير"
            >
              L
            </button>
            <button
              onClick={() => handleResize('full')}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="عرض كامل"
            >
              <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* أزرار المحاذاة */}
          <div className="flex items-center gap-0.5 sm:gap-1 border-l border-gray-200 dark:border-gray-700 pl-1 sm:pl-2 ml-0.5 sm:ml-1">
            <button
              onClick={() => handleAlign('right')}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="محاذاة يمين"
            >
              <AlignRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => handleAlign('center')}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="توسيط"
            >
              <AlignCenter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => handleAlign('left')}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="محاذاة يسار"
            >
              <AlignLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* أزرار إضافية */}
          <div className="flex items-center gap-0.5 sm:gap-1 border-l border-gray-200 dark:border-gray-700 pl-1 sm:pl-2 ml-0.5 sm:ml-1">
            <button
              onClick={() => setShowAltModal(true)}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="تعديل النص البديل"
            >
              <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setShowReplaceModal(true)}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="استبدال الصورة"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* زر الحذف */}
          <button
            onClick={handleDelete}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
            title="حذف الصورة"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
            title="إغلاق"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Modal تعديل النص البديل */}
      {showAltModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              تعديل النص البديل (Alt)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              النص البديل مهم للسيو وإمكانية الوصول
            </p>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="وصف الصورة..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAltModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdateAlt}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal استبدال الصورة */}
      {showReplaceModal && (
        <ImageReplaceModal
          currentSrc={imageElement.src}
          onReplace={(newUrl) => {
            // حفظ الـ src القديم كـ data attribute قبل التحديث
            const oldSrc = imageElement.src;
            console.log('[ImageToolbar] Replacing image:', {
              oldSrc: oldSrc?.substring(0, 50),
              newSrc: newUrl?.substring(0, 50),
            });

            // حفظ الـ src القديم للاستخدام لاحقاً
            imageElement.setAttribute('data-old-src', oldSrc);

            // تحديث الصورة في DOM مباشرة
            imageElement.src = newUrl;

            // التأكد من تحديث الصورة
            console.log(
              '[ImageToolbar] Image src after update:',
              imageElement.src?.substring(0, 50)
            );

            // إغلاق Modal أولاً
            setShowReplaceModal(false);

            // تأخير أطول قبل استدعاء onUpdate للتأكد من تحديث DOM
            setTimeout(() => {
              console.log('[ImageToolbar] Calling onUpdate after delay');
              onUpdate(newUrl);
            }, 300);
          }}
          onClose={() => setShowReplaceModal(false)}
        />
      )}
    </>
  );
}

// مكون Modal استبدال الصورة
function ImageReplaceModal({
  currentSrc,
  onReplace,
  onClose,
}: {
  currentSrc: string;
  onReplace: (url: string) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'url' | 'search' | 'upload'>('search');
  const [imageUrl, setImageUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // البحث عن صور
  const handleSearch = async () => {
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

  // رفع صورة
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة');
      return;
    }

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

  const handleConfirm = () => {
    const url = mode === 'url' ? imageUrl : selectedImage;
    if (url) {
      setReplacing(true);
      console.log('[ImageReplaceModal] Replacing image:', {
        oldSrc: currentSrc?.substring(0, 50),
        newSrc: url?.substring(0, 50),
      });
      // تأخير بسيط للتأكد من إغلاق Modal قبل التحديث
      setTimeout(() => {
        onReplace(url);
      }, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            استبدال الصورة
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* تبويبات */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setMode('search')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium ${
              mode === 'search'
                ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Search className="w-4 h-4" />
            بحث
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium ${
              mode === 'upload'
                ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            رفع
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium ${
              mode === 'url'
                ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            رابط
          </button>
        </div>

        <div className="p-4 overflow-auto max-h-[60vh]">
          {/* البحث */}
          {mode === 'search' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="ابحث عن صور..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                />
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
                >
                  {searchLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {searchResults.map((url, idx) => (
                    <button
                      key={idx}
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
            </div>
          )}

          {/* الرفع */}
          {mode === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-500">جاري الرفع...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      اضغط لاختيار صورة
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* الرابط */}
          {mode === 'url' && (
            <div className="space-y-4">
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
          )}

          {/* معاينة */}
          {(selectedImage || imageUrl) && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">الصورة الحالية</p>
                <img
                  src={currentSrc}
                  alt=""
                  className="max-h-32 mx-auto rounded-lg opacity-50"
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">الصورة الجديدة</p>
                <img
                  src={selectedImage || imageUrl}
                  alt=""
                  className="max-h-32 mx-auto rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={replacing}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={(!selectedImage && !imageUrl) || replacing}
            className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {replacing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الاستبدال...
              </>
            ) : (
              'استبدال'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
