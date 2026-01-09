import { Metadata } from 'next';
import { query } from '@/lib/db/database';
import { ArticlesPageClient } from '@/components/ArticlesPageClient';
import { StructuredData } from '@/components/SEO/StructuredData';
import { InContentAd, FooterAd } from '@/components/AdSense/AdSenseSlot';
import type { Article, ArticleCategory } from '@/types';

// جعل الصفحة ديناميكية لجلب البيانات في كل طلب
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title:
    'مكتبة مقالات ميلادك - نصائح صحية ومعلومات مفيدة عن العمر والصحة والحياة | ميلادك',
  description:
    'اكتشف مكتبة مقالات ميلادك الشاملة حول حساب العمر، الأبراج، صحة الأطفال، التغذية، الحمل والولادة. محتوى عربي موثوق ومفيد لكل مرحلة من مراحل الحياة.',
  keywords: [
    // === مقالات صحية عامة (15 كلمة) ===
    'مقالات صحية',
    'نصائح صحية',
    'معلومات طبية',
    'نصائح طبية',
    'صحة عامة',
    'مقالات طبية',
    'معلومات صحية',
    'ثقافة صحية',
    'وعي صحي',
    'إرشادات صحية',
    'طب وصحة',
    'نصائح طبيب',
    'استشارات طبية',
    'معلومات طبيب',
    'دليل صحي',
    // === التغذية والغذاء الصحي (15 كلمة) ===
    'التغذية السليمة',
    'نصائح غذائية',
    'الأكل الصحي',
    'حمية غذائية',
    'تغذية صحية',
    'فوائد الأطعمة',
    'الغذاء الصحي',
    'نظام غذائي',
    'وجبات صحية',
    'فيتامينات',
    'معادن',
    'بروتينات',
    'كربوهيدرات',
    'دهون صحية',
    'أطعمة مفيدة',
    // === اللياقة البدنية والرياضة (15 كلمة) ===
    'اللياقة البدنية',
    'تمارين رياضية',
    'الرياضة والصحة',
    'فوائد الرياضة',
    'تمارين يومية',
    'رياضة',
    'لياقة',
    'تمارين',
    'نشاط بدني',
    'حركة',
    'تمارين منزلية',
    'كمال أجسام',
    'تمارين القوة',
    'تمارين الكارديو',
    'يوغا',
    // === الصحة النفسية والعقلية (10 كلمات) ===
    'الصحة النفسية',
    'صحة نفسية',
    'راحة نفسية',
    'تخفيف التوتر',
    'الاسترخاء',
    'السعادة',
    'الإيجابية',
    'التفاؤل',
    'الصحة العقلية',
    'علم النفس',
    // === العمر ونمط الحياة (10 كلمات) ===
    'العمر والصحة',
    'نمط حياة صحي',
    'حياة صحية',
    'عادات صحية',
    'روتين صحي',
    'جودة الحياة',
    'حياة أفضل',
    'عيش صحي',
    'أسلوب حياة',
    'توازن الحياة',
    // === الحمل والولادة (15 كلمة) ===
    'صحة الحامل',
    'نصائح للحامل',
    'الحمل والولادة',
    'رعاية الحامل',
    'تغذية الحامل',
    'مراحل الحمل',
    'أعراض الحمل',
    'فحوصات الحمل',
    'نمو الجنين',
    'صحة الجنين',
    'الولادة الطبيعية',
    'الولادة القيصرية',
    'ما بعد الولادة',
    'رضاعة طبيعية',
    'عناية بالحامل',
    // === صحة الأطفال والتربية (10 كلمات) ===
    'صحة الأطفال',
    'تربية الأطفال',
    'نمو الطفل',
    'تطور الطفل',
    'رعاية الأطفال',
    'تغذية الأطفال',
    'صحة الرضع',
    'نمو الرضيع',
    'تطعيمات الأطفال',
    'سلامة الأطفال',
    // === الوزن والجسم (10 كلمات) ===
    'الوزن المثالي',
    'إنقاص الوزن',
    'زيادة الوزن',
    'مؤشر كتلة الجسم',
    'السمنة',
    'الرشاقة',
    'جسم صحي',
    'وزن صحي',
    'حرق الدهون',
    'بناء العضلات',
  ],
  openGraph: {
    title: 'مكتبة مقالات ميلادك - محتوى عربي شامل ومفيد',
    description:
      'اكتشف مكتبة مقالات ميلادك الشاملة حول حساب العمر، الأبراج، صحة الأطفال، التغذية والمزيد',
    url: 'https://miladak.com/articles',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/articles',
  },
};

const articlesStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'مكتبة مقالات ميلادك',
  description:
    'مكتبة شاملة من المقالات المفيدة حول حساب العمر، الأبراج، صحة الأطفال، التغذية، الحمل والولادة',
  url: 'https://miladak.com/articles',
  publisher: {
    '@type': 'Organization',
    name: 'ميلادك',
    url: 'https://miladak.com',
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [],
  },
};

export default async function ArticlesPage() {
  let articles: Article[] = [];
  let categories: ArticleCategory[] = [];
  let totalArticles = 0;

  try {
    // جلب إجمالي عدد المقالات
    const countResult = await query<{ total: number }>(`
      SELECT COUNT(*) as total FROM articles
    `);
    totalArticles = countResult[0]?.total || 0;

    // جلب المقالات مع pagination
    articles = await query<Article>(`
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.category_id,
        c.name as category_name,
        c.color as category_color,
        a.author,
        a.read_time,
        a.views,
        a.featured,
        a.featured_image,
        a.image,
        a.created_at,
        a.updated_at
      FROM articles a
      LEFT JOIN article_categories c ON CAST(a.category_id AS INTEGER) = c.id
      WHERE CAST(a.published AS TEXT) IN ('1', 'true')
      ORDER BY a.featured DESC, a.created_at DESC
      LIMIT 20
    `);

    // جلب التصنيفات مع عدد المقالات
    categories = await query<ArticleCategory>(`
      SELECT 
        c.id,
        c.name,
        COALESCE(c.slug, LOWER(REPLACE(c.name, ' ', '-'))) as slug,
        c.description,
        c.color,
        (SELECT COUNT(*) FROM articles a WHERE CAST(a.category_id AS INTEGER) = c.id AND CAST(a.published AS TEXT) IN ('1', 'true')) as articles_count
      FROM article_categories c
      ORDER BY c.sort_order ASC, c.name ASC
    `);
  } catch (error) {
    console.log('Database not available during build:', error);
    // Database not initialized yet - use empty arrays
  }

  return (
    <>
      <StructuredData data={articlesStructuredData} />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12">
          {/* Articles Grid - الهيدر الآن داخل المكون */}
          <ArticlesPageClient
            articles={articles}
            categories={categories}
            totalArticles={totalArticles}
          />

          {/* إعلان بين المقالات والمحتوى */}
          <InContentAd className="my-8" />

          {/* SEO Content Section */}
          <section className="mt-20 glass rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
              محتوى صحي موثوق
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">الصحة والعافية</h3>
                <p className="text-gray-600 dark:text-gray-300">نصائح شاملة للحفاظ على صحتك وعافيتك في جميع مراحل الحياة</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">التغذية السليمة</h3>
                <p className="text-gray-600 dark:text-gray-300">معلومات غذائية موثوقة لنظام غذائي متوازن وصحي</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">اللياقة البدنية</h3>
                <p className="text-gray-600 dark:text-gray-300">تمارين ونصائح للحفاظ على لياقتك ونشاطك البدني</p>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">لماذا تقرأ مقالات ميلادك؟</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                نقدم لك في ميلادك مجموعة متنوعة من المقالات الصحية والتثقيفية المكتوبة بعناية فائقة. 
                نهدف إلى تزويدك بمعلومات موثوقة ومفيدة تساعدك على اتخاذ قرارات صحية أفضل لك ولعائلتك.
                سواء كنت تبحث عن نصائح للتغذية السليمة، أو معلومات عن صحة الأطفال، أو إرشادات للحمل والولادة،
                ستجد في مكتبتنا ما يلبي احتياجاتك.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">مواضيع متنوعة تهمك</h3>
              <p className="text-gray-600 dark:text-gray-300">
                تغطي مقالاتنا مجموعة واسعة من المواضيع الصحية والحياتية، بما في ذلك: حساب العمر بدقة،
                معرفة برجك وصفاته، نصائح للحوامل والأمهات الجدد، تغذية الأطفال ونموهم،
                اللياقة البدنية والتمارين الرياضية، الصحة النفسية والعقلية، وغيرها الكثير.
                كل مقال مكتوب بأسلوب سهل ومبسط ليناسب جميع القراء.
              </p>
            </div>
          </section>

          {/* إعلان أسفل الصفحة */}
          <FooterAd className="mt-8" />
        </div>
      </div>
    </>
  );
}
