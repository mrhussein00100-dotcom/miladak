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
} from 'lucide-react';

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

  // بيانات التوليد بالذكاء الاصطناعي
  const [aiTopic, setAiTopic] = useState('');
  const [aiLength, setAiLength] = useState<
    'short' | 'medium' | 'long' | 'comprehensive'
  >('medium');
  const [aiStyle, setAiStyle] = useState<
    'formal' | 'casual' | 'seo' | 'academic'
  >('formal');
  const [selectedProvider, setSelectedProvider] = useState<
    'gemini' | 'groq' | 'cohere' | 'huggingface' | 'local' | 'sona'
  >('sona'); // SONA كافتراضي
  const [aiKeywords, setAiKeywords] = useState('');
  const [includeImages, setIncludeImages] = useState(true);
  const [imageCount, setImageCount] = useState(3);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [providersStatus, setProvidersStatus] = useState<
    Record<string, boolean>
  >({
    gemini: false,
    groq: false,
    cohere: false,
    huggingface: false,
    local: true,
    sona: true, // SONA دائماً متاح
  });

  // جلب التصنيفات وحالة المزودين
  useEffect(() => {
    // جلب التصنيفات
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

    // جلب حالة المزودين
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
          setCoverImage(data.data.coverImage);
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

  // حفظ المقال
  const handleSave = async () => {
    if (!title || !content || !categoryId) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          category_id: categoryId,
          published: published ? 1 : 0,
          featured: featured ? 1 : 0,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
          ai_provider: aiProvider,
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/articles"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-7 h-7 text-purple-500" />
              مقال جديد
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                showAIPanel
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              توليد بالذكاء الاصطناعي
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              حفظ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Panel */}
          {showAIPanel && (
            <div className="lg:col-span-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-500" />
                توليد المقال بالذكاء الاصطناعي
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
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
                    <option value="sona">
                      🟢 SONA - سونا (موصى به - سريع ومجاني)
                    </option>
                    <option value="groq">
                      {providersStatus.groq ? '🟢' : '🔴'} Groq (سريع جداً)
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
                    <option value="local">🟢 المولد المحلي القديم</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    النمط
                  </label>
                  <select
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <option value="formal">رسمي</option>
                    <option value="casual">عامي</option>
                    <option value="seo">محسن للسيو</option>
                    <option value="academic">أكاديمي</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الكلمات المفتاحية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={aiKeywords}
                    onChange={(e) => setAiKeywords(e.target.value)}
                    placeholder="عيد ميلاد, تهنئة, احتفال (مفصولة بفواصل)"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عدد الصور
                  </label>
                  <select
                    value={imageCount}
                    onChange={(e) => setImageCount(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <option value={0}>بدون صور</option>
                    <option value={2}>2 صور</option>
                    <option value={3}>3 صور</option>
                    <option value={5}>5 صور</option>
                    <option value={7}>7 صور</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="includeImages"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <label
                    htmlFor="includeImages"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    إضافة صور تلقائياً (Pexels)
                  </label>
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

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المحتوى *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="أدخل محتوى المقال (يدعم HTML)"
                rows={15}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-sm"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
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
          <div className="space-y-6">
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
                    className="w-5 h-5 rounded border-gray-300"
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
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    مقال مميز
                  </label>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  تحسين محركات البحث
                </h3>
                <button
                  onClick={handleGenerateMeta}
                  className="text-sm text-purple-500 hover:text-purple-600 flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  توليد تلقائي
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
                    placeholder="وصف قصير للمقال (160 حرف)"
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
                  تم التوليد بواسطة: {aiProvider}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
