'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export default function AdminHeader() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.authenticated) {
          setUsername(data.username || 'المستخدم');
          setRole(data.role || 'user');
        }
      })
      .catch(() => {});
  }, []);

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/admin': 'لوحة التحكم',
      '/admin/articles': 'إدارة المقالات',
      '/admin/categories': 'إدارة التصنيفات',
      '/admin/users': 'إدارة المستخدمين',
      '/admin/rewriter': 'إعادة الصياغة',
      '/admin/auto-publish': 'النشر التلقائي',
      '/admin/historical-events': 'الأحداث التاريخية',
      '/admin/celebrities': 'المشاهير',
      '/admin/birthstones-flowers': 'أحجار وزهور الميلاد',
      '/admin/colors-numbers': 'الألوان والأرقام',
      '/admin/page-keywords': 'الكلمات المفتاحية',
      '/admin/quick-tools': 'الأدوات السريعة',
      '/admin/mobile-settings': 'إعدادات الموبايل',
    };
    return titles[pathname || ''] || 'لوحة التحكم';
  };

  const getRoleLabel = (r: string) => {
    const labels: Record<string, string> = {
      admin: 'مدير',
      content_manager: 'مدير محتوى',
      editor: 'محرر',
      writer: 'كاتب',
      support: 'دعم فني',
    };
    return labels[r] || r;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/admin/login';
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* عنوان الصفحة */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white hidden md:block">
            {getPageTitle()}
          </h1>
        </div>

        {/* الأدوات */}
        <div className="flex items-center gap-2">
          {/* البحث */}
          <button
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            style={{ color: '#ffffff' }}
          >
            <Search className="w-5 h-5" style={{ color: '#ffffff' }} />
          </button>

          {/* الإشعارات */}
          <button
            className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors"
            style={{ color: '#ffffff' }}
          >
            <Bell className="w-5 h-5" style={{ color: '#ffffff' }} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* قائمة المستخدم */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg transition-colors"
              style={{ color: '#ffffff' }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {username?.charAt(0).toUpperCase() || 'م'}
                </span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium" style={{ color: '#ffffff' }}>
                  {username}
                </p>
                <p className="text-xs" style={{ color: '#f3f4f6' }}>
                  {getRoleLabel(role)}
                </p>
              </div>
              <ChevronDown
                className="w-4 h-4 hidden md:block"
                style={{ color: '#ffffff' }}
              />
            </button>

            {/* القائمة المنسدلة */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-xl border border-gray-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p
                      className="text-sm font-medium"
                      style={{ color: '#ffffff' }}
                    >
                      {username}
                    </p>
                    <p className="text-xs" style={{ color: '#f3f4f6' }}>
                      {getRoleLabel(role)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // يمكن إضافة صفحة الملف الشخصي لاحقاً
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-colors"
                    style={{ color: '#ffffff' }}
                  >
                    <User className="w-4 h-4" style={{ color: '#ffffff' }} />
                    <span style={{ color: '#ffffff' }}>الملف الشخصي</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-colors"
                    style={{ color: '#ffffff' }}
                  >
                    <Settings
                      className="w-4 h-4"
                      style={{ color: '#ffffff' }}
                    />
                    <span style={{ color: '#ffffff' }}>الإعدادات</span>
                  </button>
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 transition-colors"
                      style={{ color: '#ef4444' }}
                    >
                      <LogOut
                        className="w-4 h-4"
                        style={{ color: '#ef4444' }}
                      />
                      <span style={{ color: '#ef4444' }}>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
