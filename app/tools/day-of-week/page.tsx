import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { DayOfWeekCalculator } from '@/components/tools/DayOfWeekCalculator';
import { datesKeywords, dayOfWeekKeywords } from '@/lib/keywords/datesKeywords';

const allKeywords = [...dayOfWeekKeywords, ...datesKeywords.slice(0, 25)];

export const metadata: Metadata = {
  title: 'معرفة يوم التاريخ | ميلادك - في أي يوم ولدت؟',
  description:
    'اكتشف في أي يوم من أيام الأسبوع كان تاريخ معين. معرفة يوم الميلاد أو أي تاريخ تاريخي بدقة ومجاناً.',
  keywords: allKeywords,
  openGraph: {
    title: 'معرفة يوم التاريخ | ميلادك',
    description: 'اكتشف في أي يوم من أيام الأسبوع كان تاريخ معين',
    url: 'https://miladak.com/tools/day-of-week',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/day-of-week',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      في أي يوم ولدت؟
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      هل تريد معرفة في أي يوم من أيام الأسبوع ولدت؟ أو في أي يوم حدث حدث تاريخي
      مهم؟ أداة معرفة يوم التاريخ من ميلادك تساعدك على اكتشاف يوم الأسبوع لأي
      تاريخ في التاريخ!
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      أيام الأسبوع
    </h3>
    <div className="grid grid-cols-7 gap-2 mb-6">
      {[
        'السبت',
        'الأحد',
        'الاثنين',
        'الثلاثاء',
        'الأربعاء',
        'الخميس',
        'الجمعة',
      ].map((day, index) => (
        <div
          key={index}
          className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {day}
          </span>
        </div>
      ))}
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      استخدامات الأداة
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
      <li>معرفة يوم ميلادك من الأسبوع</li>
      <li>اكتشاف يوم أحداث تاريخية مهمة</li>
      <li>التخطيط للمناسبات والاحتفالات</li>
      <li>معرفة يوم ذكرى الزواج أو أي مناسبة</li>
      <li>الفضول التاريخي والمعرفة العامة</li>
    </ul>

    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3">
        🌟 هل تعلم؟
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        في بعض الثقافات، يُعتقد أن يوم ميلادك يؤثر على شخصيتك! مثلاً، من ولد يوم
        الجمعة يُقال أنه محظوظ ومحبوب. اكتشف يوم ميلادك وشاركه مع أصدقائك!
      </p>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      كيف تعمل الأداة؟
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      تستخدم الأداة خوارزمية رياضية دقيقة لحساب يوم الأسبوع لأي تاريخ. فقط أدخل
      التاريخ الذي تريد معرفة يومه، وستحصل على النتيجة فوراً. تدعم الأداة
      التواريخ الميلادية والهجرية.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      أحداث تاريخية مشهورة
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
      جرب معرفة يوم أحداث تاريخية مهمة مثل: يوم استقلال بلدك، يوم ميلاد شخصية
      مشهورة، أو أي تاريخ يثير فضولك. ستكتشف معلومات مثيرة!
    </p>
  </div>
);

export default function DayOfWeekPage() {
  return (
    <ToolPageLayout
      toolName="معرفة يوم التاريخ"
      toolSlug="day-of-week"
      toolDescription="اكتشف في أي يوم من أيام الأسبوع كان تاريخ معين. أداة مجانية من ميلادك."
      toolIcon="📆"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-purple-500 to-violet-500"
      showKeywords={true}
    >
      <DayOfWeekCalculator />
    </ToolPageLayout>
  );
}
