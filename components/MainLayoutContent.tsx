'use client';

import { usePathname } from 'next/navigation';
import { FinalNavbar } from '@/components/FinalNavbar';
import { Footer } from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingActions from '@/components/FloatingActions';
import WelcomeScreen from '@/components/WelcomeScreen';
import { LoadingBar } from '@/components/ui/LoadingBar';

export default function MainLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // التحقق مما إذا كنا في صفحات لوحة التحكم
  const isAdminPage = pathname?.startsWith('/admin');

  // إذا كنا في لوحة التحكم، لا نعرض عناصر الواجهة الأمامية
  if (isAdminPage) {
    return <>{children}</>;
  }

  // الواجهة الأمامية العادية
  return (
    <>
      <LoadingBar />
      <WelcomeScreen />
      <FinalNavbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <ScrollToTop />
      <FloatingActions />
    </>
  );
}
