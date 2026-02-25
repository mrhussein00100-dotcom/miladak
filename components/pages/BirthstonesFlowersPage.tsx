'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Gem,
  Flower2,
  Palette,
  Calendar,
  Search,
  ChevronDown,
  Loader2,
  AlertCircle,
  Sparkles,
  Star,
  Heart,
  BookOpen,
  Info,
  Crown,
  Lightbulb,
} from 'lucide-react';
import KeywordsSection from '@/components/tools/KeywordsSection';

/**
 * Birthstones and Flowers Page Component - Enhanced Version
 * Feature: birthstones-flowers-page-enhancement
 */

interface MonthlyInfo {
  month: number;
  monthName: string;
  birthstone: {
    name: string;
    nameEn?: string;
    properties: string;
  } | null;
  birthFlower: {
    name: string;
    nameEn?: string;
    meaning: string;
  } | null;
  luckyColor: {
    color: string;
    colorEn?: string;
    meaning: string;
  } | null;
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

// بيانات ثابتة للأحجار والزهور (احتياطي)
const BIRTHSTONES_DATA: Record<
  number,
  { name: string; nameEn: string; properties: string; emoji: string }
> = {
  1: {
    name: 'الجارنت',
    nameEn: 'Garnet',
    properties: 'يرمز للحماية والقوة والصداقة',
    emoji: '🔴',
  },
  2: {
    name: 'الجمشت',
    nameEn: 'Amethyst',
    properties: 'يرمز للحكمة والروحانية والسلام',
    emoji: '💜',
  },
  3: {
    name: 'الأكوامارين',
    nameEn: 'Aquamarine',
    properties: 'يرمز للشجاعة والهدوء والوضوح',
    emoji: '💎',
  },
  4: {
    name: 'الألماس',
    nameEn: 'Diamond',
    properties: 'يرمز للحب الأبدي والقوة والنقاء',
    emoji: '💠',
  },
  5: {
    name: 'الزمرد',
    nameEn: 'Emerald',
    properties: 'يرمز للتجدد والحب والخصوبة',
    emoji: '💚',
  },
  6: {
    name: 'اللؤلؤ',
    nameEn: 'Pearl',
    properties: 'يرمز للنقاء والحكمة والثروة',
    emoji: '🤍',
  },
  7: {
    name: 'الياقوت الأحمر',
    nameEn: 'Ruby',
    properties: 'يرمز للشغف والحماية والازدهار',
    emoji: '❤️',
  },
  8: {
    name: 'الزبرجد',
    nameEn: 'Peridot',
    properties: 'يرمز للقوة والتوازن والحماية',
    emoji: '💛',
  },
  9: {
    name: 'الياقوت الأزرق',
    nameEn: 'Sapphire',
    properties: 'يرمز للحكمة والولاء والنبل',
    emoji: '💙',
  },
  10: {
    name: 'الأوبال',
    nameEn: 'Opal',
    properties: 'يرمز للأمل والإبداع والبراءة',
    emoji: '🌈',
  },
  11: {
    name: 'التوباز',
    nameEn: 'Topaz',
    properties: 'يرمز للقوة والذكاء والشفاء',
    emoji: '🧡',
  },
  12: {
    name: 'الفيروز',
    nameEn: 'Turquoise',
    properties: 'يرمز للحظ والنجاح والحماية',
    emoji: '🩵',
  },
};

const BIRTH_FLOWERS_DATA: Record<
  number,
  { name: string; nameEn: string; meaning: string; emoji: string }
> = {
  1: {
    name: 'القرنفل',
    nameEn: 'Carnation',
    meaning: 'الحب والإعجاب والتميز',
    emoji: '🌸',
  },
  2: {
    name: 'البنفسج',
    nameEn: 'Violet',
    meaning: 'الوفاء والتواضع والحكمة',
    emoji: '💜',
  },
  3: {
    name: 'النرجس',
    nameEn: 'Daffodil',
    meaning: 'البدايات الجديدة والتجدد',
    emoji: '🌼',
  },
  4: {
    name: 'الأقحوان',
    nameEn: 'Daisy',
    meaning: 'البراءة والنقاء والحب الصادق',
    emoji: '🌼',
  },
  5: {
    name: 'زنبق الوادي',
    nameEn: 'Lily of the Valley',
    meaning: 'السعادة والتواضع والعودة',
    emoji: '🌷',
  },
  6: {
    name: 'الورد',
    nameEn: 'Rose',
    meaning: 'الحب والجمال والشغف',
    emoji: '🌹',
  },
  7: {
    name: 'الدلفينيوم',
    nameEn: 'Larkspur',
    meaning: 'الحب والمودة والإخلاص',
    emoji: '💐',
  },
  8: {
    name: 'الغلاديولس',
    nameEn: 'Gladiolus',
    meaning: 'القوة والنزاهة والإخلاص',
    emoji: '🌺',
  },
  9: {
    name: 'زهرة النجمة',
    nameEn: 'Aster',
    meaning: 'الحب والصبر والأناقة',
    emoji: '🌸',
  },
  10: {
    name: 'القطيفة',
    nameEn: 'Marigold',
    meaning: 'الدفء والإبداع والعاطفة',
    emoji: '🌻',
  },
  11: {
    name: 'الأقحوان',
    nameEn: 'Chrysanthemum',
    meaning: 'الفرح والتفاؤل والحياة الطويلة',
    emoji: '🌼',
  },
  12: {
    name: 'البونسيتيا',
    nameEn: 'Poinsettia',
    meaning: 'النجاح والاحتفال والبهجة',
    emoji: '🎄',
  },
};

// حقائق مثيرة عن الأحجار والزهور
const INTERESTING_FACTS = [
  {
    icon: '💎',
    title: 'أقدم حجر',
    description: 'الزركون أقدم معدن على الأرض، عمره 4.4 مليار سنة',
  },
  {
    icon: '🌹',
    title: 'ملكة الزهور',
    description: 'الورد يُزرع منذ أكثر من 5000 عام',
  },
  {
    icon: '💍',
    title: 'الألماس الأبدي',
    description: 'الألماس هو أصلب مادة طبيعية على الأرض',
  },
  {
    icon: '🌸',
    title: 'لغة الزهور',
    description: 'في العصر الفيكتوري، كانت الزهور وسيلة للتواصل السري',
  },
];

export default function BirthstonesFlowersPageClient() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyData, setMonthlyData] = useState<MonthlyInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  // جلب بيانات الشهر
  const fetchMonthData = async (month: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/monthly-info/${month}`);
      if (!response.ok) throw new Error('فشل في جلب البيانات');
      const data = await response.json();
      if (data.success) {
        setMonthlyData(data.data);
      } else {
        // استخدام البيانات الثابتة كاحتياط
        setMonthlyData({
          month,
          monthName: MONTHS[month - 1],
          birthstone: BIRTHSTONES_DATA[month],
          birthFlower: BIRTH_FLOWERS_DATA[month],
          luckyColor: null,
        });
      }
    } catch (err) {
      console.error('Error fetching month data:', err);
      // استخدام البيانات الثابتة كاحتياط
      setMonthlyData({
        month,
        monthName: MONTHS[month - 1],
        birthstone: BIRTHSTONES_DATA[month],
        birthFlower: BIRTH_FLOWERS_DATA[month],
        luckyColor: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // جلب المقالات ذات الصلة
  const fetchRelatedArticles = async () => {
    setArticlesLoading(true);
    try {
      const response = await fetch('/api/articles?limit=6');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.data?.items || []);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setArticlesLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthData(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    fetchRelatedArticles();
  }, []);

  // بيانات جميع الشهور للعرض الشامل
  const allMonthsData = useMemo(() => {
    return MONTHS.map((name, index) => ({
      month: index + 1,
      monthName: name,
      birthstone: BIRTHSTONES_DATA[index + 1],
      birthFlower: BIRTH_FLOWERS_DATA[index + 1],
    }));
  }, []);

  // فلترة الشهور حسب البحث
  const filteredMonths = useMemo(() => {
    if (!searchQuery) return allMonthsData;
    const query = searchQuery.toLowerCase();
    return allMonthsData.filter(
      (m) =>
        m.monthName.includes(query) ||
        m.birthstone.name.includes(query) ||
        m.birthstone.nameEn.toLowerCase().includes(query) ||
        m.birthFlower.name.includes(query) ||
        m.birthFlower.nameEn.toLowerCase().includes(query)
    );
  }, [allMonthsData, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 dark:from-primary/20 dark:via-secondary/20 dark:to-accent/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
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
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl shadow-primary/30"
            >
              <Gem className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            {/* العنوان */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                أحجار وزهور الميلاد
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              اكتشف حجر ميلادك وزهرة ميلادك الخاصة
              <br />
              <span className="text-lg text-muted-foreground/80">
                معاني ورموز فريدة لكل شهر من شهور السنة
              </span>
            </p>

            {/* إحصائيات سريعة */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { icon: Gem, label: 'حجر كريم', value: '12' },
                { icon: Flower2, label: 'زهرة', value: '12' },
                { icon: Palette, label: 'لون محظوظ', value: '12' },
                { icon: Star, label: 'معنى فريد', value: '36+' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50"
                >
                  <stat.icon className="w-5 h-5 text-primary" />
                  <span className="font-bold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* قسم اختيار الشهر */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl shadow-xl p-6 md:p-8 border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">
                    اختر شهر ميلادك
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    اكتشف حجرك وزهرتك الخاصة
                  </p>
                </div>
              </div>

              {/* تبديل وضع العرض */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('single')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    viewMode === 'single'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  شهر واحد
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    viewMode === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  كل الشهور
                </button>
              </div>
            </div>

            {viewMode === 'single' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* اختيار الشهر */}
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    الشهر
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) =>
                        setSelectedMonth(parseInt(e.target.value))
                      }
                      className="w-full appearance-none px-4 py-3 pr-10 border-2 border-input rounded-xl 
                               bg-background text-foreground
                               focus:ring-2 focus:ring-primary/20 focus:border-primary
                               transition-all duration-300 cursor-pointer"
                    >
                      {MONTHS.map((m, i) => (
                        <option key={i} value={i + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* زر الشهر الحالي */}
                <div className="flex items-end">
                  <button
                    onClick={() => setSelectedMonth(new Date().getMonth() + 1)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl
                             hover:shadow-lg hover:shadow-primary/30 transition-all duration-300
                             flex items-center justify-center gap-2 font-medium"
                  >
                    <Sparkles className="w-5 h-5" />
                    شهري الحالي
                  </button>
                </div>
              </div>
            ) : (
              /* البحث في كل الشهور */
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ابحث عن حجر أو زهرة
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم العربي أو الإنجليزي..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                             bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-primary/20 focus:border-primary
                             transition-all duration-300"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* قسم عرض النتائج */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {viewMode === 'single' ? (
            /* عرض شهر واحد */
            <>
              {/* عنوان النتائج */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    شهر {MONTHS[selectedMonth - 1]}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    حجرك وزهرتك الخاصة
                  </p>
                </div>
              </div>

              {/* حالة التحميل */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">
                    جاري تحميل البيانات...
                  </p>
                </div>
              )}

              {/* حالة الخطأ */}
              {error && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center"
                >
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <p className="text-destructive font-medium">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* عرض البيانات */}
              {!loading && !error && monthlyData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* بطاقة الحجر */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl p-6 shadow-lg border border-border
                             hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">
                          {BIRTHSTONES_DATA[selectedMonth]?.emoji || '💎'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-card-foreground">
                          حجر الميلاد
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Birthstone
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {monthlyData.birthstone?.name ||
                            BIRTHSTONES_DATA[selectedMonth]?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {monthlyData.birthstone?.nameEn ||
                            BIRTHSTONES_DATA[selectedMonth]?.nameEn}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {monthlyData.birthstone?.properties ||
                          BIRTHSTONES_DATA[selectedMonth]?.properties}
                      </p>
                    </div>
                  </motion.div>

                  {/* بطاقة الزهرة */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl p-6 shadow-lg border border-border
                             hover:shadow-xl hover:border-secondary/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">
                          {BIRTH_FLOWERS_DATA[selectedMonth]?.emoji || '🌸'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-card-foreground">
                          زهرة الميلاد
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Birth Flower
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-secondary">
                          {monthlyData.birthFlower?.name ||
                            BIRTH_FLOWERS_DATA[selectedMonth]?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {monthlyData.birthFlower?.nameEn ||
                            BIRTH_FLOWERS_DATA[selectedMonth]?.nameEn}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {monthlyData.birthFlower?.meaning ||
                          BIRTH_FLOWERS_DATA[selectedMonth]?.meaning}
                      </p>
                    </div>
                  </motion.div>

                  {/* بطاقة اللون المحظوظ */}
                  {monthlyData.luckyColor && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-card rounded-2xl p-6 shadow-lg border border-border
                               hover:shadow-xl hover:border-accent/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg">
                          <Palette className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-card-foreground">
                            اللون المحظوظ
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Lucky Color
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-2xl font-bold text-accent">
                          {monthlyData.luckyColor.color}
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {monthlyData.luckyColor.meaning}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* عرض كل الشهور */
            <AnimatePresence mode="wait">
              {filteredMonths.length > 0 ? (
                <motion.div
                  key="months"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredMonths.map((data, index) => (
                    <motion.div
                      key={data.month}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedMonth(data.month);
                        setViewMode('single');
                      }}
                      className="group bg-card rounded-2xl p-6 shadow-lg cursor-pointer
                               border border-border hover:border-primary/50
                               transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                          {data.monthName}
                        </h3>
                        <span className="text-2xl">
                          {data.birthstone.emoji}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Gem className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">
                            {data.birthstone.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flower2 className="w-4 h-4 text-secondary" />
                          <span className="text-muted-foreground">
                            {data.birthFlower.name}
                          </span>
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
                  className="bg-muted/30 rounded-3xl p-12 text-center"
                >
                  <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    لا توجد نتائج
                  </h3>
                  <p className="text-muted-foreground">
                    جرب البحث بكلمة أخرى
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* قسم حقائق مثيرة */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
              <Lightbulb className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              حقائق مثيرة
            </h2>
            <p className="text-muted-foreground">
              معلومات قد لا تعرفها عن الأحجار والزهور
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INTERESTING_FACTS.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl
                         border border-border hover:border-primary/50
                         transition-all duration-300 transform hover:-translate-y-2"
              >
                <span className="text-4xl mb-4 block">{fact.icon}</span>
                <h3 className="text-lg font-bold text-card-foreground mb-2">
                  {fact.title}
                </h3>
                <p className="text-sm text-muted-foreground">
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
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    مقالات ذات صلة
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    اقرأ المزيد عن الأحجار والزهور
                  </p>
                </div>
              </div>
              <Link
                href="/articles"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary
                         rounded-xl hover:bg-primary/20 transition-colors font-medium"
              >
                عرض الكل
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </Link>
            </motion.div>

            {articlesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
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
                      className="group block bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl
                               border border-border hover:border-primary/50
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
                        <h3 className="text-lg font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
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
        toolSlug="birthstones-flowers"
        pageType="page"
        title="مواضيع ذات صلة بالأحجار والزهور"
        className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/5 dark:to-secondary/5"
      />
    </div>
  );
}
