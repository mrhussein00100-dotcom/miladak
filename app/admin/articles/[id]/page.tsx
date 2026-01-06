'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Sparkles,
  RefreshCw,
  Eye,
  FileText,
  Wand2,
  Image,
  Palette,
  Code,
  Edit3,
  Trash2,
  Zap,
} from 'lucide-react';
import EnhancedImagePicker from '@/components/admin/EnhancedImagePicker';
import RichTextEditor from '@/components/admin/RichTextEditor';
import EnhancedRichTextEditor from '@/components/admin/EnhancedRichTextEditor';
import { processContent, extractHeadings } from '@/lib/utils/contentFormatter';

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // بيانات المقال
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [aiProvider, setAiProvider] = useState<string | null>(null);
  const [featuredImage, setFeaturedImage] = useState('');
  const [author, setAuthor] = useState('');
  const [showAuthor, setShowAuthor] = useState(false);

  // خيارات التنسيق
  const [autoFormat, setAutoFormat] = useState(true);
  const [addTOC, setAddTOC] = useState(true);
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const [addingImages, setAddingImages] = useState(false);

  // جلب المقال والتصنيفات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/articles/${id}`),
          fetch('/api/admin/categories'),
        ]);

        const articleData = await articleRes.json();
        const categoriesData = await categoriesRes.json();

        if (articleData.success) {
          const article = articleData.data;
          setTitle(article.title);
          setSlug(article.slug);
          setContent(article.content);
          setExcerpt(article.excerpt || '');
          setCategoryId(article.category_id);
          setPublished(article.published === 1);
          setFeatured(article.featured === 1);
          setMetaDescription(article.meta_description || '');
          setMetaKeywords(article.meta_keywords || '');
          setAiProvider(article.ai_provider);
          setFeaturedImage(article.featured_image || article.image || '');
          setAuthor(article.author || '');
          setShowAuthor(!!article.author);
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // توليد الميتا تلقائياً
  const handleGenerateMeta = async () => {
    if (!content) {
      alert('يرجى إدخال محتوى المقال أولاً');
      return;
    }

    try {
      const res = await fetch('/api/admin/ai/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, provider: 'gemini' }),
      });

      const data = await res.json();
      if (data.success) {
        setMetaDescription(data.data.metaDescription);
        setMetaKeywords(data.data.keywords.join(', '));
      }
    } catch (error) {
      console.error('Meta generation error:', error);
    }
  };

  // تنسيق المحتوى
  const handleFormatContent = () => {
    if (!content) return;
    const formatted = processContent(content, {
      addTOC,
      formatStyles: autoFormat,
    });
    setContent(formatted);
  };

  // إضافة صور تلقائية مناسبة للموضوع
  const handleAddAutoImages = async () => {
    if (!content && !title) {
      alert('يرجى إدخال عنوان أو محتوى أولاً');
      return;
    }

    setAddingImages(true);
    try {
      const searchTerm =
        title || content.replace(/<[^>]*>/g, '').substring(0, 100);
      const res = await fetch(
        `/api/search-images?q=${encodeURIComponent(searchTerm)}&count=5`
      );
      const data = await res.json();

      if (data.success && data.images && data.images.length > 0) {
        // إدراج الصور في المحتوى بطريقة بسيطة
        let updatedContent = content;
        const images = data.images;

        // إضافة صورة في البداية إذا لم توجد
        if (!updatedContent.includes('<img')) {
          const firstImage = `<figure class="my-6 text-center">
            <img src="${images[0]}" alt="${
            title || 'صورة توضيحية'
          }" class="w-full rounded-xl shadow-lg" loading="lazy" />
          </figure>`;

          // إدراج الصورة بعد أول فقرة أو عنوان
          const insertPoint = updatedContent.search(/<\/(?:p|h[1-6])>/i);
          if (insertPoint !== -1) {
            const insertIndex = updatedContent.indexOf('>', insertPoint) + 1;
            updatedContent =
              updatedContent.slice(0, insertIndex) +
              '\n\n' +
              firstImage +
              '\n\n' +
              updatedContent.slice(insertIndex);
          } else {
            updatedContent = firstImage + '\n\n' + updatedContent;
          }
        }

        setContent(updatedContent);

        if (!featuredImage && images[0]) {
          setFeaturedImage(images[0]);
        }

        alert('تم إضافة الصور بنجاح!');
      } else {
        alert('لم يتم العثور على صور مناسبة. جرب تغيير العنوان.');
      }
    } catch (error) {
      console.error('Error adding images:', error);
      alert('حدث خطأ أثناء إضافة الصور');
    }
    setAddingImages(false);
  };

  // إدراج صورة في المحتوى
  const handleInsertImage = (url: string) => {
    const imageHtml = `\n<figure class="my-6">\n  <img src="${url}" alt="صورة توضيحية" class="w-full rounded-xl" />\n</figure>\n`;
    setContent(content + imageHtml);
    setShowImagePicker(false);
  };

  // حفظ المقال
  const handleSave = async () => {
    if (!title || !content || !categoryId) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setSaving(true);
    try {
      // استخدام المحتوى كما هو بدون تنسيق إضافي عند الحفظ
      // التنسيق يتم فقط عند الضغط على زر "تنسيق المحتوى" يدوياً
      let finalContent = content;

      // التحقق من حجم المحتوى
      const contentSize = finalContent.length;
      if (contentSize > 5000000) {
        alert('حجم المحتوى كبير جداً. يرجى تقليل عدد الصور أو حجم المحتوى.');
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content: finalContent,
          excerpt,
          category_id: categoryId,
          published: published ? 1 : 0,
          featured: featured ? 1 : 0,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
          featured_image: featuredImage,
          author: showAuthor ? author : '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('تم حفظ المقال بنجاح');
      } else {
        // عرض رسالة خطأ مفصلة
        const errorMsg = data.error || 'فشل في حفظ المقال';
        const details = data.details ? `\n\nتفاصيل: ${data.details}` : '';
        alert(errorMsg + details);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.');
    }
    setSaving(false);
  };

  // حذف المقال
  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/articles');
      } else {
        alert(data.error || 'فشل في حذف المقال');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // عدد العناوين للمعاينة
  const headingsCount = extractHeadings(content).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/admin/articles"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-500" />
              تعديل المقال
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl hover:bg-red-200 text-sm"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">حذف</span>
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all text-sm ${
                showPreview
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">معاينة</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              حفظ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                عنوان المقال *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان المقال"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg"
              />
            </div>

            {/* Slug */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الرابط (slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="رابط-المقال"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              />
            </div>

            {/* Content Tools */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* تبديل نوع المحرر */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setEditorMode('visual')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      editorMode === 'visual'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    محرر مرئي
                  </button>
                  <button
                    onClick={() => setEditorMode('html')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      editorMode === 'html'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    HTML
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

                <button
                  onClick={() => setShowImagePicker(!showImagePicker)}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 text-xs sm:text-sm"
                >
                  <Image className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">إدراج صورة</span>
                  <span className="xs:hidden">صورة</span>
                </button>
                <button
                  onClick={handleFormatContent}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 text-xs sm:text-sm"
                >
                  <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">تنسيق المحتوى</span>
                  <span className="xs:hidden">تنسيق</span>
                </button>
                <button
                  onClick={handleAddAutoImages}
                  disabled={addingImages}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 text-xs sm:text-sm"
                >
                  {addingImages ? (
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span className="hidden xs:inline">صور تلقائية</span>
                  <span className="xs:hidden">صور</span>
                </button>
                <button
                  onClick={() => {
                    if (!content) return;
                    import('@/lib/utils/smartFormatter')
                      .then(({ applyCompleteFormatting }) => {
                        const formatted = applyCompleteFormatting(content, {
                          addTOC,
                        });
                        setContent(formatted);
                      })
                      .catch(console.error);
                  }}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 text-xs sm:text-sm"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">تنسيق ذكي</span>
                  <span className="xs:hidden">ذكي</span>
                </button>
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <input
                    type="checkbox"
                    id="autoFormat"
                    checked={autoFormat}
                    onChange={(e) => setAutoFormat(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="autoFormat"
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="hidden xs:inline">تنسيق تلقائي</span>
                    <span className="xs:hidden">تلقائي</span>
                  </label>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <input
                    type="checkbox"
                    id="addTOC"
                    checked={addTOC}
                    onChange={(e) => setAddTOC(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="addTOC"
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="hidden xs:inline">
                      جدول محتويات ({headingsCount} عنوان)
                    </span>
                    <span className="xs:hidden">فهرس ({headingsCount})</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image Picker */}
            {showImagePicker && (
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-sm sm:text-base">
                  إدراج صورة في المحتوى
                </h3>
                <EnhancedImagePicker onSelect={handleInsertImage} />
              </div>
            )}

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المحتوى *
              </label>
              {showPreview ? (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-900 rounded-xl min-h-[400px]"
                  dangerouslySetInnerHTML={{
                    __html: processContent(content, {
                      addTOC,
                      formatStyles: autoFormat,
                      useEnhancedFormatting: true,
                    }),
                  }}
                />
              ) : editorMode === 'visual' ? (
                <EnhancedRichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="ابدأ كتابة محتوى المقال..."
                  minHeight="500px"
                  autoFormat={autoFormat}
                  addTOC={addTOC}
                  enableAutoImages={true}
                />
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="أدخل محتوى المقال (HTML)"
                  rows={20}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-sm"
                  dir="ltr"
                />
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المقتطف
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="مقتطف قصير من المقال"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Featured Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Image className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                الصورة البارزة
              </h3>
              <EnhancedImagePicker
                onSelect={setFeaturedImage}
                currentImage={featuredImage}
                label=""
              />
            </div>

            {/* Category & Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">
                الإعدادات
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    التصنيف *
                  </label>
                  <select
                    value={categoryId || ''}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor="published"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    نشر المقال
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    مقال مميز
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showAuthor"
                    checked={showAuthor}
                    onChange={(e) => setShowAuthor(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor="showAuthor"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    إظهار اسم الكاتب
                  </label>
                </div>
                {showAuthor && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      اسم الكاتب
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="أدخل اسم الكاتب"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                  تحسين SEO
                </h3>
                <button
                  onClick={handleGenerateMeta}
                  className="text-xs sm:text-sm text-purple-500 hover:text-purple-600 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  توليد
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وصف الميتا
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="وصف قصير (160 حرف)"
                    rows={3}
                    maxLength={160}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {metaDescription.length}/160
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الكلمات المفتاحية
                  </label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="كلمة1, كلمة2, كلمة3"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* AI Info */}
            {aiProvider && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  {aiProvider === 'rewriter'
                    ? 'تم النقل من إعادة الصياغة'
                    : `تم التوليد بواسطة: ${aiProvider}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* زر الحفظ العائم */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="font-medium">جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span className="font-medium">حفظ المقال</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
