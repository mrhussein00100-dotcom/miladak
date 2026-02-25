import { Suspense } from 'react';
import { Metadata } from 'next';
import Hero from '@/components/Hero';
import { AgeCalculator } from '@/components/AgeCalculator';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorks from '@/components/HowItWorks';
import FAQSection from '@/components/FAQSection';
import RandomArticlesSection from '@/components/RandomArticlesSection';
import HomeContentSection from '@/components/HomeContentSection';
import TodayHighlights from '@/components/TodayHighlights';
import QuickToolsGrid from '@/components/QuickToolsGrid';
import { StructuredData } from '@/components/SEO/StructuredData';
import { InContentAd, FooterAd } from '@/components/AdSense/AdSenseSlot';

export const metadata: Metadata = {
  title: 'ميلادك - حاسبة العمر العربية الأكثر دقة',
  description:
    'احسب عمرك بدقة مع ميلادك - أفضل حاسبة عمر عربية مع إحصاءات ممتعة، أدوات حسابية متنوعة، ومعلومات شخصية مفصلة',
  keywords:
    'حاسبة العمر, حساب العمر, ميلادك, عمر, تاريخ الميلاد, حاسبة, أدوات حسابية, إحصاءات العمر',
  openGraph: {
    title: 'ميلادك - حاسبة العمر العربية الأكثر دقة',
    description:
      'احسب عمرك بدقة مع ميلادك - أفضل حاسبة عمر عربية مع إحصاءات ممتعة وأدوات حسابية متنوعة',
    url: 'https://miladak.com',
    siteName: 'ميلادك',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ميلادك - حاسبة العمر العربية الأكثر دقة',
    description:
      'احسب عمرك بدقة مع ميلادك - أفضل حاسبة عمر عربية مع إحصاءات ممتعة وأدوات حسابية متنوعة',
  },
  alternates: {
    canonical: 'https://miladak.com',
  },
};

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ميلادك',
  url: 'https://miladak.com',
  description:
    'حاسبة العمر العربية الأكثر دقة مع إحصاءات ممتعة وأدوات حسابية متنوعة',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://miladak.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ميلادك',
    url: 'https://miladak.com',
  },
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ميلادك',
  url: 'https://miladak.com',
  description: 'موقع ميلادك - حاسبة العمر العربية الأكثر دقة',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://miladak.com/contact',
  },
};

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'حاسبة العمر - ميلادك',
  description: 'احسب عمرك بدقة بالسنوات والأشهر والأيام والساعات',
  url: 'https://miladak.com',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript',
  softwareVersion: '2.0',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'SAR',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'حساب العمر بالميلادي',
    'حساب العمر بالهجري',
    'معرفة البرج',
    'العد التنازلي لعيد الميلاد',
  ],
};

// Loading component for Suspense
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <StructuredData data={websiteStructuredData} />
      <StructuredData data={organizationStructuredData} />
      <StructuredData data={webApplicationSchema} />

      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />
      
        <div className="container mx-auto px-4 -mt-20 relative z-10 mb-12">
          <Suspense fallback={<LoadingSpinner />}>
            <AgeCalculator />
          </Suspense>
        </div>

        <TodayHighlights />
        
        <FeaturesSection />

        <QuickToolsGrid />

        <HowItWorks />

        {/* Tools & Content Section */}
        <HomeContentSection />

        {/* Random Articles */}
        <section className="bg-white dark:bg-gray-800">
          <Suspense fallback={<LoadingSpinner />}>
            <RandomArticlesSection />
          </Suspense>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 dark:bg-gray-900">
          <FAQSection />
        </section>

        {/* إعلان أسفل الصفحة */}
        <FooterAd className="bg-white dark:bg-gray-800" />
      </main>
    </>
  );
}
