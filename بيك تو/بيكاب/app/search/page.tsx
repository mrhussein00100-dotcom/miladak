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
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');

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
      } else if (data.results) {
        // في حالة عدم وجود success ولكن يوجد results
        setResults(data.results);
      } else {
        console.log('No results found or error:', data.error);
        setResults([]);
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
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              تم العثور على{' '}
              <span className="font-bold text-green-600">{results.length}</span>{' '}
              نتيجة
            </p>

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
