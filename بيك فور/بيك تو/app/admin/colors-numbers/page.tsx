import { Metadata } from 'next';
import ColorsNumbersAdmin from '@/components/admin/ColorsNumbersAdmin';

export const metadata: Metadata = {
  title: 'إدارة الألوان والأرقام | لوحة التحكم',
  description: 'إدارة الألوان المحظوظة والأرقام المحظوظة في موقع ميلادك',
};

export default function ColorsNumbersAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <ColorsNumbersAdmin />
      </div>
    </div>
  );
}
