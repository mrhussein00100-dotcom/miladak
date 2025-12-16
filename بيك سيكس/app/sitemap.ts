import { MetadataRoute } from 'next';

const BASE_URL = 'https://miladak.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  const toolPages = [
    'bmi-calculator',
    'calorie-calculator',
    'birthday-countdown',
    'days-between',
    'age-in-seconds',
    'life-statistics',
    'day-of-week',
    'event-countdown',
    'child-age',
    'child-growth',
    'pregnancy-stages',
    'relative-age',
    'generation-calculator',
    'timezone-calculator',
    'holidays-calculator',
    'islamic-holidays-dates',
    'celebration-planner',
  ].map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages];
}
