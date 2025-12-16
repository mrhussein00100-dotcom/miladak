'use client';

import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { InContentAd, FooterAd } from '@/components/AdSense/AdSenseSlot';

// Lazy load components for better performance
const KeywordsSection = lazy(() => import('./KeywordsSection'));
const ToolRandomArticles = lazy(() => import('./ToolRandomArticles'));
const ToolStructuredData = lazy(() => import('./ToolStructuredData'));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
  </div>
);

interface ToolPageLayoutProps {
  children: React.ReactNode;
  toolName: string;
  toolSlug: string;
  toolDescription: string;
  toolIcon?: string;
  keywords?: string[];
  seoContent?: React.ReactNode;
  showKeywords?: boolean;
  showArticles?: boolean;
  showAds?: boolean;
  gradient?: string;
}

export default function ToolPageLayout({
  children,
  toolName,
  toolSlug,
  toolDescription,
  toolIcon = '🔧',
  keywords = [],
  seoContent,
  showKeywords = false,
  showArticles = true,
  showAds = true,
  gradient = 'from-purple-500 to-pink-500',
}: ToolPageLayoutProps) {
  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'الأدوات', href: '/tools' },
    { label: toolName, href: `/tools/${toolSlug}` },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متدرجة محسّنة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10"></div>
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-800/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-800/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-200/10 dark:bg-pink-800/5 rounded-full blur-3xl -z-10"></div>

      {/* Structured Data for SEO */}
      <Suspense fallback={null}>
        <ToolStructuredData
          toolName={toolName}
          toolSlug={toolSlug}
          toolDescription={toolDescription}
          toolIcon={toolIcon}
          keywords={keywords}
        />
      </Suspense>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Breadcrumbs items={breadcrumbItems} />
        </motion.div>

        {/* Hero Section محسّن */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* أيقونة الأداة محسّنة */}
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative inline-block mb-8"
          >
            <div
              className={`w-24 h-24 bg-gradient-to-br ${gradient} rounded-3xl 
                           flex items-center justify-center text-5xl shadow-2xl
                           transform hover:scale-110 hover:rotate-3 transition-all duration-300`}
            >
              {toolIcon}
            </div>
            {/* تأثير الإضاءة */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-xl opacity-40 -z-10`}
            ></div>
            {/* نقطة متحركة */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-gray-800"></div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {toolName}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            {toolDescription}
          </p>

          {/* شارة ميلادك محسّنة */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3"
          >
            <div
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 
                          dark:from-purple-900/40 dark:to-pink-900/40 rounded-full 
                          text-purple-700 dark:text-purple-300 font-medium shadow-lg
                          border border-purple-200/50 dark:border-purple-700/50"
            >
              <Star className="w-5 h-5 fill-current text-yellow-500" />
              <span>أداة مجانية من ميلادك</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </motion.div>
        </motion.div>

        {/* قسم الحاسبة محسّن */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-16"
        >
          {/* خلفية الكارد */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-[2rem] blur-xl"></div>
          <div
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 
                        shadow-2xl border border-white/50 dark:border-gray-700/50"
          >
            {children}
          </div>
        </motion.div>

        {/* إعلان بين الحاسبة والمحتوى */}
        {showAds && <InContentAd className="my-8" />}

        {/* قسم المقالات العشوائية - Lazy Loaded */}
        {showArticles && (
          <Suspense fallback={<SectionLoader />}>
            <ToolRandomArticles
              toolSlug={toolSlug}
              keywords={keywords}
              count={6}
              title="مقالات ذات صلة"
              className="mb-12"
            />
          </Suspense>
        )}

        {/* قسم الكلمات المفتاحية - Lazy Loaded */}
        {showKeywords && (
          <Suspense fallback={<SectionLoader />}>
            <KeywordsSection
              toolSlug={toolSlug}
              pageType="tool"
              title="مواضيع ذات صلة"
              className="mb-12"
            />
          </Suspense>
        )}

        {/* محتوى SEO */}
        {seoContent && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 mb-12"
          >
            {seoContent}
          </motion.section>
        )}

        {/* روابط سريعة للأدوات الأخرى - محسّن */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-[2rem] blur-xl"></div>
          <div
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 
                        shadow-xl border border-white/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl 
                            flex items-center justify-center shadow-lg"
              >
                <Calculator className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  أدوات أخرى قد تهمك
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  اكتشف المزيد من أدوات ميلادك المجانية
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <QuickToolLink
                href="/tools/bmi-calculator"
                icon="⚖️"
                name="حاسبة BMI"
              />
              <QuickToolLink
                href="/tools/birthday-countdown"
                icon="🎂"
                name="العد التنازلي"
              />
              <QuickToolLink
                href="/tools/calorie-calculator"
                icon="🔥"
                name="السعرات الحرارية"
              />
              <QuickToolLink
                href="/tools/days-between"
                icon="📅"
                name="الأيام بين تاريخين"
              />
              <QuickToolLink
                href="/tools/life-statistics"
                icon="📊"
                name="إحصاءات الحياة"
              />
              <QuickToolLink
                href="/tools/pregnancy-stages"
                icon="🤰"
                name="مراحل الحمل"
              />
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/tools"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 
                         text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 
                         transition-all duration-300 font-semibold text-lg transform hover:scale-105"
              >
                <span>جميع الأدوات</span>
                <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* إعلان أسفل الصفحة */}
        {showAds && <FooterAd className="mt-8" />}
      </div>
    </div>
  );
}

function QuickToolLink({
  href,
  icon,
  name,
}: {
  href: string;
  icon: string;
  name: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-gray-50 to-white 
               dark:from-gray-700 dark:to-gray-800 
               border-2 border-gray-200 dark:border-gray-600 rounded-2xl
               hover:border-blue-400 dark:hover:border-blue-500
               hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30
               hover:shadow-lg hover:shadow-blue-500/10
               transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {name}
      </span>
    </Link>
  );
}
