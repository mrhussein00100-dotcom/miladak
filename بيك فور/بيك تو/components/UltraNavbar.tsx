'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { cn } from '@/lib/utils';

// ===== بيانات التنقل =====
const features = [
  {
    id: 'age',
    name: 'حاسبة العمر',
    href: '/age-calculator',
    icon: '🎂',
    color: 'from-pink-500 to-rose-500',
    description: 'احسب عمرك بدقة',
    hot: true,
  },
  {
    id: 'tools',
    name: 'الأدوات',
    href: '/tools',
    icon: '🛠️',
    color: 'from-blue-500 to-cyan-500',
    description: '+20 أداة مفيدة',
  },
  {
    id: 'cards',
    name: 'البطاقات',
    href: '/cards',
    icon: '🎨',
    color: 'from-purple-500 to-violet-500',
    description: 'بطاقات تهنئة',
    isNew: true,
  },
  {
    id: 'articles',
    name: 'المقالات',
    href: '/articles',
    icon: '📚',
    color: 'from-amber-500 to-orange-500',
    description: 'مقالات مفيدة',
  },
  {
    id: 'colors',
    name: 'الألوان والأرقام',
    href: '/colors-numbers',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-500',
    description: 'اكتشف حظك',
  },
];

const megaMenuData = {
  birthday: {
    title: '🎂 أدوات الميلاد',
    items: [
      {
        name: 'حاسبة العمر الدقيقة',
        href: '/age-calculator',
        icon: '📅',
        desc: 'احسب عمرك بالتفصيل',
      },
      {
        name: 'العمر بالثواني',
        href: '/tools/age-in-seconds',
        icon: '⏱️',
        desc: 'كم ثانية عشت؟',
      },
      {
        name: 'عد تنازلي للميلاد',
        href: '/tools/birthday-countdown',
        icon: '🎉',
        desc: 'كم باقي لعيد ميلادك؟',
      },
      {
        name: 'إحصائيات حياتك',
        href: '/tools/life-statistics',
        icon: '📊',
        desc: 'أرقام مذهلة عن حياتك',
      },
    ],
  },
  date: {
    title: '📆 أدوات التاريخ',
    items: [
      {
        name: 'تحويل التاريخ',
        href: '/date-converter',
        icon: '🔄',
        desc: 'هجري ↔ ميلادي',
      },
      {
        name: 'يوم الأسبوع',
        href: '/tools/day-of-week',
        icon: '📅',
        desc: 'في أي يوم ولدت؟',
      },
      {
        name: 'الأيام بين التواريخ',
        href: '/tools/days-between',
        icon: '📏',
        desc: 'احسب الفرق',
      },
      {
        name: 'عد تنازلي للأحداث',
        href: '/tools/event-countdown',
        icon: '⏰',
        desc: 'تتبع أحداثك',
      },
    ],
  },
  health: {
    title: '🏥 أدوات الصحة',
    items: [
      {
        name: 'حاسبة BMI',
        href: '/tools/bmi-calculator',
        icon: '⚖️',
        desc: 'مؤشر كتلة الجسم',
      },
      {
        name: 'حاسبة السعرات',
        href: '/tools/calorie-calculator',
        icon: '🍎',
        desc: 'احتياجاتك اليومية',
      },
      {
        name: 'نمو الطفل',
        href: '/tools/child-growth',
        icon: '📈',
        desc: 'تتبع نمو طفلك',
      },
      {
        name: 'عمر الطفل',
        href: '/tools/child-age',
        icon: '👶',
        desc: 'حساب عمر الطفل',
      },
    ],
  },
  more: {
    title: '✨ المزيد',
    items: [
      {
        name: 'المناطق الزمنية',
        href: '/tools/timezone-calculator',
        icon: '🌍',
        desc: 'فرق التوقيت',
      },
      {
        name: 'مخطط الاحتفالات',
        href: '/tools/celebration-planner',
        icon: '🎊',
        desc: 'خطط لحفلتك',
      },
      {
        name: 'أحجار الميلاد',
        href: '/birthstones-flowers',
        icon: '💎',
        desc: 'حجرك وزهرتك',
      },
      {
        name: 'مشاهير يومك',
        href: '/celebrities',
        icon: '⭐',
        desc: 'من ولد معك؟',
      },
    ],
  },
};

const themes = [
  { value: 'light', icon: '☀️', label: 'فاتح' },
  { value: 'dark', icon: '🌙', label: 'داكن' },
  { value: 'miladak', icon: '✨', label: 'ميلادك' },
  { value: 'system', icon: '🖥️', label: 'تلقائي' },
] as const;

export function UltraNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target as Node)
      ) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* ===== NAVBAR الرئيسي ===== */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'py-2 bg-background/90 backdrop-blur-2xl shadow-xl border-b border-border/50'
            : 'py-4 bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* ===== LOGO ===== */}
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500" />
                <AnimatedLogo
                  className={cn(
                    'relative transition-all duration-300',
                    isScrolled ? 'h-9 w-9' : 'h-11 w-11'
                  )}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    'font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent transition-all duration-300',
                    isScrolled ? 'text-xl' : 'text-2xl'
                  )}
                >
                  ميلادك
                </span>
                <span
                  className={cn(
                    'text-[10px] text-muted-foreground font-medium tracking-wide transition-all duration-300 hidden sm:block',
                    isScrolled ? 'opacity-0 h-0' : 'opacity-100'
                  )}
                >
                  أدوات ذكية لحياة أفضل ✨
                </span>
              </div>
            </Link>

            {/* ===== DESKTOP NAV ===== */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Home */}
              <Link
                href="/"
                className={cn(
                  'px-4 py-2 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2',
                  isActive('/') && pathname === '/'
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary'
                    : 'hover:bg-muted/50 text-foreground/70 hover:text-foreground'
                )}
              >
                <span>🏠</span>
                <span>الرئيسية</span>
              </Link>

              {/* Features Pills */}
              {features.slice(0, 4).map((feature) => (
                <Link
                  key={feature.id}
                  href={feature.href}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                  onMouseLeave={() => setActiveFeature(null)}
                  className={cn(
                    'relative px-4 py-2 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 group',
                    isActive(feature.href)
                      ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                      : 'hover:bg-muted/50 text-foreground/70 hover:text-foreground'
                  )}
                >
                  <span className="text-base group-hover:scale-125 transition-transform duration-300">
                    {feature.icon}
                  </span>
                  <span>{feature.name}</span>

                  {/* Badges */}
                  {feature.hot && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                      🔥
                    </span>
                  )}
                  {feature.isNew && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-full">
                      جديد
                    </span>
                  )}

                  {/* Hover tooltip */}
                  <div
                    className={cn(
                      'absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs rounded-lg whitespace-nowrap transition-all duration-200 pointer-events-none',
                      activeFeature === feature.id
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-2'
                    )}
                  >
                    {feature.description}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                  </div>
                </Link>
              ))}

              {/* Mega Menu Trigger */}
              <div ref={megaMenuRef} className="relative">
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className={cn(
                    'px-4 py-2 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2',
                    isMegaMenuOpen
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'hover:bg-muted/50 text-foreground/70 hover:text-foreground'
                  )}
                >
                  <span className="text-base">🚀</span>
                  <span>المزيد</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform duration-300',
                      isMegaMenuOpen && 'rotate-180'
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

                {/* ===== MEGA MENU ===== */}
                <div
                  className={cn(
                    'absolute top-full right-0 mt-4 w-[800px] bg-background/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-300 origin-top-right',
                    isMegaMenuOpen
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                  )}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4 border-b border-border/50">
                    <h3 className="text-lg font-bold gradient-text">
                      🎯 اكتشف جميع الأدوات
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      أكثر من 20 أداة مفيدة لحياتك اليومية
                    </p>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-4 gap-0 divide-x divide-border/50 rtl:divide-x-reverse">
                    {Object.entries(megaMenuData).map(([key, category]) => (
                      <div
                        key={key}
                        className="p-4 hover:bg-muted/30 transition-colors"
                      >
                        <h4 className="font-bold text-sm mb-3 text-foreground">
                          {category.title}
                        </h4>
                        <div className="space-y-1">
                          {category.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="flex items-start gap-2 p-2 rounded-xl hover:bg-primary/10 transition-all group"
                            >
                              <span className="text-lg group-hover:scale-110 transition-transform">
                                {item.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                  {item.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate">
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="bg-muted/30 p-4 flex items-center justify-between">
                    <Link
                      href="/tools"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <span>عرض جميع الأدوات</span>
                      <span>→</span>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-bold text-primary">+20</span> أداة
                      متاحة
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* ===== RIGHT ACTIONS ===== */}
            <div className="flex items-center gap-2">
              {/* Theme Switcher - Pill Style */}
              <div className="hidden md:flex items-center bg-muted/50 rounded-full p-1 gap-0.5">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                      theme === t.value
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-110'
                        : 'hover:bg-muted text-foreground/60 hover:text-foreground'
                    )}
                    title={t.label}
                  >
                    <span className="text-sm">{t.icon}</span>
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href="/age-calculator"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>احسب عمرك</span>
                <span>🎂</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden w-11 h-11 rounded-2xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
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
      </header>

      {/* ===== MOBILE MENU ===== */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        pathname={pathname}
        theme={theme}
        setTheme={setTheme}
      />

      {/* ===== BOTTOM NAV (Mobile) ===== */}
      <MobileBottomNav pathname={pathname} />

      {/* Spacer */}
      <div
        className={cn(
          'transition-all duration-500',
          isScrolled ? 'h-16' : 'h-20'
        )}
      />
    </>
  );
}

// ===== MOBILE DRAWER =====
function MobileDrawer({
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
  setTheme: (t: any) => void;
}) {
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[70] w-[85%] max-w-sm bg-background shadow-2xl transition-transform duration-300 ease-out lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <AnimatedLogo className="h-9 w-9" />
            <span className="font-black text-xl gradient-text">ميلادك</span>
          </Link>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5"
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
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick CTA */}
          <Link
            href="/age-calculator"
            onClick={onClose}
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg shadow-lg"
          >
            <span>🎂</span>
            <span>احسب عمرك الآن</span>
          </Link>

          {/* Main Features */}
          <div className="space-y-2">
            <Link
              href="/"
              onClick={onClose}
              className={cn(
                'flex items-center gap-4 p-4 rounded-2xl transition-all',
                isActive('/') && pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/50'
              )}
            >
              <span className="text-2xl">🏠</span>
              <span className="font-medium text-lg">الرئيسية</span>
            </Link>

            {features.map((feature) => (
              <Link
                key={feature.id}
                href={feature.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl transition-all relative',
                  isActive(feature.href)
                    ? `bg-gradient-to-r ${feature.color} text-white`
                    : 'hover:bg-muted/50'
                )}
              >
                <span className="text-2xl">{feature.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-lg">{feature.name}</div>
                  <div
                    className={cn(
                      'text-xs',
                      isActive(feature.href)
                        ? 'text-white/80'
                        : 'text-muted-foreground'
                    )}
                  >
                    {feature.description}
                  </div>
                </div>
                {feature.isNew && (
                  <span className="px-2 py-1 text-[10px] font-bold bg-white/20 rounded-full">
                    جديد
                  </span>
                )}
                {feature.hot && <span className="text-lg">🔥</span>}
              </Link>
            ))}
          </div>

          {/* Quick Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground px-2">
              ⚡ أدوات سريعة
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'تحويل التاريخ', href: '/date-converter', icon: '🔄' },
                {
                  name: 'حاسبة BMI',
                  href: '/tools/bmi-calculator',
                  icon: '⚖️',
                },
                {
                  name: 'العد التنازلي',
                  href: '/tools/birthday-countdown',
                  icon: '⏰',
                },
                {
                  name: 'المناطق الزمنية',
                  href: '/tools/timezone-calculator',
                  icon: '🌍',
                },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={onClose}
                  className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <span>{tool.icon}</span>
                  <span className="text-sm font-medium truncate">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Theme */}
        <div className="p-5 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-3">🎨 المظهر</p>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
                  theme === t.value
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-muted/50 hover:bg-muted'
                )}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ===== MOBILE BOTTOM NAV =====
function MobileBottomNav({ pathname }: { pathname: string }) {
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const items = [
    { name: 'الرئيسية', href: '/', icon: '🏠' },
    { name: 'العمر', href: '/age-calculator', icon: '🎂' },
    { name: 'الأدوات', href: '/tools', icon: '🛠️' },
    { name: 'البطاقات', href: '/cards', icon: '🎨' },
    { name: 'المقالات', href: '/articles', icon: '📚' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-2xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 w-full h-full rounded-xl transition-all',
              isActive(item.href) &&
                (item.href === '/' ? pathname === '/' : true)
                ? 'text-primary bg-primary/10'
                : 'text-foreground/50 hover:text-foreground'
            )}
          >
            <span
              className={cn(
                'text-xl transition-transform',
                isActive(item.href) &&
                  (item.href === '/' ? pathname === '/' : true) &&
                  'scale-110'
              )}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
