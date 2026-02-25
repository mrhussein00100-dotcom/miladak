'use client';

import { useState } from 'react';
import { Search, Image, Upload, Link, X, Loader2 } from 'lucide-react';

interface ImagePickerProps {
  onSelect: (url: string) => void;
  currentImage?: string;
}

export default function ImagePicker({
  onSelect,
  currentImage,
}: ImagePickerProps) {
  const [mode, setMode] = useState<'url' | 'search'>('url');
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');

  // البحث عن صور من Pexels
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
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
    setLoading(false);
  };

  // تأكيد اختيار الصورة
  const handleConfirm = () => {
    if (previewUrl) {
      onSelect(previewUrl);
    }
  };

  return (
    <div className="space-y-4">
      {/* أزرار التبديل */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
            mode === 'url'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Link className="w-4 h-4" />
          رابط
        </button>
        <button
          type="button"
          onClick={() => setMode('search')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
            mode === 'search'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Search className="w-4 h-4" />
          بحث
        </button>
      </div>

      {/* إدخال الرابط */}
      {mode === 'url' && (
        <div className="space-y-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
          />
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
              placeholder="ابحث عن صور..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
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
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-auto">
              {searchResults.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPreviewUrl(url)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    previewUrl === url
                      ? 'border-blue-500'
                      : 'border-transparent'
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
        <div className="relative">
          <img
            src={previewUrl}
            alt="معاينة"
            className="w-full h-32 object-cover rounded-lg"
            onError={() => setPreviewUrl('')}
          />
          <button
            type="button"
            onClick={() => setPreviewUrl('')}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* زر التأكيد */}
      {previewUrl && (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          استخدام هذه الصورة
        </button>
      )}
    </div>
  );
}
