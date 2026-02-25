'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Calculator,
  Wrench,
  FileText,
  MoreHorizontal,
  X,
  User,
  Info,
  Mail,
  Shield,
  Star,
  Calendar,
} from 'lucide-react';

const mainNavItems = [
  { name: 'الرئيسية', href: '/', icon: Home },
  { name: 'الحاسبة', href: '/#calculator', icon: Calculator },
  { name: 'الأدوات', href: '/tools', icon: Wrench },
  { name: 'المقالات', href: '/articles', icon: FileText },
  { name: 'المزيد', href: '#more', icon: MoreHorizontal },
];

const moreMenuItems = [
  { name: 'الأصدقاء', href: '/friends', icon: User },
  { name: 'بطاقات التهنئة', href: '/cards', icon: Star },
  { name: 'أحداث تاريخية', href: '/historical-events', icon: Calendar },
  { name: 'عن الموقع', href: '/about', icon: Info },
  { name: 'اتصل بنا', href: '/contact', icon: Mail },
  { name: 'الخصوصية', href: '/privacy', icon: Shield },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // إخفاء/إظهار عند التمرير
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 50) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // التمرير للأسفل - إخفاء
      setIsVisible(false);
      setIsMoreOpen(false);
    } else if (currentScrollY < lastScrollY) {
      // التمرير للأعلى - إظهار
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/#calculator') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleMoreClick = () => {
    setIsMoreOpen(!isMoreOpen);
  };

  return (
    <>
      {/* Overlay للقائمة المنبثقة */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* قائمة المزيد المنبثقة */}
      <div
        className={cn(
          'fixed bottom-20 left-4 right-4 bg-background border border-border rounded-2xl shadow-2xl z-50 md:hidden',
          'transform transition-all duration-300 ease-out',
          isMoreOpen
            ? 'translate-y-0 opacity-100 visible'
            : 'translate-y-4 opacity-0 invisible'
        )}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">المزيد</h3>
            <button
              onClick={() => setIsMoreOpen(false)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {moreMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                  'hover:bg-muted active:scale-95',
                  pathname === item.href && 'bg-primary/10 text-primary'
                )}
                onClick={() => setIsMoreOpen(false)}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* شريط التنقل السفلي */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 md:hidden',
          'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700',
          'shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]',
          'transform transition-transform duration-300 ease-out',
          'safe-area-bottom',
          isVisible ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {mainNavItems.map((item) => {
            const isItemActive =
              item.href === '#more' ? isMoreOpen : isActive(item.href);
            const Icon = item.icon;

            if (item.href === '#more') {
              return (
                <button
                  key={item.name}
                  onClick={handleMoreClick}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl',
                    'transition-all duration-200 min-w-[60px]',
                    'active:scale-95',
                    isItemActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'p-1.5 rounded-lg transition-all',
                      isItemActive && 'bg-primary/10'
                    )}
                  >
                    <Icon
                      className={cn('w-5 h-5', isItemActive && 'scale-110')}
                    />
                  </div>
                  <span className="text-[10px] font-medium">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl',
                  'transition-all duration-200 min-w-[60px]',
                  'active:scale-95',
                  isItemActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-lg transition-all',
                    isItemActive && 'bg-primary/10'
                  )}
                >
                  <Icon
                    className={cn('w-5 h-5', isItemActive && 'scale-110')}
                  />
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer لمنع المحتوى من الاختفاء خلف الشريط */}
      <div className="h-16 md:hidden" />
    </>
  );
}

export default BottomNav;
