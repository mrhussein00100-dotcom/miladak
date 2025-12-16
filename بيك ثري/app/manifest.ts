import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ميلادك - حاسبة العمر الدقيقة',
    short_name: 'ميلادك',
    description: 'احسب عمرك بدقة بالسنوات والأشهر والأيام والساعات. اكتشف برجك وإحصاءات حياتك الممتعة.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8B5CF6',
    orientation: 'portrait',
    categories: ['utilities', 'lifestyle', 'health'],
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
