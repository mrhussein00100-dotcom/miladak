'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Loader2,
  Calculator,
  Baby,
  Heart,
  Clock,
  Calendar,
  Users,
  Scale,
  Flame,
  Globe,
  Sparkles,
  Gift,
  Moon,
  Activity,
  Timer,
  CalendarDays,
  Cake,
  LucideIcon,
} from 'lucide-react';

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  image?: string;
  icon?: string;
  type: 'tool' | 'article';
  category?: string;
}

interface GroupedResults {
  tools: { [category: string]: SearchResult[] };
  articles: { [category: string]: SearchResult[] };
}

// خريطة الأيقونات للأدوات
const iconMap: Record<string, LucideIcon> = {
  Calculator: Calculator,
  Baby: Baby,
  Heart: Heart,
  Clock: Clock,
  Calendar: Calendar,
  Users: Users,
  Scale: Scale,
  Flame: Flame,
  Globe: Globe,
  Sparkles: Sparkles,
  Gift: Gift,
  Moon: Moon,
  Activity: Activity,
  Timer: Timer,
  CalendarDays: CalendarDays,
  Cake: Cake,
};

// دالة للحصول على الأيقونة المناسبة
function getToolIcon(iconName?: string): LucideIcon {
  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }
  return Calculator; // أيقونة افتراضية
}

function SearchContent() {
  const searchParams = useSearchParams();
  // دعم كلا المعاملين: q و keyword
  const urlQuery = searchParams.get('q') || searchParams.get('keyword') || '';

  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [groupedResults, setGroupedResults] = useState<GroupedResults>({
    tools: {},
    articles: {},
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');

  // تجميع النتائج حسب الأقسام
  const groupResults = (results: SearchResult[]): GroupedResults => {
    const grouped: GroupedResults = { tools: {}, articles: {} };

    results.forEach((result) => {
      const category = result.category || 'أخرى';
      if (result.type === 'tool') {
        if (!grouped.tools[category]) {
          grouped.tools[category] = [];
        }
        grouped.tools[category].push(result);
      } else {
        if (!grouped.articles[category]) {
          grouped.articles[category] = [];
        }
        grouped.articles[category].push(result);
      }
    });

    return grouped;
  };

  // البحث عند تحميل الصفحة أو تغيير URL
  useEffect(() => {
    if (urlQuery && urlQuery !== lastSearchedQuery) {
      setSearchTerm(urlQuery);
      setLastSearchedQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [urlQuery]);

  const performSearch = async (term: string) => {
    if (!term.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const searchUrl = `/api/search?q=${encodeURIComponent(term)}`;
      console.log('Searching:', searchUrl);

      const response = await fetch(searchUrl);
      const data = await response.json();

      console.log('Search response:', data);

      if (data.success && data.results) {
        setResults(data.results);
        setGroupedResults(groupResults(data.results));
      } else if (data.results) {
        // في حالة عدم وجود success ولكن يوجد results
        setResults(data.results);
        setGroupedResults(groupResults(data.results));
      } else {
        console.log('No results found or error:', data.error);
        setResults([]);
        setGroupedResults({ tools: {}, articles: {} });
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
    // تحديث URL
    window.history.pushState(
      {},
      '',
      `/search?q=${encodeURIComponent(searchTerm)}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* عنوان الصفحة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl mb-6 shadow-xl">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-500 bg-clip-text text-transparent mb-4">
            البحث في الموقع
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            ابحث في الأدوات والمقالات والمحتوى المتاح على موقع ميلادك
          </p>
        </motion.div>

        {/* شريط البحث */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن أدوات، مقالات، أو أي محتوى..."
              className="w-full px-6 py-4 pr-14 border-2 border-gray-200 dark:border-gray-700 rounded-2xl 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-4 focus:ring-green-500/20 focus:border-green-500
                       transition-all duration-300 text-lg shadow-xl"
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 
                       bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl
                       hover:shadow-lg transition-all duration-300"
            >
              <Search className="text-white w-5 h-5" />
            </button>
          </div>
        </motion.form>

        {/* نتائج البحث */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">جاري البحث...</p>
          </div>
        ) : searched && results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              جرب البحث بكلمات مختلفة أو تصفح الأقسام أدناه
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                <span>تصفح الأدوات</span>
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>تصفح المقالات</span>
              </Link>
            </div>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <p className="text-gray-600 dark:text-gray-400 text-center sm:text-right">
                تم العثور على{' '}
                <span className="font-bold text-green-600">
                  {results.length}
                </span>{' '}
                نتيجة
              </p>

              {/* أزرار تبديل طريقة العرض */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grouped')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grouped'
                      ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  مجمّع حسب القسم
                </button>
                <button
                  onClick={() => setViewMode('flat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'flat'
                      ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  عرض مسطح
                </button>
              </div>
            </div>

            {viewMode === 'grouped' ? (
              <div className="space-y-8">
                {/* قسم الأدوات */}
                {Object.keys(groupedResults.tools).length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        الأدوات
                      </h2>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">
                        {Object.values(groupedResults.tools).flat().length}
                      </span>
                    </div>

                    {Object.entries(groupedResults.tools).map(
                      ([category, tools]) => (
                        <div key={category} className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {category}
                            <span className="text-xs text-gray-400">
                              ({tools.length})
                            </span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tools.map((result, index) => (
                              <motion.div
                                key={`tool-${result.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                              >
                                <Link
                                  href={`/tools/${result.slug}`}
                                  className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transform hover:-translate-y-1"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                      {(() => {
                                        const IconComponent = getToolIcon(
                                          result.icon
                                        );
                                        return (
                                          <IconComponent className="w-5 h-5 text-white" />
                                        );
                                      })()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {result.title}
                                      </h4>
                                      {result.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                          {result.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* قسم المقالات */}
                {Object.keys(groupedResults.articles).length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        المقالات
                      </h2>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full">
                        {Object.values(groupedResults.articles).flat().length}
                      </span>
                    </div>

                    {Object.entries(groupedResults.articles).map(
                      ([category, articles]) => (
                        <div key={category} className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            {category}
                            <span className="text-xs text-gray-400">
                              ({articles.length})
                            </span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {articles.map((result, index) => (
                              <motion.div
                                key={`article-${result.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                              >
                                <Link
                                  href={`/articles/${result.slug}`}
                                  className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transform hover:-translate-y-1"
                                >
                                  {result.image ? (
                                    <div className="relative h-32">
                                      <Image
                                        src={result.image}
                                        alt={result.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                      <BookOpen className="w-10 h-10 text-white/70" />
                                    </div>
                                  )}
                                  <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                                      {result.title}
                                    </h4>
                                    {result.excerpt && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                        {result.excerpt}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* العرض المسطح الأصلي */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result, index) => (
                  <motion.div
                    key={`${result.type}-${result.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={
                        result.type === 'tool'
                          ? `/tools/${result.slug}`
                          : `/articles/${result.slug}`
                      }
                      className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transform hover:-translate-y-1"
                    >
                      {/* صورة أو أيقونة */}
                      <div
                        className={`relative h-40 flex items-center justify-center ${
                          result.type === 'tool'
                            ? 'bg-gradient-to-br from-green-500 to-teal-500'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                        }`}
                      >
                        {result.image ? (
                          <Image
                            src={result.image}
                            alt={result.title}
                            fill
                            className="object-cover"
                          />
                        ) : result.type === 'tool' ? (
                          (() => {
                            const IconComponent = getToolIcon(result.icon);
                            return (
                              <IconComponent className="w-16 h-16 text-white" />
                            );
                          })()
                        ) : (
                          <BookOpen className="w-16 h-16 text-white/70" />
                        )}
                        {/* نوع النتيجة */}
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full text-xs font-bold">
                          {result.type === 'tool' ? (
                            <span className="text-green-600 flex items-center gap-1">
                              {(() => {
                                const IconComponent = getToolIcon(result.icon);
                                return <IconComponent className="w-3 h-3" />;
                              })()}
                              أداة
                            </span>
                          ) : (
                            <span className="text-purple-600 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> مقال
                            </span>
                          )}
                        </div>
                      </div>

                      {/* المحتوى */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                          {result.title}
                        </h3>
                        {(result.description || result.excerpt) && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {result.description || result.excerpt}
                          </p>
                        )}
                        {result.category && (
                          <div className="mt-3 inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                            {result.category}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : !searched ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              ابدأ بكتابة كلمة البحث للعثور على ما تبحث عنه
            </p>

            {/* اقتراحات بحث شائعة */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                عمليات بحث شائعة
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'حاسبة العمر',
                  'حاسبة الحمل',
                  'BMI',
                  'السعرات الحرارية',
                  'العد التنازلي',
                  'تحويل التاريخ',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchTerm(term);
                      performSearch(term);
                      window.history.pushState(
                        {},
                        '',
                        `/search?q=${encodeURIComponent(term)}`
                      );
                    }}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:border-green-400 hover:text-green-600 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
