'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SafeImage } from './ui/SafeImage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';
import { Button } from './ui/Button';
import { formatArabicNumber } from '@/lib/formatArabic';
import {
  Search,
  Star,
  Grid,
  List,
  Clock,
  Eye,
  User,
  ChevronDown,
  Loader2,
  Tag,
  Home,
  ChevronLeft,
} from 'lucide-react';
import type { Article, ArticleCategory } from '@/types';
import { SmartCategoriesFilter } from './articles/SmartCategoriesFilter';

// 100 كلمة مفتاحية للموقع
const SITE_KEYWORDS = [
  'ميلادك',
  'حساب العمر',
  'تاريخ الميلاد',
  'العمر بالهجري',
  'العمر بالميلادي',
  'حاسبة العمر',
  'كم عمري',
  'معرفة العمر',
  'حساب العمر بالتفصيل',
  'العمر الدقيق',
  'الأبراج',
  'البرج الفلكي',
  'برجك اليوم',
  'صفات الأبراج',
  'توافق الأبراج',
  'البرج الصيني',
  'الأبراج الصينية',
  'حيوان البرج',
  'سنة الميلاد الصينية',
  'صحة الأطفال',
  'نمو الطفل',
  'تطور الطفل',
  'مراحل النمو',
  'العناية بالطفل',
  'التغذية السليمة',
  'الغذاء الصحي',
  'نصائح غذائية',
  'الفيتامينات',
  'المعادن',
  'الحمل',
  'الولادة',
  'صحة الحامل',
  'مراحل الحمل',
  'تغذية الحامل',
  'الرضاعة',
  'حليب الأم',
  'فطام الطفل',
  'تغذية الرضيع',
  'نوم الطفل',
  'تربية الأطفال',
  'التعليم المبكر',
  'ألعاب الأطفال',
  'أنشطة تعليمية',
  'الصحة النفسية',
  'التوتر',
  'القلق',
  'الاكتئاب',
  'السعادة',
  'اللياقة البدنية',
  'الرياضة',
  'التمارين',
  'المشي',
  'الجري',
  'إنقاص الوزن',
  'زيادة الوزن',
  'الوزن المثالي',
  'مؤشر كتلة الجسم',
  'السعرات الحرارية',
  'النوم الصحي',
  'ساعات النوم',
  'جودة النوم',
  'الأرق',
  'الاسترخاء',
  'العناية بالبشرة',
  'البشرة الصحية',
  'مكافحة الشيخوخة',
  'التجاعيد',
  'صحة القلب',
  'ضغط الدم',
  'الكوليسترول',
  'السكري',
  'الوقاية من الأمراض',
  'التقويم الهجري',
  'التقويم الميلادي',
  'تحويل التاريخ',
  'المناسبات الإسلامية',
  'عيد الميلاد',
  'الاحتفال بالميلاد',
  'هدايا عيد الميلاد',
  'كعكة الميلاد',
  'إحصاءات الحياة',
  'عدد أيام العمر',
  'عدد ساعات العمر',
  'لحظات الحياة',
  'يوم الميلاد',
  'شهر الميلاد',
  'سنة الميلاد',
  'برج الميلاد',
  'حجر الميلاد',
  'زهرة الميلاد',
  'لون الحظ',
  'رقم الحظ',
  'الشخصية',
  'صفات الشخصية',
  'مشاهير مواليد',
  'أحداث تاريخية',
  'هذا اليوم في التاريخ',
  'مواليد اليوم',
];

interface ArticlesPageClientProps {
  articles: Article[];
  categories: ArticleCategory[];
  totalArticles?: number;
}

const ARTICLES_PER_PAGE = 15;

export function ArticlesPageClient({
  articles: initialArticles,
  categories,
  totalArticles = 0,
}: ArticlesPageClientProps) {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>(
    initialArticles.slice(0, ARTICLES_PER_PAGE)
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'reading_time'>(
    'newest'
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialArticles.length > ARTICLES_PER_PAGE
  );
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [categoryArticlesCount, setCategoryArticlesCount] =
    useState(totalArticles);
  const [initialCategoryLoaded, setInitialCategoryLoaded] = useState(false);

  // جلب مقالات التصنيف من الـ API
  const fetchCategoryArticles = useCallback(
    async (categoryId: string | null, categorySlug?: string) => {
      setLoading(true);
      try {
        let url = `/api/articles?page=1&pageSize=${ARTICLES_PER_PAGE}`;

        if (categoryId) {
          // البحث عن اسم التصنيف بالـ ID
          const category = categories.find(
            (c) => c.id.toString() === categoryId
          );
          if (category) {
            // إرسال اسم التصنيف مع encoding للأحرف العربية
            url += `&category=${encodeURIComponent(category.name)}`;
          }
        } else if (categorySlug) {
          // البحث عن التصنيف بالـ slug
          const category = categories.find(
            (c) => c.slug === categorySlug || c.name === categorySlug
          );
          if (category) {
            url += `&category=${encodeURIComponent(category.name)}`;
          }
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setArticles(data.data.items);
          setPage(1);
          setHasMore(data.meta.hasMore);
          setCategoryArticlesCount(data.data.total);
        }
      } catch (error) {
        console.error('Error fetching category articles:', error);
      } finally {
        setLoading(false);
      }
    },
    [categories]
  );

  // قراءة التصنيف من الـ URL عند تحميل الصفحة
  useEffect(() => {
    if (initialCategoryLoaded) return;

    const categoryParam = searchParams?.get('category');
    if (categoryParam && categories.length > 0) {
      // البحث عن التصنيف بالـ slug أو الاسم
      const category = categories.find(
        (c) => c.slug === categoryParam || c.name === categoryParam
      );
      if (category) {
        setSelectedCategory(category.id.toString());
        fetchCategoryArticles(null, categoryParam);
      }
    }
    setInitialCategoryLoaded(true);
  }, [searchParams, categories, fetchCategoryArticles, initialCategoryLoaded]);

  // معالجة تغيير التصنيف
  const handleCategorySelect = useCallback(
    (categoryId: string | null) => {
      setSelectedCategory(categoryId);
      setSearchQuery(''); // مسح البحث عند تغيير التصنيف
      fetchCategoryArticles(categoryId);
    },
    [fetchCategoryArticles]
  );

  // تحميل المزيد من المقالات
  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      let url = `/api/articles?page=${nextPage}&pageSize=${ARTICLES_PER_PAGE}`;

      // إضافة فلتر التصنيف إذا كان محدداً
      if (selectedCategory) {
        const category = categories.find(
          (c) => c.id.toString() === selectedCategory
        );
        if (category) {
          url += `&category=${encodeURIComponent(category.name)}`;
        }
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.data.items.length > 0) {
        setArticles((prev) => [...prev, ...data.data.items]);
        setPage(nextPage);
        setHasMore(data.meta.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, selectedCategory, categories]);

  const filteredArticles = useMemo(() => {
    // التصفية حسب البحث فقط (التصنيف يتم من الـ API)
    let result = articles.filter((article) => {
      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt &&
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });

    switch (sortBy) {
      case 'popular':
        result = [...result].sort((a, b) => b.views - a.views);
        break;
      case 'reading_time':
        result = [...result].sort((a, b) => a.read_time - b.read_time);
        break;
      default:
        break;
    }

    return result;
  }, [articles, searchQuery, sortBy]);

  const featuredArticles = useMemo(
    () => articles.filter((article) => article.featured),
    [articles]
  );

  const remainingCount = categoryArticlesCount - articles.length;
  const displayedKeywords = showAllKeywords
    ? SITE_KEYWORDS
    : SITE_KEYWORDS.slice(0, 30);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs للـ SEO */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-purple-600 transition-colors"
        >
          <Home size={14} />
          <span>الرئيسية</span>
        </Link>
        <ChevronLeft size={14} />
        <span className="text-purple-600 dark:text-purple-400 font-medium">
          مكتبة مقالات ميلادك
        </span>
      </nav>

      {/* Header Section - محسن */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-4xl md:text-5xl ml-2">📚</span>
          <span className="gradient-text">مكتبة مقالات ميلادك</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          مقالات شاملة ومفيدة حول حساب العمر، الأبراج، صحة الأطفال، التغذية
          والحياة الصحية
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث في المقالات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Sort & View Controls */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50"
            >
              <option value="newest">الأحدث</option>
              <option value="popular">الأكثر مشاهدة</option>
              <option value="reading_time">وقت القراءة</option>
            </select>

            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-purple-600'
                    : 'text-gray-500'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-purple-600'
                    : 'text-gray-500'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Smart Category Filters */}
        <div className="mt-4 relative" style={{ zIndex: 100 }}>
          <SmartCategoriesFilter
            categories={categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              color: cat.color || '#8B5CF6',
              articles_count:
                (cat as unknown as { articles_count?: number })
                  .articles_count || 0,
            }))}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            totalArticles={totalArticles || articles.length}
          />
        </div>
      </motion.div>

      {/* Featured Articles */}
      {!selectedCategory && !searchQuery && featuredArticles.length > 0 && (
        <section className="relative" style={{ zIndex: 1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Star className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold">المقالات المميزة</h2>
          </div>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {featuredArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                featured
                viewMode={viewMode}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="relative" style={{ zIndex: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory
              ? categories.find((c) => c.id.toString() === selectedCategory)
                  ?.name
              : 'جميع المقالات'}
          </h2>
          <span className="text-gray-500">
            {filteredArticles.length} من {categoryArticlesCount} مقال
          </span>
        </div>

        {loading && filteredArticles.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="mr-3 text-gray-500">جاري تحميل المقالات...</span>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>

      {/* Load More Button */}
      {hasMore && !searchQuery && (
        <div className="text-center py-8">
          <button
            onClick={loadMoreArticles}
            disabled={loading}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري التحميل...</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                <span>المزيد من المقالات</span>
                {remainingCount > 0 && (
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    +
                    {formatArabicNumber(
                      Math.min(remainingCount, ARTICLES_PER_PAGE)
                    )}
                  </span>
                )}
              </>
            )}
          </button>

          {remainingCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              {loading
                ? 'نحضر لك المزيد من المحتوى المفيد...'
                : `${formatArabicNumber(remainingCount)} مقال متبقي`}
            </p>
          )}
        </div>
      )}

      {/* All Articles Loaded Message */}
      {!hasMore && articles.length > ARTICLES_PER_PAGE && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full border border-green-200 dark:border-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">
              ✅ تم عرض جميع المقالات ({formatArabicNumber(articles.length)})
            </span>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-16">
          <div className="glass rounded-2xl p-12 max-w-md mx-auto">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">
              لم يتم العثور على مقالات
            </h3>
            <p className="text-gray-500 mb-4">
              جرب البحث بكلمات مختلفة أو اختر فئة أخرى
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              إعادة تعيين البحث
            </Button>
          </div>
        </div>
      )}

      {/* SEO Content Section */}
      <section className="mt-16">
        <div className="glass rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="gradient-text">لماذا مكتبة مقالات ميلادك؟</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 rounded-xl text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="text-lg font-bold mb-2">محتوى موثوق</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                مقالات مكتوبة بعناية ومراجعة من متخصصين
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold mb-2">مواضيع متنوعة</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                تغطية شاملة لمواضيع العمر والصحة والحياة
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🆕</span>
              </div>
              <h3 className="text-lg font-bold mb-2">تحديث مستمر</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                مقالات جديدة تضاف باستمرار لإثراء المحتوى
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الكلمات المفتاحية - 100 كلمة - في الأسفل للـ SEO */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-purple-200/30 dark:border-purple-800/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Tag className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold">📋 مواضيع المقالات</h2>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {SITE_KEYWORDS.length} موضوع
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {displayedKeywords.map((keyword, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-700 dark:hover:text-purple-300 transition-all cursor-default"
            >
              {keyword}
            </span>
          ))}
        </div>

        {SITE_KEYWORDS.length > 30 && (
          <div className="text-center">
            <button
              onClick={() => setShowAllKeywords(!showAllKeywords)}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition-colors"
            >
              {showAllKeywords
                ? 'عرض أقل'
                : `عرض المزيد (${SITE_KEYWORDS.length - 30})`}
            </button>
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          اكتشف مجموعة واسعة من المواضيع في <strong>مكتبة مقالات ميلادك</strong>
          . من حساب العمر والأبراج إلى صحة الأطفال والتغذية، نقدم لك محتوى شامل
          ومفيد.
        </p>
      </motion.section>
    </div>
  );
}

function ArticleCard({
  article,
  featured = false,
  viewMode = 'grid',
}: {
  article: Article;
  featured?: boolean;
  viewMode?: 'grid' | 'list';
}) {
  const categoryColor =
    (article as Article & { category_color?: string }).category_color ||
    '#8B5CF6';
  const coverImage = article.featured_image || article.image;

  if (viewMode === 'list') {
    return (
      <Link href={`/articles/${article.slug}`} className="block">
        <div
          className={`flex gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border ${
            featured ? 'border-yellow-400/50' : 'border-white/20'
          } hover:shadow-lg transition-all`}
        >
          {coverImage && (
            <div className="w-32 h-24 rounded-lg overflow-hidden relative shrink-0">
              <SafeImage
                src={coverImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2 py-1 text-xs rounded-full text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {article.category_name}
              </span>
              {featured && <Star className="text-yellow-500" size={14} />}
            </div>
            <h3 className="font-semibold line-clamp-1 mb-1">{article.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <User size={12} />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatArabicNumber(article.read_time)} د
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {formatArabicNumber(article.views)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${
        featured ? 'ring-2 ring-yellow-400/50' : ''
      }`}
    >
      {coverImage && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
          <SafeImage
            src={coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <span
              className="px-2 py-1 text-xs rounded-full text-white backdrop-blur-sm"
              style={{ backgroundColor: categoryColor }}
            >
              {article.category_name}
            </span>
            {featured && (
              <span className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-full flex items-center gap-1">
                <Star size={12} /> مميز
              </span>
            )}
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {article.excerpt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <User size={14} />
            {article.author}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {formatArabicNumber(article.read_time)} د
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {formatArabicNumber(article.views)}
            </span>
          </div>
        </div>
        <Link href={`/articles/${article.slug}`}>
          <Button
            variant="default"
            className="w-full bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700 active:bg-purple-800 active:text-white focus:bg-purple-700 focus:text-white transition-all"
          >
            اقرأ المقال
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
