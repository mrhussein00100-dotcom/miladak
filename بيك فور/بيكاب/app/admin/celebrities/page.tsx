import { Metadata } from 'next';
import CelebritiesAdmin from '@/components/admin/CelebritiesAdmin';

export const metadata: Metadata = {
  title: 'إدارة المشاهير | لوحة التحكم',
  description: 'إدارة قائمة المشاهير وتواريخ ميلادهم',
};

export default function CelebritiesAdminPage() {
  return <CelebritiesAdmin />;
}
