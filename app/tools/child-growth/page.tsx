import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import ChildGrowthCalculator from '@/components/tools/ChildGrowthCalculator';
import {
  pregnancyKeywords,
  childGrowthKeywords,
} from '@/lib/keywords/pregnancyKeywords';

const allKeywords = [...childGrowthKeywords, ...pregnancyKeywords.slice(0, 25)];

export const metadata: Metadata = {
  title: 'حاسبة نمو الطفل | ميلادك - تابع وزن وطول طفلك',
  description:
    'تابعي نمو طفلك ومقارنته بمنحنيات النمو العالمية. حاسبة مجانية لمتابعة وزن وطول الطفل.',
  keywords: allKeywords,
  openGraph: {
    title: 'حاسبة نمو الطفل | ميلادك',
    description: 'تابعي نمو طفلك ومقارنته بمنحنيات النمو العالمية',
    url: 'https://miladak.com/tools/child-growth',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/child-growth',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      متابعة نمو الطفل
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      حاسبة نمو الطفل من ميلادك تساعدك على متابعة وزن وطول طفلك ومقارنته
      بمنحنيات النمو المعتمدة من منظمة الصحة العالمية. تأكدي من أن طفلك ينمو
      بشكل صحي!
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      ماذا تقيس الحاسبة؟
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">⚖️</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">الوزن</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مقارنة بالمعدل الطبيعي
        </p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">📏</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">الطول</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مقارنة بالمعدل الطبيعي
        </p>
      </div>
    </div>

    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-green-700 dark:text-green-300 mb-3">
        📊 منحنيات النمو
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        نستخدم منحنيات النمو المعتمدة من منظمة الصحة العالمية (WHO) لتقييم نمو
        طفلك. هذه المنحنيات تعتمد على بيانات من أطفال أصحاء من مختلف أنحاء
        العالم.
      </p>
    </div>
  </div>
);

export default function ChildGrowthPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة نمو الطفل"
      toolSlug="child-growth"
      toolDescription="تابعي نمو طفلك ومقارنته بمنحنيات النمو العالمية. أداة مجانية من ميلادك."
      toolIcon="📈"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-green-500 to-teal-500"
      showKeywords={true}
    >
      <ChildGrowthCalculator />
    </ToolPageLayout>
  );
}
