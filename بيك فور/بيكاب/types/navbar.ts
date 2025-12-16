export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface Tool {
  name: string;
  href: string;
  icon: string;
  isPopular?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: Tool[];
}

export interface SearchResult {
  title: string;
  href: string;
  type: 'tool' | 'article' | 'page';
  icon?: string;
}

// Navigation items for main menu
export const navigationItems: NavItem[] = [
  {
    name: 'الرئيسية',
    href: '/',
    icon: '🏠',
  },
  {
    name: 'الأدوات',
    href: '/tools',
    icon: '🛠️',
  },
  {
    name: 'المقالات',
    href: '/articles',
    icon: '📚',
  },
  {
    name: 'البطاقات',
    href: '/cards',
    icon: '🎨',
    badge: 'جديد',
  },
  {
    name: 'الألوان والأرقام',
    href: '/colors-numbers',
    icon: '🎯',
  },
];

// Tool categories for dropdown
export const toolCategories: ToolCategory[] = [
  {
    id: 'age-tools',
    name: 'حاسبات العمر',
    icon: '🎂',
    tools: [
      {
        name: 'حاسبة العمر',
        href: '/tools/age-calculator',
        icon: '📅',
        isPopular: true,
      },
      {
        name: 'العمر بالثواني',
        href: '/tools/age-in-seconds',
        icon: '⏱️',
      },
      {
        name: 'عمر الطفل',
        href: '/tools/child-age',
        icon: '👶',
      },
      {
        name: 'إحصائيات الحياة',
        href: '/tools/life-statistics',
        icon: '📊',
      },
    ],
  },
  {
    id: 'date-tools',
    name: 'أدوات التاريخ',
    icon: '📆',
    tools: [
      {
        name: 'محول التاريخ',
        href: '/tools/date-converter',
        icon: '🔄',
        isPopular: true,
      },
      {
        name: 'يوم الأسبوع',
        href: '/tools/day-of-week',
        icon: '📅',
      },
      {
        name: 'الأيام بين التواريخ',
        href: '/tools/days-between',
        icon: '📏',
      },
      {
        name: 'عد تنازلي للأحداث',
        href: '/tools/event-countdown',
        icon: '⏰',
      },
    ],
  },
  {
    id: 'health-tools',
    name: 'أدوات الصحة',
    icon: '🏥',
    tools: [
      {
        name: 'حاسبة كتلة الجسم',
        href: '/tools/bmi-calculator',
        icon: '⚖️',
        isPopular: true,
      },
      {
        name: 'حاسبة السعرات',
        href: '/tools/calorie-calculator',
        icon: '🍎',
      },
      {
        name: 'نمو الطفل',
        href: '/tools/child-growth',
        icon: '📈',
      },
    ],
  },
  {
    id: 'utility-tools',
    name: 'أدوات مساعدة',
    icon: '🔧',
    tools: [
      {
        name: 'حاسبة المناطق الزمنية',
        href: '/tools/timezone-calculator',
        icon: '🌍',
      },
      {
        name: 'مخطط الاحتفالات',
        href: '/tools/celebration-planner',
        icon: '🎉',
      },
      {
        name: 'عد تنازلي لعيد الميلاد',
        href: '/tools/birthday-countdown',
        icon: '🎂',
      },
    ],
  },
];

// Bottom navigation items for mobile
export const bottomNavItems: NavItem[] = [
  {
    name: 'الرئيسية',
    href: '/',
    icon: '🏠',
  },
  {
    name: 'الأدوات',
    href: '/tools',
    icon: '🛠️',
  },
  {
    name: 'البطاقات',
    href: '/cards',
    icon: '🎨',
  },
  {
    name: 'المقالات',
    href: '/articles',
    icon: '📚',
  },
];
