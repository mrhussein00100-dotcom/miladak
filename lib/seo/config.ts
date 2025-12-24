/**
 * SEO Configuration Constants
 * إعدادات SEO الثابتة للموقع
 */

// ==================== Base Configuration ====================

export const SEO_CONFIG = {
  // Site URL - يمكن تغييره من متغيرات البيئة
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://miladak.com',

  // Site Information
  siteName: 'ميلادك',
  siteNameEn: 'Miladak',
  defaultLocale: 'ar_SA',
  language: 'ar',

  // Default Meta
  defaultTitle: 'ميلادك - حاسبة العمر الدقيقة وأدوات مفيدة',
  defaultDescription:
    'احسب عمرك بدقة بالسنوات والأشهر والأيام والساعات. اكتشف برجك وإحصاءات حياتك الممتعة مع ميلادك - أفضل حاسبة عمر عربية.',

  // Images
  defaultImage: '/icon.svg',
  logo: '/icon.svg',

  // Social
  twitterHandle: '@miladak',

  // AdSense
  adsensePublisherId:
    process.env.ADSENSE_PUBLISHER_ID ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
    '',
} as const;

// ==================== Sitemap Priority Configuration ====================

export const SITEMAP_PRIORITY = {
  // الصفحة الرئيسية - أعلى أولوية
  home: 1.0,

  // صفحات الأدوات الرئيسية
  toolsListing: 0.9,

  // صفحات الأدوات الفردية
  toolPage: 0.8,

  // صفحات المقالات
  articlesListing: 0.8,
  articlePage: 0.8,

  // صفحات التصنيفات
  categoriesListing: 0.7,
  categoryPage: 0.7,

  // صفحات ثابتة مهمة
  about: 0.6,
  contact: 0.6,

  // صفحات قانونية
  privacy: 0.4,
  terms: 0.4,
} as const;

// ==================== Sitemap Change Frequency ====================

export const SITEMAP_CHANGE_FREQ = {
  home: 'daily' as const,
  toolsListing: 'weekly' as const,
  toolPage: 'monthly' as const,
  articlesListing: 'daily' as const,
  articlePage: 'weekly' as const,
  categoriesListing: 'weekly' as const,
  categoryPage: 'weekly' as const,
  about: 'monthly' as const,
  contact: 'monthly' as const,
  privacy: 'yearly' as const,
  terms: 'yearly' as const,
} as const;

// ==================== Static Pages for Sitemap ====================

export const STATIC_PAGES = [
  {
    path: '',
    priority: SITEMAP_PRIORITY.home,
    changeFreq: SITEMAP_CHANGE_FREQ.home,
  },
  {
    path: '/tools',
    priority: SITEMAP_PRIORITY.toolsListing,
    changeFreq: SITEMAP_CHANGE_FREQ.toolsListing,
  },
  {
    path: '/articles',
    priority: SITEMAP_PRIORITY.articlesListing,
    changeFreq: SITEMAP_CHANGE_FREQ.articlesListing,
  },
  {
    path: '/categories',
    priority: SITEMAP_PRIORITY.categoriesListing,
    changeFreq: SITEMAP_CHANGE_FREQ.categoriesListing,
  },
  {
    path: '/calculate-birthday',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/cards',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/colors-numbers',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/chinese-zodiac',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/celebrities',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/historical-events',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/birthstones-flowers',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/pregnancy-calculator',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/friends',
    priority: SITEMAP_PRIORITY.toolPage,
    changeFreq: SITEMAP_CHANGE_FREQ.toolPage,
  },
  {
    path: '/search',
    priority: 0.5,
    changeFreq: 'weekly' as const,
  },
  {
    path: '/about',
    priority: SITEMAP_PRIORITY.about,
    changeFreq: SITEMAP_CHANGE_FREQ.about,
  },
  {
    path: '/contact',
    priority: SITEMAP_PRIORITY.contact,
    changeFreq: SITEMAP_CHANGE_FREQ.contact,
  },
  {
    path: '/privacy',
    priority: SITEMAP_PRIORITY.privacy,
    changeFreq: SITEMAP_CHANGE_FREQ.privacy,
  },
  {
    path: '/terms',
    priority: SITEMAP_PRIORITY.terms,
    changeFreq: SITEMAP_CHANGE_FREQ.terms,
  },
] as const;

// ==================== Robots.txt Configuration ====================

export const ROBOTS_CONFIG = {
  // المسارات المسموح بها
  allowedPaths: [
    '/',
    '/tools/',
    '/articles/',
    '/categories/',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ],

  // المسارات الممنوعة
  disallowedPaths: [
    '/admin/',
    '/api/',
    '/_next/',
    '/test-*',
    '/*.json$',
    '/search',
  ],

  // Crawl delay بالثواني
  crawlDelay: 1,
} as const;

// ==================== Ads.txt Configuration ====================

export const ADS_CONFIG = {
  // Google AdSense
  google: {
    domain: 'google.com',
    relationship: 'DIRECT' as const,
    certificationId: 'f08c47fec0942fa0',
  },
} as const;

// ==================== JSON-LD Default Templates ====================

export const JSONLD_DEFAULTS = {
  organization: {
    '@context': 'https://schema.org' as const,
    '@type': 'Organization' as const,
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    logo: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.logo}`,
    description: SEO_CONFIG.defaultDescription,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint' as const,
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
    },
  },

  website: {
    '@context': 'https://schema.org' as const,
    '@type': 'WebSite' as const,
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    description: SEO_CONFIG.defaultDescription,
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction' as const,
      target: {
        '@type': 'EntryPoint' as const,
        urlTemplate: `${SEO_CONFIG.baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },

  publisher: {
    '@type': 'Organization' as const,
    name: SEO_CONFIG.siteName,
    logo: {
      '@type': 'ImageObject' as const,
      url: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.logo}`,
    },
  },
} as const;

// ==================== Sitemap Limits ====================

export const SITEMAP_LIMITS = {
  maxUrlsPerSitemap: 50000,
  maxFileSizeBytes: 50 * 1024 * 1024, // 50MB
} as const;

export default {
  SEO_CONFIG,
  SITEMAP_PRIORITY,
  SITEMAP_CHANGE_FREQ,
  STATIC_PAGES,
  ROBOTS_CONFIG,
  ADS_CONFIG,
  JSONLD_DEFAULTS,
  SITEMAP_LIMITS,
};
