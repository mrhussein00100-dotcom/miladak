'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'الرئيسية', href: '/', icon: '🏠' },
  { name: 'حاسبة العمر', href: '/age-calculator', icon: '🎂' },
  { name: 'الأدوات', href: '/tools', icon: '🛠️' },
  { name: 'البطاقات', href: '/cards', icon: '🎨' },
  { name: 'الألوان والأرقام', href: '/colors-numbers', icon: '🎯' },
  { name: 'المقالات', href: '/articles', icon: '📚' },
];

const themes = [
  { value: 'light', icon: '☀️', label: 'فاتح' },
  { value: 'dark', icon: '🌙', label: 'داكن' },
  { value: 'miladak', icon: '✨', label: 'ميلادك' },
] as const;

export function SimpleModernNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-lg shadow-md border-b border-border'
            : 'bg-background/80 backdrop-blur-md'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <AnimatedLogo className="h-9 w-9" />
              <span className="font-bold text-xl gradient-text">ميلادك</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all',
                    'flex items-center gap-2',
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    title={t.label}
                    className={cn(
                      'w-8 h-8 rounded-md flex items-center justify-center transition-all',
                      theme === t.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'hover:bg-background hover:scale-105'
                    )}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-[70] w-64 bg-background shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg gradient-text">ميلادك</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  المظهر
                </p>
                <div className="flex gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        'flex-1 py-2 rounded-lg transition-all flex flex-col items-center gap-1',
                        theme === t.value ? 'bg-primary text-white' : 'bg-muted'
                      )}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-xs">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t">
        <div className="flex items-center justify-around h-16">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full',
                isActive(item.href) ? 'text-primary' : 'text-foreground/60'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px]">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="h-16" />
    </>
  );
}
