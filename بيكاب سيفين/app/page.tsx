import { Suspense } from 'react';
import { Metadata } from 'next';
import Hero from '@/components/Hero';
import { AgeCalculator } from '@/components/AgeCalculator';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorks from '@/components/HowItWorks';
import FAQSection from '@/components/FAQSection';
import RandomArticlesSection from '@/components/RandomArticlesSection';
import HomeContentSection from '@/components/HomeContentSection';
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

      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />

        {/* Main Age Calculator */}
        <section
          id="calculator"
          className="py-16 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                احسب عمرك الآن
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                أدخل تاريخ ميلادك واكتشف عمرك بالتفصيل مع إحصاءات ممتعة
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={<LoadingSpinner />}>
                <AgeCalculator />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-gray-800">
          <FeaturesSection />
        </section>

        {/* إعلان بين الأقسام */}
        <InContentAd className="bg-gray-50 dark:bg-gray-900 py-4" />

        {/* How It Works */}
        <section className="bg-gray-50 dark:bg-gray-900">
          <HowItWorks />
        </section>

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
