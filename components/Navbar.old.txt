'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/Button';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'الرئيسية', href: '/' },
  { name: 'الأدوات', href: '/tools' },
  { name: 'الأصدقاء', href: '/friends' },
  { name: 'المقالات', href: '/articles' },
  { name: 'عن الموقع', href: '/about' },
];

const exploreLinks = [
  { name: 'حاسبة العمر', href: '/age-calculator', icon: '🎂' },
  {
    name: 'العد التنازلي للميلاد',
    href: '/tools/birthday-countdown',
    icon: '⏰',
  },
  { name: 'تحويل التاريخ', href: '/tools/date-converter', icon: '📅' },
  { name: 'بطاقات التهنئة', href: '/cards', icon: '🎉' },
  { name: 'أحجار وزهور الميلاد', href: '/birthstones-flowers', icon: '💎' },
  { name: 'مشاهير', href: '/celebrities', icon: '⭐' },
];

const themes = [
  { value: 'system', label: 'النظام', icon: '🖥️' },
  { value: 'light', label: 'فاتح', icon: '☀️' },
  { value: 'dark', label: 'داكن', icon: '🌙' },
  { value: 'miladak', label: 'ميلادك', icon: '✨' },
] as const;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-white dark:bg-gray-900 backdrop-blur-md shadow-lg"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backgroundColor: 'rgb(255, 255, 255)',
        opacity: 1,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 space-x-reverse group"
          >
            <AnimatedLogo />
            <span className="font-bold text-xl gradient-text group-hover:scale-105 transition-transform">
              ميلادك
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Explore Dropdown */}
            <div className="relative group">
              <button className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1">
                استكشف
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {exploreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <span>{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="hidden md:flex items-center gap-2">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'p-2 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center',
                  theme === t.value
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'bg-muted/50 text-foreground hover:bg-muted hover:scale-105'
                )}
                title={t.label}
                aria-label={`تغيير المظهر إلى ${t.label}`}
              >
                <span className="text-lg leading-none">{t.icon}</span>
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-border/50">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">
                    {item.name === 'الرئيسية' && '🏠'}
                    {item.name === 'الأدوات' && '🛠️'}
                    {item.name === 'الأصدقاء' && '👥'}
                    {item.name === 'المقالات' && '📚'}
                    {item.name === 'عن الموقع' && 'ℹ️'}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Birthday & Date Tools Section */}
            <div className="pt-4 border-t border-border/50">
              <div className="px-4 pb-2">
                <p className="text-sm font-semibold text-primary flex items-center gap-2">
                  <span>🎂</span>
                  أدوات الميلاد والتواريخ
                </p>
              </div>
              <div className="space-y-1">
                {exploreLinks.slice(0, 4).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-6 py-3 text-foreground/80 hover:text-foreground hover:bg-primary/10 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Tools Section */}
            <div className="pt-4 border-t border-border/50">
              <div className="px-4 pb-2">
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <span>✨</span>
                  أدوات أخرى
                </p>
              </div>
              <div className="space-y-1">
                {exploreLinks.slice(4).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-6 py-2.5 text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="text-sm">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Theme Selector */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">المظهر:</span>
              <div className="flex items-center gap-2">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      'p-2 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center',
                      theme === t.value
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'bg-muted/50 text-foreground hover:bg-muted'
                    )}
                    title={t.label}
                    aria-label={`تغيير المظهر إلى ${t.label}`}
                  >
                    <span className="text-lg leading-none">{t.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
