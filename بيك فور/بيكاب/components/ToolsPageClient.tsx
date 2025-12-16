/**
 * 🎨 ToolsPageClient - النسخة الخفيفة v4.0
 *
 * التحسينات:
 * ✅ بدون framer-motion - CSS فقط للأداء
 * ✅ Hero Section خفيف وسريع
 * ✅ تأثيرات hover بـ CSS transitions
 * ✅ دعم reduced-motion
 * ✅ مناسب لـ AdSense
 *
 * آخر تحديث: 2024
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';
import { Button } from './ui/Button';
import {
  Search,
  Star,
  Grid,
  List,
  ChevronDown,
  Sparkles,
  Calculator,
  Heart,
  Calendar,
  Baby,
  Zap,
  PartyPopper,
} from 'lucide-react';
import type { Tool, ToolCategory } from '@/types';
import { HeaderAd, InContentAd, FooterAd } from './AdSense/AdSenseSlot';

// خريطة الإيموجي للأدوات
const toolEmojis: Record<string, string> = {
  'age-in-seconds': '⏱️',
  'birthday-countdown': '🎂',
  'bmi-calculator': '⚖️',
  'calorie-calculator': '🔥',
  'days-between': '📅',
  'day-of-week': '📆',
  'event-countdown': '⏳',
  'holidays-calculator': '🎊',
  'islamic-holidays-dates': '🌙',
  'celebration-planner': '🎉',
  'child-age': '👶',
  'child-growth': '📈',
  'pregnancy-stages': '🤰',
  'relative-age': '👥',
  'life-statistics': '📊',
  'generation-calculator': '👨‍👩‍👧‍👦',
  'timezone-calculator': '🌍',
  'age-calculator': '🎂',
  'basic-age-calculator': '🎂',
  'date-converter': '📅',
};

// ألوان التدرج للأدوات
const toolGradients: Record<string, string> = {
  'age-in-seconds': 'from-blue-500 to-cyan-500',
  'birthday-countdown': 'from-pink-500 to-rose-500',
  'bmi-calculator': 'from-green-500 to-emerald-500',
  'calorie-calculator': 'from-orange-500 to-amber-500',
  'days-between': 'from-indigo-500 to-purple-500',
  'day-of-week': 'from-violet-500 to-purple-500',
  'event-countdown': 'from-red-500 to-pink-500',
  'holidays-calculator': 'from-yellow-500 to-orange-500',
  'islamic-holidays-dates': 'from-emerald-500 to-teal-500',
  'celebration-planner': 'from-fuchsia-500 to-pink-500',
  'child-age': 'from-sky-500 to-blue-500',
  'child-growth': 'from-lime-500 to-green-500',
  'pregnancy-stages': 'from-rose-500 to-pink-500',
  'relative-age': 'from-cyan-500 to-blue-500',
  'life-statistics': 'from-purple-500 to-indigo-500',
  'generation-calculator': 'from-teal-500 to-cyan-500',
  'timezone-calculator': 'from-blue-500 to-indigo-500',
  'basic-age-calculator': 'from-purple-500 to-pink-500',
  'date-converter': 'from-indigo-500 to-blue-500',
};

interface ToolsPageClientProps {
  tools: Tool[];
  categories: ToolCategory[];
}

export function ToolsPageClient({ tools, categories }: ToolsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        !selectedCategory || tool.category_id.toString() === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  const featuredTools = useMemo(
    () => tools.filter((tool) => tool.featured),
    [tools]
  );

  const toolsByCategory = useMemo(() => {
    const grouped: Record<number, Tool[]> = {};
    filteredTools.forEach((tool) => {
      if (!grouped[tool.category_id]) grouped[tool.category_id] = [];
      grouped[tool.category_id].push(tool);
    });
    return grouped;
  }, [filteredTools]);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 6);

  const getCategoryIcon = (name: string) => {
    const icons: Record<string, React.ReactNode> = {
      'حاسبات العمر': <Calculator className="w-5 h-5" />,
      'الصحة واللياقة': <Heart className="w-5 h-5" />,
      'التواريخ والأوقات': <Calendar className="w-5 h-5" />,
      'الأعياد والمناسبات': <PartyPopper className="w-5 h-5" />,
      'الأطفال والعائلة': <Baby className="w-5 h-5" />,
    };
    return icons[name] || <Zap className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8">
      {/* 🎨 Hero Section - خفيف بدون أنيميشن JavaScript */}
      <div className="text-center mb-12 fade-in">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
          <span className="text-4xl md:text-5xl not-prose">🎯</span>
          <span className="gradient-text">أدوات ميلادك الحسابية</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          مجموعة شاملة من الأدوات الحسابية المجانية لمساعدتك في حساب العمر
          والصحة والتواريخ.
        </p>

        {/* إحصائيات سريعة - CSS transitions فقط */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="glass px-6 py-3 rounded-xl border border-purple-200 dark:border-purple-800 hover-lift">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {tools.length}+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              🛠️ أداة مجانية
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-xl border border-green-200 dark:border-green-800 hover-lift">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              📂 تصنيف متنوع
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-xl border border-blue-200 dark:border-blue-800 hover-lift">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              100%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              🎁 مجاني تماماً
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 قسم البحث والفلتر */}
      <div className="glass rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="🔍 ابحث عن أداة... (مثال: حاسبة BMI، العمر، السعرات)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
              title="عرض شبكي"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
              title="عرض قائمة"
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* فلتر التصنيفات */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              تصفية حسب الفئة:
            </p>
            <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                📊 {filteredTools.length} أداة
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                  : ''
              }`}
            >
              <Sparkles size={14} className="ml-1" />
              الكل ({tools.length})
            </Button>
            {visibleCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={
                  selectedCategory === cat.id.toString() ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`rounded-full ${
                  selectedCategory === cat.id.toString()
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : ''
                }`}
              >
                <span className="ml-1">{getCategoryIcon(cat.name)}</span>
                {cat.name}
              </Button>
            ))}
            {categories.length > 6 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="rounded-full"
              >
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform ${
                    showAllCategories ? 'rotate-180' : ''
                  }`}
                />
                {showAllCategories ? 'أقل' : `+${categories.length - 6}`}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 📢 إعلان أعلى الصفحة - بعد Hero Section */}
      <HeaderAd className="my-4" />

      {/* الأدوات المميزة */}
      {!selectedCategory && !searchQuery && featuredTools.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Star className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold">الأدوات المميزة</h2>
          </div>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {featuredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                featured
                viewMode={viewMode}
              />
            ))}
          </div>
        </section>
      )}

      {/* الأدوات حسب التصنيف */}
      {categories.map((cat, catIndex) => {
        const catTools = toolsByCategory[cat.id];
        if (!catTools?.length) return null;
        return (
          <section key={cat.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                {getCategoryIcon(cat.name)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{cat.name}</h2>
                <p className="text-sm text-gray-500">{catTools.length} أداة</p>
              </div>
            </div>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {catTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} viewMode={viewMode} />
              ))}
            </div>

            {/* 📢 إعلان داخل المحتوى - بعد التصنيف الثاني */}
            {catIndex === 1 && <InContentAd className="my-8" />}
          </section>
        );
      })}

      {/* رسالة عدم وجود نتائج */}
      {filteredTools.length === 0 && (
        <div className="text-center py-16 fade-in">
          <div className="glass rounded-2xl p-12 max-w-md mx-auto border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Search className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              😕 لم يتم العثور على أدوات
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              جرب البحث بكلمات مختلفة أو اختر فئة أخرى
            </p>
            <Button
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              🔄 إعادة تعيين البحث
            </Button>
          </div>
        </div>
      )}

      {/* 📢 إعلان أسفل الصفحة */}
      <FooterAd className="my-8" />

      {/* قسم SEO */}
      <section className="mt-16">
        <div className="glass rounded-3xl p-8 md:p-12 border border-purple-200 dark:border-purple-800">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl mb-8 text-center">
            <h2 className="text-2xl font-bold">
              🧮 أدوات حسابية مجانية ودقيقة
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8">
            موقع ميلادك يقدم لك مجموعة شاملة من الأدوات الحسابية المجانية
            والدقيقة. سواء كنت تريد حساب عمرك، مؤشر كتلة الجسم، السعرات
            الحرارية، أو أي حسابات أخرى، ستجد كل ما تحتاجه هنا.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 rounded-xl text-center hover-lift">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">حسابات دقيقة</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                جميع الأدوات تستخدم خوارزميات دقيقة لتقديم نتائج موثوقة
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover-lift">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">نتائج فورية</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                احصل على النتائج فوراً بدون انتظار أو تحميل
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover-lift">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">مجاني بالكامل</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                جميع الأدوات مجانية ولا تحتاج لتسجيل أو اشتراك
              </p>
            </div>
          </div>

          {/* فئات الأدوات */}
          <h3 className="text-xl font-bold text-center mb-6">
            📋 فئات الأدوات المتاحة
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass p-4 rounded-xl">
              <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">
                🎂 حسابات العمر
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                حاسبة العمر الدقيقة، العمر بالأيام والساعات، العمر النسبي،
                وإحصاءات الحياة
              </p>
            </div>
            <div className="glass p-4 rounded-xl">
              <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">
                💪 الصحة واللياقة
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                حاسبة BMI، السعرات الحرارية، نمو الطفل، ومراحل الحمل
              </p>
            </div>
            <div className="glass p-4 rounded-xl">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">
                📅 التواريخ والوقت
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                الأيام بين تاريخين، يوم الأسبوع، العد التنازلي، والتقويم الهجري
              </p>
            </div>
            <div className="glass p-4 rounded-xl">
              <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2">
                🎉 المناسبات
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                العد التنازلي لعيد الميلاد، الأعياد الإسلامية، ومخطط الاحتفالات
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolCard({
  tool,
  featured = false,
  viewMode = 'grid',
}: {
  tool: Tool;
  featured?: boolean;
  viewMode?: 'grid' | 'list';
}) {
  const emoji = toolEmojis[tool.slug] || '🔧';
  const gradient = toolGradients[tool.slug] || 'from-purple-500 to-pink-500';

  if (viewMode === 'list') {
    return (
      <Link href={tool.href || `/tools/${tool.slug}`} className="block">
        <div
          className={`flex items-center gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border transition-shadow hover:shadow-lg ${
            featured
              ? 'border-purple-400/50 dark:border-purple-500/50'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div
            className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}
          >
            <span className="text-2xl">{emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">
                {tool.title || tool.name}
              </h3>
              {featured && (
                <Star
                  className="text-purple-500 shrink-0 fill-purple-500"
                  size={16}
                />
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{tool.description}</p>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            استخدم
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-200 overflow-hidden relative h-full flex flex-col ${
        featured
          ? 'ring-2 ring-purple-400 dark:ring-purple-500'
          : 'hover:ring-1 hover:ring-purple-300 dark:hover:ring-purple-700'
      }`}
    >
      {/* بادج "جديد" للأدوات الحديثة */}
      {[
        'timezone-calculator',
        'generation-calculator',
        'celebration-planner',
      ].includes(tool.slug) && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          جديد ✨
        </div>
      )}

      <CardHeader className="flex-shrink-0">
        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-lg flex-shrink-0`}
          >
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {tool.title || tool.name}
              </CardTitle>
              {featured && (
                <Star
                  className="text-purple-500 fill-purple-500 flex-shrink-0"
                  size={16}
                />
              )}
            </div>
            <CardDescription className="mt-1 line-clamp-2">
              {tool.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Link href={tool.href || `/tools/${tool.slug}`}>
          <Button
            className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity font-bold`}
          >
            استخدم الأداة ←
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
