import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { AgeInSecondsCalculator } from '@/components/tools/AgeInSecondsCalculator';
import { ageKeywords, ageInSecondsKeywords } from '@/lib/keywords/ageKeywords';

const allKeywords = [...ageInSecondsKeywords, ...ageKeywords.slice(0, 25)];

export const metadata: Metadata = {
  title: 'حاسبة العمر بالثواني | ميلادك - كم ثانية عشت؟',
  description:
    'اكتشف عمرك بالثواني والدقائق والساعات بدقة مذهلة. حاسبة مجانية لمعرفة كم وقت قضيت في الحياة بأرقام مدهشة.',
  keywords: allKeywords,
  openGraph: {
    title: 'حاسبة العمر بالثواني | ميلادك',
    description: 'اكتشف عمرك بالثواني والدقائق والساعات بدقة مذهلة',
    url: 'https://miladak.com/tools/age-in-seconds',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/age-in-seconds',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      عمرك بالثواني - أرقام مذهلة!
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      هل تساءلت يوماً كم ثانية عشت في حياتك؟ حاسبة العمر بالثواني من ميلادك تكشف
      لك عمرك بوحدات زمنية دقيقة جداً. اكتشف أرقاماً مذهلة عن الوقت الذي قضيته
      في هذا العالم!
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      ماذا ستعرف؟
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">⏱️</span>
        <h4 className="font-bold text-gray-800 dark:text-white">الثواني</h4>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">⏰</span>
        <h4 className="font-bold text-gray-800 dark:text-white">الدقائق</h4>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">🕐</span>
        <h4 className="font-bold text-gray-800 dark:text-white">الساعات</h4>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">📅</span>
        <h4 className="font-bold text-gray-800 dark:text-white">الأيام</h4>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-3">
        ⏳ حقيقة عن الوقت
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        السنة الواحدة تحتوي على 31,536,000 ثانية تقريباً! تخيل كم ثانية مرت منذ
        ولادتك. كل ثانية هي فرصة جديدة للحياة والإنجاز.
      </p>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      لماذا نحسب العمر بالثواني؟
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
      <li>تقدير قيمة كل لحظة في الحياة</li>
      <li>الوعي بمرور الوقت وأهميته</li>
      <li>مشاركة أرقام مثيرة مع الأصدقاء</li>
      <li>التحفيز على استغلال الوقت</li>
      <li>اكتشاف حقائق مذهلة عن عمرك</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      استغل كل ثانية!
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
      الوقت هو أثمن ما نملك. كل ثانية تمر لن تعود أبداً. استخدم هذه الأداة
      لتذكير نفسك بقيمة الوقت واستغلال كل لحظة في حياتك بأفضل طريقة ممكنة.
    </p>
  </div>
);

export default function AgeInSecondsPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة العمر بالثواني"
      toolSlug="age-in-seconds"
      toolDescription="اكتشف عمرك بالثواني والدقائق والساعات بدقة مذهلة. أداة مجانية من ميلادك."
      toolIcon="⏱️"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-blue-500 to-indigo-500"
      showKeywords={true}
    >
      <AgeInSecondsCalculator />
    </ToolPageLayout>
  );
}
