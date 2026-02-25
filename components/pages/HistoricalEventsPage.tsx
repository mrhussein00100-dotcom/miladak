'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Search,
  Clock,
  Globe,
  BookOpen,
  Star,
  TrendingUp,
  Filter,
  ChevronDown,
  Loader2,
  AlertCircle,
  History,
  Sparkles,
  Award,
  Zap,
  Users,
  Lightbulb,
} from 'lucide-react';
import KeywordsSection from '@/components/tools/KeywordsSection';

/**
 * Historical Events Page Component - Enhanced Version
 * Feature: historical-events-page-enhancement
 */

interface Event {
  id: number;
  title: string;
  description: string;
  year: number;
  month: number;
  day: number;
  category?: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
}

const MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

// دالة لحساب عدد أيام الشهر
function getDaysInMonth(month: number): number {
  // الأشهر ذات 31 يوم: يناير، مارس، مايو، يوليو، أغسطس، أكتوبر، ديسمبر
  const months31 = [1, 3, 5, 7, 8, 10, 12];
  // الأشهر ذات 30 يوم: أبريل، يونيو، سبتمبر، نوفمبر
  const months30 = [4, 6, 9, 11];

  if (months31.includes(month)) return 31;
  if (months30.includes(month)) return 30;
  // فبراير - نستخدم 29 للسماح بالسنوات الكبيسة
  return 29;
}

const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: Globe, color: 'from-blue-500 to-cyan-500' },
  {
    id: 'سياسي',
    name: 'سياسي',
    icon: Users,
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'علمي',
    name: 'علمي',
    icon: Lightbulb,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'رياضي',
    name: 'رياضي',
    icon: Award,
    color: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'ثقافي',
    name: 'ثقافي',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'اقتصادي',
    name: 'اقتصادي',
    icon: TrendingUp,
    color: 'from-indigo-500 to-blue-500',
  },
];

// حقائق تاريخية مثيرة
const HISTORICAL_FACTS = [
  {
    icon: '📜',
    title: 'أقدم حضارة',
    description: 'الحضارة السومرية في العراق منذ 4500 ق.م',
  },
  {
    icon: '🏛️',
    title: 'أول جامعة',
    description: 'جامعة القرويين في فاس أقدم جامعة في العالم',
  },
  {
    icon: '🌍',
    title: 'أكبر إمبراطورية',
    description: 'الإمبراطورية البريطانية غطت ربع الأرض',
  },
  {
    icon: '🚀',
    title: 'أول رحلة فضاء',
    description: 'يوري غاغارين أول إنسان في الفضاء 1961',
  },
];

export default function HistoricalEventsPageClient() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);

  // تعديل اليوم تلقائياً عند تغيير الشهر إذا كان أكبر من عدد أيام الشهر
  useEffect(() => {
    const maxDays = getDaysInMonth(month);
    if (day > maxDays) {
      setDay(maxDays);
    }
  }, [month, day]);

  // جلب الأحداث
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load static data first
      const { dailyEvents: staticEvents } = await import('@/lib/dailyData');
      const currentStaticEvents = staticEvents.filter(e => e.day === day && e.month === month);

      const response = await fetch(`/api/daily-events/${month}/${day}`);
      if (!response.ok) throw new Error('فشل في جلب البيانات');
      const data = await response.json();
      
      if (data.success) {
        const apiEvents = data.data.events || [];
        const mergedEvents = [...apiEvents];

        // Merge static events
        currentStaticEvents.forEach((staticEvent, index) => {
          if (!mergedEvents.some((e: any) => e.title === staticEvent.title)) {
            mergedEvents.push({
              id: -1 * (index + 1),
              title: staticEvent.title,
              description: staticEvent.description,
              year: staticEvent.year || 0,
              month: month,
              day: day,
              category: staticEvent.category
            });
          }
        });

        setEvents(mergedEvents);
      } else {
        // Fallback to static
        setEvents(currentStaticEvents.map((e, i) => ({
          id: -1 * (i + 1),
          title: e.title,
          description: e.description,
          year: e.year || 0,
          month: month,
          day: day,
          category: e.category
        })));
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      // Fallback to static data
      const { dailyEvents } = await import('@/lib/dailyData');
      const currentStaticEvents = dailyEvents.filter(e => e.day === day && e.month === month);
      setEvents(currentStaticEvents.map((e, i) => ({
        id: -1 * (i + 1),
        title: e.title,
        description: e.description,
        year: e.year || 0,
        month: month,
        day: day,
        category: e.category
      })));
    } finally {
      setLoading(false);
    }
  };

  // جلب المقالات ذات الصلة
  const fetchRelatedArticles = async () => {
    setArticlesLoading(true);
    try {
      // جلب أحدث المقالات (بدون تحديد فئة معينة)
      const response = await fetch('/api/articles?limit=12');
      if (response.ok) {
        const data = await response.json();
        const items = data.data?.items || [];
        // تقليب المقالات عشوائياً واختيار 6 منها
        const shuffled = items.sort(() => Math.random() - 0.5).slice(0, 6);
        setArticles(shuffled);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setArticlesLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [month, day]);

  useEffect(() => {
    fetchRelatedArticles();
  }, []);

  // فلترة الأحداث
  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.title.includes(searchQuery) ||
          (e.description && e.description.includes(searchQuery))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((e) => e.category === selectedCategory);
    }

    return filtered;
  }, [events, searchQuery, selectedCategory]);

  // إحصائيات
  const stats = useMemo(() => {
    const categories: Record<string, number> = {};
    events.forEach((e) => {
      const cat = e.category || 'عام';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return {
      total: events.length,
      categories,
      oldest:
        events.length > 0
          ? Math.min(...events.map((e) => e.year || 2000))
          : null,
      newest:
        events.length > 0
          ? Math.max(...events.map((e) => e.year || 2000))
          : null,
    };
  }, [events]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* أيقونة */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-2xl shadow-amber-500/30"
            >
              <History className="w-10 h-10 text-white" />
            </motion.div>

            {/* العنوان */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                أحداث تاريخية
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              اكتشف ما حدث في يوم ميلادك عبر التاريخ
              <br />
              <span className="text-lg text-gray-500 dark:text-gray-400">
                آلاف الأحداث السياسية والعلمية والرياضية والثقافية
              </span>
            </p>

            {/* إحصائيات سريعة */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { icon: Calendar, label: 'يوم', value: '365' },
                { icon: Globe, label: 'حدث', value: '10,000+' },
                { icon: Clock, label: 'سنة', value: '3000+' },
                { icon: Star, label: 'فئة', value: '6' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg"
                >
                  <stat.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* قسم اختيار التاريخ */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  اختر التاريخ
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  حدد اليوم والشهر لاستكشاف الأحداث
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* اختيار الشهر */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الشهر
                </label>
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="w-full appearance-none px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                             bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500
                             transition-all duration-300 cursor-pointer"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* اختيار اليوم */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اليوم
                </label>
                <div className="relative">
                  <select
                    value={day}
                    onChange={(e) => setDay(parseInt(e.target.value))}
                    className="w-full appearance-none px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                             bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500
                             transition-all duration-300 cursor-pointer"
                  >
                    {Array.from(
                      { length: getDaysInMonth(month) },
                      (_, i) => i + 1
                    ).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* البحث */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  بحث في الأحداث
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                             bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500
                             transition-all duration-300"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* زر اليوم الحالي */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setMonth(new Date().getMonth() + 1);
                    setDay(new Date().getDate());
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl
                           hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300
                           flex items-center justify-center gap-2 font-medium"
                >
                  <Zap className="w-5 h-5" />
                  اليوم الحالي
                </button>
              </div>
            </div>

            {/* فلاتر الفئات */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  تصفية حسب الفئة:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.name}
                    {selectedCategory === cat.id &&
                      stats.categories[cat.id] && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                          {stats.categories[cat.id]}
                        </span>
                      )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* قسم عرض الأحداث */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* عنوان النتائج */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  أحداث {day} {MONTHS[month - 1]}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredEvents.length} حدث تاريخي
                  {stats.oldest &&
                    stats.newest &&
                    ` (${stats.oldest} - ${stats.newest})`}
                </p>
              </div>
            </div>
          </div>

          {/* حالة التحميل */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                جاري تحميل الأحداث...
              </p>
            </div>
          )}

          {/* حالة الخطأ */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
              <button
                onClick={fetchEvents}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                إعادة المحاولة
              </button>
            </motion.div>
          )}

          {/* عرض الأحداث */}
          {!loading && !error && (
            <AnimatePresence mode="wait">
              {filteredEvents.length > 0 ? (
                <motion.div
                  key="events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4"
                >
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl
                               border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600
                               transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        {/* السنة */}
                        <div
                          className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl
                                      flex flex-col items-center justify-center text-white shadow-lg"
                        >
                          <span className="text-2xl font-bold">
                            {event.year || '؟'}
                          </span>
                          <span className="text-xs opacity-80">م</span>
                        </div>

                        {/* المحتوى */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {event.title}
                            </h3>
                            {event.category && (
                              <span className="flex-shrink-0 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full">
                                {event.category}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-12 text-center"
                >
                  <History className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    لا توجد أحداث لهذا التاريخ
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    جرب اختيار تاريخ آخر أو تغيير معايير البحث
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* قسم حقائق تاريخية */}
      <section className="py-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              حقائق تاريخية مثيرة
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              معلومات تاريخية قد لا تعرفها
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HISTORICAL_FACTS.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl
                         border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600
                         transition-all duration-300 transform hover:-translate-y-2"
              >
                <span className="text-4xl mb-4 block">{fact.icon}</span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {fact.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fact.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم المقالات ذات الصلة */}
      {articles.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    مقالات قد تهمك
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    اقرأ المزيد من المقالات
                  </p>
                </div>
              </div>
              <Link
                href="/articles"
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400
                         rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium"
              >
                عرض الكل
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </Link>
            </motion.div>

            {articlesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 6).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/articles/${article.slug}`}
                      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl
                               border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600
                               transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {article.featured_image && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* قسم الكلمات المفتاحية */}
      <KeywordsSection
        toolSlug="historical-events"
        pageType="page"
        title="مواضيع تاريخية ذات صلة"
        className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/5 dark:to-orange-900/5"
      />
    </div>
  );
}
