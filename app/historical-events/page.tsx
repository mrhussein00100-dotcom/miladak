import { Metadata } from 'next';
import HistoricalEventsPageClient from '@/components/pages/HistoricalEventsPage';
import Script from 'next/script';

// SEO Keywords - 25+ keywords
const keywords = [
  'أحداث تاريخية',
  'هذا اليوم في التاريخ',
  'ماذا حدث في يوم ميلادي',
  'أحداث يوم الميلاد',
  'تاريخ اليوم',
  'ميلادك',
  'أحداث تاريخية مهمة',
  'تاريخ يوم ميلادي',
  'ما حدث في هذا اليوم',
  'أحداث عالمية',
  'تاريخ العالم',
  'أحداث سياسية',
  'أحداث علمية',
  'أحداث رياضية',
  'أحداث ثقافية',
  'مواليد مشاهير',
  'وفيات مشاهير',
  'اكتشافات تاريخية',
  'حروب تاريخية',
  'معارك تاريخية',
  'اختراعات تاريخية',
  'أحداث عربية',
  'تاريخ العرب',
  'أحداث إسلامية',
  'تقويم تاريخي',
  'يوميات تاريخية',
];

export const metadata: Metadata = {
  title: 'أحداث تاريخية | ميلادك - اكتشف ما حدث في يوم ميلادك عبر التاريخ',
  description:
    'اكتشف الأحداث التاريخية المهمة التي وقعت في يوم ميلادك. تصفح آلاف الأحداث السياسية والعلمية والرياضية حسب التاريخ واعرف ما حدث في هذا اليوم.',
  keywords: keywords,
  authors: [{ name: 'ميلادك' }],
  creator: 'ميلادك',
  publisher: 'ميلادك',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://miladak.com/historical-events',
    siteName: 'ميلادك',
    title: 'أحداث تاريخية | ميلادك - اكتشف ما حدث في يوم ميلادك',
    description:
      'اكتشف الأحداث التاريخية المهمة التي وقعت في يوم ميلادك. تصفح آلاف الأحداث حسب التاريخ.',
    images: [
      {
        url: 'https://miladak.com/og-historical-events.jpg',
        width: 1200,
        height: 630,
        alt: 'أحداث تاريخية - ميلادك',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أحداث تاريخية | ميلادك',
    description: 'اكتشف ما حدث في يوم ميلادك عبر التاريخ',
    images: ['https://miladak.com/og-historical-events.jpg'],
  },
  alternates: {
    canonical: 'https://miladak.com/historical-events',
  },
  category: 'تاريخ',
};

// JSON-LD Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'أحداث تاريخية - ميلادك',
  description:
    'اكتشف الأحداث التاريخية المهمة التي وقعت في يوم ميلادك. تصفح آلاف الأحداث حسب التاريخ.',
  url: 'https://miladak.com/historical-events',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
  author: {
    '@type': 'Organization',
    name: 'ميلادك',
    url: 'https://miladak.com',
  },
  inLanguage: 'ar',
  isAccessibleForFree: true,
};

const breadcrumbData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'الرئيسية',
      item: 'https://miladak.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'الأدوات',
      item: 'https://miladak.com/tools',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'أحداث تاريخية',
      item: 'https://miladak.com/historical-events',
    },
  ],
};

export default function HistoricalEventsPage() {
  return (
    <>
      <Script
        id="structured-data-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <HistoricalEventsPageClient />
    </>
  );
}
