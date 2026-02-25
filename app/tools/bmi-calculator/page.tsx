import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { BMICalculator } from '@/components/tools/BMICalculator';
import { bmiKeywords, bmiCategories } from '@/lib/keywords/bmiKeywords';

export const metadata: Metadata = {
  title: 'حاسبة مؤشر كتلة الجسم BMI | ميلادك - حساب الوزن المثالي',
  description:
    'احسب مؤشر كتلة جسمك BMI بدقة واعرف إذا كان وزنك مثالياً. حاسبة BMI مجانية مع نصائح صحية وتصنيفات الوزن حسب منظمة الصحة العالمية.',
  keywords: bmiKeywords,
  openGraph: {
    title: 'حاسبة مؤشر كتلة الجسم BMI | ميلادك',
    description: 'احسب مؤشر كتلة جسمك BMI بدقة واعرف إذا كان وزنك مثالياً',
    url: 'https://miladak.com/tools/bmi-calculator',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/bmi-calculator',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      ما هو مؤشر كتلة الجسم BMI؟
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      مؤشر كتلة الجسم (BMI) هو مقياس عالمي يستخدم لتقييم ما إذا كان وزن الشخص
      صحياً بالنسبة لطوله. يتم حسابه بقسمة الوزن بالكيلوغرام على مربع الطول
      بالمتر. هذا المؤشر معتمد من منظمة الصحة العالمية ويستخدمه الأطباء في جميع
      أنحاء العالم.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      تصنيفات مؤشر كتلة الجسم
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {bmiCategories.map((category, index) => (
        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <span className="text-gray-700 dark:text-gray-300">{category}</span>
        </div>
      ))}
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      أهمية معرفة مؤشر كتلة الجسم
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      معرفة مؤشر كتلة جسمك يساعدك على فهم حالتك الصحية واتخاذ قرارات أفضل بشأن
      نمط حياتك. يمكن أن يكون مؤشراً مبكراً لمخاطر صحية مثل أمراض القلب والسكري
      وارتفاع ضغط الدم. ومع ذلك، يجب استشارة طبيب للحصول على تقييم شامل لصحتك.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      نصائح للحفاظ على وزن صحي
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
      <li>تناول غذاء متوازن غني بالخضروات والفواكه</li>
      <li>ممارسة الرياضة بانتظام (30 دقيقة يومياً على الأقل)</li>
      <li>شرب كمية كافية من الماء</li>
      <li>الحصول على قسط كافٍ من النوم</li>
      <li>تجنب الأطعمة المصنعة والسكريات الزائدة</li>
    </ul>
  </div>
);

export default function BMICalculatorPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة مؤشر كتلة الجسم BMI"
      toolSlug="bmi-calculator"
      toolDescription="احسب مؤشر كتلة جسمك واعرف إذا كان وزنك ضمن النطاق الصحي. أداة دقيقة ومجانية من ميلادك."
      toolIcon="⚖️"
      keywords={bmiKeywords}
      seoContent={seoContent}
      gradient="from-green-500 to-emerald-500"
      showKeywords={true}
    >
      <BMICalculator />
    </ToolPageLayout>
  );
}
