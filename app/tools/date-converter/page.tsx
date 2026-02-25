import DateConverter from '@/components/tools/DateConverter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'محول التاريخ الهجري والميلادي | تحويل دقيق وسريع',
  description: 'أداة مجانية لتحويل التاريخ من هجري لميلادي ومن ميلادي لهجري بدقة عالية. اعرف تاريخ ميلادك بالهجري وتواريخ المناسبات الإسلامية.',
  keywords: [
    'محول التاريخ',
    'تحويل هجري ميلادي',
    'التقويم الهجري',
    'التقويم الميلادي',
    'حساب العمر بالهجري',
    'تاريخ اليوم هجري',
    'تحويل التاريخ',
    'هجري الى ميلادي',
    'ميلادي الى هجري',
  ],
  openGraph: {
    title: 'محول التاريخ الهجري والميلادي | تحويل دقيق وسريع',
    description:
      'أداة مجانية لتحويل التاريخ من هجري لميلادي ومن ميلادي لهجري بدقة عالية.',
    url: 'https://miladak.com/tools/date-converter',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ميلادك',
    images: [
      {
        url: 'https://miladak.com/og-date-converter.jpg',
        width: 1200,
        height: 630,
        alt: 'محول التاريخ - ميلادك',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'محول التاريخ الهجري والميلادي | ميلادك',
    description: 'حول التاريخ بين الهجري والميلادي بدقة وسهولة.',
    images: ['https://miladak.com/og-date-converter.jpg'],
  },
  alternates: {
    canonical: 'https://miladak.com/tools/date-converter',
  },
};

export default function DateConverterPage() {
  return <DateConverter />;
}
