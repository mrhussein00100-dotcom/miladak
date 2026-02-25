'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = {
  main: [
    { name: 'الرئيسية', href: '/', icon: '🏠' },
    { name: 'الأدوات', href: '/tools', icon: '🛠️' },
    { name: 'المقالات', href: '/articles', icon: '📚' },
    { name: 'من نحن', href: '/about', icon: 'ℹ️' },
  ],
  explore: [
    { name: 'بطاقات التهنئة', href: '/cards', icon: '🎉' },
    { name: 'أحداث تاريخية', href: '/historical-events', icon: '📜' },
    { name: 'مشاهير', href: '/celebrities', icon: '⭐' },
    { name: 'أحجار وزهور الميلاد', href: '/birthstones-flowers', icon: '💎' },
  ],
  legal: [
    { name: 'سياسة الخصوصية', href: '/privacy', icon: '🔒' },
    { name: 'الشروط والأحكام', href: '/terms', icon: '📋' },
    { name: 'اتصل بنا', href: '/contact', icon: '📧' },
  ],
  tools: [
    { name: 'حاسبة العمر', href: '/', icon: '🎂' },
    { name: 'توافق الأبراج', href: '/tools/zodiac-compatibility', icon: '❤️' },
    { name: 'حاسبة الحب', href: '/tools/love-calculator', icon: '💘' },
    { name: 'حاسبة فرق العمر', href: '/tools/age-difference', icon: '⏳' },
    { name: 'حاسبة BMI', href: '/tools/bmi-calculator', icon: '⚖️' },
    { name: 'العد التنازلي', href: '/tools/birthday-countdown', icon: '⏰' },
    { name: 'حاسبة السعرات', href: '/tools/calorie-calculator', icon: '🔥' },
    { name: 'محول التاريخ', href: '/tools/date-converter', icon: '📅' },
    { name: 'عمرك في الفضاء', href: '/tools/age-on-planets', icon: '🚀' },
  ],
  social: [
    { name: 'تويتر', href: '#', icon: '🐦' },
    { name: 'فيسبوك', href: '#', icon: '📘' },
    { name: 'إنستغرام', href: '#', icon: '📷' },
  ],
};

const stats = [
  { label: 'المستخدمين', value: '10K+', icon: '👥' },
  { label: 'الحسابات', value: '50K+', icon: '🧮' },
  { label: 'الأدوات', value: '15+', icon: '🛠️' },
  { label: 'المقالات', value: '100+', icon: '📚' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Wave Pattern */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className="fill-primary/10"
          />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="relative bg-gradient-to-br from-card via-card/95 to-card/90 pt-20 pb-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xl md:text-2xl mb-1">{stat.icon}</div>
                <div className="text-lg md:text-xl font-black text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Links Section - صفين في الموبايل */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Brand - يأخذ عرض كامل في الموبايل */}
            <motion.div
              className="col-span-2 md:col-span-1 text-center md:text-right"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link
                href="/"
                className="flex items-center justify-center md:justify-start space-x-2 space-x-reverse mb-3 md:mb-4"
              >
                <motion.div
                  className="text-2xl md:text-3xl"
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -15, 15, 0],
                    transition: { duration: 0.6 },
                  }}
                >
                  🎂
                </motion.div>
                <span className="text-lg md:text-xl font-black text-gradient">
                  ميلادك
                </span>
              </Link>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-3 md:mb-4 max-w-xs mx-auto md:mx-0">
                موقع حاسبة العمر الأكثر دقة وتفصيلاً. اكتشف رحلة حياتك بأجمل
                الطرق.
              </p>
              <div className="flex justify-center md:justify-start space-x-2 space-x-reverse">
                {footerLinks.social.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white hover:scale-110 transition-transform text-sm md:text-base"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    title={link.name}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Main Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-sm md:text-lg mb-3 md:mb-4 text-gradient">
                الصفحات
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.main.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm flex items-center space-x-1.5 md:space-x-2 space-x-reverse group"
                    >
                      <span className="group-hover:scale-110 transition-transform text-sm md:text-base">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Explore */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-sm md:text-lg mb-3 md:mb-4 text-gradient">
                استكشف
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm flex items-center space-x-1.5 md:space-x-2 space-x-reverse group"
                    >
                      <span className="group-hover:scale-110 transition-transform text-sm md:text-base">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-sm md:text-lg mb-3 md:mb-4 text-gradient">
                الأدوات
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.tools.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm flex items-center space-x-1.5 md:space-x-2 space-x-reverse group"
                    >
                      <span className="group-hover:scale-110 transition-transform text-sm md:text-base">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-sm md:text-lg mb-3 md:mb-4 text-gradient">
                قانوني
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm flex items-center space-x-1.5 md:space-x-2 space-x-reverse group"
                    >
                      <span className="group-hover:scale-110 transition-transform text-sm md:text-base">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            className="pt-6 md:pt-8 border-t border-border/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <p className="text-muted-foreground text-xs md:text-sm">
                © {currentYear} ميلادك. جميع الحقوق محفوظة 🎉
              </p>
              <p className="text-muted-foreground text-xs md:text-sm flex items-center space-x-1.5 md:space-x-2 space-x-reverse">
                <span>صُنع بـ</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ❤️
                </motion.span>
                <span>للمجتمع العربي</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
