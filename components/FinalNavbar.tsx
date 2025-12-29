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
    }, 300); // تأخير 300ms
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
                        {/* رابط المزيد للمقالات */}
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
                        {/* رابط المزيد للتصنيفات */}
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
                        className="w-full px-4 py-2 pr-10 rounded-lg bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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

              {/* Mobile Menu */}
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

      {/* Mobile Menu */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="mobile-menu-slide fixed top-0 right-0 bottom-0 z-[70] w-72 bg-background shadow-xl overflow-y-auto text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold text-lg gradient-text">ميلادك</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-foreground hover:text-primary transition-colors"
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
            <div className="p-4 space-y-4">
              {/* Search */}
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث..."
                  className="w-full px-4 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </form>

              {/* Main Nav */}
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              {/* Tools */}
              <div className="space-y-2">
                <div className="px-2 text-xs font-semibold text-muted-foreground">
                  🛠️ الأدوات
                </div>
                {topTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-muted"
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.name}</span>
                  </Link>
                ))}
                <Link
                  href="/tools"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg font-medium"
                >
                  <span>المزيد</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Articles */}
              <div className="space-y-2">
                <div className="px-2 text-xs font-semibold text-muted-foreground">
                  📚 المقالات والتصنيفات
                </div>
                {topArticleCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-muted"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
                <div className="flex gap-2 mt-2">
                  <Link
                    href="/articles"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-primary hover:bg-primary/10 rounded-lg font-medium"
                  >
                    <span>المقالات</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/categories"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-secondary hover:bg-secondary/10 rounded-lg font-medium"
                  >
                    <span>التصنيفات</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Explore */}
              <div className="space-y-2">
                <div className="px-2 text-xs font-semibold text-muted-foreground">
                  🔍 استكشف
                </div>
                {exploreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-muted"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Theme */}
              <div className="pt-4 border-t">
                <div className="px-2 text-xs font-semibold text-muted-foreground mb-2">
                  المظهر
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all',
                        theme === t.value ? 'bg-primary text-white' : 'bg-muted'
                      )}
                    >
                      <span>{t.icon}</span>
                      <span className="text-[10px]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t">
        <div className="flex items-center justify-around h-16">
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
