'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Palette,
  Hash,
  Calendar,
  Sparkles,
  Star,
  ChevronDown,
  Loader2,
  AlertCircle,
  BookOpen,
  Lightbulb,
  Heart,
  Zap,
  Crown,
  Target,
} from 'lucide-react';
import ColorNumbersResults from '@/components/enhanced/ColorNumbersResults';
import { useColorNumbers } from '@/hooks/useColorNumbers';
import { UserInput } from '@/lib/colorNumbersUtils';
import KeywordsSection from '@/components/tools/KeywordsSection';

/**
 * Colors and Numbers Page Component - Enhanced Version
 * Feature: colors-numbers-page-enhancement
 */

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
}

// حقائق مثيرة عن الألوان والأرقام
const INTERESTING_FACTS = [
  {
    icon: '🎨',
    title: 'علم الألوان',
    description: 'الألوان تؤثر على مزاجنا وقراراتنا بشكل لا واعي',
  },
  {
    icon: '🔢',
    title: 'علم الأرقام',
    description: 'علم الأرقام يعود لآلاف السنين في الحضارات القديمة',
  },
  {
    icon: '💜',
    title: 'اللون الملكي',
    description: 'البنفسجي كان لون الملوك لأن صبغته كانت نادرة وغالية',
  },
  {
    icon: '7️⃣',
    title: 'الرقم السحري',
    description: 'الرقم 7 يعتبر محظوظاً في معظم الثقافات حول العالم',
  },
];

export default function ColorsNumbersPageClient() {
  const [userInput, setUserInput] = useState<UserInput>({
    day: 0,
    month: 0,
    year: 0,
  });
  const { result, loading, error, validationErrors, calculateColorsNumbers } =
    useColorNumbers();
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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
    fetchRelatedArticles();
  }, []);

  const handleInputChange = (field: keyof UserInput, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setUserInput((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = async () => {
    await calculateColorsNumbers(userInput);
  };

  const handleShare = async () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getFieldError = (field: keyof UserInput) => {
    return validationErrors.find((error) => error.field === field)?.message;
  };

  const setToday = () => {
    const today = new Date();
    setUserInput({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    });
  };

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
              <Palette className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            {/* العنوان */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                الألوان والأرقام المحظوظة
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              اكتشف ألوانك وأرقامك المحظوظة بناءً على تاريخ ميلادك
              <br />
              <span className="text-lg text-muted-foreground/80">
                تحليل شامل يعتمد على علم الأرقام والبرج الصيني
              </span>
            </p>

            {/* إحصائيات سريعة */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { icon: Palette, label: 'لون محظوظ', value: '∞' },
                { icon: Hash, label: 'رقم الحياة', value: '9' },
                { icon: Star, label: 'برج صيني', value: '12' },
                { icon: Heart, label: 'توافق', value: '100%' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50"
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

      {/* قسم إدخال التاريخ */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl shadow-xl p-6 md:p-8 border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  أدخل تاريخ ميلادك
                </h2>
                <p className="text-sm text-muted-foreground">
                  لاكتشاف ألوانك وأرقامك المحظوظة
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* اليوم */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اليوم
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={userInput.day || ''}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-center text-lg font-medium
                    ${
                      getFieldError('day')
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }
                    bg-background text-foreground
                    focus:ring-2 focus:ring-primary/20 transition-all duration-300`}
                  placeholder="يوم"
                />
                {getFieldError('day') && (
                  <p className="text-destructive text-sm mt-1">
                    {getFieldError('day')}
                  </p>
                )}
              </div>

              {/* الشهر */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  الشهر
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={userInput.month || ''}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-center text-lg font-medium
                    ${
                      getFieldError('month')
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }
                    bg-background text-foreground
                    focus:ring-2 focus:ring-primary/20 transition-all duration-300`}
                  placeholder="شهر"
                />
                {getFieldError('month') && (
                  <p className="text-destructive text-sm mt-1">
                    {getFieldError('month')}
                  </p>
                )}
              </div>

              {/* السنة */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  السنة
                </label>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={userInput.year || ''}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-center text-lg font-medium
                    ${
                      getFieldError('year')
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }
                    bg-background text-foreground
                    focus:ring-2 focus:ring-primary/20 transition-all duration-300`}
                  placeholder="سنة"
                />
                {getFieldError('year') && (
                  <p className="text-destructive text-sm mt-1">
                    {getFieldError('year')}
                  </p>
                )}
              </div>

              {/* زر اليوم */}
              <div className="flex items-end">
                <button
                  onClick={setToday}
                  className="w-full px-4 py-3 bg-muted text-muted-foreground rounded-xl
                           hover:bg-muted/80 transition-all duration-300
                           flex items-center justify-center gap-2 font-medium"
                >
                  <Zap className="w-5 h-5" />
                  اليوم
                </button>
              </div>
            </div>

            {/* زر الحساب */}
            <div className="mt-6 text-center">
              <button
                onClick={handleCalculate}
                disabled={
                  !userInput.day ||
                  !userInput.month ||
                  !userInput.year ||
                  loading
                }
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium rounded-xl
                         hover:shadow-lg hover:shadow-primary/30 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الحساب...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    اكتشف ألوانك وأرقامك المحظوظة
                  </>
                )}
              </button>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center"
              >
                <AlertCircle className="w-5 h-5 text-destructive inline-block mr-2" />
                <span className="text-destructive font-medium">{error}</span>
              </motion.div>
            )}

            {/* رسالة النسخ */}
            {copySuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl text-center"
              >
                <span className="text-primary font-medium">
                  ✅ تم نسخ النتائج بنجاح!
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* قسم النتائج */}
      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    نتائجك الشخصية
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    ألوانك وأرقامك المحظوظة
                  </p>
                </div>
              </div>
              <ColorNumbersResults result={result} onShare={handleShare} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

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
              معلومات عن الألوان والأرقام
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
                <h3 className="text-lg font-bold text-foreground mb-2">
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
                    اقرأ المزيد عن الألوان والأرقام
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
                               transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
        toolSlug="colors-numbers"
        pageType="page"
        title="مواضيع ذات صلة بالألوان والأرقام"
        className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
      />
    </div>
  );
}
