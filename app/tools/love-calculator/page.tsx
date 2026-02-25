import { Metadata } from 'next';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import LoveCalculator from '@/components/tools/LoveCalculator';

export const metadata: Metadata = {
  title: 'حاسبة الحب - اكتشف نسبة التوافق مع شريكك | ميلادك',
  description:
    'احسب نسبة الحب والتوافق بينك وبين شريك حياتك مجاناً. اكتشف مدى الانسجام بين اسميكما باستخدام خوارزمية حاسبة الحب الممتعة.',
  keywords: [
    'حاسبة الحب',
    'نسبة الحب',
    'قياس الحب',
    'توافق الأسماء',
    'اختبار الحب',
    'مقياس الحب',
    'لعبة الحب',
    'نسبة التوافق',
    'الحب الحقيقي',
    'حاسبة التوافق',
  ],
  openGraph: {
    title: 'حاسبة الحب | ميلادك',
    description: 'اكتشف نسبة الحب بينك وبين شريكك الآن!',
    url: 'https://miladak.com/tools/love-calculator',
    type: 'website',
    images: [
      {
        url: 'https://miladak.com/og-love-calculator.jpg', // You might want to create this image later
        width: 1200,
        height: 630,
        alt: 'حاسبة الحب',
      },
    ],
  },
};

export default function LoveCalculatorPage() {
  return (
    <ToolPageLayout
      toolName="حاسبة الحب"
      toolSlug="love-calculator"
      toolDescription="أداة ممتعة لحساب نسبة التوافق والحب بين شخصين بناءً على أسمائهم."
      toolIcon="💘"
    >
      <LoveCalculator />
    </ToolPageLayout>
  );
}
