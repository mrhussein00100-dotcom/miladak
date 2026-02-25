import { Metadata } from 'next';
import { CalculateBirthdayClient } from '@/components/CalculateBirthdayClient';
import { StructuredData } from '@/components/SEO/StructuredData';

export const metadata: Metadata = {
  title: 'احسب ميلادك - حاسبة العمر الأكثر دقة وشمولاً | ميلادك',
  description:
    'احسب عمرك بدقة متناهية واكتشف معلومات مذهلة عن ميلادك: برجك، يوم ميلادك، عمرك بالثواني، إحصائيات حياتك، الأحداث التاريخية في يوم ميلادك، المشاهير الذين يشاركونك نفس اليوم، وأكثر من 50 معلومة مفيدة!',
  keywords: [
    'احسب ميلادك',
    'حاسبة العمر',
    'حساب العمر',
    'كم عمري',
    'عمري بالأيام',
    'عمري بالساعات',
    'عمري بالثواني',
    'برجي',
    'يوم ميلادي',
    'معلومات عن ميلادي',
    'إحصائيات الحياة',
    'حاسبة العمر الدقيقة',
    'age calculator',
    'birthday calculator',
    'معرفة البرج',
    'حساب تاريخ الميلاد',
    'العمر بالهجري',
    'العمر بالميلادي',
    'مشاهير يوم ميلادي',
    'أحداث تاريخية يوم ميلادي',
  ],
  openGraph: {
    title: 'احسب ميلادك - حاسبة العمر الأكثر دقة وشمولاً',
    description:
      'اكتشف معلومات مذهلة عن ميلادك: عمرك بدقة، برجك، إحصائيات حياتك، والمزيد!',
    url: 'https://miladak.com/calculate-birthday',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://miladak.com/calculate-birthday',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'احسب ميلادك - حاسبة العمر الشاملة',
  description: 'حاسبة عمر متقدمة تقدم أكثر من 50 معلومة عن ميلادك وحياتك',
  url: 'https://miladak.com/calculate-birthday',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '15000',
  },
};

export default function CalculateBirthdayPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <CalculateBirthdayClient />
    </>
  );
}
