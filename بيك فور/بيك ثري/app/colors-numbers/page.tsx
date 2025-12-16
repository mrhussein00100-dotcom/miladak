import { Metadata } from 'next';
import ColorsNumbersPageClient from '@/components/pages/ColorsNumbersPage';

export const metadata: Metadata = {
  title: 'الألوان والأرقام المحظوظة | ميلادك',
  description:
    'اكتشف ألوانك وأرقامك المحظوظة بناءً على تاريخ ميلادك وبرجك الصيني. تعرف على معاني الألوان والأرقام وكيفية استخدامها في حياتك.',
  keywords: [
    'الألوان المحظوظة',
    'الأرقام المحظوظة',
    'البرج الصيني',
    'ألوان الحظ',
    'أرقام الحظ',
    'تاريخ الميلاد',
    'الألوان والأرقام',
    'حظ الألوان',
    'حظ الأرقام',
    'ميلادك',
  ],
  openGraph: {
    title: 'الألوان والأرقام المحظوظة | ميلادك',
    description:
      'اكتشف ألوانك وأرقامك المحظوظة بناءً على تاريخ ميلادك وبرجك الصيني',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الألوان والأرقام المحظوظة | ميلادك',
    description:
      'اكتشف ألوانك وأرقامك المحظوظة بناءً على تاريخ ميلادك وبرجك الصيني',
  },
};

export default function ColorsNumbersPage() {
  return <ColorsNumbersPageClient />;
}
