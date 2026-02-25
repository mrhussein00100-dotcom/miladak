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
  'zodiac-compatibility': '❤️',
  'love-calculator': '💘',
  'age-difference': '⏳',
};

// ألوان التدرج للأدوات - استخدام متغيرات الثيم
const toolGradients: Record<string, string> = {
  'age-in-seconds': 'from-primary to-secondary',
  'birthday-countdown': 'from-secondary to-accent',
  'bmi-calculator': 'from-accent to-primary',
  'calorie-calculator': 'from-primary to-accent',
  'days-between': 'from-secondary to-primary',
  'day-of-week': 'from-accent to-secondary',
  'event-countdown': 'from-primary to-secondary',
  'holidays-calculator': 'from-secondary to-accent',
  'islamic-holidays-dates': 'from-accent to-primary',
  'celebration-planner': 'from-primary to-accent',
  'child-age': 'from-secondary to-primary',
  'child-growth': 'from-accent to-secondary',
  'pregnancy-stages': 'from-primary to-secondary',
  'relative-age': 'from-secondary to-accent',
  'life-statistics': 'from-accent to-primary',
  'generation-calculator': 'from-primary to-accent',
  'timezone-calculator': 'from-secondary to-primary',
  'basic-age-calculator': 'from-accent to-secondary',
  'date-converter': 'from-primary to-secondary',
  'zodiac-compatibility': 'from-secondary to-accent',
  'love-calculator': 'from-accent to-primary',
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
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          مجموعة شاملة من الأدوات الحسابية المجانية لمساعدتك في حساب العمر
          والصحة والتواريخ.
        </p>

        {/* إحصائيات سريعة - CSS transitions فقط */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="glass px-6 py-3 rounded-xl border border-primary/20 hover-lift">
            <div className="text-3xl font-bold text-primary">
              {tools.length}+
            </div>
            <div className="text-sm text-muted-foreground">
              🛠️ أداة مجانية
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-xl border border-secondary/20 hover-lift">
            <div className="text-3xl font-bold text-secondary">
              {categories.length}
            </div>
            <div className="text-sm text-muted-foreground">
              📂 تصنيف متنوع
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-xl border border-secondary/20 hover-lift">
            <div className="text-3xl font-bold text-secondary">
              100%
            </div>
            <div className="text-sm text-muted-foreground">
              🎁 مجاني تماماً
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 قسم البحث والفلتر */}
      <div className="glass rounded-2xl p-6 border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="🔍 ابحث عن أداة... (مثال: حاسبة BMI، العمر، السعرات)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2 bg-muted/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-primary'
              }`}
              title="عرض شبكي"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-primary'
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
            <p className="text-sm text-muted-foreground">
              تصفية حسب الفئة:
            </p>
            <div className="bg-primary/10 px-3 py-1 rounded-full">
              <span className="text-sm font-bold text-primary">
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
                  ? 'bg-gradient-to-r from-primary to-secondary'
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
                    ? 'bg-gradient-to-r from-primary to-secondary'
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
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Star className="text-primary-foreground" size={20} />
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
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-primary-foreground">
                {getCategoryIcon(cat.name)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{cat.name}</h2>
                <p className="text-sm text-muted-foreground">{catTools.length} أداة</p>
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
          <div className="glass rounded-2xl p-12 max-w-md mx-auto border-2 border-dashed border-border">
            <Search className="mx-auto text-muted-foreground mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2 text-foreground">
              😕 لم يتم العثور على أدوات
            </h3>
            <p className="text-muted-foreground mb-6">
              جرب البحث بكلمات مختلفة أو اختر فئة أخرى
            </p>
            <Button
              variant="default"
              className="bg-gradient-to-r from-primary to-secondary"
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
        <div className="glass rounded-3xl p-8 md:p-12 border border-border">
          <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-2xl mb-8 text-center">
            <h2 className="text-2xl font-bold">
              🧮 أدوات حسابية مجانية ودقيقة
            </h2>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8">
            موقع ميلادك يقدم لك مجموعة شاملة من الأدوات الحسابية المجانية
            والدقيقة. سواء كنت تريد حساب عمرك، مؤشر كتلة الجسم، السعرات
            الحرارية، أو أي حسابات أخرى، ستجد كل ما تحتاجه هنا.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 rounded-xl text-center hover-lift border border-border">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">حسابات دقيقة</h3>
              <p className="text-muted-foreground text-sm">
                جميع الأدوات تستخدم خوارزميات دقيقة لتقديم نتائج موثوقة
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover-lift border border-border">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">نتائج فورية</h3>
              <p className="text-muted-foreground text-sm">
                احصل على النتائج فوراً بدون انتظار أو تحميل
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center hover-lift border border-border">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">مجاني بالكامل</h3>
              <p className="text-muted-foreground text-sm">
                جميع الأدوات مجانية ولا تحتاج لتسجيل أو اشتراك
              </p>
            </div>
          </div>

          {/* فئات الأدوات */}
          <h3 className="text-xl font-bold text-center mb-6">
            📋 فئات الأدوات المتاحة
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass p-4 rounded-xl border border-border">
              <h4 className="font-bold text-primary mb-2">
                🎂 حسابات العمر
              </h4>
              <p className="text-sm text-muted-foreground">
                حاسبة العمر الدقيقة، العمر بالأيام والساعات، العمر النسبي،
                وإحصاءات الحياة
              </p>
            </div>
            <div className="glass p-4 rounded-xl border border-border">
              <h4 className="font-bold text-secondary mb-2">
                💪 الصحة واللياقة
              </h4>
              <p className="text-sm text-muted-foreground">
                حاسبة BMI، السعرات الحرارية، نمو الطفل، ومراحل الحمل
              </p>
            </div>
            <div className="glass p-4 rounded-xl border border-border">
              <h4 className="font-bold text-accent mb-2">
                📅 التواريخ والوقت
              </h4>
              <p className="text-sm text-muted-foreground">
                الأيام بين تاريخين، يوم الأسبوع، العد التنازلي، والتقويم الهجري
              </p>
            </div>
            <div className="glass p-4 rounded-xl border border-border">
              <h4 className="font-bold text-primary mb-2">
                🎉 المناسبات
              </h4>
              <p className="text-sm text-muted-foreground">
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
  const gradient = toolGradients[tool.slug] || 'from-primary to-secondary';

  if (viewMode === 'list') {
    return (
      <Link href={tool.href || `/tools/${tool.slug}`} className="block">
        <div
          className={`flex items-center gap-4 p-4 bg-card rounded-xl border transition-shadow hover:shadow-lg ${
            featured
              ? 'border-primary/50'
              : 'border-border'
          }`}
        >
          <div
            className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}
          >
            <span className="text-2xl">{emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{tool.title}</h3>
              {featured && (
                <Star
                  className="text-primary shrink-0 fill-primary"
                  size={16}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary"
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
          ? 'ring-2 ring-primary'
          : 'hover:ring-1 hover:ring-primary/50'
      }`}
    >
      {/* بادج "جديد" للأدوات الحديثة */}
      {[
        'timezone-calculator',
        'generation-calculator',
        'celebration-planner',
      ].includes(tool.slug) && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-secondary to-accent text-white text-xs font-bold px-2 py-1 rounded-full z-10">
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
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {tool.title}
              </CardTitle>
              {featured && (
                <Star
                  className="text-primary fill-primary flex-shrink-0"
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
            className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity font-bold text-white shadow-md`}
          >
            استخدم الأداة ←
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
