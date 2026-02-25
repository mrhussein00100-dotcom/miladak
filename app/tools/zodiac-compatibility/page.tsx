
import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import ZodiacCompatibility from '@/components/tools/ZodiacCompatibility';

export const metadata: Metadata = {
  title: 'حاسبة توافق الأبراج | ميلادك - اكتشف نسبة التوافق بينك وبين شريكك',
  description:
    'احسب نسبة التوافق بين الأبراج بدقة. اعرف مدى انسجامك مع شريك حياتك بناءً على صفات الأبراج وعناصرها (ناري، ترابي، هوائي، مائي).',
  keywords: [
    'توافق الأبراج',
    'حاسبة الحب',
    'الأبراج والحب',
    'توافق الزواج',
    'صفات الأبراج',
    'برج الحمل',
    'برج الثور',
    'برج الجوزاء',
    'برج السرطان',
    'برج الأسد',
    'برج العذراء',
    'برج الميزان',
    'برج العقرب',
    'برج القوس',
    'برج الجدي',
    'برج الدلو',
    'برج الحوت',
  ],
  openGraph: {
    title: 'حاسبة توافق الأبراج | ميلادك',
    description: 'اكتشف نسبة التوافق بينك وبين شريكك بناءً على علم الأبراج.',
    url: 'https://miladak.com/tools/zodiac-compatibility',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/zodiac-compatibility',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      كيف يعمل توافق الأبراج؟
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      يعتمد توافق الأبراج بشكل كبير على العناصر الأربعة التي تحكم كل برج: النار، الأرض، الهواء، والماء.
      كل عنصر يحمل صفات معينة تؤثر على كيفية تفاعل الشخص مع الآخرين.
    </p>

    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
        <h3 className="font-bold text-red-700 dark:text-red-300 mb-2">🔥 الأبراج النارية</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          (الحمل، الأسد، القوس) - تتميز بالحماس، الطاقة، والشجاعة. تتوافق جيداً مع الأبراج النارية والهوائية.
        </p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
        <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">🌿 الأبراج الترابية</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          (الثور، العذراء، الجدي) - تتميز بالاستقرار، العملية، والواقعية. تتوافق جيداً مع الأبراج الترابية والمائية.
        </p>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">💨 الأبراج الهوائية</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          (الجوزاء، الميزان، الدلو) - تتميز بالذكاء، التواصل، والاجتماعية. تتوافق جيداً مع الأبراج الهوائية والنارية.
        </p>
      </div>
      <div className="bg-cyan-50 dark:bg-cyan-900/10 p-4 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
        <h3 className="font-bold text-cyan-700 dark:text-cyan-300 mb-2">💧 الأبراج المائية</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          (السرطان، العقرب، الحوت) - تتميز بالعاطفة، الحدس، والعمق. تتوافق جيداً مع الأبراج المائية والترابية.
        </p>
      </div>
    </div>

    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      هل التوافق المنخفض يعني فشل العلاقة؟
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      بالطبع لا! توافق الأبراج يعطيك لمحة عن طبيعة التفاعل بين الشخصيتين، ونقاط القوة والتحديات المحتملة.
      العلاقات الناجحة تبنى على التفاهم، الاحترام، والعمل المستمر من الطرفين، بغض النظر عن ما تقوله النجوم.
      في بعض الأحيان، الاختلافات (تجاذب الأضداد) تخلق علاقات أكثر إثارة وتكاملاً.
    </p>
  </div>
);

export default function ZodiacCompatibilityPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة توافق الأبراج"
      toolSlug="zodiac-compatibility"
      toolDescription="اكتشف نسبة الانسجام والتوافق بينك وبين شريك حياتك بناءً على تحليل الأبراج والعناصر الفلكية."
      toolIcon="🔮"
      keywords={['توافق', 'أبراج', 'حب', 'زواج']}
      seoContent={seoContent}
      gradient="from-purple-600 to-pink-600"
    >
      <ZodiacCompatibility />
    </ToolPageLayout>
  );
}
