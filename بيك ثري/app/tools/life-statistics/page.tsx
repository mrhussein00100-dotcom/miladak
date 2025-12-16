import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { LifeStatisticsCalculator } from '@/components/tools/LifeStatisticsCalculator';
import {
  ageKeywords,
  lifeStatisticsKeywords,
} from '@/lib/keywords/ageKeywords';

const allKeywords = [...lifeStatisticsKeywords, ...ageKeywords.slice(0, 30)];

export const metadata: Metadata = {
  title: 'إحصائيات الحياة | ميلادك - اكتشف أرقاماً مذهلة عن حياتك',
  description:
    'اكتشف إحصائيات مذهلة عن حياتك: كم مرة تنفست، عدد نبضات قلبك، ساعات نومك، وأكثر. حاسبة مجانية للإحصائيات الشخصية.',
  keywords: allKeywords,
  openGraph: {
    title: 'إحصائيات الحياة | ميلادك',
    description: 'اكتشف إحصائيات مذهلة عن حياتك',
    url: 'https://miladak.com/tools/life-statistics',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/life-statistics',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      إحصائيات مذهلة عن حياتك
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      هل تساءلت يوماً كم مرة تنفست منذ ولادتك؟ أو كم نبضة نبض قلبك؟ أداة
      إحصائيات الحياة من ميلادك تكشف لك أرقاماً مذهلة ومثيرة عن حياتك بناءً على
      عمرك.
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      ماذا ستكتشف؟
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">❤️</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          نبضات القلب
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          عدد المرات التي نبض فيها قلبك
        </p>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🌬️</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          مرات التنفس
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          كم مرة تنفست في حياتك
        </p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">😴</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          ساعات النوم
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          الوقت الذي قضيته نائماً
        </p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🍽️</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الوجبات
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          عدد الوجبات التي تناولتها
        </p>
      </div>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">👣</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الخطوات
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          تقدير عدد خطواتك
        </p>
      </div>
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">😊</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الابتسامات
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          كم مرة ابتسمت تقريباً
        </p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3">
        🌟 حقيقة مذهلة
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        القلب البشري ينبض حوالي 100,000 مرة يومياً، أي أكثر من 35 مليون نبضة
        سنوياً! تخيل كم نبضة نبض قلبك منذ ولادتك.
      </p>
    </div>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      لماذا هذه الإحصائيات مهمة؟
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
      معرفة هذه الأرقام تساعدك على تقدير قيمة الحياة وكل لحظة فيها. كل نبضة قلب،
      كل نفس، كل خطوة هي جزء من رحلتك الفريدة في هذه الحياة. استمتع باكتشاف هذه
      الإحصائيات المذهلة!
    </p>
  </div>
);

export default function LifeStatisticsPage() {
  return (
    <ToolPageLayout
      toolName="إحصائيات الحياة"
      toolSlug="life-statistics"
      toolDescription="اكتشف إحصائيات مذهلة عن حياتك: نبضات القلب، مرات التنفس، ساعات النوم، وأكثر. أداة مجانية من ميلادك."
      toolIcon="📊"
      keywords={allKeywords}
      seoContent={seoContent}
      gradient="from-purple-500 to-pink-500"
      showKeywords={true}
    >
      <LifeStatisticsCalculator />
    </ToolPageLayout>
  );
}
