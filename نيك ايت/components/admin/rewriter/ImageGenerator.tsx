'use client';

/**
 * مكون توليد الصور
 */

import { useState } from 'react';
import type { GeneratedImage, ImageStyle } from '@/types/rewriter';

interface ImageGeneratorProps {
  content: string;
  onImagesGenerated: (images: GeneratedImage[]) => void;
}

const IMAGE_STYLES: { id: ImageStyle; label: string; icon: string }[] = [
  { id: 'realistic', label: 'واقعية', icon: '📷' },
  { id: 'illustration', label: 'رسوم توضيحية', icon: '🎨' },
  { id: 'diagram', label: 'مخططات', icon: '📊' },
];

export default function ImageGenerator({
  content,
  onImagesGenerated,
}: ImageGeneratorProps) {
  const [count, setCount] = useState(2);
  const [style, setStyle] = useState<ImageStyle>('realistic');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!content) {
      setError('المحتوى مطلوب لتوليد الصور');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/ai/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, count, style }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'فشل في توليد الصور');
        return;
      }

      setImages(data.images);
      onImagesGenerated(data.images);
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (index: number) => {
    // إعادة توليد صورة واحدة
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, count: 1, style }),
      });

      const data = await response.json();

      if (data.success && data.images.length > 0) {
        const newImages = [...images];
        newImages[index] = data.images[0];
        setImages(newImages);
        onImagesGenerated(newImages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* إعدادات التوليد */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            عدد الصور
          </label>
          <select
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            النمط
          </label>
          <div className="flex gap-2">
            {IMAGE_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                disabled={loading}
                className={`
                  px-3 py-2 rounded-lg text-sm transition-colors
                  ${
                    style === s.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !content}
          className={`
            px-6 py-2 rounded-lg font-medium text-white transition-all
            ${
              loading || !content
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600'
            }
          `}
        >
          {loading ? '⏳ جاري التوليد...' : '🖼️ توليد الصور'}
        </button>
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* عرض الصور */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.thumbnailUrl || image.url}
                alt={image.alt}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => handleRegenerate(index)}
                  disabled={loading}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                  title="إعادة توليد"
                >
                  🔄
                </button>
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                  title="عرض"
                >
                  👁️
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
