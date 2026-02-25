'use client';

import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SocialShare from '@/components/SocialShare';
import { InContentAd, FooterAd } from '@/components/AdSense/AdSenseSlot';

// Lazy load components for better performance
const KeywordsSection = lazy(() => import('./KeywordsSection'));
const ToolRandomArticles = lazy(() => import('./ToolRandomArticles'));
const ToolStructuredData = lazy(() => import('./ToolStructuredData'));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
  gradient = 'from-primary to-secondary',
}: ToolPageLayoutProps) {
  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'الأدوات', href: '/tools' },
    { label: toolName, href: `/tools/${toolSlug}` },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* خلفية متدرجة محسّنة */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10"></div>
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10"></div>

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
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse border-2 border-background"></div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {toolName}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
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
              className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 
                          rounded-full 
                          text-primary font-medium shadow-lg
                          border border-primary/20"
            >
              <Star className="w-5 h-5 fill-current text-primary" />
              <span>أداة مجانية من ميلادك</span>
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
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
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[2rem] blur-xl"></div>
          <div
            className="relative bg-card/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 
                        shadow-2xl border border-border/50"
          >
            {children}

            <div className="mt-8 pt-8 border-t border-border">
              <SocialShare 
                title={toolName}
                url={`/tools/${toolSlug}`}
                description={toolDescription}
                heading="شارك الأداة"
              />
            </div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-[2rem] blur-xl"></div>
          <div
            className="relative bg-card/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 
                        shadow-xl border border-border/50"
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-2xl 
                            flex items-center justify-center shadow-lg"
              >
                <Calculator className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  أدوات أخرى قد تهمك
                </h2>
                <p className="text-muted-foreground">
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
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-secondary to-accent 
                         text-primary-foreground rounded-2xl hover:shadow-xl hover:shadow-secondary/25 
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
      className="group flex items-center gap-3 px-5 py-3 bg-card 
               border-2 border-border rounded-2xl
               hover:border-secondary
               hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10
               hover:shadow-lg hover:shadow-secondary/10
               transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="font-medium text-foreground group-hover:text-secondary transition-colors">
        {name}
      </span>
    </Link>
  );
}
