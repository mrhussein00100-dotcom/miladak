import { Metadata } from 'next';
import BirthstonesFlowersPageClient from '@/components/pages/BirthstonesFlowersPage';

export const metadata: Metadata = {
  title: 'أحجار وزهور الميلاد | اكتشف حجرك وزهرتك الخاصة | ميلادك',
  description:
    'اكتشف حجر ميلادك وزهرة ميلادك ولونك المحظوظ حسب شهر ميلادك. تعرف على معاني وخصائص كل حجر كريم وزهرة لكل شهر من شهور السنة مع معلومات شاملة ومفصلة.',
  keywords: [
    'حجر الميلاد',
    'زهرة الميلاد',
    'أحجار كريمة',
    'لون محظوظ',
    'حجر يناير',
    'حجر فبراير',
    'حجر مارس',
    'حجر أبريل',
    'حجر مايو',
    'حجر يونيو',
    'حجر يوليو',
    'حجر أغسطس',
    'حجر سبتمبر',
    'حجر أكتوبر',
    'حجر نوفمبر',
    'حجر ديسمبر',
    'زهور الشهور',
    'الجارنت',
    'الجمشت',
    'الأكوامارين',
    'الألماس',
    'الزمرد',
    'اللؤلؤ',
    'الياقوت',
    'الزبرجد',
    'الأوبال',
    'التوباز',
    'الفيروز',
    'ميلادك',
  ],
  openGraph: {
    title: 'أحجار وزهور الميلاد | اكتشف حجرك وزهرتك الخاصة',
    description:
      'اكتشف حجر ميلادك وزهرة ميلادك ولونك المحظوظ حسب شهر ميلادك. معاني ورموز فريدة لكل شهر.',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ميلادك',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أحجار وزهور الميلاد | ميلادك',
    description: 'اكتشف حجر ميلادك وزهرة ميلادك ولونك المحظوظ حسب شهر ميلادك.',
  },
  alternates: {
    canonical: 'https://miladak.com/birthstones-flowers',
  },
};

export default function BirthstonesFlowersPage() {
  return <BirthstonesFlowersPageClient />;
}
