import { Metadata } from 'next';
import BirthstonesFlowersAdmin from '@/components/admin/BirthstonesFlowersAdmin';

export const metadata: Metadata = {
  title: 'إدارة أحجار وزهور الميلاد | لوحة التحكم',
  description: 'إدارة أحجار وزهور الميلاد لكل شهر في موقع ميلادك',
};

export default function BirthstonesFlowersAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <BirthstonesFlowersAdmin />
      </div>
    </div>
  );
}
