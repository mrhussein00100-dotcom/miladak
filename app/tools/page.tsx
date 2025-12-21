import { Metadata } from 'next';
import { query } from '@/lib/db/database';
import { ToolsPageClient } from '@/components/ToolsPageClient';
import { JsonLd } from '@/components/SEO/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/jsonld';
import { InContentAd, FooterAd } from '@/components/AdSense/AdSenseSlot';
import KeywordsSection from '@/components/tools/KeywordsSection';
import ToolRandomArticles from '@/components/tools/ToolRandomArticles';
import type { Tool, ToolCategory } from '@/types';

function toBoolean(value: unknown): boolean {
  return (
    value === true ||
    value === 1 ||
    value === '1' ||
    value === 'true' ||
    value === 't'
  );
}

export const metadata: Metadata = {
  title:
    'أدوات ميلادك - أكثر من 17 أداة حسابية مجانية | حاسبات الصحة والعمر والتواريخ',
  description:
    'اكتشف مجموعة شاملة من الأدوات الحسابية المجانية: حاسبة BMI، حاسبة السعرات الحرارية، حاسبة الحمل، العد التنازلي لعيد الميلاد، حاسبة الأيام بين تاريخين، حاسبة المناطق الزمنية، حاسبة الأجيال، وأكثر من 17 أداة مفيدة.',
  keywords: [
    // === أدوات حساب العمر (20 كلمة) ===
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
    'age calculator',
    'حاسبة السن',
    'معرفة العمر',
    'حساب تاريخ الميلاد',
    'عمري بالدقائق',
    'العمر الدقيق',
    'حساب عمري',
    'كم عمري بالضبط',
    'عمري الحقيقي',
    'حاسبة عمر مجانية',
    // === أدوات الصحة واللياقة (20 كلمة) ===
    'حاسبة BMI',
    'مؤشر كتلة الجسم',
    'حاسبة السعرات الحرارية',
    'حاسبة الوزن المثالي',
    'حاسبة السعرات',
    'حساب السعرات الحرارية',
    'BMI calculator',
    'calorie calculator',
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
    'حمية غذائية',
    // === أدوات الحمل والأطفال (15 كلمة) ===
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
    // === أدوات التواريخ والأوقات (20 كلمة) ===
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
    'مدة زمنية',
    'تاريخ اليوم',
    'حاسبة الزمن',
    // === أدوات المناسبات والأعياد (15 كلمة) ===
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
    // === أدوات متنوعة ومتقدمة (10 كلمات) ===
    'حاسبة الأجيال',
    'إحصائيات الحياة',
    'مقارنة الأعمار',
    'العمر النسبي',
    'حاسبة الإحصائيات',
    'معلومات شخصية',
    'حسابات رياضية',
    'أدوات تحليلية',
    'إحصائيات شخصية',
    'حاسبة متقدمة',
  ],
  openGraph: {
    title: 'أدوات ميلادك - أكثر من 17 أداة حسابية مجانية',
    description:
      'مجموعة شاملة من الأدوات الحسابية المجانية للصحة والعمر والتواريخ',
    url: 'https://miladak.com/tools',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools',
  },
};

const toolsStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'أدوات ميلادك الحسابية',
  description:
    'مجموعة شاملة من الأدوات الحسابية المجانية للصحة والعمر والتواريخ',
  url: 'https://miladak.com/tools',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'حاسبة مؤشر كتلة الجسم BMI',
        url: 'https://miladak.com/tools/bmi-calculator',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'حاسبة السعرات الحرارية',
        url: 'https://miladak.com/tools/calorie-calculator',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'العد التنازلي لعيد الميلاد',
        url: 'https://miladak.com/tools/birthday-countdown',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'حاسبة الأيام بين تاريخين',
        url: 'https://miladak.com/tools/days-between',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'إحصاءات الحياة',
        url: 'https://miladak.com/tools/life-statistics',
      },
    ],
  },
};

export default async function ToolsPage() {
  let tools: Tool[] = [];
  let categories: ToolCategory[] = [];

  // أثناء البناء، استخدم بيانات افتراضية
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
    tools = [
      {
        id: 1,
        slug: 'age-calculator',
        title: 'حاسبة العمر',
        description: 'احسب عمرك بالسنوات والشهور والأيام',
        icon: '🎂',
        category_id: 1,
        category_name: 'حاسبات التاريخ',
        href: '/age-calculator',
        featured: true,
        active: true,
      },
      {
        id: 2,
        slug: 'days-between',
        title: 'حاسبة الأيام بين تاريخين',
        description: 'احسب عدد الأيام بين تاريخين',
        icon: '📊',
        category_id: 1,
        category_name: 'حاسبات التاريخ',
        href: '/days-between',
        featured: true,
        active: true,
      },
    ];

    categories = [
      {
        id: 1,
        name: 'حاسبات التاريخ',
        slug: 'date-calculators',
        title: 'حاسبات التاريخ والوقت',
        icon: '📅',
        sort_order: 1,
      },
    ];
  } else {
    try {
      type ToolRow = Omit<Tool, 'featured' | 'active'> & {
        featured: unknown;
        active: unknown;
      };

      let toolRows: ToolRow[] = [];
      try {
        // محاولة الاستعلام بأسماء الأعمدة الجديدة (PostgreSQL)
        toolRows = await query<ToolRow>(`
          SELECT 
            t.id,
            t.name as slug,
            t.title,
            COALESCE(t.description, '') as description,
            COALESCE(t.icon, '') as icon,
            t.category_id,
            tc.name as category_name,
            t.href,
            t.is_featured as featured,
            t.is_active as active
          FROM tools t
          JOIN tool_categories tc ON t.category_id = tc.id
          WHERE t.is_active = 1
          ORDER BY COALESCE(t.sort_order, 0) ASC, t.title ASC
        `);
      } catch (e1) {
        console.log('First query failed, trying alternative:', e1);
        try {
          // محاولة الاستعلام بأسماء الأعمدة القديمة (SQLite)
          toolRows = await query<ToolRow>(`
            SELECT 
              t.id,
              t.slug,
              t.title,
              COALESCE(t.description, '') as description,
              COALESCE(t.icon, '') as icon,
              t.category_id,
              tc.name as category_name,
              t.href,
              t.featured as featured,
              t.active as active
            FROM tools t
            JOIN tool_categories tc ON t.category_id = tc.id
            WHERE t.active = 1
            ORDER BY COALESCE(t.sort_order, 0) ASC, t.title ASC
          `);
        } catch (e2) {
          console.log('Second query also failed:', e2);
        }
      }

      tools = toolRows.map((row) => ({
        ...row,
        featured: toBoolean(row.featured),
        active: toBoolean(row.active),
      }));

      try {
        // محاولة الاستعلام بأسماء الأعمدة الجديدة (PostgreSQL)
        categories = await query<ToolCategory>(`
          SELECT 
            id,
            name,
            name as slug,
            COALESCE(title, name) as title,
            icon,
            COALESCE(sort_order, 0) as sort_order
          FROM tool_categories
          ORDER BY COALESCE(sort_order, 0) ASC, name ASC
        `);
      } catch (e1) {
        console.log('Categories query failed, trying alternative:', e1);
        try {
          categories = await query<ToolCategory>(`
            SELECT 
              id,
              name,
              slug,
              COALESCE(title, name) as title,
              icon,
              COALESCE(sort_order, 0) as sort_order
            FROM tool_categories
            ORDER BY COALESCE(sort_order, 0) ASC, name ASC
          `);
        } catch (e2) {
          console.log('Second categories query also failed:', e2);
        }
      }
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  }

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'الرئيسية', url: 'https://miladak.com' },
    { name: 'الأدوات' },
  ]);

  return (
    <>
      <JsonLd data={[toolsStructuredData, breadcrumbSchema]} />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12">
          {/* Tools Grid - الهيدر موجود في ToolsPageClient */}
          <ToolsPageClient tools={tools} categories={categories} />

          {/* إعلان بين الأدوات والمحتوى */}
          <InContentAd className="my-8" />

          {/* SEO Content Section */}
          <section className="mt-20 glass rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
              لماذا تستخدم أدوات ميلادك؟
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-bold mb-2">دقة عالية</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  جميع الحسابات تعتمد على معادلات علمية دقيقة ومعتمدة
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🆓</span>
                </div>
                <h3 className="text-xl font-bold mb-2">مجانية بالكامل</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  جميع الأدوات متاحة مجاناً بدون تسجيل أو اشتراك
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-xl font-bold mb-2">متوافقة مع الجوال</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  تعمل بشكل مثالي على جميع الأجهزة والشاشات
                </p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                أدوات الصحة واللياقة
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                تشمل أدواتنا الصحية حاسبة مؤشر كتلة الجسم (BMI) التي تساعدك على
                معرفة وزنك المثالي، وحاسبة السعرات الحرارية لتحديد احتياجاتك
                اليومية من الطاقة، بالإضافة إلى حاسبة نمو الطفل لمتابعة تطور
                أطفالك.
              </p>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                أدوات حساب العمر والتواريخ
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                احسب عمرك بدقة بالسنوات والأشهر والأيام، واعرف كم يوم متبقي لعيد
                ميلادك القادم، واحسب الفرق بين أي تاريخين بسهولة. كما يمكنك
                معرفة يوم ميلادك من الأسبوع واكتشاف إحصاءات مذهلة عن حياتك.
              </p>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                أدوات الحمل والأمومة
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                للأمهات الحوامل، نقدم حاسبة مراحل الحمل لمتابعة تطور الجنين
                أسبوعاً بأسبوع، وحاسبة عمر الطفل لمتابعة نمو طفلك ومراحل تطوره
                المختلفة.
              </p>
            </div>
          </section>

          {/* قسم المقالات العشوائية */}
          <ToolRandomArticles
            count={6}
            title="مقالات مفيدة"
            className="mt-12"
          />

          {/* قسم الكلمات المفتاحية */}
          <KeywordsSection className="mt-12" />

          {/* إعلان أسفل الصفحة */}
          <FooterAd className="mt-8" />
        </div>
      </div>
    </>
  );
}
