'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { cn } from '@/lib/utils';

// البيانات
const mainNav = [
  { name: 'الرئيسية', href: '/', icon: '🏠' },
  { name: 'الأصدقاء', href: '/friends', icon: '👥' },
  { name: 'البطاقات', href: '/cards', icon: '🎨' },
];

const topTools = [
  { name: 'احسب ميلادك', href: '/calculate-birthday', icon: '🎂' },
  {
    name: 'العد التنازلي للميلاد',
    href: '/tools/birthday-countdown',
    icon: '⏰',
  },
  { name: 'تحويل التاريخ', href: '/tools/date-converter', icon: '🔄' },
  { name: 'يوم الأسبوع', href: '/tools/day-of-week', icon: '📅' },
  { name: 'الأيام بين التواريخ', href: '/tools/days-between', icon: '📏' },
];

const topArticleCategories = [
  { name: 'الصحة والعافية', href: '/articles?category=health', icon: '🏥' },
  {
    name: 'التطوير الذاتي',
    href: '/articles?category=self-development',
    icon: '🌱',
  },
  {
    name: 'العلاقات الاجتماعية',
    href: '/articles?category=relationships',
    icon: '💝',
  },
  { name: 'الثقافة والمعرفة', href: '/articles?category=culture', icon: '📖' },
  { name: 'نصائح وإرشادات', href: '/articles?category=tips', icon: '💡' },
];

const exploreItems = [
  { name: 'أحداث تاريخية', href: '/historical-events', icon: '📜' },
  { name: 'مشاهير', href: '/celebrities', icon: '⭐' },
  { name: 'أحجار وزهور الميلاد', href: '/birthstones-flowers', icon: '💎' },
  { name: 'الأرقام والألوان', href: '/colors-numbers', icon: '🎯' },
];

const themes = [
  { value: 'light', icon: '☀️', label: 'فاتح' },
  { value: 'dark', icon: '🌙', label: 'داكن' },
  { value: 'miladak', icon: '✨', label: 'ميلادك' },
  { value: 'system', icon: '🖥️', label: 'النظام' },
] as const;

// مكون القسم القابل للطي في الموبايل
function MobileAccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <svg
          className={cn(
            'w-4 h-4 transition-transform duration-300',
            isOpen && 'rotate-180'
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
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-3 space-y-1">{children}</div>
      </div>
    </div>
  );
}

export function FinalNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
  };

  const handleMouseEnter = (dropdown: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const toolsRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        if (openDropdown === 'tools') setOpenDropdown(null);
      }
      if (
        articlesRef.current &&
        !articlesRef.current.contains(e.target as Node)
      ) {
        if (openDropdown === 'articles') setOpenDropdown(null);
      }
      if (
        exploreRef.current &&
        !exploreRef.current.contains(e.target as Node)
      ) {
        if (openDropdown === 'explore') setOpenDropdown(null);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        if (openDropdown === 'theme') setOpenDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

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
            ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border'
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Main Links */}
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Tools Dropdown */}
              <div
                ref={toolsRef}
                className="relative"
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => handleMouseEnter('tools')}
              >
                <Link
                  href="/tools"
                  onMouseEnter={() => setOpenDropdown('tools')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                    openDropdown === 'tools' || pathname.startsWith('/tools')
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span>🛠️</span>
                  <span>الأدوات</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      openDropdown === 'tools' && 'rotate-180'
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
                </Link>

                {openDropdown === 'tools' && (
                  <div className="navbar-dropdown absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-xl p-2">
                    {topTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                      >
                        <span>{tool.icon}</span>
                        <span>{tool.name}</span>
                      </Link>
                    ))}
                    <div className="border-t border-border mt-2 pt-2">
                      <Link
                        href="/tools"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg font-medium"
                      >
                        <span>المزيد</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Articles Dropdown */}
              <div
                ref={articlesRef}
                className="relative"
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => handleMouseEnter('articles')}
              >
                <Link
                  href="/articles"
                  onMouseEnter={() => setOpenDropdown('articles')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                    openDropdown === 'articles' ||
                      pathname.startsWith('/articles')
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span>📚</span>
                  <span>المقالات</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      openDropdown === 'articles' && 'rotate-180'
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
                </Link>

                {openDropdown === 'articles' && (
                  <div className="navbar-dropdown absolute top-full right-0 mt-2 w-[500px] bg-background border border-border rounded-xl shadow-xl p-4">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Right Column - المقالات الأكثر مشاهدة */}
                      <div className="space-y-2">
                        <Link
                          href="/articles"
                          onClick={() => setOpenDropdown(null)}
                          className="px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <span>📚</span>
                          <span>المقالات</span>
                        </Link>
                        <div className="space-y-1">
                          <Link
                            href="/articles/health-benefits-birthday"
                            onClick={() => setOpenDropdown(null)}
                            className="block px-3 py-2 rounded-lg text-xs hover:bg-muted transition-colors"
                          >
                            🔥 فوائد الاحتفال بعيد الميلاد
                          </Link>
                          <Link
                            href="/articles/zodiac-personality"
                            onClick={() => setOpenDropdown(null)}
                            className="block px-3 py-2 rounded-lg text-xs hover:bg-muted transition-colors"
                          >
                            ⭐ شخصيتك من برجك
                          </Link>
                          <Link
                            href="/articles/birthday-traditions-world"
                            onClick={() => setOpenDropdown(null)}
                            className="block px-3 py-2 rounded-lg text-xs hover:bg-muted transition-colors"
                          >
                            🎂 تقاليد أعياد الميلاد
                          </Link>
                          <Link
                            href="/articles/healthy-aging-tips"
                            onClick={() => setOpenDropdown(null)}
                            className="block px-3 py-2 rounded-lg text-xs hover:bg-muted transition-colors"
                          >
                            💪 نصائح للشيخوخة الصحية
                          </Link>
                          <Link
                            href="/articles/life-milestones"
                            onClick={() => setOpenDropdown(null)}
                            className="block px-3 py-2 rounded-lg text-xs hover:bg-muted transition-colors"
                          >
                            🎯 معالم الحياة المهمة
                          </Link>
                        </div>
                        <div className="border-t border-border mt-2 pt-2">
                          <Link
                            href="/articles"
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs text-primary hover:bg-primary/10 rounded-lg font-medium"
                          >
                            <span>المزيد من المقالات</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>

                      {/* Left Column - التصنيفات */}
                      <div className="space-y-2 border-r border-border pr-4">
                        <Link
                          href="/categories"
                          onClick={() => setOpenDropdown(null)}
                          className="px-3 py-2 text-sm font-bold text-secondary hover:bg-secondary/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <span>🏷️</span>
                          <span>التصنيفات</span>
                        </Link>
                        <div className="space-y-1">
                          {topArticleCategories.map((cat) => (
                            <Link
                              key={cat.href}
                              href={cat.href}
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-muted transition-colors"
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-border mt-2 pt-2">
                          <Link
                            href="/categories"
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs text-secondary hover:bg-secondary/10 rounded-lg font-medium"
                          >
                            <span>جميع التصنيفات</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Explore Dropdown */}
              <div
                ref={exploreRef}
                className="relative"
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => handleMouseEnter('explore')}
              >
                <button
                  onMouseEnter={() => setOpenDropdown('explore')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                    openDropdown === 'explore'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span>🔍</span>
                  <span>استكشف</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      openDropdown === 'explore' && 'rotate-180'
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

                {openDropdown === 'explore' && (
                  <div className="navbar-dropdown absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-xl p-2">
                    {exploreItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-foreground hover:text-primary"
                  aria-label="فتح البحث"
                  aria-expanded={isSearchOpen}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {isSearchOpen && (
                  <div className="navbar-search-popup absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-xl shadow-xl p-3">
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch(e);
                          }
                        }}
                        placeholder="ابحث في الموقع..."
                        className="w-full px-4 py-2 pr-10 rounded-lg bg-white dark:bg-gray-800 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition-colors"
                        aria-label="بحث"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Theme Switcher Dropdown */}
              <div
                ref={themeRef}
                className="hidden sm:block relative"
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => handleMouseEnter('theme')}
              >
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === 'theme' ? null : 'theme')
                  }
                  onMouseEnter={() => setOpenDropdown('theme')}
                  className="px-3 py-2 rounded-lg hover:bg-muted flex items-center gap-1 transition-colors text-foreground hover:text-primary"
                  aria-label="تغيير المظهر"
                  aria-expanded={openDropdown === 'theme'}
                  aria-haspopup="true"
                >
                  <span className="text-base">
                    {themes.find((t) => t.value === theme)?.icon || '✨'}
                  </span>
                  <svg
                    className={cn(
                      'w-3 h-3 transition-transform',
                      openDropdown === 'theme' && 'rotate-180'
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

                {openDropdown === 'theme' && (
                  <div className="navbar-dropdown absolute top-full left-0 mt-2 w-40 bg-background border border-border rounded-xl shadow-xl p-2 overflow-hidden">
                    {themes.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => {
                          setTheme(t.value);
                          setOpenDropdown(null);
                        }}
                        className={cn(
                          'theme-dropdown-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                          theme === t.value
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted'
                        )}
                      >
                        <span className="text-base">{t.icon}</span>
                        <span>{t.label}</span>
                        {theme === t.value && (
                          <span className="mr-auto text-primary">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center text-foreground hover:text-primary transition-colors"
                aria-label="فتح القائمة"
                aria-expanded={isMobileOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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

      {/* Mobile Menu - تصميم محسّن مع أقسام قابلة للطي */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Menu Panel */}
          <div className="mobile-menu-slide fixed top-0 right-0 bottom-0 z-[70] w-[85%] max-w-[320px] bg-background shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-l from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <AnimatedLogo className="h-8 w-8" />
                <span className="font-bold text-lg gradient-text">ميلادك</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-foreground hover:text-primary transition-all hover:rotate-90"
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

            {/* Search */}
            <div className="p-4 border-b border-border/50">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الموقع..."
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition-colors"
                >
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Quick Links - الروابط الرئيسية */}
              <div className="p-4 space-y-2">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isActive(item.href)
                        ? 'bg-gradient-to-l from-primary/20 to-primary/5 text-primary border border-primary/20'
                        : 'hover:bg-muted/50 border border-transparent'
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                    {isActive(item.href) && (
                      <span className="mr-auto text-primary">●</span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Accordion Sections */}
              <div className="border-t border-border/50">
                {/* الأدوات */}
                <MobileAccordionSection
                  title="الأدوات"
                  icon="🛠️"
                  defaultOpen={pathname.startsWith('/tools')}
                >
                  {topTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                        isActive(tool.href)
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/tools"
                    className="flex items-center justify-center gap-2 px-3 py-2.5 mt-2 text-sm text-primary bg-primary/5 hover:bg-primary/10 rounded-lg font-medium transition-colors"
                  >
                    <span>عرض جميع الأدوات</span>
                    <span>←</span>
                  </Link>
                </MobileAccordionSection>

                {/* المقالات */}
                <MobileAccordionSection
                  title="المقالات"
                  icon="📚"
                  defaultOpen={pathname.startsWith('/articles')}
                >
                  {topArticleCategories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted/50 transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Link
                      href="/articles"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 text-xs text-primary bg-primary/5 hover:bg-primary/10 rounded-lg font-medium transition-colors"
                    >
                      <span>المقالات</span>
                      <span>←</span>
                    </Link>
                    <Link
                      href="/categories"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 text-xs text-secondary bg-secondary/5 hover:bg-secondary/10 rounded-lg font-medium transition-colors"
                    >
                      <span>التصنيفات</span>
                      <span>←</span>
                    </Link>
                  </div>
                </MobileAccordionSection>

                {/* استكشف */}
                <MobileAccordionSection title="استكشف" icon="🔍">
                  {exploreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </MobileAccordionSection>
              </div>

              {/* Theme Selector */}
              <div className="p-4 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <span>🎨</span>
                  <span>المظهر</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs transition-all',
                        theme === t.value
                          ? 'bg-gradient-to-b from-primary/20 to-primary/5 text-primary border border-primary/30 shadow-sm'
                          : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
                      )}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-[10px] font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 bg-muted/20">
              <p className="text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} ميلادك - جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border shadow-lg">
        <div className="flex items-center justify-around h-16 safe-area-bottom">
          {[
            { name: 'الرئيسية', href: '/', icon: '🏠' },
            { name: 'الأصدقاء', href: '/friends', icon: '👥' },
            { name: 'الأدوات', href: '/tools', icon: '🛠️' },
            { name: 'البطاقات', href: '/cards', icon: '🎨' },
            { name: 'المقالات', href: '/articles', icon: '📚' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full transition-all',
                isActive(item.href)
                  ? 'text-primary scale-105'
                  : 'text-foreground/50 hover:text-foreground/70'
              )}
            >
              <span
                className={cn(
                  'text-xl transition-transform',
                  isActive(item.href) && 'animate-bounce-subtle'
                )}
              >
                {item.icon}
              </span>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive(item.href) && 'font-bold'
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
