import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { BirthdayCountdown } from '@/components/tools/BirthdayCountdown';
import {
  birthdayCountdownKeywords,
  birthdayCountdownPhrases,
} from '@/lib/keywords/birthdayCountdownKeywords';

export const metadata: Metadata = {
  title: 'العد التنازلي لعيد الميلاد | ميلادك - كم باقي على عيد ميلادي؟',
  description:
    'احسب كم يوم وساعة ودقيقة باقية على عيد ميلادك القادم. عداد تنازلي دقيق ومجاني مع تذكير بموعد الاحتفال.',
  keywords: birthdayCountdownKeywords,
  openGraph: {
    title: 'العد التنازلي لعيد الميلاد | ميلادك',
    description: 'احسب كم يوم وساعة ودقيقة باقية على عيد ميلادك القادم',
    url: 'https://miladak.com/tools/birthday-countdown',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/birthday-countdown',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      العد التنازلي لعيد ميلادك
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      هل تتساءل كم يوم باقي على عيد ميلادك القادم؟ أداة العد التنازلي من ميلادك
      تساعدك على معرفة الوقت المتبقي بدقة بالأيام والساعات والدقائق والثواني.
      استخدمها للتخطيط لاحتفالك القادم!
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      لماذا تستخدم عداد عيد الميلاد؟
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
      <li>التخطيط المسبق لحفلة عيد الميلاد</li>
      <li>تذكير الأصدقاء والعائلة بالموعد</li>
      <li>الاستعداد لشراء الهدايا والتحضيرات</li>
      <li>مشاركة العد التنازلي على وسائل التواصل</li>
      <li>الإثارة والترقب للاحتفال القادم</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      أفكار للاحتفال بعيد الميلاد
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      استغل الوقت المتبقي للتخطيط لاحتفال مميز. يمكنك تنظيم حفلة مفاجئة، أو
      التخطيط لرحلة خاصة، أو حتى قضاء وقت ممتع مع العائلة والأصدقاء. كل عيد
      ميلاد هو فرصة للاحتفال بالحياة!
    </p>

    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3">
        💡 نصيحة من ميلادك
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        شارك رابط العد التنازلي مع أصدقائك ليتذكروا موعد عيد ميلادك ويستعدوا
        للاحتفال معك!
      </p>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      أسئلة شائعة
    </h3>
    <div className="space-y-4">
      {birthdayCountdownPhrases.slice(0, 4).map((phrase, index) => (
        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="font-medium text-gray-700 dark:text-gray-300">
            {phrase}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default function BirthdayCountdownPage() {
  return (
    <ToolPageLayout
      toolName="العد التنازلي لعيد الميلاد"
      toolSlug="birthday-countdown"
      toolDescription="احسب كم يوم وساعة ودقيقة باقية على عيد ميلادك القادم. عداد تنازلي دقيق ومجاني من ميلادك."
      toolIcon="🎂"
      keywords={birthdayCountdownKeywords}
      seoContent={seoContent}
      gradient="from-pink-500 to-rose-500"
      showKeywords={true}
    >
      <BirthdayCountdown />
    </ToolPageLayout>
  );
}
