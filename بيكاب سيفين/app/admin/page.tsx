'use client';

import Link from 'next/link';
import {
  Tag,
  Wrench,
  Settings,
  BarChart3,
  FileText,
  Home,
  Smartphone,
  Calendar,
  Star,
  Gem,
  Palette,
  FolderTree,
  Sparkles,
  Clock,
} from 'lucide-react';

const adminLinks = [
  // إدارة المحتوى
  {
    href: '/admin/articles',
    icon: FileText,
    title: '📝 إدارة المقالات',
    description: 'إضافة وتعديل المقالات مع دعم الذكاء الاصطناعي',
    color: 'from-violet-500 to-purple-500',
  },
  {
    href: '/admin/categories',
    icon: FolderTree,
    title: '📁 إدارة التصنيفات',
    description: 'تنظيم التصنيفات بشكل هرمي مع الألوان والأيقونات',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    href: '/admin/auto-publish',
    icon: Clock,
    title: '⏰ النشر التلقائي',
    description: 'إعدادات النشر التلقائي اليومي للمقالات',
    color: 'from-green-500 to-teal-500',
  },
  // إدارة البيانات
  {
    href: '/admin/historical-events',
    icon: Calendar,
    title: '📜 إدارة الأحداث التاريخية',
    description: 'إضافة وتعديل الأحداث التاريخية اليومية والسنوية',
    color: 'from-amber-500 to-orange-500',
  },
  {
    href: '/admin/celebrities',
    icon: Star,
    title: '⭐ إدارة المشاهير',
    description: 'إضافة وتعديل قائمة المشاهير وتواريخ ميلادهم',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    href: '/admin/birthstones-flowers',
    icon: Gem,
    title: '💎 إدارة أحجار وزهور الميلاد',
    description: 'تحديث أحجار وزهور الميلاد لكل شهر',
    color: 'from-emerald-500 to-green-500',
  },
  {
    href: '/admin/colors-numbers',
    icon: Palette,
    title: '🎨 إدارة الألوان والأرقام',
    description: 'تحديث الألوان المحظوظة والأرقام لكل شهر',
    color: 'from-purple-500 to-pink-500',
  },

  // الإدارة العامة
  {
    href: '/admin/page-keywords',
    icon: Tag,
    title: 'إدارة الكلمات المفتاحية',
    description: 'إدارة الكلمات المفتاحية لجميع صفحات الموقع',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    href: '/admin/quick-tools',
    icon: Wrench,
    title: 'الأدوات السريعة',
    description: 'إدارة الأدوات السريعة في الموقع',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/admin/mobile-settings',
    icon: Smartphone,
    title: 'إعدادات الموبايل',
    description: 'التحكم في شريط التنقل السفلي والأزرار العائمة',
    color: 'from-teal-500 to-emerald-500',
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                لوحة التحكم
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                إدارة موقع ميلادك
              </p>
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            إدارة المحتوى
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {adminLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <link.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Data Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            إدارة البيانات
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {adminLinks.slice(3, 7).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <link.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* General Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            الإدارة العامة
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {adminLinks.slice(7).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <link.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
