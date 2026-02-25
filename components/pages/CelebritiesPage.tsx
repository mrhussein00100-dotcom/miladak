'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Search,
  Star,
  Users,
  Filter,
  ChevronDown,
  Loader2,
  AlertCircle,
  Sparkles,
  Award,
  Zap,
  Music,
  Film,
  Trophy,
  BookOpen,
  Briefcase,
  Mic,
  Palette,
  GraduationCap,
  Globe,
  Heart,
  TrendingUp,
  User,
} from 'lucide-react';
import KeywordsSection from '@/components/tools/KeywordsSection';
import { getZodiacSign } from '@/lib/zodiac-data';
import SocialShare from '@/components/SocialShare';

/**
 * Celebrities Page Component - Enhanced Version
 * Feature: celebrities-page-enhancement
 */

interface Celebrity {
  id: number;
  name: string;
  profession: string;
  birth_year: number;
  month: number;
  day: number;
  image_url?: string;
  nationality?: string;
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

const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: Globe, color: 'from-blue-500 to-cyan-500' },
  {
    id: 'ممثل',
    name: 'ممثلين',
    icon: Film,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'مغني',
    name: 'مغنيين',
    icon: Music,
    color: 'from-rose-500 to-red-500',
  },
  {
    id: 'رياضي',
    name: 'رياضيين',
    icon: Trophy,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'عالم',
    name: 'علماء',
    icon: GraduationCap,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'كاتب',
    name: 'كتاب',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'سياسي',
    name: 'سياسيين',
    icon: Briefcase,
    color: 'from-gray-500 to-slate-500',
  },
  {
    id: 'فنان',
    name: 'فنانين',
    icon: Palette,
    color: 'from-pink-500 to-fuchsia-500',
  },
];

// حقائق عن المشاهير
const CELEBRITY_FACTS = [
  {
    icon: '🎬',
    title: 'أكثر المهن',
    description: 'الممثلون هم الأكثر شهرة عالمياً',
  },
  {
    icon: '⚽',
    title: 'الرياضة الأشهر',
    description: 'كرة القدم تنتج أكثر المشاهير',
  },
  {
    icon: '🎵',
    title: 'صناعة الموسيقى',
    description: 'المغنون يحققون أعلى الإيرادات',
  },
  {
    icon: '🌟',
    title: 'النجومية',
    description: 'معظم المشاهير بدأوا في سن مبكرة',
  },
];

// دالة للحصول على أيقونة المهنة
const getProfessionIcon = (profession: string) => {
  const lower = profession?.toLowerCase() || '';
  if (lower.includes('ممثل') || lower.includes('actor')) return Film;
  if (
    lower.includes('مغني') ||
    lower.includes('singer') ||
    lower.includes('موسيق')
  )
    return Music;
  if (
    lower.includes('رياضي') ||
    lower.includes('لاعب') ||
    lower.includes('player')
  )
    return Trophy;
  if (lower.includes('عالم') || lower.includes('scientist'))
    return GraduationCap;
  if (
    lower.includes('كاتب') ||
    lower.includes('writer') ||
    lower.includes('مؤلف')
  )
    return BookOpen;
  if (
    lower.includes('سياسي') ||
    lower.includes('politician') ||
    lower.includes('رئيس')
  )
    return Briefcase;
  if (
    lower.includes('فنان') ||
    lower.includes('artist') ||
    lower.includes('رسام')
  )
    return Palette;
  if (lower.includes('مقدم') || lower.includes('presenter')) return Mic;
  return Star;
};

// دالة للحصول على لون المهنة
const getProfessionColor = (profession: string) => {
  const lower = profession?.toLowerCase() || '';
  if (lower.includes('ممثل') || lower.includes('actor'))
    return 'from-purple-500 to-pink-500';
  if (lower.includes('مغني') || lower.includes('singer'))
    return 'from-rose-500 to-red-500';
  if (lower.includes('رياضي') || lower.includes('لاعب'))
    return 'from-green-500 to-emerald-500';
  if (lower.includes('عالم') || lower.includes('scientist'))
    return 'from-indigo-500 to-blue-500';
  if (lower.includes('كاتب') || lower.includes('writer'))
    return 'from-amber-500 to-orange-500';
  if (lower.includes('سياسي') || lower.includes('politician'))
    return 'from-gray-500 to-slate-500';
  if (lower.includes('فنان') || lower.includes('artist'))
    return 'from-pink-500 to-fuchsia-500';
  return 'from-yellow-500 to-amber-500';
};

// Skeleton Loader Component
const CelebritySkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export default function CelebritiesPageClient() {
  const searchParams = useSearchParams();
  const initialMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth() + 1;
  const initialDay = searchParams.get('day') ? parseInt(searchParams.get('day')!) : new Date().getDate();

  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(initialDay);
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);

  const zodiacSign = useMemo(() => getZodiacSign(day, month), [day, month]);

  // جلب المشاهير
  const fetchCelebrities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/daily-birthdays/${month}/${day}`);
      if (!response.ok) throw new Error('فشل في جلب البيانات');
      const data = await response.json();
      if (data.success) {
        setCelebrities(data.data.celebrities || []);
      } else {
        setError(data.error || 'حدث خطأ غير متوقع');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى');
      console.error('Error fetching celebrities:', err);
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
    fetchCelebrities();
  }, [month, day]);

  useEffect(() => {
    fetchRelatedArticles();
  }, []);

  // فلترة المشاهير
  const filteredCelebrities = useMemo(() => {
    let filtered = celebrities;

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.includes(searchQuery) ||
          (c.profession && c.profession.includes(searchQuery))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((c) => {
        const profession = c.profession?.toLowerCase() || '';
        return profession.includes(selectedCategory.toLowerCase());
      });
    }

    return filtered;
  }, [celebrities, searchQuery, selectedCategory]);

  // إحصائيات
  const stats = useMemo(() => {
    const professions: Record<string, number> = {};
    celebrities.forEach((c) => {
      const prof = c.profession || 'غير محدد';
      professions[prof] = (professions[prof] || 0) + 1;
    });
    return {
      total: celebrities.length,
      professions,
      oldest:
        celebrities.length > 0
          ? Math.min(...celebrities.map((c) => c.birth_year || 2000))
          : null,
      newest:
        celebrities.length > 0
          ? Math.max(...celebrities.map((c) => c.birth_year || 2000))
          : null,
    };
  }, [celebrities]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-orange-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-40 right-20 w-64 h-64 bg-orange-400/15 rounded-full blur-3xl animate-pulse delay-500" />
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
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl shadow-2xl shadow-yellow-500/30"
            >
              <Star className="w-10 h-10 text-white" />
            </motion.div>

            {/* العنوان */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                مشاهير ولدوا في يومك
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              اكتشف من يشاركك يوم ميلادك من المشاهير
              <br />
              <span className="text-lg text-gray-500 dark:text-gray-400">
                آلاف المشاهير من ممثلين ورياضيين وعلماء وفنانين
              </span>
            </p>

            {/* إحصائيات سريعة */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { icon: Users, label: 'مشهور', value: '5,000+' },
                { icon: Film, label: 'ممثل', value: '1,500+' },
                { icon: Trophy, label: 'رياضي', value: '1,200+' },
                { icon: Music, label: 'فنان', value: '800+' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg"
                >
                  <stat.icon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
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
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  اختر تاريخ ميلادك
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  حدد اليوم والشهر لاكتشاف المشاهير
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
                             focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اليوم
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) =>
                    setDay(
                      Math.min(31, Math.max(1, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                           bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                           focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500
                           transition-all duration-300"
                />
              </div>

              {/* البحث */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  بحث عن مشهور
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو المهنة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                             bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500
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
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl
                           hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300
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
                  تصفية حسب المهنة:
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
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* قسم عرض المشاهير */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Zodiac Sign Banner */}
          {zodiacSign && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                    {zodiacSign.symbol}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      برج {zodiacSign.name}
                    </h3>
                    <p className="text-purple-100 text-sm md:text-base max-w-xl leading-relaxed">
                      {zodiacSign.description}
                    </p>
                  </div>
                </div>
                
                <Link 
                  href="/tools/zodiac-compatibility" 
                  className="group flex items-center gap-3 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                  <span>توافق الأبراج</span>
                </Link>
              </div>
            </motion.div>
          )}

          {/* عنوان النتائج */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  مشاهير {day} {MONTHS[month - 1]}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredCelebrities.length} مشهور
                  {stats.oldest &&
                    stats.newest &&
                    ` (${stats.oldest} - ${stats.newest})`}
                </p>
              </div>
            </div>
          </div>

          {/* حالة التحميل */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <CelebritySkeleton key={i} />
              ))}
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
                onClick={fetchCelebrities}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                إعادة المحاولة
              </button>
            </motion.div>
          )}

          {/* عرض المشاهير */}
          {!loading && !error && (
            <AnimatePresence mode="wait">
              {filteredCelebrities.length > 0 ? (
                <motion.div
                  key="celebrities"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredCelebrities.map((celebrity, index) => {
                    const ProfessionIcon = getProfessionIcon(
                      celebrity.profession
                    );
                    const professionColor = getProfessionColor(
                      celebrity.profession
                    );

                    return (
                      <motion.div
                        key={celebrity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl
                                 border border-gray-100 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600
                                 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-4">
                          {/* صورة/أيقونة المشهور */}
                          <div
                            className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${professionColor} rounded-2xl
                                        flex items-center justify-center text-white shadow-lg`}
                          >
                            <ProfessionIcon className="w-8 h-8" />
                          </div>

                          {/* المحتوى */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                                {celebrity.name}
                              </h3>
                            </div>

                            {celebrity.profession && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full mb-2">
                                <ProfessionIcon className="w-3 h-3" />
                                {celebrity.profession}
                              </span>
                            )}

                            {celebrity.birth_year && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                مواليد {celebrity.birth_year}
                                <span className="text-gray-400 dark:text-gray-500">
                                  (
                                  {new Date().getFullYear() -
                                    celebrity.birth_year}{' '}
                                  سنة)
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-12 text-center"
                >
                  <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    لا يوجد مشاهير لهذا التاريخ
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

      {/* قسم حقائق عن المشاهير */}
      <section className="py-12 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              حقائق عن المشاهير
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              معلومات مثيرة قد لا تعرفها
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CELEBRITY_FACTS.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl
                         border border-gray-100 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600
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
        toolSlug="celebrities"
        pageType="page"
        title="مواضيع ذات صلة بالمشاهير"
        className="bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-900/5 dark:to-amber-900/5"
      />
    </div>
  );
}
