import { Metadata } from 'next';
import CardsPageClient from '@/components/cards/CardsPageClient';

export const metadata: Metadata = {
  title: 'بطاقات التهنئة | ميلادك',
  description:
    'صمم بطاقات تهنئة جميلة لأعياد الميلاد وشاركها مع أحبائك. قوالب متنوعة وتصاميم احترافية.',
  keywords: [
    'بطاقات تهنئة',
    'بطاقات عيد ميلاد',
    'تصميم بطاقات',
    'بطاقات معايدة',
    'تهنئة عيد ميلاد',
    'بطاقات مجانية',
  ],
  openGraph: {
    title: 'بطاقات التهنئة | ميلادك',
    description: 'صمم بطاقات تهنئة جميلة لأعياد الميلاد وشاركها مع أحبائك',
    type: 'website',
  },
};

export default function CardsPage() {
  return <CardsPageClient />;
}
