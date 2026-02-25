import { Metadata } from 'next';
import ChineseZodiacPageClient from '@/components/pages/ChineseZodiacPage';

export const metadata: Metadata = {
  title: 'البرج الصيني | ميلادك - اكتشف برجك الصيني',
  description:
    'اكتشف برجك الصيني بناءً على سنة ميلادك. تعرف على صفاتك وتوافقك مع الأبراج الأخرى وأرقامك وألوانك المحظوظة.',
  keywords: [
    'البرج الصيني',
    'الأبراج الصينية',
    'حاسبة البرج الصيني',
    'برج الفأر',
    'برج الثور',
    'برج النمر',
    'برج الأرنب',
    'برج التنين',
    'برج الأفعى',
    'برج الحصان',
    'برج الماعز',
    'برج القرد',
    'برج الديك',
    'برج الكلب',
    'برج الخنزير',
    'ميلادك',
  ],
  openGraph: {
    title: 'البرج الصيني | ميلادك',
    description: 'اكتشف برجك الصيني بناءً على سنة ميلادك',
    type: 'website',
  },
};

export default function ChineseZodiacPage() {
  return <ChineseZodiacPageClient />;
}
