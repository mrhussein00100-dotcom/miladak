
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Heart, Calendar, Star, Globe, Clock, Baby } from 'lucide-react';

const tools = [
  {
    name: 'توافق الأبراج',
    description: 'اكتشف نسبة التوافق مع شريكك',
    icon: Heart,
    href: '/tools/zodiac-compatibility',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    text: 'text-pink-600 dark:text-pink-400'
  },
  {
    name: 'حاسبة الحب',
    description: 'احسب نسبة الحب والتوافق',
    icon: Heart,
    href: '/tools/love-calculator',
    color: 'from-red-500 to-rose-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400'
  },
  {
    name: 'حاسبة فرق العمر',
    description: 'احسب الفرق بين عمرين',
    icon: Clock,
    href: '/tools/age-difference',
    color: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'مؤشر كتلة الجسم',
    description: 'احسب وزنك المثالي وصحتك',
    icon: Scale,
    href: '/tools/bmi-calculator',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'تحويل التاريخ',
    description: 'حول بين الهجري والميلادي',
    icon: Calendar,
    href: '/tools/date-converter',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'مشاهير يومك',
    description: 'من ولد في نفس يوم ميلادك؟',
    icon: Star,
    href: '/celebrities',
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    name: 'أحداث تاريخية',
    description: 'ماذا حدث في مثل هذا اليوم؟',
    icon: History,
    href: '/historical-events',
    color: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'حاسبة الحمل',
    description: 'تتبع مراحل الحمل وموعد الولادة',
    icon: Baby,
    href: '/pregnancy-calculator',
    color: 'from-teal-500 to-cyan-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    text: 'text-teal-600 dark:text-teal-400'
  }
];

import { History } from 'lucide-react';

export default function QuickToolsGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            أدواتنا المميزة
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            مجموعة متكاملة من الأدوات الحسابية والمعلوماتية المصممة خصيصاً لك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link key={index} href={tool.href}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex items-start gap-4 group"
              >
                <div className={`p-3 rounded-xl ${tool.bg} ${tool.text} group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tool.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
