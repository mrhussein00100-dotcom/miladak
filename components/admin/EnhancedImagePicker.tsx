'use client';

import { useState, useRef } from 'react';
import { Search, Image, Upload, Link, X, Loader2, Globe } from 'lucide-react';

interface EnhancedImagePickerProps {
  onSelect: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function EnhancedImagePicker({
  onSelect,
  currentImage,
  label = 'اختر صورة',
}: EnhancedImagePickerProps) {
  const [mode, setMode] = useState<'upload' | 'url' | 'search'>('upload');
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setPreviewUrl(data.url);
        onSelect(data.url);
      } else {
        alert(data.error || 'فشل في رفع الصورة');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('حدث خطأ أثناء رفع الصورة');
    }
    setUploading(false);
  };

  // البحث عن صور من Pexels
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/images/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.images || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  // تأكيد اختيار الصورة من الرابط
  const handleUrlConfirm = () => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
      onSelect(imageUrl);
    }
  };

  // اختيار صورة من نتائج البحث
  const handleSelectFromSearch = (url: string) => {
    setPreviewUrl(url);
    onSelect(url);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {/* أزرار التبديل */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            mode === 'upload'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Upload className="w-4 h-4" />
          رفع
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            mode === 'url'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Globe className="w-4 h-4" />
          رابط
        </button>
        <button
          type="button"
          onClick={() => setMode('search')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            mode === 'search'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Search className="w-4 h-4" />
          Pexels
        </button>
      </div>

      {/* رفع من الكمبيوتر */}
      {mode === 'upload' && (
        <div className="space-y-3">
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
            className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-800"
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
                  اضغط لاختيار صورة من جهازك
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, GIF حتى 5MB
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* إدخال الرابط */}
      {mode === 'url' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
            />
            <button
              type="button"
              onClick={handleUrlConfirm}
              disabled={!imageUrl}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              تأكيد
            </button>
          </div>
        </div>
      )}

      {/* البحث عن صور */}
      {mode === 'search' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ابحث عن صور في Pexels..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* نتائج البحث */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-auto p-1">
              {searchResults.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectFromSearch(url)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    previewUrl === url
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

      {/* معاينة الصورة */}
      {previewUrl && (
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            الصورة المختارة:
          </div>
          <img
            src={previewUrl}
            alt="معاينة الصورة البارزة"
            className="w-full h-40 object-cover rounded-lg shadow-md"
            onError={(e) => {
              console.error('Image load error:', previewUrl);
              setPreviewUrl('');
            }}
            onLoad={() => console.log('Image loaded successfully:', previewUrl)}
          />
          <button
            type="button"
            onClick={() => {
              setPreviewUrl('');
              setImageUrl('');
              onSelect('');
            }}
            className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
            {previewUrl}
          </div>
        </div>
      )}

      {/* رسالة عدم وجود صورة */}
      {!previewUrl && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          لم يتم اختيار صورة بارزة
        </div>
      )}
    </div>
  );
}
