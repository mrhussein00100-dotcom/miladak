import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { DaysBetweenCalculator } from '@/components/tools/DaysBetweenCalculator';
import {
  datesKeywords,
  daysBetweenKeywords,
} from '@/lib/keywords/datesKeywords';

const allKeywords = [...daysBetweenKeywords, ...datesKeywords.slice(0, 30)];

export const metadata: Metadata = {
  title: 'حاسبة الأيام بين تاريخين | ميلادك - احسب الفرق بين التواريخ',
  description:
    'احسب عدد الأيام والأسابيع والشهور بين أي تاريخين بدقة. حاسبة مجانية للفرق بين التواريخ مع دعم التقويم الهجري والميلادي.',
  keywords: allKeywords,
  openGraph: {
    title: 'حاسبة الأيام بين تاريخين | ميلادك',
    description: 'احسب عدد الأيام والأسابيع والشهور بين أي تاريخين بدقة',
    url: 'https://miladak.com/tools/days-between',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/days-between',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      حساب الأيام بين تاريخين
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      هل تحتاج لمعرفة عدد الأيام بين تاريخين؟ حاسبة الأيام من ميلادك تساعدك على
      حساب الفرق بين أي تاريخين بدقة عالية. سواء كنت تخطط لمشروع، أو تحسب مدة
      إجازة، أو تريد معرفة عمر علاقة أو حدث مهم.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      استخدامات حاسبة الأيام
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
      <li>حساب مدة المشاريع والمهام</li>
      <li>معرفة عدد أيام الإجازة</li>
      <li>حساب عمر العلاقات والذكريات</li>
      <li>التخطيط للأحداث والمناسبات</li>
      <li>حساب فترات الحمل والرضاعة</li>
      <li>معرفة الأيام المتبقية للامتحانات</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      ميزات الحاسبة
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">📅</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          دعم التقويمين
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          الميلادي والهجري
        </p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">⚡</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          نتائج فورية
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          حساب تلقائي ودقيق
        </p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">📊</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          تفاصيل شاملة
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          أيام، أسابيع، شهور، سنوات
        </p>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🆓</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          مجانية بالكامل
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          بدون تسجيل أو اشتراك
        </p>
      </div>
    </div>

    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-3">
        💡 هل تعلم؟
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        السنة الميلادية تحتوي على 365 يوماً (أو 366 في السنة الكبيسة)، بينما
        السنة الهجرية تحتوي على 354 أو 355 يوماً. لذلك الفرق بين التاريخين قد
        يختلف حسب التقويم المستخدم.
      </p>
    </div>
  </div>
);

export default function DaysBetweenPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة الأيام بين تاريخين"
      toolSlug="days-between"
      toolDescription="احسب عدد الأيام والأسابيع والشهور بين أي تاريخين بدقة. أداة مجانية من ميلادك."
      toolIcon="📅"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-blue-500 to-cyan-500"
      showKeywords={true}
    >
      <DaysBetweenCalculator />
    </ToolPageLayout>
  );
}
