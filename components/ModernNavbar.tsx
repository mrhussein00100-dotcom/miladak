'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { cn } from '@/lib/utils';

// Navigation data
const mainNavigation = [
  { name: 'الرئيسية', href: '/', icon: '🏠' },
  { name: 'حاسبة العمر', href: '/age-calculator', icon: '🎂', featured: true },
  { name: 'الأدوات', href: '/tools', icon: '🛠️' },
  { name: 'البطاقات', href: '/cards', icon: '🎨', badge: 'جديد' },
  { name: 'المقالات', href: '/articles', icon: '📚' },
];

const quickTools = [
  {
    category: 'أدوات العمر والتاريخ',
    icon: '🎂',
    tools: [
      {
        name: 'حاسبة العمر',
        href: '/age-calculator',
        icon: '📅',
        popular: true,
      },
      { name: 'العمر بالثواني', href: '/tools/age-in-seconds', icon: '⏱️' },
      {
        name: 'عد تنازلي للميلاد',
        href: '/tools/birthday-countdown',
        icon: '🎉',
      },
      { name: 'تحويل التاريخ', href: '/date-converter', icon: '🔄' },
      { name: 'يوم الأسبوع', href: '/tools/day-of-week', icon: '📆' },
      { name: 'الأيام بين التواريخ', href: '/tools/days-between', icon: '📏' },
    ],
  },
  {
    category: 'أدوات الصحة واللياقة',
    icon: '🏥',
    tools: [
      {
        name: 'حاسبة BMI',
        href: '/tools/bmi-calculator',
        icon: '⚖️',
        popular: true,
      },
      { name: 'حاسبة السعرات', href: '/tools/calorie-calculator', icon: '🍎' },
      { name: 'نمو الطفل', href: '/tools/child-growth', icon: '📈' },
      { name: 'عمر الطفل', href: '/tools/child-age', icon: '👶' },
    ],
  },
  {
    category: 'أدوات مساعدة',
    icon: '🔧',
    tools: [
      {
        name: 'المناطق الزمنية',
        href: '/tools/timezone-calculator',
        icon: '🌍',
      },
      {
        name: 'مخطط الاحتفالات',
        href: '/tools/celebration-planner',
        icon: '🎊',
      },
      { name: 'عد تنازلي للأحداث', href: '/tools/event-countdown', icon: '⏰' },
      { name: 'إحصائيات الحياة', href: '/tools/life-statistics', icon: '📊' },
    ],
  },
];

const themes = [
  { value: 'system', label: 'النظام', icon: '🖥️' },
  { value: 'light', label: 'فاتح', icon: '☀️' },
  { value: 'dark', label: 'داكن', icon: '🌙' },
  { value: 'miladak', label: 'ميلادك', icon: '✨' },
] as const;

export function ModernNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  }, [pathname]);

  // Close tools dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolsRef.current &&
        !toolsRef.current.contains(event.target as Node)
      ) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'bg-background/80 backdrop-blur-xl border-b border-border/50',
          isScrolled && 'bg-background/95 shadow-lg border-border'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <AnimatedLogo className="h-10 w-10 transition-transform group-hover:scale-110" />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-sm" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl gradient-text">ميلادك</span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  أدوات ذكية لحياة أفضل
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    'flex items-center gap-2 group',
                    isActiveLink(item.href)
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50',
                    item.featured && 'ring-1 ring-primary/20'
                  )}
                >
                  <span className="text-base group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.featured && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
                  )}
                </Link>
              ))}

              {/* Quick Tools Dropdown */}
              <div ref={toolsRef} className="relative">
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  onMouseEnter={() => setIsToolsOpen(true)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    'flex items-center gap-2 group',
                    isToolsOpen
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <span className="text-base group-hover:scale-110 transition-transform">
                    🚀
                  </span>
                  <span>أدوات سريعة</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isToolsOpen && 'rotate-180'
                    )}
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

                {/* Tools Dropdown */}
                <div
                  onMouseLeave={() => setIsToolsOpen(false)}
                  className={cn(
                    'absolute top-full right-0 mt-2 w-[90vw] max-w-4xl',
                    'bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl',
                    'transition-all duration-300 origin-top-right',
                    'max-h-[80vh] overflow-y-auto',
                    isToolsOpen
                      ? 'opacity-100 scale-100 visible translate-y-0'
                      : 'opacity-0 scale-95 invisible -translate-y-2'
                  )}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {quickTools.map((category) => (
                        <div key={category.category} className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                            <span className="text-xl">{category.icon}</span>
                            <h3 className="font-semibold text-foreground">
                              {category.category}
                            </h3>
                          </div>
                          <div className="space-y-1">
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                onClick={() => setIsToolsOpen(false)}
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                                  'text-sm text-foreground/80 hover:text-foreground',
                                  'hover:bg-muted/50 transition-all duration-200 group',
                                  tool.popular &&
                                    'bg-primary/5 border border-primary/20'
                                )}
                              >
                                <span className="text-base group-hover:scale-110 transition-transform">
                                  {tool.icon}
                                </span>
                                <span className="flex-1">{tool.name}</span>
                                {tool.popular && (
                                  <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full">
                                    شائع
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 text-center">
                      <Link
                        href="/tools"
                        onClick={() => setIsToolsOpen(false)}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                      >
                        <span>عرض جميع الأدوات</span>
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
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar - Desktop */}
              <div className="hidden md:flex items-center">
                <div
                  className={cn(
                    'relative transition-all duration-300',
                    isSearchFocused ? 'w-64' : 'w-48'
                  )}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="ابحث في الأدوات..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-muted/30 rounded-xl">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      'w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200',
                      theme === t.value
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/50 hover:scale-105'
                    )}
                    title={t.label}
                  >
                    <span className="text-sm">{t.icon}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted/50 transition-colors"
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
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Bottom Navigation - Mobile */}
      <BottomNavigation pathname={pathname} />

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

// Mobile Menu Component
function MobileMenu({
  isOpen,
  onClose,
  pathname,
  theme,
  setTheme,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  theme: string;
  setTheme: (theme: any) => void;
}) {
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background/95 backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <AnimatedLogo className="h-8 w-8" />
            <span className="font-bold text-lg gradient-text">ميلادك</span>
          </Link>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted/50 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في الأدوات..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200',
                  'text-base font-medium min-h-[52px]',
                  isActiveLink(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Quick Tools */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground px-2">
              الأدوات السريعة
            </h3>
            {quickTools.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-sm">
                    {category.category}
                  </span>
                </div>
                <div className="space-y-1 pr-4">
                  {category.tools.slice(0, 4).map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                      {tool.popular && (
                        <span className="mr-auto text-[10px] text-primary">
                          ⭐
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Theme Selector */}
        <div className="p-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">المظهر</p>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all min-h-[60px]',
                  theme === t.value
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-muted/50 text-foreground/70 hover:text-foreground hover:bg-muted'
                )}
              >
                <span className="text-lg">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Bottom Navigation Component
function BottomNavigation({ pathname }: { pathname: string }) {
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const bottomNavItems = [
    { name: 'الرئيسية', href: '/', icon: '🏠' },
    { name: 'حاسبة العمر', href: '/age-calculator', icon: '🎂' },
    { name: 'الأدوات', href: '/tools', icon: '🛠️' },
    { name: 'البطاقات', href: '/cards', icon: '🎨' },
    { name: 'المقالات', href: '/articles', icon: '📚' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-full h-full min-h-[44px]',
              'text-xs font-medium transition-all duration-200 rounded-lg mx-1',
              isActiveLink(item.href)
                ? 'text-primary bg-primary/10'
                : 'text-foreground/60 hover:text-foreground hover:bg-muted/50'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px]">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
