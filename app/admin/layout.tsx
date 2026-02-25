import { Metadata } from 'next';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export const metadata: Metadata = {
  title: 'لوحة التحكم | ميلادك',
  description: 'لوحة تحكم موقع ميلادك',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark admin-layout" data-theme="dark">
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </div>
  );
}
