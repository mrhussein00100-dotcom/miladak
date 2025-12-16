import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import HolidaysCalculator from '@/components/tools/HolidaysCalculator';
import { datesKeywords } from '@/lib/keywords/datesKeywords';

const holidaysKeywords = [
  'حاسبة الأعياد',
  'مواعيد الأعياد',
  'العطل الرسمية',
  'الإجازات الرسمية',
  'أعياد السعودية',
  'أعياد مصر',
  'أعياد الإمارات',
  'عيد الفطر',
  'عيد الأضحى',
  'اليوم الوطني',
  'رأس السنة',
  'العطل السنوية',
  'تقويم الأعياد',
  'مناسبات رسمية',
  'إجازات العمل',
  ...datesKeywords.slice(0, 15),
];

export const metadata: Metadata = {
  title: 'حاسبة الأعياد والعطل | ميلادك - مواعيد الإجازات',
  description:
    'اعرف مواعيد الأعياد والعطل الرسمية في بلدك. حاسبة مجانية للإجازات والمناسبات الرسمية.',
  keywords: holidaysKeywords,
  openGraph: {
    title: 'حاسبة الأعياد والعطل | ميلادك',
    description: 'اعرف مواعيد الأعياد والعطل الرسمية في بلدك',
    url: 'https://miladak.com/tools/holidays-calculator',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/holidays-calculator',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      مواعيد الأعياد والعطل الرسمية
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      خطط لإجازاتك مسبقاً مع حاسبة الأعياد من ميلادك. اعرف مواعيد جميع الأعياد
      والعطل الرسمية في بلدك وخطط لرحلاتك واحتفالاتك.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      أنواع العطل
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🕌</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الأعياد الإسلامية
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          عيد الفطر، عيد الأضحى
        </p>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🏛️</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الأعياد الوطنية
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          اليوم الوطني، يوم التأسيس
        </p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🎉</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          المناسبات العالمية
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          رأس السنة، يوم العمال
        </p>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">📅</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          العطل الرسمية
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          إجازات العمل الرسمية
        </p>
      </div>
    </div>

    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-green-700 dark:text-green-300 mb-3">
        💡 نصيحة للتخطيط
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        خطط لإجازاتك مبكراً! معرفة مواعيد العطل الرسمية يساعدك على حجز السفر
        والفنادق بأسعار أفضل وتجنب الازدحام.
      </p>
    </div>
  </div>
);

export default function HolidaysCalculatorPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة الأعياد والعطل"
      toolSlug="holidays-calculator"
      toolDescription="اعرف مواعيد الأعياد والعطل الرسمية في بلدك. أداة مجانية من ميلادك."
      toolIcon="🎊"
      keywords={holidaysKeywords}
      seoContent={seoContent}
      gradient="from-green-500 to-emerald-500"
      showKeywords={true}
    >
      <HolidaysCalculator />
    </ToolPageLayout>
  );
}
