import { Metadata } from 'next';
import HistoricalEventsAdmin from '@/components/admin/HistoricalEventsAdmin';

export const metadata: Metadata = {
  title: 'إدارة الأحداث التاريخية | لوحة التحكم',
  description: 'إدارة الأحداث التاريخية اليومية والسنوية',
};

export default function HistoricalEventsAdminPage() {
  return <HistoricalEventsAdmin />;
}
