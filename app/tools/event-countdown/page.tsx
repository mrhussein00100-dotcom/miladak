import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { EventCountdownCalculator } from '@/components/tools/EventCountdownCalculator';
import {
  datesKeywords,
  eventCountdownKeywords,
} from '@/lib/keywords/datesKeywords';

const allKeywords = [...eventCountdownKeywords, ...datesKeywords.slice(0, 25)];

export const metadata: Metadata = {
  title: 'العد التنازلي للأحداث | ميلادك - كم باقي على الحدث؟',
  description:
    'أنشئ عداد تنازلي مخصص لأي حدث مهم. احسب الوقت المتبقي بدقة للمناسبات والأحداث الخاصة مع تذكير مفيد.',
  keywords: allKeywords,
  openGraph: {
    title: 'العد التنازلي للأحداث | ميلادك',
    description: 'أنشئ عداد تنازلي مخصص لأي حدث مهم',
    url: 'https://miladak.com/tools/event-countdown',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/event-countdown',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      العد التنازلي لأحداثك المهمة
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      هل لديك حدث مهم قادم؟ أداة العد التنازلي من ميلادك تساعدك على تتبع الوقت
      المتبقي لأي مناسبة أو حدث. سواء كان زفافاً، تخرجاً، سفراً، أو أي مناسبة
      خاصة!
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      أنواع الأحداث
    </h3>
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">💒</span>
        <h4 className="font-bold text-gray-800 dark:text-white">الزفاف</h4>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">🎓</span>
        <h4 className="font-bold text-gray-800 dark:text-white">التخرج</h4>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">✈️</span>
        <h4 className="font-bold text-gray-800 dark:text-white">السفر</h4>
      </div>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">📝</span>
        <h4 className="font-bold text-gray-800 dark:text-white">الامتحانات</h4>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">🎉</span>
        <h4 className="font-bold text-gray-800 dark:text-white">الاحتفالات</h4>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
        <span className="text-3xl mb-2 block">🏖️</span>
        <h4 className="font-bold text-gray-800 dark:text-white">الإجازات</h4>
      </div>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      مميزات العداد
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
      <li>عد تنازلي دقيق بالأيام والساعات والدقائق</li>
      <li>إمكانية تخصيص اسم الحدث</li>
      <li>مشاركة العداد مع الأصدقاء</li>
      <li>تصميم جذاب ومتجاوب</li>
      <li>دعم التقويم الميلادي والهجري</li>
    </ul>

    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-3">
        💡 نصيحة من ميلادك
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        استخدم العد التنازلي للتحفيز والتخطيط! معرفة الوقت المتبقي يساعدك على
        تنظيم استعداداتك وعدم تفويت أي تفصيلة مهمة.
      </p>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      كيف تستخدم الأداة؟
    </h3>
    <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
      <li>أدخل اسم الحدث الذي تريد تتبعه</li>
      <li>حدد تاريخ ووقت الحدث</li>
      <li>شاهد العد التنازلي يبدأ فوراً</li>
      <li>شارك الرابط مع من تريد</li>
    </ol>
  </div>
);

export default function EventCountdownPage() {
  return (
    <ToolPageLayout
      toolName="العد التنازلي للأحداث"
      toolSlug="event-countdown"
      toolDescription="أنشئ عداد تنازلي مخصص لأي حدث مهم في حياتك. أداة مجانية من ميلادك."
      toolIcon="⏳"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-pink-500 to-orange-500"
      showKeywords={true}
    >
      <EventCountdownCalculator />
    </ToolPageLayout>
  );
}
