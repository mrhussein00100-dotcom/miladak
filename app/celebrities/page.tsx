import { Metadata } from 'next';
import CelebritiesPageClient from '@/components/pages/CelebritiesPage';
import Script from 'next/script';

// SEO Keywords - 25+ keywords
const keywords = [
  'مشاهير يوم الميلاد',
  'من ولد في يومي',
  'مشاهير ولدوا اليوم',
  'أعياد ميلاد المشاهير',
  'ميلادك',
  'مشاهير عرب',
  'مشاهير عالميين',
  'ممثلين ولدوا في يومي',
  'رياضيين ولدوا في يومي',
  'علماء ولدوا في يومي',
  'فنانين ولدوا في يومي',
  'مغنيين ولدوا في يومي',
  'كتاب ولدوا في يومي',
  'سياسيين ولدوا في يومي',
  'مشاهير يشاركونني يوم ميلادي',
  'من يشاركني يوم ميلادي',
  'أعياد ميلاد اليوم',
  'مواليد اليوم من المشاهير',
  'تاريخ ميلاد المشاهير',
  'مشاهير شهر يناير',
  'مشاهير شهر فبراير',
  'مشاهير حسب تاريخ الميلاد',
  'قائمة المشاهير',
  'أشهر المشاهير',
  'نجوم ولدوا في يومي',
  'شخصيات مشهورة',
];

export const metadata: Metadata = {
  title: 'مشاهير ولدوا في يومك | ميلادك - اكتشف من يشاركك يوم ميلادك',
  description:
    'اكتشف المشاهير الذين ولدوا في نفس يوم ميلادك. تصفح آلاف المشاهير من ممثلين ورياضيين وعلماء وفنانين حسب تاريخ الميلاد واعرف من يشاركك يومك.',
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
    url: 'https://miladak.com/celebrities',
    siteName: 'ميلادك',
    title: 'مشاهير ولدوا في يومك | ميلادك - اكتشف من يشاركك يوم ميلادك',
    description:
      'اكتشف المشاهير الذين ولدوا في نفس يوم ميلادك. تصفح آلاف المشاهير حسب تاريخ الميلاد.',
    images: [
      {
        url: 'https://miladak.com/og-celebrities.jpg',
        width: 1200,
        height: 630,
        alt: 'مشاهير ولدوا في يومك - ميلادك',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مشاهير ولدوا في يومك | ميلادك',
    description: 'اكتشف من يشاركك يوم ميلادك من المشاهير',
    images: ['https://miladak.com/og-celebrities.jpg'],
  },
  alternates: {
    canonical: 'https://miladak.com/celebrities',
  },
  category: 'مشاهير',
};

// JSON-LD Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'مشاهير ولدوا في يومك - ميلادك',
  description:
    'اكتشف المشاهير الذين ولدوا في نفس يوم ميلادك. تصفح آلاف المشاهير حسب تاريخ الميلاد.',
  url: 'https://miladak.com/celebrities',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '2150',
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
      name: 'مشاهير ولدوا في يومك',
      item: 'https://miladak.com/celebrities',
    },
  ],
};

export default function CelebritiesPage() {
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
      <CelebritiesPageClient />
    </>
  );
}
