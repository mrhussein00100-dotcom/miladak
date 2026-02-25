export interface NavbarLink {
  href: string;
  label: string;
}

export interface NavbarConfig {
  siteName: string;
  logo?: string;
  links: NavbarLink[];
}

export const defaultNavbar: NavbarConfig = {
  siteName: 'ميلادك',
  logo: '/logo.png',
  links: [
    { href: '/', label: 'الرئيسية' },
    { href: '/#calculator', label: 'احسب عمرك' },
    { href: '/friends', label: 'الأصدقاء' },
    { href: '/cards', label: 'بطاقات التهنئة' },
    { href: '/pregnancy-calculator', label: 'حاسبة الولادة' },
    { href: '/tools/date-converter', label: 'تحويل التاريخ' },
    { href: '/articles', label: 'المقالات' },
    { href: '/contact', label: 'اتصل بنا' },
  ],
};
