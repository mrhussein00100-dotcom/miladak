'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Moon,
  Sun,
  Calculator,
  Calendar,
  Sparkles,
  BookOpen,
  Heart,
  Users,
  Palette,
  Home,
  ArrowRight,
  Layers,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

// --- Navigation Data ---
const mainNav = [
  { name: 'الرئيسية', href: '/', icon: Home },
  { name: 'الأصدقاء', href: '/friends', icon: Users },
  { name: 'البطاقات', href: '/cards', icon: Palette },
];

const toolsCategories = [
  {
    title: 'أدوات العمر',
    icon: Calculator,
    items: [
      { name: 'احسب عمرك', href: '/calculate-birthday', description: 'حساب دقيق' },
      { name: 'العد التنازلي', href: '/tools/birthday-countdown', description: 'باقي لعيد ميلادك' },
    ],
  },
  {
    title: 'أدوات التاريخ',
    icon: Calendar,
    items: [
      { name: 'تحويل التاريخ', href: '/tools/date-converter', description: 'هجري وميلادي' },
      { name: 'يوم الأسبوع', href: '/tools/day-of-week', description: 'يوم ولادتك' },
      { name: 'فرق الأيام', href: '/tools/days-between', description: 'بين تاريخين' },
    ],
  },
  {
    title: 'استكشف',
    icon: Sparkles,
    items: [
      { name: 'أحداث', href: '/historical-events', description: 'حدث في مثل هذا اليوم' },
      { name: 'مشاهير', href: '/celebrities', description: 'مشاهير نفس اليوم' },
      { name: 'أحجار وزهور', href: '/birthstones-flowers', description: 'رموز شهرك' },
      { name: 'أرقام وألوان', href: '/colors-numbers', description: 'حظك اليوم' },
    ],
  },
];

const articleCategories = [
  { name: 'الصحة والعافية', href: '/articles?category=health', icon: Heart, color: 'text-destructive', bg: 'bg-destructive/10' },
  { name: 'تطوير الذات', href: '/articles?category=self-development', icon: Sparkles, color: 'text-accent', bg: 'bg-accent/10' },
  { name: 'العلاقات', href: '/articles?category=relationships', icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
  { name: 'علم النفس', href: '/articles?category=psychology', icon: Layers, color: 'text-primary', bg: 'bg-primary/10' },
];

export function NavbarV2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);

  // Smart Scroll Behavior
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (latest > previous && latest > 150) {
      setActiveDropdown(null); 
    }
    setIsScrolled(latest > 20);
    lastScrollY.current = latest;
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/articles?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Cycle through themes: system -> light -> dark -> miladak
  const cycleTheme = () => {
    const themes: any[] = ['system', 'light', 'dark', 'miladak'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark': return <Moon className="w-5 h-5" />;
      case 'light': return <Sun className="w-5 h-5" />;
      case 'miladak': return <Sparkles className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <>
      <div className="h-[72px]" /> {/* Spacer */}
      
      <motion.nav
        ref={navRef}
        initial={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-background border-b border-border/30'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatedLogo className="w-10 h-10 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ميلادك
                </span>
                <span className="text-[0.65rem] text-muted-foreground font-medium tracking-wide">
                  أدوات حساب العمر الدقيقة
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:bg-accent/10 hover:text-primary'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}

              {/* Tools Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('tools')}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group',
                    (pathname?.startsWith('/tools') || activeDropdown === 'tools')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent/10 hover:text-primary'
                  )}
                >
                  <Calculator className="w-4 h-4" />
                  الأدوات
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeDropdown === 'tools' ? "rotate-180" : "")} />
                </button>

                {/* Mega Menu - Tools - Compact Redesign */}
                <AnimatePresence>
                  {activeDropdown === 'tools' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-4 w-[90vw] max-w-[600px] bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden z-50 ring-1 ring-black/5"
                    >
                      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {toolsCategories.map((category) => (
                          <div key={category.title} className="space-y-3">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider border-b border-border pb-1">
                              <category.icon className="w-3 h-3" />
                              {category.title}
                            </div>
                            <div className="grid gap-2">
                              {category.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="group flex items-center gap-2 p-1.5 -mx-1.5 rounded-lg hover:bg-muted transition-colors"
                                >
                                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
                                  <div>
                                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {item.name}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground line-clamp-1">
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-muted/30 p-3 flex items-center justify-between border-t border-border">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">حاسبة العمر الدقيقة</p>
                            </div>
                         </div>
                         <Link href="/calculate-birthday" className="px-3 py-1.5 bg-background text-primary text-xs font-bold rounded-lg border border-input hover:border-primary hover:text-primary transition-colors shadow-sm">
                           جربها الآن
                         </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Articles Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('articles')}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group',
                    (pathname?.startsWith('/articles') || activeDropdown === 'articles')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent/10 hover:text-primary'
                  )}
                >
                  <BookOpen className="w-4 h-4" />
                  المقالات
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeDropdown === 'articles' ? "rotate-180" : "")} />
                </button>

                 <AnimatePresence>
                  {activeDropdown === 'articles' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-4 w-80 max-w-[90vw] bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden z-50 ring-1 ring-black/5"
                    >
                      <div className="p-2">
                        <div className="mb-2 px-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground uppercase">التصنيفات</span>
                          <Link href="/articles/categories" className="text-[10px] text-primary hover:underline">عرض الكل</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {articleCategories.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-muted transition-colors group border border-border hover:border-primary/20"
                            >
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110", item.bg, item.color)}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-foreground group-hover:text-primary text-center">
                                {item.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link href="/articles" className="mt-2 flex items-center justify-center w-full py-2 text-xs font-bold text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          تصفح جميع المقالات
                          <ArrowRight className="w-3 h-3 mr-1" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center relative">
                 <Search className="w-4 h-4 absolute right-3 text-muted-foreground" />
                 <input 
                   type="text" 
                   placeholder="بحث..." 
                   className="w-48 h-10 pr-9 pl-4 bg-muted/50 text-foreground placeholder:text-muted-foreground rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                 />
              </div>

              <div className="h-6 w-px bg-border mx-2 hidden lg:block" />

              <button
                onClick={cycleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title={`Current Theme: ${theme}`}
              >
                {getThemeIcon()}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation - New & Modern */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/50 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          <Link href="/" className={cn("flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors", pathname === '/' ? "text-primary" : "text-muted-foreground")}>
            <Home className={cn("w-6 h-6", pathname === '/' && "fill-current")} />
            <span className="text-[10px] font-medium">الرئيسية</span>
          </Link>
          
          <Link href="/tools" className={cn("flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors", pathname?.startsWith('/tools') ? "text-primary" : "text-muted-foreground")}>
            <Calculator className={cn("w-6 h-6", pathname?.startsWith('/tools') && "fill-current")} />
            <span className="text-[10px] font-medium">الأدوات</span>
          </Link>

          {/* Center Floating Action Button */}
          <Link href="/calculate-birthday" className="flex flex-col items-center justify-center -mt-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 border-4 border-background">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium text-primary mt-1">احسب</span>
          </Link>

          <Link href="/articles" className={cn("flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors", pathname?.startsWith('/articles') ? "text-primary" : "text-muted-foreground")}>
            <BookOpen className={cn("w-6 h-6", pathname?.startsWith('/articles') && "fill-current")} />
            <span className="text-[10px] font-medium">المقالات</span>
          </Link>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className={cn("flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors", isMobileMenuOpen ? "text-primary" : "text-muted-foreground")}
          >
            <Menu className="w-6 h-6" />
            <span className="text-[10px] font-medium">القائمة</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Full Screen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">القائمة الكاملة</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
              <div className="space-y-6">
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="ابحث عن أداة أو مقال..." 
                    className="w-full h-12 pr-10 pl-4 bg-muted/50 rounded-xl border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </div>

                {/* Main Links */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase px-1">الأقسام الرئيسية</p>
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <ArrowRight className="w-4 h-4 mr-auto text-muted-foreground group-hover:text-primary -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>

                {/* Tools Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase">الأدوات المميزة</p>
                    <Link href="/tools" className="text-xs text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>عرض الكل</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {toolsCategories.flatMap(c => c.items).slice(0, 6).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors text-center flex flex-col items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-xs font-semibold text-foreground line-clamp-1">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Articles Section - Added as requested */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase">تصنيفات المقالات</p>
                    <Link href="/articles" className="text-xs text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>عرض الكل</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     {articleCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
                        >
                           <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px]", cat.bg, cat.color)}>
                              <cat.icon className="w-3 h-3" />
                           </div>
                           <span className="text-xs font-medium text-foreground">{cat.name}</span>
                        </Link>
                     ))}
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">مظهر التطبيق</span>
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-background/50 border border-border">
                      {theme === 'system' ? 'تلقائي' : theme === 'dark' ? 'ليلي' : theme === 'miladak' ? 'ميلادك' : 'نهاري'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'light', icon: Sun, label: 'نهاري' },
                      { id: 'dark', icon: Moon, label: 'ليلي' },
                      { id: 'miladak', icon: Sparkles, label: 'ميلادك' },
                      { id: 'system', icon: Monitor, label: 'تلقائي' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setTheme(mode.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all",
                          theme === mode.id 
                            ? "bg-background border-primary text-primary shadow-sm" 
                            : "bg-transparent border-transparent text-muted-foreground hover:bg-background/50"
                        )}
                      >
                        <mode.icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
