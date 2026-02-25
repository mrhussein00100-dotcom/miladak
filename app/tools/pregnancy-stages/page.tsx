import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import PregnancyStagesCalculator from '@/components/tools/PregnancyStagesCalculator';
import {
  pregnancyKeywords,
  pregnancyStagesKeywords,
} from '@/lib/keywords/pregnancyKeywords';

const allKeywords = [
  ...pregnancyStagesKeywords,
  ...pregnancyKeywords.slice(0, 30),
];

export const metadata: Metadata = {
  title: 'حاسبة مراحل الحمل | ميلادك - تابعي تطور جنينك أسبوعياً',
  description:
    'تابعي مراحل الحمل وتطور الجنين أسبوعاً بأسبوع. حاسبة مجانية لمعرفة حجم الجنين ونصائح صحية لكل مرحلة.',
  keywords: allKeywords,
  openGraph: {
    title: 'حاسبة مراحل الحمل | ميلادك',
    description: 'تابعي مراحل الحمل وتطور الجنين أسبوعاً بأسبوع',
    url: 'https://miladak.com/tools/pregnancy-stages',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/pregnancy-stages',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      مراحل الحمل وتطور الجنين
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      رحلة الحمل هي من أجمل التجارب في حياة المرأة. حاسبة مراحل الحمل من ميلادك
      تساعدك على متابعة تطور جنينك أسبوعاً بأسبوع، مع معلومات مفيدة ونصائح صحية
      لكل مرحلة.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      مراحل الحمل الثلاث
    </h3>
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🌱</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الثلث الأول
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          الأسابيع 1-12
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          تكوين الأعضاء الرئيسية
        </p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">👶</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الثلث الثاني
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          الأسابيع 13-26
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          نمو وتطور الجنين
        </p>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🤰</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الثلث الثالث
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          الأسابيع 27-40
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          الاستعداد للولادة
        </p>
      </div>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      ماذا ستعرفين؟
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
      <li>أسبوع الحمل الحالي</li>
      <li>حجم الجنين ووزنه التقريبي</li>
      <li>تطورات الجنين في كل أسبوع</li>
      <li>نصائح صحية للأم</li>
      <li>موعد الولادة المتوقع</li>
      <li>الفحوصات المطلوبة</li>
    </ul>

    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-3">
        💝 نصيحة من ميلادك
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        احرصي على المتابعة الدورية مع طبيبك، وتناولي الفيتامينات الموصوفة،
        واحصلي على قسط كافٍ من الراحة. صحتك وصحة جنينك أولوية!
      </p>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      نصائح عامة للحامل
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
      <li>تناولي غذاء متوازن غني بالفيتامينات</li>
      <li>اشربي كمية كافية من الماء يومياً</li>
      <li>مارسي رياضة خفيفة مثل المشي</li>
      <li>تجنبي التدخين والكافيين الزائد</li>
      <li>احصلي على نوم كافٍ ومريح</li>
    </ul>
  </div>
);

export default function PregnancyStagesPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة مراحل الحمل"
      toolSlug="pregnancy-stages"
      toolDescription="تابعي مراحل الحمل وتطور الجنين أسبوعاً بأسبوع مع نصائح صحية مفيدة. أداة مجانية من ميلادك."
      toolIcon="🤰"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-pink-500 to-purple-500"
      showKeywords={true}
    >
      <PregnancyStagesCalculator />
    </ToolPageLayout>
  );
}
