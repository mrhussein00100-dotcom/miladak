import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { RelativeAgeCalculator } from '@/components/tools/RelativeAgeCalculator';
import { ageKeywords, relativeAgeKeywords } from '@/lib/keywords/ageKeywords';

const allKeywords = [...relativeAgeKeywords, ...ageKeywords.slice(0, 25)];

export const metadata: Metadata = {
  title: 'حاسبة فرق العمر | ميلادك - مقارنة الأعمار',
  description:
    'احسب فرق العمر بين شخصين بدقة. حاسبة مجانية لمقارنة الأعمار ومعرفة من أكبر ومن أصغر.',
  keywords: allKeywords,
  openGraph: {
    title: 'حاسبة فرق العمر | ميلادك',
    description: 'احسب فرق العمر بين شخصين بدقة',
    url: 'https://miladak.com/tools/relative-age',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/relative-age',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      حاسبة فرق العمر
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      هل تريد معرفة فرق العمر بينك وبين شخص آخر؟ حاسبة فرق العمر من ميلادك
      تساعدك على مقارنة الأعمار بدقة ومعرفة الفرق بالسنوات والشهور والأيام.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      استخدامات الحاسبة
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
      <li>معرفة فرق العمر بين الزوجين</li>
      <li>مقارنة أعمار الأصدقاء</li>
      <li>حساب فرق العمر بين الأشقاء</li>
      <li>معرفة فرق العمر مع المشاهير</li>
      <li>التخطيط للمناسبات المشتركة</li>
    </ul>

    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-3">
        💡 معلومة مفيدة
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        فرق العمر بين الأشخاص يمكن أن يؤثر على طريقة التواصل والتفاهم. معرفة هذا
        الفرق يساعد على فهم الاختلافات في الخبرات والتجارب الحياتية.
      </p>
    </div>
  </div>
);

export default function RelativeAgePage() {
  return (
    <ToolPageLayout
      toolName="حاسبة فرق العمر"
      toolSlug="relative-age"
      toolDescription="احسب فرق العمر بين شخصين بدقة بالسنوات والشهور والأيام. أداة مجانية من ميلادك."
      toolIcon="👥"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-teal-500 to-cyan-500"
      showKeywords={true}
    >
      <RelativeAgeCalculator />
    </ToolPageLayout>
  );
}
