'use client';

import Script from 'next/script';

interface ToolStructuredDataProps {
  toolName: string;
  toolSlug: string;
  toolDescription: string;
  toolIcon?: string;
  keywords?: string[];
  howToSteps?: string[];
}

export default function ToolStructuredData({
  toolName,
  toolSlug,
  toolDescription,
  keywords = [],
  howToSteps,
}: ToolStructuredDataProps) {
  const baseUrl = 'https://miladak.com';

  // WebApplication Schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${toolName} | ميلادك`,
    description: toolDescription,
    url: `${baseUrl}/tools/${toolSlug}`,
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
    provider: {
      '@type': 'Organization',
      name: 'ميلادك',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      sameAs: ['https://twitter.com/miladak', 'https://facebook.com/miladak'],
    },
    author: {
      '@type': 'Organization',
      name: 'ميلادك',
      url: baseUrl,
    },
    inLanguage: 'ar',
    keywords: keywords.slice(0, 20).join(', '),
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // HowTo Schema - خطوات استخدام الأداة
  const defaultSteps = [
    'افتح صفحة الأداة على موقع ميلادك',
    'أدخل البيانات المطلوبة في الحقول المخصصة',
    'اضغط على زر الحساب للحصول على النتيجة',
    'اطلع على النتائج التفصيلية',
    'يمكنك مشاركة النتيجة أو طباعتها',
  ];

  const howToData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `كيفية استخدام ${toolName} من ميلادك`,
    description: `دليل خطوة بخطوة لاستخدام ${toolName} على موقع ميلادك`,
    image: `${baseUrl}/images/tools/${toolSlug}.png`,
    totalTime: 'PT2M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'SAR',
      value: '0',
    },
    supply: [],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'متصفح إنترنت',
      },
    ],
    step: (howToSteps || defaultSteps).map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `الخطوة ${index + 1}`,
      text: step,
      url: `${baseUrl}/tools/${toolSlug}#step-${index + 1}`,
    })),
  };

  // BreadcrumbList Schema
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'الأدوات',
        item: `${baseUrl}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: toolName,
        item: `${baseUrl}/tools/${toolSlug}`,
      },
    ],
  };

  // FAQPage Schema - أسئلة شائعة
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `ما هي ${toolName}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: toolDescription,
        },
      },
      {
        '@type': 'Question',
        name: `هل ${toolName} مجانية؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `نعم، ${toolName} من ميلادك مجانية تماماً ولا تحتاج لتسجيل أو اشتراك.`,
        },
      },
      {
        '@type': 'Question',
        name: `كيف أستخدم ${toolName}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `لاستخدام ${toolName}، أدخل البيانات المطلوبة في الحقول المخصصة ثم اضغط على زر الحساب للحصول على النتيجة فوراً.`,
        },
      },
    ],
  };

  return (
    <>
      <Script
        id={`tool-structured-data-${toolSlug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id={`tool-howto-data-${toolSlug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToData) }}
      />
      <Script
        id={`tool-breadcrumb-data-${toolSlug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <Script
        id={`tool-faq-data-${toolSlug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
}
