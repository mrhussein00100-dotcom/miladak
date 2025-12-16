import { Metadata } from 'next';
import BirthstonesFlowersPageClient from '@/components/pages/BirthstonesFlowersPage';

export const metadata: Metadata = {
  title: 'أحجار وزهور الميلاد | ميلادك',
  description:
    'اكتشف حجر ميلادك وزهرة ميلادك ولونك المحظوظ حسب شهر ميلادك. تعرف على معاني وخصائص كل حجر وزهرة.',
  keywords: [
    'حجر الميلاد',
    'زهرة الميلاد',
    'أحجار كريمة',
    'لون محظوظ',
    'حجر يناير',
    'حجر فبراير',
    'زهور الشهور',
    'ميلادك',
  ],
};

export default function BirthstonesFlowersPage() {
  return <BirthstonesFlowersPageClient />;
}
