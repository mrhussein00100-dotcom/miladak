import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import GenerationCalculator from '@/components/tools/GenerationCalculator';
import { ageKeywords } from '@/lib/keywords/ageKeywords';

const generationKeywords = [
  'حاسبة الأجيال',
  'معرفة جيلك',
  'جيل الألفية',
  'جيل Z',
  'جيل X',
  'Baby Boomers',
  'Generation Alpha',
  'تصنيف الأجيال',
  'خصائص الأجيال',
  'فرق الأجيال',
  ...ageKeywords.slice(0, 20),
];

export const metadata: Metadata = {
  title: 'حاسبة الأجيال | ميلادك - اكتشف جيلك',
  description:
    'اكتشف إلى أي جيل تنتمي وتعرف على خصائص جيلك. حاسبة مجانية لتصنيف الأجيال.',
  keywords: generationKeywords,
  openGraph: {
    title: 'حاسبة الأجيال | ميلادك',
    description: 'اكتشف إلى أي جيل تنتمي وتعرف على خصائص جيلك',
    url: 'https://miladak.com/tools/generation-calculator',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/generation-calculator',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      اكتشف جيلك
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      كل جيل له خصائصه وتجاربه الفريدة. حاسبة الأجيال من ميلادك تساعدك على معرفة
      إلى أي جيل تنتمي واكتشاف الخصائص المشتركة لجيلك.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      تصنيف الأجيال
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          Baby Boomers
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">1946-1964</p>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          Generation X
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">1965-1980</p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          Millennials
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">1981-1996</p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          Generation Z
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">1997-2012</p>
      </div>
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl col-span-2">
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          Generation Alpha
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">2013-الآن</p>
      </div>
    </div>

    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3">
        🌟 لماذا تصنيف الأجيال مهم؟
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        فهم الأجيال يساعد على تحسين التواصل بين الأجيال المختلفة وفهم الاختلافات
        في القيم والتوقعات وأساليب العمل والتواصل.
      </p>
    </div>
  </div>
);

export default function GenerationCalculatorPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة الأجيال"
      toolSlug="generation-calculator"
      toolDescription="اكتشف إلى أي جيل تنتمي وتعرف على خصائص جيلك. أداة مجانية من ميلادك."
      toolIcon="👨‍👩‍👧‍👦"
      keywords={generationKeywords}
      seoContent={seoContent}
      gradient="from-purple-500 to-indigo-500"
      showKeywords={true}
    >
      <GenerationCalculator />
    </ToolPageLayout>
  );
}
