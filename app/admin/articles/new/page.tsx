'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  List,
  Palette,
  Code,
  Edit3,
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

export default function NewArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showAI = searchParams.get('ai') === 'true';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(showAI);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // بيانات المقال
  const [title, setTitle] = useState('');
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

  // بيانات التوليد بالذكاء الاصطناعي
  const [aiTopic, setAiTopic] = useState('');
  const [aiLength, setAiLength] = useState<
    'short' | 'medium' | 'long' | 'comprehensive'
  >('medium');
  const [aiStyle, setAiStyle] = useState<
    'formal' | 'casual' | 'seo' | 'academic'
  >('formal');
  const [selectedProvider, setSelectedProvider] = useState<
    | 'gemini'
    | 'groq'
    | 'cohere'
    | 'huggingface'
    | 'local'
    | 'sona'
    | 'sona-enhanced'
    | 'sona-v5'
    | 'sona-v6'
  >('sona-v6');
  const [aiKeywords, setAiKeywords] = useState('');
  const [includeImages, setIncludeImages] = useState(true);
  const [imageCount, setImageCount] = useState<number | 'auto'>('auto'); // تلقائي بناءً على حجم المقال
  const [providersStatus, setProvidersStatus] = useState<
    Record<string, boolean>
  >({
    gemini: false,
    groq: false,
    cohere: false,
    huggingface: false,
    local: true,
    sona: true,
    'sona-enhanced': true,
    'sona-v5': true,
    'sona-v6': true,
  });

  // جلب التصنيفات وحالة المزودين والبيانات المنقولة
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0) {
            setCategoryId(data.data[0].id);
          }
        }
      });

    fetch('/api/admin/ai/generate')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.providers) {
          const status: Record<string, boolean> = {};
          data.data.providers.forEach((p: any) => {
            status[p.id] = p.available;
          });
          setProvidersStatus(status);
        }
      });

    try {
      const transferData = sessionStorage.getItem('articleTransfer');
      if (transferData) {
        const data = JSON.parse(transferData);
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - data.timestamp < oneHour) {
          setTitle(data.title || '');
          setContent(data.content || '');
          setMetaDescription(data.metaDescription || '');
          setMetaKeywords(data.keywords?.join(', ') || '');
          setExcerpt(data.metaDescription || '');
          setAiProvider('rewriter');
          sessionStorage.removeItem('articleTransfer');
        }
      }
    } catch (e) {
      console.error('Error loading transfer data:', e);
    }
  }, []);

  // توليد المقال بالذكاء الاصطناعي
  const handleGenerate = async () => {
    if (!aiTopic) {
      alert('يرجى إدخال موضوع المقال');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          length: aiLength,
          provider: selectedProvider,
          style: aiStyle,
          category: categories.find((c) => c.id === categoryId)?.name,
          keywords: aiKeywords
            .split(',')
            .map((k) => k.trim())
            .filter((k) => k),
          includeImages,
          imageCount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTitle(data.data.title);
        setContent(data.data.content);
        setMetaDescription(data.data.metaDescription);
        setMetaKeywords(data.data.keywords.join(', '));
        setAiProvider(data.data.provider);
        setExcerpt(data.data.metaDescription);
        if (data.data.coverImage) {
          setFeaturedImage(data.data.coverImage);
        }
        setShowAIPanel(false);
      } else {
        alert(data.error || 'فشل في توليد المقال');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('حدث خطأ أثناء التوليد');
    }
    setGenerating(false);
  };

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
      // استخراج الكلمات المفتاحية من العنوان أو المحتوى
      const searchTerm =
        title || content.replace(/<[^>]*>/g, '').substring(0, 100);

      // البحث عن صور من Pexels
      const res = await fetch(
        `/api/images/search?q=${encodeURIComponent(searchTerm)}&count=5`
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

        // تعيين أول صورة كصورة بارزة إذا لم تكن موجودة
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

  // إدراج صورة في المحتوى - يتم إضافتها في نهاية المحتوى
  // ملاحظة: لإدراج الصورة في موقع المؤشر، استخدم المحرر المرئي المحسن
  const handleInsertImage = (url: string) => {
    const imageHtml = `\n<figure class="my-6">\n  <img src="${url}" alt="صورة توضيحية" class="w-full rounded-xl" />\n</figure>\n`;

    // إضافة الصورة في نهاية المحتوى
    setContent((prevContent) => prevContent + imageHtml);
    setShowImagePicker(false);
  };

  // حفظ المقال
  const handleSave = async () => {
    if (!title || !content || !categoryId) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      // تنسيق المحتوى قبل الحفظ إذا كان الخيار مفعلاً
      let finalContent = content;
      if (autoFormat) {
        finalContent = processContent(content, {
          addTOC,
          formatStyles: true,
          useEnhancedFormatting: true,
        });
      }

      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: finalContent,
          excerpt,
          category_id: categoryId,
          published: published ? 1 : 0,
          featured: featured ? 1 : 0,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
          ai_provider: aiProvider,
          featured_image: featuredImage,
          author: showAuthor ? author : '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/articles');
      } else {
        alert(data.error || 'فشل في حفظ المقال');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
    setLoading(false);
  };

  // عدد العناوين للمعاينة
  const headingsCount = extractHeadings(content).length;

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
              مقال جديد
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href="/admin/rewriter"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-all text-sm"
            >
              ✨ <span className="hidden xs:inline">إعادة الصياغة</span>
              <span className="xs:hidden">صياغة</span>
            </Link>
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all text-sm ${
                showAIPanel
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">توليد AI</span>
              <span className="xs:hidden">AI</span>
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
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              حفظ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* AI Panel */}
          {showAIPanel && (
            <div className="lg:col-span-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200 dark:border-purple-800">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                توليد المقال بالذكاء الاصطناعي
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    موضوع المقال
                  </label>
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="مثال: عيد ميلاد سعيد لمواليد برج الحمل"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المزود
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <option value="sona-v6">🌟 SONA 6.0 (المنسق الذكي)</option>
                    <option value="sona-v5">⭐ SONA 5.0</option>
                    <option value="sona-enhanced">🚀 SONA 4.01</option>
                    <option value="sona">🟢 SONA v4</option>
                    <option value="groq">
                      {providersStatus.groq ? '🟢' : '🔴'} Groq
                    </option>
                    <option value="gemini">
                      {providersStatus.gemini ? '🟢' : '🔴'} Gemini
                    </option>
                    <option value="cohere">
                      {providersStatus.cohere ? '🟢' : '🔴'} Cohere
                    </option>
                    <option value="huggingface">
                      {providersStatus.huggingface ? '🟢' : '🔴'} HuggingFace
                    </option>
                    <option value="local">🟢 Local AI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الطول
                  </label>
                  <select
                    value={aiLength}
                    onChange={(e) => setAiLength(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <option value="short">قصير (500 كلمة)</option>
                    <option value="medium">متوسط (1500 كلمة)</option>
                    <option value="long">طويل (3000 كلمة)</option>
                    <option value="comprehensive">شامل (5000+ كلمة)</option>
                  </select>
                </div>
                <div className="lg:col-span-4">
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !aiTopic}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        توليد المقال
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
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

            {/* Content Tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  title="إضافة صورة في نهاية المحتوى. لإدراج في موقع المؤشر، استخدم زر الصورة في المحرر المرئي"
                >
                  <Image className="w-4 h-4" />
                  صورة +
                </button>
                <button
                  onClick={handleFormatContent}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                >
                  <Palette className="w-4 h-4" />
                  تنسيق المحتوى
                </button>
                <button
                  onClick={handleAddAutoImages}
                  disabled={addingImages}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50"
                >
                  {addingImages ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  صور تلقائية
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
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                >
                  <Zap className="w-4 h-4" />
                  تنسيق ذكي
                </button>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <input
                    type="checkbox"
                    id="autoFormat"
                    checked={autoFormat}
                    onChange={(e) => setAutoFormat(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="autoFormat"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    تنسيق تلقائي
                  </label>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <input
                    type="checkbox"
                    id="addTOC"
                    checked={addTOC}
                    onChange={(e) => setAddTOC(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="addTOC"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    جدول محتويات ({headingsCount} عنوان)
                  </label>
                </div>
              </div>
            </div>

            {/* Image Picker */}
            {showImagePicker && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  إدراج صورة في المحتوى
                </h3>
                <EnhancedImagePicker onSelect={handleInsertImage} />
              </div>
            )}

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-500" />
                الصورة البارزة
              </h3>
              <EnhancedImagePicker
                onSelect={setFeaturedImage}
                currentImage={featuredImage}
                label=""
              />
            </div>

            {/* Category & Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                الإعدادات
              </h3>
              <div className="space-y-4">
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  تحسين SEO
                </h3>
                <button
                  onClick={handleGenerateMeta}
                  className="text-sm text-purple-500 hover:text-purple-600 flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  توليد
                </button>
              </div>
              <div className="space-y-4">
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
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {aiProvider === 'rewriter'
                    ? 'تم النقل من إعادة الصياغة'
                    : `تم التوليد بواسطة: ${aiProvider}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
