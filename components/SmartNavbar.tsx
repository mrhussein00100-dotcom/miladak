'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { cn } from '@/lib/utils';
import {
  navigationItems,
  toolCategories,
  bottomNavItems,
  type NavItem,
  type SearchResult,
} from '@/types/navbar';

// Theme options
const themes = [
  { value: 'system', label: 'النظام', icon: '🖥️' },
  { value: 'light', label: 'فاتح', icon: '☀️' },
  { value: 'dark', label: 'داكن', icon: '🌙' },
  { value: 'miladak', label: 'ميلادك', icon: '✨' },
] as const;

export function SmartNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isScrolled, isCompact } = useScrollPosition();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(false);
  }, [pathname]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsToolsDropdownOpen(false);
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
          'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          isCompact ? 'h-14' : 'h-16',
          isScrolled && 'shadow-sm'
        )}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <AnimatedLogo className={isCompact ? 'h-8 w-8' : 'h-10 w-10'} />
              <span
                className={cn(
                  'font-bold gradient-text transition-all duration-300',
                  isCompact ? 'text-lg' : 'text-xl'
                )}
              >
                ميلادك
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'flex items-center gap-2',
                    isActiveLink(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Tools Dropdown */}
              <div ref={toolsDropdownRef} className="relative">
                <button
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  onMouseEnter={() => setIsToolsDropdownOpen(true)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'flex items-center gap-2',
                    isToolsDropdownOpen
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span>🚀</span>
                  <span>أدوات سريعة</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isToolsDropdownOpen && 'rotate-180'
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

                {/* Dropdown Content */}
                <div
                  onMouseLeave={() => setIsToolsDropdownOpen(false)}
                  className={cn(
                    'absolute top-full right-0 mt-2 w-[90vw] max-w-[600px] min-w-[400px] p-4',
                    'bg-background border border-border rounded-xl shadow-xl',
                    'transition-all duration-200 origin-top-right',
                    'max-h-[80vh] overflow-y-auto',
                    isToolsDropdownOpen
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                  )}
                  style={{
                    left: 'auto',
                    right: '0',
                    transform: 'translateX(0)',
                  }}
                >
                  <div className="dropdown-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                    {toolCategories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center gap-2 px-2 py-1">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-semibold text-foreground">
                            {category.name}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {category.tools.slice(0, 4).map((tool) => (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              onClick={() => setIsToolsDropdownOpen(false)}
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg',
                                'text-sm text-foreground/70 hover:text-foreground',
                                'hover:bg-muted transition-colors',
                                tool.isPopular &&
                                  'bg-primary/5 border border-primary/20'
                              )}
                            >
                              <span>{tool.icon}</span>
                              <span>{tool.name}</span>
                              {tool.isPopular && (
                                <span className="mr-auto text-[10px] text-primary font-medium">
                                  شائع
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link
                      href="/tools"
                      onClick={() => setIsToolsDropdownOpen(false)}
                      className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:underline"
                    >
                      عرض جميع الأدوات
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

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden md:block">
                <div
                  className={cn(
                    'flex items-center transition-all duration-300',
                    isSearchExpanded ? 'w-64' : 'w-10'
                  )}
                >
                  {isSearchExpanded && (
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث..."
                      className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  )}
                  <button
                    onClick={() => {
                      setIsSearchExpanded(!isSearchExpanded);
                      if (isSearchExpanded) {
                        setSearchQuery('');
                        setSearchResults([]);
                      }
                    }}
                    className={cn(
                      'absolute left-0 w-10 h-10 flex items-center justify-center rounded-lg',
                      'text-foreground/70 hover:text-foreground hover:bg-muted transition-colors',
                      isSearchExpanded && 'bg-muted'
                    )}
                  >
                    {isSearchExpanded ? (
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
                    ) : (
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Search Results */}
                {isSearchExpanded && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        جاري البحث...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <Link
                            key={index}
                            href={result.href}
                            onClick={() => {
                              setIsSearchExpanded(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                          >
                            <span className="text-lg">
                              {result.icon || '📄'}
                            </span>
                            <div>
                              <div className="text-sm font-medium">
                                {result.title}
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {result.type === 'tool'
                                  ? 'أداة'
                                  : result.type === 'article'
                                  ? 'مقال'
                                  : 'صفحة'}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        لا توجد نتائج
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Theme Selector - Desktop */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200',
                      theme === t.value
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
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
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
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

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Bottom Navigation - Mobile */}
      <BottomNavigation pathname={pathname} />

      {/* Spacer for fixed navbar */}
      <div className={cn(isCompact ? 'h-14' : 'h-16')} />
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

  // Handle swipe to close
  const touchStartRef = useRef<number>(0);
  const touchMoveRef = useRef<number>(0);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchMoveRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = touchMoveRef.current - touchStartRef.current;
    if (diff > 100) {
      onClose();
    }
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
      <div
        className={cn(
          'absolute top-0 right-0 bottom-0 w-[85%] max-w-sm',
          'bg-background shadow-xl',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <AnimatedLogo className="h-8 w-8" />
            <span className="font-bold text-lg gradient-text">ميلادك</span>
          </Link>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
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

        {/* Navigation */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Main Navigation */}
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                'text-base font-medium transition-colors min-h-[48px]',
                isActiveLink(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
              {item.badge && (
                <span className="mr-auto px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {/* Tools Categories */}
          <div className="pt-4 mt-4 border-t border-border">
            <p className="px-4 py-2 text-sm font-semibold text-muted-foreground">
              الأدوات السريعة
            </p>
            {toolCategories.map((category) => (
              <div key={category.id} className="mb-4">
                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-foreground">
                    {category.name}
                  </span>
                </div>
                <div className="space-y-1 pr-4">
                  {category.tools.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-lg min-h-[44px]',
                        'text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors',
                        tool.isPopular && 'bg-primary/5'
                      )}
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                      {tool.isPopular && (
                        <span className="mr-auto text-[10px] text-primary font-medium">
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

        {/* Theme Selector */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <p className="text-sm text-muted-foreground mb-2">المظهر</p>
          <div className="flex items-center gap-2">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px]',
                  theme === t.value
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-muted text-foreground/70 hover:text-foreground'
                )}
              >
                <span className="text-lg">{t.icon}</span>
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-full h-full min-h-[44px]',
              'text-xs font-medium transition-colors',
              isActiveLink(item.href)
                ? 'text-primary'
                : 'text-foreground/60 hover:text-foreground'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
