import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import AgeDifference from '@/components/tools/AgeDifference';

export const metadata: Metadata = {
  title: 'حاسبة فرق العمر بين شخصين - احسب الفارق الزمني بدقة | ميلادك',
  description:
    'أداة مجانية لحساب فرق العمر بين شخصين بالسنوات والأشهر والأيام. اعرف من الأكبر وكم الفارق الزمني بين تاريخي الميلاد بدقة.',
  keywords: [
    'حاسبة فرق العمر',
    'الفرق بين عمرين',
    'حساب فرق السن',
    'من أكبر',
    'فارق العمر',
    'حساب الفرق بين تاريخين',
    'حاسبة العمر',
    'مقارنة الأعمار',
    'الفرق بين الزوجين',
    'حاسبة التوافق العمري',
  ],
  openGraph: {
    title: 'حاسبة فرق العمر | ميلادك',
    description: 'احسب الفرق الدقيق بين عمرك وعمر أي شخص آخر!',
    url: 'https://miladak.com/tools/age-difference',
    type: 'website',
    images: [
      {
        url: 'https://miladak.com/og-age-difference.jpg',
        width: 1200,
        height: 630,
        alt: 'حاسبة فرق العمر - ميلادك',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'حاسبة فرق العمر | ميلادك',
    description: 'احسب الفرق الدقيق بين عمرك وعمر أي شخص آخر!',
    images: ['https://miladak.com/og-age-difference.jpg'],
  },
};

export default function AgeDifferencePage() {
  return (
    <ToolPageLayout
      toolName="حاسبة فرق العمر"
      toolSlug="age-difference"
      toolDescription="هل تساءلت يوماً عن الفرق الدقيق في العمر بينك وبين شريكك، أو بينك وبين صديقك؟ هذه الأداة تحسب لك الفرق بالسنوات والأشهر والأيام، وتخبرك من الأكبر سناً، بالإضافة إلى إحصائيات ممتعة أخرى."
      toolIcon="⏳"
    >
      <AgeDifference />
    </ToolPageLayout>
  );
}
