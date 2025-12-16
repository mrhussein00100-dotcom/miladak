import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { CalorieCalculator } from '@/components/tools/CalorieCalculator';
import {
  calorieKeywords,
  calorieActivityLevels,
  calorieGoals,
} from '@/lib/keywords/calorieKeywords';

export const metadata: Metadata = {
  title: 'حاسبة السعرات الحرارية | ميلادك - احسب احتياجك اليومي',
  description:
    'احسب احتياجك اليومي من السعرات الحرارية بدقة حسب العمر والوزن والطول ومستوى النشاط. حاسبة BMR و TDEE مجانية.',
  keywords: calorieKeywords,
  openGraph: {
    title: 'حاسبة السعرات الحرارية | ميلادك',
    description: 'احسب احتياجك اليومي من السعرات الحرارية بدقة',
    url: 'https://miladak.com/tools/calorie-calculator',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/calorie-calculator',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      ما هي السعرات الحرارية؟
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      السعرات الحرارية هي وحدة قياس الطاقة التي يحصل عليها الجسم من الطعام.
      يحتاج جسمك إلى كمية معينة من السعرات يومياً للقيام بالوظائف الحيوية
      والأنشطة اليومية. معرفة احتياجك من السعرات يساعدك على تحقيق أهدافك الصحية.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      مستويات النشاط البدني
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {calorieActivityLevels.map((level, index) => (
        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <span className="text-gray-700 dark:text-gray-300">{level}</span>
        </div>
      ))}
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      أهداف السعرات الحرارية
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {calorieGoals.map((goal, index) => (
        <div
          key={index}
          className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl"
        >
          <span className="text-gray-700 dark:text-gray-300">{goal}</span>
        </div>
      ))}
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      كيف تحسب السعرات الحرارية؟
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      تستخدم حاسبتنا معادلة Mifflin-St Jeor المعتمدة علمياً لحساب معدل الأيض
      الأساسي (BMR)، ثم تضربه في معامل النشاط للحصول على إجمالي الطاقة اليومية
      (TDEE). هذه الطريقة تعطي نتائج دقيقة لمعظم الأشخاص.
    </p>

    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-orange-700 dark:text-orange-300 mb-3">
        🔥 نصيحة من ميلادك
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        لفقدان الوزن بشكل صحي، قلل 500 سعرة حرارية يومياً من احتياجك. هذا
        سيساعدك على فقدان حوالي نصف كيلو أسبوعياً بطريقة آمنة ومستدامة.
      </p>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      نصائح لإدارة السعرات الحرارية
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
      <li>تتبع ما تأكله يومياً باستخدام تطبيق أو دفتر</li>
      <li>اقرأ الملصقات الغذائية على المنتجات</li>
      <li>تناول وجبات صغيرة ومتعددة بدلاً من وجبات كبيرة</li>
      <li>اشرب الماء قبل الوجبات للشعور بالشبع</li>
      <li>مارس الرياضة لزيادة حرق السعرات</li>
    </ul>
  </div>
);

export default function CalorieCalculatorPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة السعرات الحرارية"
      toolSlug="calorie-calculator"
      toolDescription="احسب احتياجك اليومي من السعرات الحرارية بدقة حسب العمر والوزن والطول ومستوى النشاط. أداة مجانية من ميلادك."
      toolIcon="🔥"
      keywords={calorieKeywords}
      seoContent={seoContent}
      gradient="from-orange-500 to-red-500"
      showKeywords={true}
    >
      <CalorieCalculator />
    </ToolPageLayout>
  );
}
