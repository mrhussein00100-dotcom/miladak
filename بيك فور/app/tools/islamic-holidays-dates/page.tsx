import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import IslamicHolidaysCalculator from '@/components/tools/IslamicHolidaysCalculator';
import { datesKeywords } from '@/lib/keywords/datesKeywords';

const islamicHolidaysKeywords = [
  'مواعيد الأعياد الإسلامية',
  'تاريخ عيد الفطر',
  'تاريخ عيد الأضحى',
  'موعد رمضان',
  'التقويم الهجري',
  'المناسبات الإسلامية',
  'رأس السنة الهجرية',
  'المولد النبوي',
  'ليلة القدر',
  'يوم عرفة',
  'أيام التشريق',
  'شهر رمضان',
  'شهر ذو الحجة',
  'الأشهر الحرم',
  'التقويم الإسلامي',
  ...datesKeywords.slice(0, 15),
];

export const metadata: Metadata = {
  title: 'مواعيد الأعياد الإسلامية | ميلادك - التقويم الهجري',
  description:
    'اعرف مواعيد الأعياد والمناسبات الإسلامية بالتقويم الهجري والميلادي. عيد الفطر، عيد الأضحى، رمضان، وأكثر.',
  keywords: islamicHolidaysKeywords,
  openGraph: {
    title: 'مواعيد الأعياد الإسلامية | ميلادك',
    description: 'اعرف مواعيد الأعياد والمناسبات الإسلامية',
    url: 'https://miladak.com/tools/islamic-holidays-dates',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/islamic-holidays-dates',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      مواعيد الأعياد والمناسبات الإسلامية
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      تعرف على مواعيد جميع الأعياد والمناسبات الإسلامية بالتقويم الهجري
      والميلادي. خطط لاحتفالاتك وعباداتك مع حاسبة المناسبات الإسلامية من ميلادك.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      المناسبات الإسلامية الرئيسية
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🌙</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          شهر رمضان
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          شهر الصيام والعبادة
        </p>
      </div>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🎉</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          عيد الفطر
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">1 شوال</p>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🐑</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          عيد الأضحى
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">10 ذو الحجة</p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🕋</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          يوم عرفة
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">9 ذو الحجة</p>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">📅</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          رأس السنة الهجرية
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">1 محرم</p>
      </div>
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">💚</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          المولد النبوي
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          12 ربيع الأول
        </p>
      </div>
    </div>

    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-green-700 dark:text-green-300 mb-3">
        🌙 ملاحظة مهمة
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        التواريخ الهجرية تعتمد على رؤية الهلال، لذا قد تختلف التواريخ الفعلية
        بيوم أو يومين حسب إعلان الجهات الرسمية في كل بلد.
      </p>
    </div>
  </div>
);

export default function IslamicHolidaysPage() {
  return (
    <ToolPageLayout
      toolName="مواعيد الأعياد الإسلامية"
      toolSlug="islamic-holidays-dates"
      toolDescription="اعرف مواعيد الأعياد والمناسبات الإسلامية بالتقويم الهجري والميلادي. أداة مجانية من ميلادك."
      toolIcon="🕌"
      keywords={islamicHolidaysKeywords}
      seoContent={seoContent}
      gradient="from-emerald-500 to-teal-500"
      showKeywords={true}
    >
      <IslamicHolidaysCalculator />
    </ToolPageLayout>
  );
}
