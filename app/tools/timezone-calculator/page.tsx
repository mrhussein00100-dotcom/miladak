import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import TimezoneCalculator from '@/components/tools/TimezoneCalculator';
import { datesKeywords } from '@/lib/keywords/datesKeywords';

const timezoneKeywords = [
  'حاسبة المناطق الزمنية',
  'فرق التوقيت',
  'تحويل الوقت',
  'التوقيت العالمي',
  'GMT',
  'UTC',
  'توقيت مكة',
  'توقيت الرياض',
  'توقيت القاهرة',
  'توقيت دبي',
  'فرق الساعات',
  'المنطقة الزمنية',
  'تحويل التوقيت',
  'الوقت في',
  'كم الساعة في',
  ...datesKeywords.slice(0, 15),
];

export const metadata: Metadata = {
  title: 'حاسبة المناطق الزمنية | ميلادك - فرق التوقيت',
  description:
    'احسب فرق التوقيت بين المدن والدول المختلفة. حاسبة مجانية لتحويل الوقت بين المناطق الزمنية.',
  keywords: timezoneKeywords,
  openGraph: {
    title: 'حاسبة المناطق الزمنية | ميلادك',
    description: 'احسب فرق التوقيت بين المدن والدول المختلفة',
    url: 'https://miladak.com/tools/timezone-calculator',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/timezone-calculator',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      حاسبة المناطق الزمنية
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      هل تحتاج لمعرفة الوقت في مدينة أخرى؟ حاسبة المناطق الزمنية من ميلادك
      تساعدك على تحويل الوقت بين المدن والدول المختلفة بسهولة ودقة.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      استخدامات الحاسبة
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
      <li>جدولة اجتماعات دولية</li>
      <li>التواصل مع الأصدقاء والعائلة في الخارج</li>
      <li>التخطيط للسفر</li>
      <li>متابعة الأحداث العالمية</li>
      <li>العمل مع فرق دولية</li>
    </ul>

    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-3">
        🌍 المناطق الزمنية الرئيسية
      </h4>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span>توقيت مكة: GMT+3</span>
        <span>توقيت القاهرة: GMT+2</span>
        <span>توقيت دبي: GMT+4</span>
        <span>توقيت لندن: GMT+0</span>
        <span>توقيت نيويورك: GMT-5</span>
        <span>توقيت طوكيو: GMT+9</span>
      </div>
    </div>
  </div>
);

export default function TimezoneCalculatorPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة المناطق الزمنية"
      toolSlug="timezone-calculator"
      toolDescription="احسب فرق التوقيت بين المدن والدول المختلفة بسهولة. أداة مجانية من ميلادك."
      toolIcon="🌍"
      keywords={timezoneKeywords}
      seoContent={seoContent}
      gradient="from-blue-500 to-teal-500"
      showKeywords={true}
    >
      <TimezoneCalculator />
    </ToolPageLayout>
  );
}
