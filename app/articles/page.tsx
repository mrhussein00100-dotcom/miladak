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
      WHERE a.published = 1
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
        (SELECT COUNT(*) FROM articles a WHERE CAST(a.category_id AS INTEGER) = c.id AND a.published = 1) as article_count
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❤️</span>
                </div>
                <h3 className="text-xl font-bold mb-2">الصحة والعافية</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  مقالات شاملة عن الصحة الجسدية والنفسية وكيفية الحفاظ عليها
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🥗</span>
                </div>
                <h3 className="text-xl font-bold mb-2">التغذية السليمة</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  نصائح غذائية علمية لكل الأعمار والاحتياجات الصحية
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏃</span>
                </div>
                <h3 className="text-xl font-bold mb-2">اللياقة البدنية</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  تمارين ونصائح للحفاظ على لياقتك في كل مرحلة عمرية
                </p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                لماذا تقرأ مقالات ميلادك؟
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                نحرص في ميلادك على تقديم محتوى صحي موثوق ومبني على أسس علمية.
                مقالاتنا تغطي مواضيع متنوعة تشمل الصحة العامة، التغذية السليمة،
                اللياقة البدنية، الصحة النفسية، ونصائح للحياة الصحية في كل مرحلة
                عمرية.
              </p>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                مواضيع متنوعة تهمك
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>كيفية حساب العمر بدقة وأهميته الصحية</li>
                <li>نصائح للحفاظ على الوزن المثالي</li>
                <li>أهمية التغذية السليمة في كل مرحلة عمرية</li>
                <li>تمارين مناسبة لكل فئة عمرية</li>
                <li>الصحة النفسية وعلاقتها بالعمر</li>
                <li>نصائح للأمهات الحوامل والأطفال</li>
              </ul>
            </div>
          </section>

          {/* إعلان أسفل الصفحة */}
          <FooterAd className="mt-8" />
        </div>
      </div>
    </>
  );
}
