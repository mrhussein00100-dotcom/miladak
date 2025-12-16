import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingActions from '@/components/FloatingActions';
import WelcomeScreen from '@/components/WelcomeScreen';
import './globals.css';

// تحميل خط Cairo العربي
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ميلادك - حاسبة العمر الدقيقة وأدوات مفيدة',
    template: '%s | ميلادك',
  },
  description:
    'احسب عمرك بدقة بالسنوات والأشهر والأيام والساعات. اكتشف برجك وإحصاءات حياتك الممتعة مع ميلادك - أفضل حاسبة عمر عربية. أدوات مجانية: حاسبة BMI، السعرات الحرارية، الحمل، والمزيد.',
  keywords: [
    // === حساب العمر (25 كلمة) ===
    'حاسبة العمر',
    'حساب العمر',
    'كم عمري',
    'عمري كم',
    'احسب عمرك',
    'حاسبة عمر دقيقة',
    'عمري بالأيام',
    'عمري بالساعات',
    'عمري بالثواني',
    'عمري بالدقائق',
    'عمري بالأسابيع',
    'حساب العمر بالهجري',
    'حساب العمر بالميلادي',
    'تحويل العمر',
    'age calculator',
    'حاسبة السن',
    'معرفة العمر',
    'حساب السن',
    'كم سني',
    'حاسبة تاريخ الميلاد',
    'حساب تاريخ الميلاد',
    'موقع حساب العمر',
    'العمر الدقيق',
    'حساب عمري الحقيقي',
    'كم عمري بالضبط',
    // === الصحة واللياقة (20 كلمة) ===
    'حاسبة BMI',
    'مؤشر كتلة الجسم',
    'حاسبة الوزن المثالي',
    'BMI calculator',
    'حاسبة السعرات الحرارية',
    'حساب السعرات',
    'calorie calculator',
    'وزن مثالي',
    'صحة ولياقة',
    'حاسبة الوزن',
    'نظام غذائي',
    'حرق السعرات',
    'لياقة بدنية',
    'صحة عامة',
    'تغذية صحية',
    'حاسبة الدهون',
    'معدل الأيض',
    'السعرات اليومية',
    'الوزن الصحي',
    'حمية غذائية',
    // === الحمل والأطفال (15 كلمة) ===
    'حاسبة الحمل',
    'مراحل الحمل',
    'حاسبة نمو الطفل',
    'عمر الطفل',
    'حاسبة الحمل بالأسابيع',
    'متابعة الحمل',
    'نمو الجنين',
    'صحة الحامل',
    'تطور الطفل',
    'مراحل نمو الطفل',
    'حاسبة عمر الطفل',
    'صحة الأطفال',
    'تربية الأطفال',
    'رعاية الأطفال',
    'نصائح للحامل',
    // === التواريخ والأوقات (15 كلمة) ===
    'حاسبة الأيام',
    'الفرق بين تاريخين',
    'كم يوم بين تاريخين',
    'العد التنازلي',
    'عد تنازلي لعيد الميلاد',
    'كم باقي على عيد ميلادي',
    'يوم الأسبوع',
    'معرفة يوم الميلاد',
    'التقويم الهجري',
    'التقويم الميلادي',
    'تحويل التاريخ',
    'حاسبة الوقت',
    'فرق التوقيت',
    'المناطق الزمنية',
    'حاسبة التواريخ',
    // === المناسبات والأعياد (10 كلمات) ===
    'الأعياد الإسلامية',
    'مواعيد الأعياد',
    'حاسبة الأعياد',
    'مخطط الاحتفالات',
    'تخطيط حفلة عيد ميلاد',
    'عيد الفطر',
    'عيد الأضحى',
    'رمضان',
    'مناسبات إسلامية',
    'احتفالات',
    // === الأبراج والفلك (10 كلمات) ===
    'برجي',
    'معرفة البرج',
    'حاسبة الأبراج',
    'البرج من تاريخ الميلاد',
    'الأبراج الفلكية',
    'برج الحمل',
    'برج الثور',
    'برج الجوزاء',
    'توافق الأبراج',
    'صفات الأبراج',
    // === كلمات عامة وتقنية (5 كلمات) ===
    'ميلادك',
    'miladak',
    'أدوات مفيدة',
    'حاسبات مجانية',
    'أدوات حسابية',
  ],
  authors: [{ name: 'فريق ميلادك' }],
  creator: 'ميلادك',
  publisher: 'ميلادك',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ميلادك',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cairo.variable}
    >
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Arabic Fonts for Birthday Cards */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&family=Amiri:wght@400;700&family=Almarai:wght@400;700;800&family=Changa:wght@400;600;700&family=Lateef:wght@400;700&family=Scheherazade+New:wght@400;700&family=Harmattan:wght@400;600;700&subset=arabic&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
        {/* Google AdSense Script */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${cairo.className} font-arabic antialiased min-h-screen flex flex-col transition-colors duration-300`}
      >
        <ThemeProvider>
          <WelcomeScreen />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <ScrollToTop />
          <FloatingActions />
        </ThemeProvider>
      </body>
    </html>
  );
}
