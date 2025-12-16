'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // التحقق من الجلسة
    if (pathname !== '/admin/login') {
      fetch('/api/auth/session', { cache: 'no-store' })
        .then((r) => r.json())
        .then((data) => {
          if (!data?.authenticated) {
            window.location.href = '/admin/login';
          } else {
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          window.location.href = '/admin/login';
        });
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname]);

  // صفحة تسجيل الدخول بدون sidebar
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        {children}
      </div>
    );
  }

  // انتظار التحقق من الجلسة
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <AdminHeader />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
