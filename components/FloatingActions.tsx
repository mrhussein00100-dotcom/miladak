'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  X,
  Calculator,
  Calendar,
  Clock,
  Baby,
  Heart,
  Scale,
  Flame,
  ArrowUp,
  Sparkles,
  Users,
  Activity,
  Timer,
  Cake,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// الأدوات الافتراضية - يمكن تحميلها من قاعدة البيانات لاحقاً
const DEFAULT_QUICK_TOOLS = [
  {
    id: 'age-calculator',
    href: '#calculator',
    label: 'احسب عمرك',
    icon: 'Calculator',
    color: 'from-purple-500 to-indigo-600',
    emoji: '🎂',
    isScroll: true,
    order: 1,
  },
  {
    id: 'birthday-countdown',
    href: '/tools/birthday-countdown',
    label: 'العد التنازلي',
    icon: 'Calendar',
    color: 'from-pink-500 to-rose-600',
    emoji: '⏰',
    isScroll: false,
    order: 2,
  },
  {
    id: 'bmi-calculator',
    href: '/tools/bmi-calculator',
    label: 'حاسبة BMI',
    icon: 'Scale',
    color: 'from-emerald-500 to-teal-600',
    emoji: '⚖️',
    isScroll: false,
    order: 3,
  },
  {
    id: 'calorie-calculator',
    href: '/tools/calorie-calculator',
    label: 'السعرات الحرارية',
    icon: 'Flame',
    color: 'from-orange-500 to-red-600',
    emoji: '🔥',
    isScroll: false,
    order: 4,
  },
  {
    id: 'child-age',
    href: '/tools/child-age',
    label: 'عمر الطفل',
    icon: 'Baby',
    color: 'from-cyan-500 to-blue-600',
    emoji: '👶',
    isScroll: false,
    order: 5,
  },
];

// خريطة الأيقونات
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  Calendar,
  Clock,
  Baby,
  Heart,
  Scale,
  Flame,
  Zap,
  Users,
  Activity,
  Timer,
  Cake,
  Star,
};

interface QuickTool {
  id: string;
  href: string;
  label: string;
  icon: string;
  color: string;
  emoji: string;
  isScroll: boolean;
  order: number;
}

interface FloatingActionsProps {
  quickTools?: QuickTool[];
}

export default function FloatingActions({ quickTools }: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tools, setTools] = useState<QuickTool[]>(
    quickTools || DEFAULT_QUICK_TOOLS
  );
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if mobile
    setIsMobile(window.innerWidth < 768);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تحميل الأدوات من API - مرة واحدة فقط
  const fetchQuickTools = useCallback(async () => {
    try {
      const response = await fetch('/api/quick-tools');
      const data = await response.json();
      if (data.success && data.tools && data.tools.length > 0) {
        setTools(data.tools);
      }
    } catch (error) {
      // استخدام الأدوات الافتراضية في حالة الخطأ
    }
  }, []);

  useEffect(() => {
    if (!quickTools) {
      fetchQuickTools();
    }
  }, [quickTools, fetchQuickTools]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleToolClick = (tool: QuickTool) => {
    if (tool.isScroll) {
      const elementId = tool.href.replace('#', '');

      if (pathname === '/') {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push(`/${tool.href}`);
      }
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const sortedTools = [...tools].sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Floating Menu Container */}
      <div
        className="fixed bottom-[88px] md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-3"
        dir="rtl"
      >
        {/* Quick Tools Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col gap-2 mb-2"
            >
              {/* عنوان القائمة */}
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  أدوات سريعة
                </span>
              </div>

              {/* الأدوات */}
              {sortedTools.map((tool, index) => {
                const IconComponent = iconMap[tool.icon] || Calculator;

                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {tool.isScroll ? (
                      <button
                        onClick={() => handleToolClick(tool)}
                        className={`group flex items-center gap-3 bg-gradient-to-l ${tool.color} text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full`}
                      >
                        <span className="text-lg">{tool.emoji}</span>
                        <span className="text-sm font-bold flex-1 text-right">
                          {tool.label}
                        </span>
                        <div className="bg-white/20 p-1.5 rounded-lg">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </button>
                    ) : (
                      <Link
                        href={tool.href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center gap-3 bg-gradient-to-l ${tool.color} text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                      >
                        <span className="text-lg">{tool.emoji}</span>
                        <span className="text-sm font-bold flex-1 text-right">
                          {tool.label}
                        </span>
                        <div className="bg-white/20 p-1.5 rounded-lg">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}

              {/* زر العودة للأعلى */}
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sortedTools.length * 0.05 }}
                  onClick={scrollToTop}
                  className="group flex items-center gap-3 bg-gray-700 dark:bg-gray-600 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="text-lg">⬆️</span>
                  <span className="text-sm font-bold flex-1 text-right">
                    العودة للأعلى
                  </span>
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <ArrowUp className="w-4 h-4" />
                  </div>
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button - Simplified for performance */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl transition-all duration-300 group overflow-hidden ${
            isOpen
              ? 'bg-gray-800 dark:bg-gray-700'
              : 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500'
          }`}
          aria-label={isOpen ? 'إغلاق الأدوات السريعة' : 'فتح الأدوات السريعة'}
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {isOpen ? (
              <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
            ) : (
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            )}
          </motion.div>

          {/* Simple pulse ring - only on desktop */}
          {!isOpen && !isMobile && (
            <div
              className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-white/30 animate-ping"
              style={{ animationDuration: '2s' }}
            />
          )}

          {/* Hover Effect */}
          <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
        </motion.button>
      </div>
    </>
  );
}
