import { Metadata } from 'next';
import ColorsNumbersPageClient from '@/components/pages/ColorsNumbersPage';

export const metadata: Metadata = {
  title:
    'الألوان والأرقام المحظوظة | اكتشف حظك بناءً على تاريخ ميلادك | ميلادك',
  description:
    'اكتشف ألوانك وأرقامك المحظوظة بناءً على تاريخ ميلادك وبرجك الصيني. تحليل شامل يعتمد على علم الأرقام (Numerology) لمعرفة رقم الحياة واللون المحظوظ.',
  keywords: [
    'الألوان المحظوظة',
    'الأرقام المحظوظة',
    'رقم الحياة',
    'علم الأرقام',
    'البرج الصيني',
    'لون محظوظ',
    'رقم محظوظ',
    'تاريخ الميلاد',
    'حظك اليوم',
    'numerology',
    'life path number',
    'lucky color',
    'lucky number',
    'chinese zodiac',
    'ميلادك',
  ],
  openGraph: {
    title: 'الألوان والأرقام المحظوظة | اكتشف حظك',
    description:
      'اكتشف ألوانك وأرقامك المحظوظة بناءً على تاريخ ميلادك وبرجك الصيني.',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ميلادك',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الألوان والأرقام المحظوظة | ميلادك',
    description: 'اكتشف ألوانك وأرقامك المحظوظة بناءً على تاريخ ميلادك.',
  },
  alternates: {
    canonical: 'https://miladak.com/colors-numbers',
  },
};

export default function ColorsNumbersPage() {
  return <ColorsNumbersPageClient />;
}
