import { Metadata } from 'next';
import HistoricalEventsPageClient from '@/components/pages/HistoricalEventsPage';

export const metadata: Metadata = {
  title: 'أحداث تاريخية | ميلادك - اكتشف ما حدث في يوم ميلادك',
  description:
    'اكتشف الأحداث التاريخية المهمة التي وقعت في يوم ميلادك. تصفح الأحداث حسب التاريخ واعرف ما حدث في هذا اليوم عبر التاريخ.',
  keywords: [
    'أحداث تاريخية',
    'هذا اليوم في التاريخ',
    'ماذا حدث في يوم ميلادي',
    'أحداث يوم الميلاد',
    'تاريخ اليوم',
    'ميلادك',
  ],
};

export default function HistoricalEventsPage() {
  return <HistoricalEventsPageClient />;
}
