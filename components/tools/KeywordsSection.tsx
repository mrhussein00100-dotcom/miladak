'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Tag, Loader2, ExternalLink } from 'lucide-react';

interface KeywordGroup {
  name: string;
  icon: string;
  keywords: string[];
}

interface KeywordsSectionProps {
  onKeywordClick?: (keyword: string) => void;
  toolSlug?: string;
  pageType?: 'tool' | 'page' | 'article';
  className?: string;
  title?: string;
}

// الكلمات المفتاحية الافتراضية للصفحة الرئيسية - 6 أقسام × 20 كلمة
const defaultKeywordGroups: KeywordGroup[] = [
  {
    name: 'حسابات العمر',
    icon: '🎂',
    keywords: [
      'حاسبة العمر',
      'حساب العمر',
      'كم عمري',
      'عمري بالأيام',
      'عمري بالساعات',
      'عمري بالثواني',
      'حاسبة العمر الدقيقة',
      'احسب عمرك',
      'العمر بالهجري',
      'العمر بالميلادي',
      'حاسبة السن',
      'معرفة العمر',
      'حساب تاريخ الميلاد',
      'عمري بالدقائق',
      'العمر الدقيق',
      'حساب عمري',
      'كم عمري بالضبط',
      'حاسبة العمر أونلاين',
      'عمري الحقيقي',
      'حساب العمر بالتفصيل',
    ],
  },
  {
    name: 'الصحة واللياقة',
    icon: '💪',
    keywords: [
      'حاسبة BMI',
      'مؤشر كتلة الجسم',
      'حاسبة السعرات الحرارية',
      'حاسبة الوزن المثالي',
      'حاسبة السعرات',
      'حساب السعرات الحرارية',
      'وزن مثالي',
      'حرق السعرات',
      'نظام غذائي',
      'لياقة بدنية',
      'صحة ولياقة',
      'تغذية صحية',
      'حاسبة الوزن',
      'مؤشر الكتلة',
      'حساب الوزن',
      'صحة عامة',
      'رشاقة',
      'حاسبة الدهون',
      'السعرات اليومية',
      'الوزن الصحي',
    ],
  },
  {
    name: 'التواريخ والأوقات',
    icon: '📅',
    keywords: [
      'حاسبة الأيام',
      'الفرق بين تاريخين',
      'حاسبة الأيام بين تاريخين',
      'يوم الأسبوع',
      'العد التنازلي',
      'عد تنازلي لعيد الميلاد',
      'كم يوم باقي',
      'حاسبة التواريخ',
      'حاسبة الوقت',
      'فرق التوقيت',
      'المناطق الزمنية',
      'حاسبة المناطق الزمنية',
      'تحويل التاريخ',
      'التقويم الهجري',
      'التقويم الميلادي',
      'حساب الأيام',
      'عدد الأيام',
      'تحويل هجري ميلادي',
      'حاسبة الأسابيع',
      'حاسبة الشهور',
    ],
  },
  {
    name: 'الحمل والأطفال',
    icon: '👶',
    keywords: [
      'حاسبة الحمل',
      'مراحل الحمل',
      'حاسبة نمو الطفل',
      'عمر الطفل',
      'تطور الطفل',
      'حاسبة الحمل بالأسابيع',
      'متابعة الحمل',
      'نمو الجنين',
      'صحة الحامل',
      'رعاية الحامل',
      'حاسبة عمر الطفل',
      'صحة الأطفال',
      'تربية الأطفال',
      'نصائح للحامل',
      'مراحل نمو الطفل',
      'حاسبة الولادة',
      'موعد الولادة',
      'حاسبة الحمل الدقيقة',
      'أسابيع الحمل',
      'تطور الجنين',
    ],
  },
  {
    name: 'المناسبات والأعياد',
    icon: '🎉',
    keywords: [
      'مخطط الاحتفالات',
      'الأعياد الإسلامية',
      'مواعيد الأعياد',
      'حاسبة الأعياد',
      'تخطيط حفلة عيد ميلاد',
      'مناسبات',
      'أعياد',
      'احتفالات',
      'عيد الفطر',
      'عيد الأضحى',
      'رمضان',
      'مناسبات إسلامية',
      'تخطيط احتفال',
      'حفلة عيد ميلاد',
      'مناسبات سعيدة',
      'تهنئة عيد ميلاد',
      'بطاقات تهنئة',
      'أفكار احتفالات',
      'هدايا عيد ميلاد',
      'ديكور حفلات',
    ],
  },
  {
    name: 'أدوات ميلادك',
    icon: '🔧',
    keywords: [
      'حاسبة الأجيال',
      'إحصائيات الحياة',
      'مقارنة الأعمار',
      'العمر النسبي',
      'حاسبة الإحصائيات',
      'موقع ميلادك',
      'ميلادك حاسبة العمر',
      'ميلادك أدوات',
      'حاسبة ميلادك',
      'أدوات ميلادك المجانية',
      'ميلادك للحسابات',
      'حاسبات ميلادك',
      'ميلادك الحاسبة الذكية',
      'أدوات ميلادك الحسابية',
      'ميلادك أونلاين',
      'ميلادك العربي',
      'حاسبة البرج',
      'البرج الصيني',
      'حجر الميلاد',
      'زهرة الميلاد',
    ],
  },
];

export default function KeywordsSection({
  onKeywordClick,
  toolSlug,
  pageType = 'tool',
  className = '',
  title = 'مواضيع ذات صلة',
}: KeywordsSectionProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dbKeywords, setDbKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // جلب الكلمات المفتاحية من قاعدة البيانات إذا تم تحديد toolSlug
  useEffect(() => {
    if (toolSlug) {
      setLoading(true);
      fetch(`/api/page-keywords/${pageType}/${toolSlug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.keywords && Array.isArray(data.keywords)) {
            setDbKeywords(data.keywords);
          }
        })
        .catch((err) => console.error('Error fetching keywords:', err))
        .finally(() => setLoading(false));
    }
  }, [toolSlug, pageType]);

  // استخدام الكلمات من قاعدة البيانات إذا وجدت، وإلا استخدام الافتراضية
  const keywordGroups = useMemo(() => {
    if (dbKeywords.length > 0) {
      // تقسيم الكلمات إلى 6 مجموعات، كل مجموعة 20 كلمة
      const groupSize = 20;
      const groupConfigs = [
        { name: 'الأكثر بحثاً', icon: '🔥' },
        { name: 'مواضيع مشابهة', icon: '💡' },
        { name: 'قد يعجبك أيضاً', icon: '⭐' },
        { name: 'اكتشف المزيد', icon: '🌟' },
        { name: 'مواضيع شائعة', icon: '📈' },
        { name: 'اقتراحات لك', icon: '💎' },
      ];

      return groupConfigs
        .map((config, index) => ({
          ...config,
          keywords: dbKeywords.slice(
            index * groupSize,
            (index + 1) * groupSize
          ),
        }))
        .filter((g) => g.keywords.length > 0);
    }
    return defaultKeywordGroups;
  }, [dbKeywords]);

  // فلترة الكلمات المفتاحية
  const filteredGroups = useMemo(() => {
    return keywordGroups
      .map((group) => ({
        ...group,
        keywords: group.keywords.filter((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.keywords.length > 0);
  }, [keywordGroups, searchTerm]);

  const router = useRouter();

  // إنشاء رابط البحث للكلمة المفتاحية
  const getSearchUrl = (keyword: string) => {
    return `/search?q=${encodeURIComponent(keyword)}`;
  };

  const handleKeywordClick = (keyword: string) => {
    if (onKeywordClick) {
      onKeywordClick(keyword);
    } else {
      // الانتقال لصفحة البحث مع الكلمة المفتاحية
      router.push(getSearchUrl(keyword));
    }
  };

  const totalKeywords = keywordGroups.reduce(
    (total, group) => total + group.keywords.length,
    0
  );

  return (
    <section
      className={`relative py-16 overflow-hidden ${className}`}
      aria-label="مواضيع ذات صلة"
    >
      {/* خلفية زخرفية مطابقة لقسم الدليل الشامل */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:via-transparent dark:to-secondary/10"></div>

      <div className="relative container mx-auto px-4">
        {/* رأس القسم مطابق للمقالات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                <Tag className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-xs font-bold">
                {totalKeywords}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                مواضيع مختارة خصيصاً لك
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* شريط البحث مدمج في الهيدر */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في المواضيع..."
                className="w-64 px-4 py-2.5 pr-10 border-2 border-border rounded-xl 
                         bg-card text-foreground
                         focus:ring-2 focus:ring-primary/20 focus:border-primary
                         transition-all duration-300 shadow-lg"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>

            {loading && (
              <div
                className="group p-3 rounded-xl bg-card 
                           border-2 border-border
                           transition-all duration-300 shadow-lg"
              >
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            )}
          </div>
        </motion.div>

        {/* فلاتر المجموعات مطابقة للمقالات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedGroup(null)}
            className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              selectedGroup === null
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-xl shadow-primary/25'
                : 'bg-card text-card-foreground hover:bg-primary/5 border-2 border-border hover:border-primary/50'
            }`}
          >
            <span>جميع المواضيع</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                selectedGroup === null
                  ? 'bg-white/20 text-white'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {totalKeywords}
            </span>
          </button>

          {keywordGroups.map((group) => (
            <button
              key={group.name}
              onClick={() => setSelectedGroup(group.name)}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedGroup === group.name
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-xl shadow-primary/25'
                  : 'bg-card text-card-foreground hover:bg-primary/5 border-2 border-border hover:border-primary/50'
              }`}
            >
              <span className="text-lg">{group.icon}</span>
              <span>{group.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  selectedGroup === group.name
                    ? 'bg-white/20 text-white'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {group.keywords.length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* شبكة المواضيع - 6 أقسام في شبكة 2×3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGroups
            .filter(
              (group) => selectedGroup === null || group.name === selectedGroup
            )
            .map((group, groupIndex) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: groupIndex * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
                className="group"
              >
                <div
                  className="relative bg-card rounded-3xl overflow-hidden 
                              hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 h-full
                              border border-border hover:border-primary/50 dark:hover:border-primary/50
                              transform hover:-translate-y-2"
                >
                  {/* هيدر المجموعة مثل صورة المقال */}
                  <div className="relative p-6 bg-gradient-to-br from-primary to-secondary">
                    <div className="flex items-center gap-3 text-primary-foreground">
                      <span className="text-4xl">{group.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold">{group.name}</h3>
                        <p className="text-primary-foreground/80 text-sm">
                          {group.keywords.length} موضوع
                        </p>
                      </div>
                    </div>
                    {/* تدرج فوق الخلفية */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* محتوى المواضيع - عرض 20 كلمة */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {group.keywords
                        .slice(0, 20)
                        .map((keyword, keywordIndex) => (
                          <motion.div
                            key={`${groupIndex}-${keywordIndex}-${keyword}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: keywordIndex * 0.02 }}
                          >
                            <Link
                              href={getSearchUrl(keyword)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                                     hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary-foreground
                                     rounded-lg text-sm font-medium transition-all duration-200 
                                     border border-gray-200 dark:border-gray-600 hover:border-primary/50 dark:hover:border-primary/50
                                     group/link"
                            >
                              <Search className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                              <span>{keyword}</span>
                            </Link>
                          </motion.div>
                        ))}
                      {group.keywords.length > 20 && (
                        <Link
                          href={`/search?q=${encodeURIComponent(group.name)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400
                                      rounded-lg text-sm font-medium border border-purple-200 dark:border-purple-700
                                      hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          <span>+{group.keywords.length - 20} المزيد</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* رابط لجميع المواضيع مطابق للمقالات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/search"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary via-secondary to-accent 
                     text-primary-foreground rounded-2xl hover:shadow-2xl hover:shadow-primary/30 
                     transition-all duration-300 font-bold text-lg transform hover:scale-105"
          >
            <Search className="w-6 h-6" />
            <span>استكشف جميع المواضيع ({totalKeywords})</span>
            <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <p className="mt-4 text-muted-foreground text-sm">
            انقر على أي موضوع للبحث عنه في الموقع
          </p>
        </motion.div>
      </div>
    </section>
  );
}
