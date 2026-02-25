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
  Laptop,
  Sparkles,
  Calculator,
  Calendar,
  Heart,
  BookOpen,
  Users,
  Palette,
  Home,
  Info,
  Mail,
  ArrowRight
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
      { name: 'احسب عمرك', href: '/calculate-birthday', description: 'حساب العمر بالتفصيل الممل' },
      { name: 'العد التنازلي', href: '/tools/birthday-countdown', description: 'كم باقي على عيد ميلادك' },
    ],
  },
  {
    title: 'أدوات التاريخ',
    icon: Calendar,
    items: [
      { name: 'تحويل التاريخ', href: '/tools/date-converter', description: 'من هجري لميلادي والعكس' },
      { name: 'يوم الأسبوع', href: '/tools/day-of-week', description: 'في أي يوم ولدت؟' },
      { name: 'فرق الأيام', href: '/tools/days-between', description: 'احسب الفرق بين تاريخين' },
    ],
  },
  {
    title: 'استكشف',
    icon: Sparkles,
    items: [
      { name: 'أحداث تاريخية', href: '/historical-events', description: 'ماذا حدث في مثل هذا اليوم' },
      { name: 'مشاهير', href: '/celebrities', description: 'مشاهير يشاركونك يوم الميلاد' },
      { name: 'أحجار وزهور', href: '/birthstones-flowers', description: 'رموز شهر ميلادك' },
      { name: 'الأرقام والألوان', href: '/colors-numbers', description: 'أرقامك وألوانك المحظوظة' },
    ],
  },
];

const articleCategories = [
  { name: 'جميع المقالات', href: '/articles', icon: BookOpen, color: 'text-blue-500' },
  { name: 'الصحة والعافية', href: '/articles?category=health', icon: Heart, color: 'text-rose-500' },
  { name: 'تطوير الذات', href: '/articles?category=self-development', icon: Sparkles, color: 'text-amber-500' },
  { name: 'العلاقات', href: '/articles?category=relationships', icon: Users, color: 'text-purple-500' },
];

const themes = [
  { value: 'light', icon: Sun, label: 'فاتح' },
  { value: 'dark', icon: Moon, label: 'داكن' },
  { value: 'miladak', icon: Sparkles, label: 'ميلادك' },
  { value: 'system', icon: Laptop, label: 'النظام' },
] as const;

// --- Components ---

export function ModernNavbar() {
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
      // setIsHidden(true); // Disable hiding for now to ensure visibility
      setActiveDropdown(null); 
    } else {
      // setIsHidden(false);
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

  return (
    <>
      <div className="h-[72px]" /> {/* Spacer */}
      
      <motion.nav
        ref={navRef}
        initial={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm'
            : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
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
                <span className="font-bold text-xl leading-none bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  ميلادك <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1 align-middle border border-primary/20">جديد</span>
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
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
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
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                  )}
                >
                  <Calculator className="w-4 h-4" />
                  الأدوات
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeDropdown === 'tools' ? "rotate-180" : "")} />
                </button>

                {/* Mega Menu - Tools */}
                <AnimatePresence>
                  {activeDropdown === 'tools' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-4 w-[650px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 ring-1 ring-black/5"
                    >
                      <div className="p-6 grid grid-cols-2 gap-8">
                        {toolsCategories.map((category) => (
                          <div key={category.title} className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">
                              <category.icon className="w-3.5 h-3.5" />
                              {category.title}
                            </div>
                            <div className="grid gap-3">
                              {category.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="group flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                  <div className="mt-1 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">جرب حاسبة العمر الجديدة</p>
                              <p className="text-xs text-gray-500">أدق حاسبة عمر عربية مع تفاصيل مذهلة</p>
                            </div>
                         </div>
                         <Link href="/calculate-birthday" className="px-4 py-2 bg-white dark:bg-gray-900 text-primary text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-colors shadow-sm">
                           احسب الآن
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
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
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
                      className="absolute top-full right-0 mt-4 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 ring-1 ring-black/5 p-2"
                    >
                      {articleCategories.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform shadow-sm", item.color)}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-400">تصفح المقالات</span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center relative">
                 <Search className="w-4 h-4 absolute right-3 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="بحث..." 
                   className="w-48 h-10 pr-9 pl-4 bg-gray-100 dark:bg-gray-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                 />
              </div>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden lg:block" />

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay - Full Screen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl lg:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-100 dark:border-gray-800">
               <span className="font-bold text-xl text-primary">القائمة</span>
               <button 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
               {/* Search */}
               <div className="relative">
                 <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                 <input 
                   type="text" 
                   placeholder="عن ماذا تبحث؟" 
                   className="w-full h-12 pr-12 pl-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-base outline-none focus:ring-2 focus:ring-primary/20"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                 />
               </div>

               {/* Navigation Links */}
               <div className="space-y-2">
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">التنقل</div>
                 {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl transition-all",
                        pathname === item.href ? "bg-primary/10 text-primary font-bold" : "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                 ))}
               </div>

               {/* Tools Section */}
               <div className="space-y-4">
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">الأدوات</div>
                 <div className="grid grid-cols-2 gap-3">
                   {toolsCategories.flatMap(c => c.items).slice(0, 4).map((item) => (
                     <Link
                       key={item.href}
                       href={item.href}
                       className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all"
                     >
                       <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.name}</span>
                       <span className="text-[10px] text-gray-500 line-clamp-1">{item.description}</span>
                     </Link>
                   ))}
                 </div>
                 <Link href="/tools" className="flex items-center justify-center w-full py-3 text-sm font-medium text-primary border border-primary/20 rounded-xl hover:bg-primary/5">
                   عرض كل الأدوات
                 </Link>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
