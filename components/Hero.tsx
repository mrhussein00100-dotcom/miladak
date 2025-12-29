'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button, CelebrationButton } from './ui/Button';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if mobile for performance optimization
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToCalculator = () => {
    const calculator = document.getElementById('calculator');
    calculator?.scrollIntoView({ behavior: 'smooth' });
  };

  const statsData = [
    { value: '10K+', label: 'مستخدم نشط', icon: '👥' },
    { value: '1M+', label: 'حساب للعمر', icon: '🧮' },
    { value: '50+', label: 'إحصائية ممتعة', icon: '📊' },
    { value: '4.9', label: 'تقييم المستخدمين', icon: '⭐' },
  ];

  // Simple fade-in animation (runs once)
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Static Background - No animations on mobile */}
      <div className="absolute inset-0 -z-10">
        {/* Static Gradient Orbs - CSS only, no JS animations */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 blur-3xl opacity-40" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-secondary/20 to-accent/10 blur-3xl opacity-40 hidden sm:block" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-accent/20 to-primary/10 blur-3xl opacity-30 hidden sm:block" />

        {/* Grid Pattern - Hidden on mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 hidden sm:block" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge - Simple fade, no pulse on mobile */}
        <motion.div
          {...fadeIn}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
        >
          <span>🎂</span>
          <span className="text-sm font-medium text-primary">
            أفضل حاسبة عمر عربية
          </span>
          <span>🎂</span>
        </motion.div>

        {/* Main Title - يظهر فوراً بدون animation لتحسين LCP */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight">
          <span className="text-gradient">اكتشف عمرك</span>
          <br />
          <span className="text-foreground">بطريقة لم تراها من قبل!</span>
        </h1>

        {/* Subtitle */}
        <motion.p
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          احسب عمرك بدقة بالسنوات والأشهر والأيام والساعات، واكتشف إحصاءات مذهلة
          وممتعة عن حياتك لم تكن تعلمها من قبل! 🎉
        </motion.p>

        {/* CTA Buttons - No hover animations on mobile */}
        <motion.div
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          <CelebrationButton onClick={scrollToCalculator} size="xl">
            احسب عمرك الآن
          </CelebrationButton>

          <Button
            variant="outline"
            size="xl"
            onClick={() => (window.location.href = '/friends')}
            icon="🎁"
          >
            احسب لصديقك
          </Button>
        </motion.div>

        {/* Stats - Simple cards without hover animations on mobile */}
        <motion.div
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl text-center border border-border/50 sm:hover:scale-105 sm:hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator - Static on mobile */}
        <div className="mt-12">
          <button
            onClick={scrollToCalculator}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm">ابدأ الآن</span>
              <span className="text-2xl sm:animate-bounce">👇</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
