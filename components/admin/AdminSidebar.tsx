'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Palette,
  Calendar,
  Database,
  LogOut,
  Menu,
  X,
  BookOpen,
  Users,
  Wrench,
  Sparkles,
  RefreshCw,
  Star,
  Hash,
  Smartphone,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  {
    title: 'لوحة التحكم',
    items: [{ href: '/admin', label: 'الرئيسية', icon: LayoutDashboard }],
  },
  {
    title: 'إدارة المحتوى',
    items: [
      { href: '/admin/articles', label: 'المقالات', icon: BookOpen },
      { href: '/admin/categories', label: 'التصنيفات', icon: FileText },
      { href: '/admin/rewriter', label: 'إعادة الكتابة', icon: RefreshCw },
      { href: '/admin/auto-publish', label: 'النشر التلقائي', icon: Sparkles },
    ],
  },
  {
    title: 'البيانات',
    items: [
      {
        href: '/admin/historical-events',
        label: 'الأحداث التاريخية',
        icon: Calendar,
      },
      { href: '/admin/celebrities', label: 'المشاهير', icon: Star },
      {
        href: '/admin/birthstones-flowers',
        label: 'الأحجار والزهور',
        icon: Palette,
      },
      { href: '/admin/colors-numbers', label: 'الألوان والأرقام', icon: Hash },
      {
        href: '/admin/page-keywords',
        label: 'الكلمات المفتاحية',
        icon: Database,
      },
    ],
  },
  {
    title: 'الإعدادات',
    items: [
      { href: '/admin/users', label: 'المستخدمون', icon: Users },
      { href: '/admin/quick-tools', label: 'أدوات سريعة', icon: Wrench },
      {
        href: '/admin/mobile-settings',
        label: 'إعدادات الموبايل',
        icon: Smartphone,
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (mounted && j?.authenticated) {
          setRole(j.role);
          setUsername(j.username);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const filterByRole = (href: string) => {
    if (!role) return true;
    if (role === 'admin') return true;
    if (role === 'content_manager') {
      if (href === '/admin/users') return false;
      return true;
    }
    if (role === 'editor') {
      const allowed = new Set([
        '/admin',
        '/admin/articles',
        '/admin/articles/new',
        '/admin/categories',
        '/admin/rewriter',
      ]);
      return allowed.has(href);
    }
    if (role === 'writer') {
      const allowed = new Set([
        '/admin',
        '/admin/articles',
        '/admin/articles/new',
      ]);
      return allowed.has(href);
    }
    return false;
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-xs text-gray-400">ميلادك</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems
          .map((section) => ({
            title: section.title,
            items: section.items.filter((it) => filterByRole(it.href)),
          }))
          .filter((section) => section.items.length > 0)
          .map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname?.startsWith(item.href + '/');
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold">
              {username?.charAt(0).toUpperCase() || 'م'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {username || 'المستخدم'}
            </p>
            {role && <p className="text-xs text-gray-400">{role}</p>}
          </div>
        </div>
        <button
          onClick={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
            } catch {}
            window.location.href = '/admin/login';
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-900 text-white"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-gray-900 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-gray-900 z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
