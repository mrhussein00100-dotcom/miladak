import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import ChildAgeCalculator from '@/components/tools/ChildAgeCalculator';
import {
  pregnancyKeywords,
  childAgeKeywords,
} from '@/lib/keywords/pregnancyKeywords';

const allKeywords = [...childAgeKeywords, ...pregnancyKeywords.slice(0, 25)];

export const metadata: Metadata = {
  title: 'حاسبة عمر الطفل | ميلادك - تابع نمو طفلك',
  description:
    'احسب عمر طفلك بالشهور والأسابيع بدقة. حاسبة مجانية لمتابعة نمو الطفل ومراحل تطوره.',
  keywords: allKeywords,
  openGraph: {
    title: 'حاسبة عمر الطفل | ميلادك',
    description: 'احسب عمر طفلك بالشهور والأسابيع بدقة',
    url: 'https://miladak.com/tools/child-age',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/child-age',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      حاسبة عمر الطفل
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      تابعي نمو طفلك بدقة مع حاسبة عمر الطفل من ميلادك. احسبي عمر طفلك بالشهور
      والأسابيع واكتشفي مراحل النمو والتطور المتوقعة لكل عمر.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      مراحل نمو الطفل
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">👶</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          0-3 شهور
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مرحلة الرضاعة الأولى
        </p>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🍼</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          4-6 شهور
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          بداية الطعام الصلب
        </p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🧸</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          7-12 شهر
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          الحبو والاستكشاف
        </p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🚶</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          1-2 سنة
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          المشي والكلام
        </p>
      </div>
    </div>

    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-3">
        💝 نصيحة للأمهات
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        كل طفل فريد ويتطور بسرعته الخاصة. لا تقارني طفلك بالآخرين، واستشيري
        الطبيب إذا كانت لديك أي مخاوف بشأن نموه.
      </p>
    </div>
  </div>
);

export default function ChildAgePage() {
  return (
    <ToolPageLayout
      toolName="حاسبة عمر الطفل"
      toolSlug="child-age"
      toolDescription="احسبي عمر طفلك بالشهور والأسابيع وتابعي مراحل نموه. أداة مجانية من ميلادك."
      toolIcon="👶"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-pink-500 to-rose-500"
      showKeywords={true}
    >
      <ChildAgeCalculator />
    </ToolPageLayout>
  );
}
