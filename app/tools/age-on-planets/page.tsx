import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import AgeOnPlanets from '@/components/tools/AgeOnPlanets';

export const metadata: Metadata = {
  title: 'حاسبة عمرك على الكواكب | ميلادك - اكتشف كم عمرك في الفضاء',
  description:
    'هل تساءلت يوماً كم سيكون عمرك لو كنت تعيش على المريخ أو المشتري؟ استخدم حاسبة العمر الفضائي واكتشف حقائق مذهلة عن عمرك في المجموعة الشمسية.',
  keywords: [
    'عمرك على الكواكب',
    'حاسبة العمر الفضائي',
    'العمر على المريخ',
    'العمر على المشتري',
    'حساب العمر بالفضاء',
    'علم الفلك',
    'المجموعة الشمسية',
    'حقائق عن الكواكب',
    'عيد ميلاد فضائي',
    'السنة الضوئية',
    'دوران الكواكب',
    'ميلادك',
  ],
  openGraph: {
    title: 'حاسبة عمرك على الكواكب | ميلادك',
    description: 'اكتشف كم سيكون عمرك لو كنت تعيش على كوكب آخر!',
    url: 'https://miladak.com/tools/age-on-planets',
    type: 'website',
    images: [
      {
        url: 'https://miladak.com/og-age-on-planets.jpg',
        width: 1200,
        height: 630,
        alt: 'عمرك على الكواكب - ميلادك',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'حاسبة عمرك على الكواكب | ميلادك',
    description: 'اكتشف كم سيكون عمرك لو كنت تعيش على كوكب آخر!',
    images: ['https://miladak.com/og-age-on-planets.jpg'],
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      كيف يتم حساب العمر على الكواكب الأخرى؟
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      يعتمد حساب العمر على الكواكب الأخرى على "الفترة المدارية" للكوكب، وهي المدة التي يستغرقها الكوكب لإكمال دورة كاملة حول الشمس (السنة الكوكبية).
      بما أن كل كوكب يدور بسرعة مختلفة وعلى مسافة مختلفة من الشمس، فإن طول السنة يختلف بشكل كبير من كوكب لآخر.
    </p>

    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🌍 الأرض</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          السنة = 365.25 يوم (المرجع الأساسي)
        </p>
      </div>
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
        <h3 className="font-bold text-red-700 dark:text-red-300 mb-2">🔴 المريخ</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          السنة = 687 يوم أرضي (تقريباً ضعف سنة الأرض)
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">⚪ عطارد</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          السنة = 88 يوم أرضي فقط! (تمر السنين بسرعة فائقة)
        </p>
      </div>
      <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
        <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">🌕 المشتري</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          السنة = 11.8 سنة أرضية (ستكون طفلاً صغيراً هناك!)
        </p>
      </div>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
      حقائق ممتعة
    </h3>
    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
      <li>يوم واحد على كوكب الزهرة أطول من سنة كاملة عليه! (يدور حول نفسه ببطء شديد).</li>
      <li>بلوتو (الكوكب القزم) يستغرق 248 سنة أرضية لإكمال دورة واحدة، مما يعني أنه لم يكمل دورة واحدة منذ اكتشافه!</li>
      <li>على نبتون، ستكون رضيعاً حتى لو كان عمرك 100 سنة على الأرض.</li>
    </ul>
  </div>
);

export default function AgeOnPlanetsPage() {
  return (
    <ToolPageLayout
      toolName="عمرك على الكواكب"
      toolSlug="age-on-planets"
      toolDescription="اكتشف عمرك الحقيقي بمقاييس الكواكب الأخرى في مجموعتنا الشمسية. رحلة ممتعة عبر الزمن والفضاء!"
      toolIcon="🚀"
      keywords={['فضاء', 'كواكب', 'عمر', 'فلك']}
      seoContent={seoContent}
      gradient="from-blue-600 via-purple-600 to-pink-600"
    >
      <AgeOnPlanets />
    </ToolPageLayout>
  );
}
