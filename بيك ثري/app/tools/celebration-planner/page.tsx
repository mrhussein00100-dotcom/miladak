import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import CelebrationPlanner from '@/components/tools/CelebrationPlanner';
import { birthdayCountdownKeywords } from '@/lib/keywords/birthdayCountdownKeywords';

const celebrationKeywords = [
  'مخطط الاحتفالات',
  'تخطيط حفلة عيد ميلاد',
  'تنظيم الاحتفالات',
  'أفكار حفلات',
  'تحضير الحفلة',
  'قائمة المدعوين',
  'ميزانية الحفلة',
  'ديكور الحفلة',
  'كعكة عيد الميلاد',
  'هدايا الحفلة',
  'ألعاب الحفلة',
  'موسيقى الحفلة',
  'مكان الحفلة',
  'دعوات الحفلة',
  'تصوير الحفلة',
  ...birthdayCountdownKeywords.slice(0, 15),
];

export const metadata: Metadata = {
  title: 'مخطط الاحتفالات | ميلادك - خطط لحفلتك',
  description:
    'خطط لحفلة عيد ميلاد مثالية مع مخطط الاحتفالات من ميلادك. قوائم تحقق، أفكار، وميزانية.',
  keywords: celebrationKeywords,
  openGraph: {
    title: 'مخطط الاحتفالات | ميلادك',
    description: 'خطط لحفلة عيد ميلاد مثالية',
    url: 'https://miladak.com/tools/celebration-planner',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/tools/celebration-planner',
  },
};

const seoContent = (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      خطط لاحتفال مثالي
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
      مخطط الاحتفالات من ميلادك يساعدك على تنظيم حفلة عيد ميلاد لا تُنسى. من
      قائمة المدعوين إلى الديكور والكعكة، نساعدك في كل خطوة!
    </p>

    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
      خطوات التخطيط
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">📋</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          قائمة المدعوين
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          حدد من تريد دعوته
        </p>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">📍</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">المكان</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          اختر مكان الحفلة
        </p>
      </div>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🎨</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الثيم والديكور
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          اختر موضوع الحفلة
        </p>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🎂</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الكعكة والطعام
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">خطط للضيافة</p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">🎮</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الأنشطة والألعاب
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">رتب الترفيه</p>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <span className="text-2xl mb-2 block">💰</span>
        <h4 className="font-bold text-gray-800 dark:text-white mb-1">
          الميزانية
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">حدد التكاليف</p>
      </div>
    </div>

    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-3">
        🎉 نصيحة للتخطيط
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        ابدأ التخطيط قبل الحفلة بأسبوعين على الأقل. هذا يمنحك وقتاً كافياً
        لإرسال الدعوات وتجهيز كل شيء دون ضغط.
      </p>
    </div>
  </div>
);

export default function CelebrationPlannerPage() {
  return (
    <ToolPageLayout
      toolName="مخطط الاحتفالات"
      toolSlug="celebration-planner"
      toolDescription="خطط لحفلة عيد ميلاد مثالية مع قوائم تحقق وأفكار إبداعية. أداة مجانية من ميلادك."
      toolIcon="🎈"
      keywords={celebrationKeywords}
      seoContent={seoContent}
      gradient="from-pink-500 to-purple-500"
      showKeywords={true}
    >
      <CelebrationPlanner />
    </ToolPageLayout>
  );
}
