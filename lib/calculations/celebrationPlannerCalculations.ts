// حسابات مخطط الاحتفالات

// واجهات البيانات الأساسية
export interface CelebrationEvent {
  id: string;
  name: string;
  type: string;
  date: string;
  guestCount: number;
  budget: number;
  venue: string;
  theme: string;
  notes: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  item: string;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface CelebrationIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  cost: 'منخفض' | 'متوسط' | 'مرتفع';
  duration: string;
  participants: string;
  materials: string[];
  steps: string[];
  category: 'decoration' | 'activity' | 'food' | 'entertainment';
}

export interface GiftIdea {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  category: string;
  ageGroup?: string;
  gender?: 'ذكر' | 'أنثى' | 'كلاهما';
  occasion: string;
}

export interface TimelineItem {
  task: string;
  timeframe: string;
  priority: 'عالي' | 'متوسط' | 'منخفض';
}

export interface CelebrationPlan {
  occasion: string;
  celebrationIdeas: CelebrationIdea[];
  giftIdeas: GiftIdea[];
  budget: {
    low: number;
    medium: number;
    high: number;
  };
  timeline: TimelineItem[];
}

// أنواع المناسبات المدعومة
export interface CelebrationType {
  value: string;
  label: string;
  icon: string;
}

// فئات الميزانية
export interface BudgetCategory {
  value: string;
  label: string;
  icon: string;
}

// فئات المهام
export interface TaskCategory {
  value: string;
  label: string;
  color: string;
}

// البيانات الثابتة
export const celebrationTypes: CelebrationType[] = [
  { value: 'birthday', label: 'عيد ميلاد', icon: '🎂' },
  { value: 'wedding', label: 'زفاف', icon: '💒' },
  { value: 'graduation', label: 'تخرج', icon: '🎓' },
  { value: 'anniversary', label: 'ذكرى سنوية', icon: '💕' },
  { value: 'baby-shower', label: 'استقبال مولود', icon: '👶' },
  { value: 'engagement', label: 'خطوبة', icon: '💍' },
  { value: 'retirement', label: 'تقاعد', icon: '🏆' },
  { value: 'holiday', label: 'عطلة/عيد', icon: '🎊' },
  { value: 'corporate', label: 'مناسبة عمل', icon: '🏢' },
  { value: 'other', label: 'أخرى', icon: '🎉' }
];

export const budgetCategories: BudgetCategory[] = [
  { value: 'venue', label: 'المكان', icon: '🏛️' },
  { value: 'food', label: 'الطعام والشراب', icon: '🍽️' },
  { value: 'decoration', label: 'الديكور والزينة', icon: '🎨' },
  { value: 'entertainment', label: 'الترفيه والموسيقى', icon: '🎵' },
  { value: 'photography', label: 'التصوير', icon: '📸' },
  { value: 'invitations', label: 'الدعوات', icon: '💌' },
  { value: 'gifts', label: 'الهدايا والتذكارات', icon: '🎁' },
  { value: 'transportation', label: 'المواصلات', icon: '🚗' },
  { value: 'clothing', label: 'الملابس والإكسسوارات', icon: '👗' },
  { value: 'other', label: 'أخرى', icon: '💰' }
];

export const taskCategories: TaskCategory[] = [
  { value: 'planning', label: 'التخطيط', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
  { value: 'booking', label: 'الحجوزات', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
  { value: 'shopping', label: 'التسوق', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' },
  { value: 'preparation', label: 'التحضير', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' },
  { value: 'day-of', label: 'يوم الحدث', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
];

// أفكار الاحتفالات حسب المناسبة
const celebrationIdeas: Record<string, CelebrationIdea[]> = {
  birthday: [
    {
      id: 'birthday-party-home',
      title: 'حفلة عيد ميلاد منزلية',
      description: 'احتفال مريح في المنزل مع الأصدقاء والعائلة',
      difficulty: 'سهل',
      cost: 'منخفض',
      duration: '3-4 ساعات',
      participants: '10-20 شخص',
      materials: ['بالونات', 'كيك', 'شموع', 'هدايا', 'موسيقى', 'ألعاب'],
      steps: [
        'تحضير قائمة المدعوين',
        'شراء الكيك والحلويات',
        'تزيين المكان بالبالونات',
        'تحضير الألعاب والأنشطة',
        'تحضير الطعام والمشروبات'
      ],
      category: 'activity'
    },
    {
      id: 'birthday-outdoor',
      title: 'احتفال خارجي في الحديقة',
      description: 'حفلة في الهواء الطلق مع أنشطة ممتعة',
      difficulty: 'متوسط',
      cost: 'متوسط',
      duration: '4-5 ساعات',
      participants: '15-30 شخص',
      materials: ['خيمة أو مظلة', 'شواية', 'ألعاب خارجية', 'كراسي وطاولات', 'إضاءة'],
      steps: [
        'حجز مكان مناسب',
        'التحقق من حالة الطقس',
        'تحضير معدات الشواء',
        'إعداد منطقة الألعاب',
        'تحضير خطة بديلة للطقس السيء'
      ],
      category: 'activity'
    },
    {
      id: 'birthday-theme-party',
      title: 'حفلة بثيم معين',
      description: 'احتفال مميز بموضوع محدد (أبطال خارقين، أميرات، إلخ)',
      difficulty: 'متوسط',
      cost: 'متوسط',
      duration: '3-4 ساعات',
      participants: '8-15 شخص',
      materials: ['ديكورات الثيم', 'أزياء تنكرية', 'كيك مخصص', 'ألعاب مناسبة للثيم'],
      steps: [
        'اختيار الثيم المناسب',
        'شراء الديكورات والأزياء',
        'طلب كيك مخصص',
        'تحضير أنشطة مناسبة للثيم',
        'إرسال دعوات بنفس الثيم'
      ],
      category: 'decoration'
    },
    {
      id: 'birthday-cake-ideas',
      title: 'أفكار كعكات عيد الميلاد',
      description: 'كعكات إبداعية ومميزة لعيد الميلاد',
      difficulty: 'سهل',
      cost: 'منخفض',
      duration: '1-2 ساعة',
      participants: 'حسب الحاجة',
      materials: ['كعكة أساسية', 'كريمة تزيين', 'شموع', 'ألوان طعام', 'حلويات للتزيين'],
      steps: [
        'اختيار شكل الكعكة',
        'تحضير الكريمة والألوان',
        'تزيين الكعكة',
        'إضافة الشموع والتفاصيل'
      ],
      category: 'food'
    }
  ],
  wedding: [
    {
      id: 'wedding-traditional',
      title: 'زفاف تقليدي',
      description: 'احتفال زفاف بالطريقة التقليدية مع العادات المحلية',
      difficulty: 'صعب',
      cost: 'مرتفع',
      duration: '6-8 ساعات',
      participants: '100-300 شخص',
      materials: ['قاعة احتفالات', 'كوشة', 'موسيقى', 'طعام', 'تصوير', 'زهور'],
      steps: [
        'حجز القاعة والتاريخ',
        'اختيار فريق التصوير',
        'تحديد قائمة الطعام',
        'تحضير الدعوات',
        'ترتيب النقل والإقامة للضيوف'
      ],
      category: 'activity'
    },
    {
      id: 'wedding-garden',
      title: 'زفاف في الحديقة',
      description: 'احتفال زفاف رومانسي في الهواء الطلق',
      difficulty: 'متوسط',
      cost: 'متوسط',
      duration: '4-6 ساعات',
      participants: '50-150 شخص',
      materials: ['خيام أنيقة', 'إضاءة رومانسية', 'زهور طبيعية', 'كراسي وطاولات', 'نظام صوتي'],
      steps: [
        'اختيار الحديقة المناسبة',
        'التأكد من تصاريح الاستخدام',
        'تحضير خطة بديلة للطقس',
        'ترتيب الديكورات الطبيعية',
        'تنسيق الإضاءة والموسيقى'
      ],
      category: 'decoration'
    }
  ],
  graduation: [
    {
      id: 'graduation-family',
      title: 'احتفال التخرج العائلي',
      description: 'احتفال مع العائلة والأصدقاء المقربين',
      difficulty: 'سهل',
      cost: 'منخفض',
      duration: '2-3 ساعات',
      participants: '10-25 شخص',
      materials: ['كيك تخرج', 'بالونات بألوان الجامعة', 'صور تذكارية', 'هدايا'],
      steps: [
        'دعوة الأهل والأصدقاء',
        'طلب كيك مناسب للتخرج',
        'تحضير عرض صور من الرحلة الدراسية',
        'تحضير كلمة شكر',
        'ترتيب جلسة تصوير'
      ],
      category: 'activity'
    },
    {
      id: 'graduation-party',
      title: 'حفلة تخرج كبيرة',
      description: 'احتفال كبير مع زملاء الدراسة والأصدقاء',
      difficulty: 'متوسط',
      cost: 'متوسط',
      duration: '4-5 ساعات',
      participants: '30-80 شخص',
      materials: ['قاعة أو مكان واسع', 'نظام صوتي', 'ديكورات التخرج', 'بوفيه', 'كاميرا'],
      steps: [
        'حجز المكان المناسب',
        'إرسال الدعوات لزملاء الدراسة',
        'تحضير عرض تقديمي عن الرحلة الدراسية',
        'ترتيب البوفيه والمشروبات',
        'تنظيم فقرات ترفيهية'
      ],
      category: 'entertainment'
    }
  ],
  baby_shower: [
    {
      id: 'baby-shower-classic',
      title: 'حفلة استقبال المولود الكلاسيكية',
      description: 'احتفال تقليدي لاستقبال المولود الجديد',
      difficulty: 'متوسط',
      cost: 'متوسط',
      duration: '3-4 ساعات',
      participants: '15-30 شخص',
      materials: ['ديكورات الأطفال', 'كيك', 'ألعاب تفاعلية', 'هدايا للطفل', 'طعام خفيف'],
      steps: [
        'تحديد جنس المولود (إن أمكن)',
        'اختيار ألوان الديكور',
        'تحضير ألعاب مناسبة',
        'إعداد قائمة هدايا مقترحة',
        'تحضير ركن للصور التذكارية'
      ],
      category: 'activity'
    }
  ],
  anniversary: [
    {
      id: 'anniversary-romantic',
      title: 'احتفال رومانسي بالذكرى السنوية',
      description: 'أمسية رومانسية للاحتفال بالذكرى السنوية للزواج',
      difficulty: 'سهل',
      cost: 'متوسط',
      duration: '2-3 ساعات',
      participants: '2-10 أشخاص',
      materials: ['شموع', 'زهور', 'عشاء خاص', 'موسيقى هادئة', 'هدايا تذكارية'],
      steps: [
        'حجز مطعم رومانسي أو تحضير عشاء منزلي',
        'شراء الزهور والشموع',
        'تحضير قائمة تشغيل موسيقية',
        'إعداد ألبوم صور للذكريات',
        'تحضير هدية مميزة'
      ],
      category: 'entertainment'
    }
  ],
  engagement: [
    {
      id: 'engagement-party',
      title: 'حفلة خطوبة تقليدية',
      description: 'احتفال بالخطوبة مع الأهل والأصدقاء',
      difficulty: 'متوسط',
      cost: 'متوسط',
      duration: '3-5 ساعات',
      participants: '30-100 شخص',
      materials: ['قاعة أو مكان مناسب', 'ديكورات أنيقة', 'حلويات وضيافة', 'تصوير', 'موسيقى'],
      steps: [
        'تحديد قائمة المدعوين',
        'حجز المكان والتاريخ',
        'اختيار الديكورات والألوان',
        'تحضير الحلويات والضيافة',
        'ترتيب جلسة تصوير'
      ],
      category: 'activity'
    }
  ]
};

// أفكار الهدايا حسب المناسبة والعمر
const giftIdeas: Record<string, GiftIdea[]> = {
  birthday_child: [
    {
      id: 'toy-educational',
      name: 'ألعاب تعليمية',
      description: 'ألعاب تساعد على التعلم والتطور',
      priceRange: '50-200 ريال',
      category: 'ألعاب',
      ageGroup: '3-12 سنة',
      gender: 'كلاهما',
      occasion: 'birthday'
    },
    {
      id: 'books-children',
      name: 'كتب الأطفال',
      description: 'قصص وكتب تعليمية مناسبة للعمر',
      priceRange: '30-100 ريال',
      category: 'كتب',
      ageGroup: '3-15 سنة',
      gender: 'كلاهما',
      occasion: 'birthday'
    },
    {
      id: 'art-supplies',
      name: 'أدوات الرسم والفنون',
      description: 'ألوان وأوراق وأدوات للإبداع الفني',
      priceRange: '40-150 ريال',
      category: 'فنون',
      ageGroup: '4-16 سنة',
      gender: 'كلاهما',
      occasion: 'birthday'
    }
  ],
  birthday_adult: [
    {
      id: 'perfume',
      name: 'عطر فاخر',
      description: 'عطر من ماركة معروفة',
      priceRange: '200-800 ريال',
      category: 'عطور',
      gender: 'كلاهما',
      occasion: 'birthday'
    },
    {
      id: 'watch',
      name: 'ساعة يد أنيقة',
      description: 'ساعة كلاسيكية أو رياضية',
      priceRange: '300-2000 ريال',
      category: 'إكسسوارات',
      gender: 'كلاهما',
      occasion: 'birthday'
    },
    {
      id: 'experience-gift',
      name: 'تجربة مميزة',
      description: 'رحلة، دورة تدريبية، أو نشاط ممتع',
      priceRange: '500-3000 ريال',
      category: 'تجارب',
      gender: 'كلاهما',
      occasion: 'birthday'
    }
  ],
  wedding: [
    {
      id: 'home-appliances',
      name: 'أجهزة منزلية',
      description: 'أجهزة مفيدة للمنزل الجديد',
      priceRange: '500-5000 ريال',
      category: 'منزلية',
      gender: 'كلاهما',
      occasion: 'wedding'
    },
    {
      id: 'jewelry',
      name: 'مجوهرات',
      description: 'قطع مجوهرات أنيقة للعروس',
      priceRange: '1000-10000 ريال',
      category: 'مجوهرات',
      gender: 'أنثى',
      occasion: 'wedding'
    }
  ],
  baby_shower: [
    {
      id: 'baby-clothes',
      name: 'ملابس الأطفال',
      description: 'ملابس مريحة وجميلة للمولود',
      priceRange: '100-500 ريال',
      category: 'ملابس',
      ageGroup: '0-2 سنة',
      gender: 'كلاهما',
      occasion: 'baby_shower'
    },
    {
      id: 'baby-care',
      name: 'مستلزمات العناية بالطفل',
      description: 'منتجات العناية والنظافة للطفل',
      priceRange: '150-600 ريال',
      category: 'عناية',
      ageGroup: '0-2 سنة',
      gender: 'كلاهما',
      occasion: 'baby_shower'
    }
  ]
};

// دوال حساب التكاليف
export function calculateEstimatedCosts(
  occasionType: string,
  guestCount: number,
  budgetLevel: 'منخفض' | 'متوسط' | 'مرتفع'
): BudgetItem[] {
  // التكاليف بالجنيه المصري
  const baseCosts = {
    birthday: {
      منخفض: { venue: 0, food: 50, decoration: 20, entertainment: 30, photography: 0, invitations: 10, gifts: 25, transportation: 0, clothing: 0, other: 15 },
      متوسط: { venue: 500, food: 80, decoration: 50, entertainment: 60, photography: 400, invitations: 15, gifts: 40, transportation: 100, clothing: 200, other: 30 },
      مرتفع: { venue: 1200, food: 150, decoration: 100, entertainment: 120, photography: 800, invitations: 25, gifts: 80, transportation: 200, clothing: 500, other: 60 }
    },
    wedding: {
      منخفض: { venue: 8000, food: 200, decoration: 1500, entertainment: 2000, photography: 4000, invitations: 800, gifts: 0, transportation: 1000, clothing: 5000, other: 1500 },
      متوسط: { venue: 20000, food: 400, decoration: 5000, entertainment: 6000, photography: 10000, invitations: 2000, gifts: 0, transportation: 3000, clothing: 12000, other: 3000 },
      مرتفع: { venue: 50000, food: 800, decoration: 12000, entertainment: 15000, photography: 20000, invitations: 4000, gifts: 0, transportation: 6000, clothing: 25000, other: 6000 }
    },
    graduation: {
      منخفض: { venue: 0, food: 60, decoration: 150, entertainment: 0, photography: 300, invitations: 80, gifts: 250, transportation: 0, clothing: 500, other: 120 },
      متوسط: { venue: 800, food: 100, decoration: 400, entertainment: 500, photography: 800, invitations: 200, gifts: 600, transportation: 200, clothing: 1200, other: 250 },
      مرتفع: { venue: 2000, food: 180, decoration: 1000, entertainment: 1200, photography: 1500, invitations: 400, gifts: 1200, transportation: 400, clothing: 2500, other: 500 }
    }
  };



  const costs = baseCosts[occasionType as keyof typeof baseCosts] || baseCosts.birthday;
  const levelCosts = costs[budgetLevel];

  return budgetCategories.map(category => ({
    id: `${category.value}-estimated`,
    category: category.value,
    item: `تكلفة ${category.label} المقدرة`,
    estimatedCost: Math.round((levelCosts[category.value as keyof typeof levelCosts] || 0) * guestCount)
  }));
}

// إنشاء المهام التلقائية حسب نوع المناسبة
export function generateDefaultTasks(occasionType: string, eventDate: string): Task[] {
  const eventDateTime = new Date(eventDate);
  const now = new Date();
  const daysUntilEvent = Math.ceil((eventDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const taskTemplates = {
    birthday: [
      { title: 'تحديد قائمة المدعوين', category: 'planning', daysBefore: 14, priority: 'high' as const },
      { title: 'إرسال الدعوات', category: 'planning', daysBefore: 10, priority: 'high' as const },
      { title: 'حجز المكان (إن لزم الأمر)', category: 'booking', daysBefore: 12, priority: 'medium' as const },
      { title: 'طلب الكعكة', category: 'booking', daysBefore: 7, priority: 'high' as const },
      { title: 'شراء الديكورات والبالونات', category: 'shopping', daysBefore: 5, priority: 'medium' as const },
      { title: 'شراء الهدايا والجوائز', category: 'shopping', daysBefore: 7, priority: 'medium' as const },
      { title: 'تحضير الألعاب والأنشطة', category: 'preparation', daysBefore: 3, priority: 'medium' as const },
      { title: 'تحضير الطعام والمشروبات', category: 'preparation', daysBefore: 1, priority: 'high' as const },
      { title: 'تزيين المكان', category: 'day-of', daysBefore: 0, priority: 'high' as const }
    ],
    wedding: [
      { title: 'حجز القاعة والتاريخ', category: 'booking', daysBefore: 180, priority: 'high' as const },
      { title: 'اختيار فريق التصوير', category: 'booking', daysBefore: 120, priority: 'high' as const },
      { title: 'تحديد قائمة الطعام', category: 'planning', daysBefore: 90, priority: 'high' as const },
      { title: 'إرسال الدعوات', category: 'planning', daysBefore: 45, priority: 'high' as const },
      { title: 'شراء فستان الزفاف', category: 'shopping', daysBefore: 60, priority: 'high' as const },
      { title: 'حجز المكياج والتصفيف', category: 'booking', daysBefore: 30, priority: 'medium' as const },
      { title: 'التجهيزات النهائية', category: 'preparation', daysBefore: 7, priority: 'high' as const },
      { title: 'بروفة الزفاف', category: 'preparation', daysBefore: 1, priority: 'medium' as const }
    ],
    graduation: [
      { title: 'تحديد قائمة المدعوين', category: 'planning', daysBefore: 14, priority: 'medium' as const },
      { title: 'حجز المكان', category: 'booking', daysBefore: 10, priority: 'medium' as const },
      { title: 'طلب كعكة التخرج', category: 'booking', daysBefore: 7, priority: 'medium' as const },
      { title: 'شراء الديكورات', category: 'shopping', daysBefore: 5, priority: 'low' as const },
      { title: 'تحضير عرض الصور', category: 'preparation', daysBefore: 3, priority: 'medium' as const },
      { title: 'تحضير كلمة الشكر', category: 'preparation', daysBefore: 2, priority: 'low' as const }
    ]
  };

  const templates = taskTemplates[occasionType as keyof typeof taskTemplates] || taskTemplates.birthday;
  
  return templates.map((template, index) => {
    const dueDate = new Date(eventDateTime);
    dueDate.setDate(dueDate.getDate() - template.daysBefore);
    
    return {
      id: `task-${occasionType}-${index}`,
      title: template.title,
      category: template.category,
      dueDate: dueDate.toISOString().split('T')[0],
      completed: false,
      priority: template.priority,
      notes: ''
    };
  });
}

// حساب الوقت المتبقي للحدث
export function calculateTimeUntilEvent(eventDate: string) {
  const now = new Date();
  const event = new Date(eventDate);
  const timeDiff = event.getTime() - now.getTime();
  
  if (timeDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, isPast: false };
}

export function getCelebrationPlan(
  occasion: string,
  budget: 'منخفض' | 'متوسط' | 'مرتفع',
  participants: number,
  ageGroup?: string
): CelebrationPlan {
  
  // تحديد نوع الهدايا حسب المناسبة والعمر
  let giftKey = occasion;
  if (occasion === 'birthday' && ageGroup) {
    const age = parseInt(ageGroup);
    giftKey = age < 18 ? 'birthday_child' : 'birthday_adult';
  }
  
  const ideas = celebrationIdeas[occasion] || [];
  const gifts = giftIdeas[giftKey] || giftIdeas[occasion] || [];
  
  // فلترة الأفكار حسب الميزانية
  const filteredIdeas = ideas.filter(idea => {
    if (budget === 'منخفض') return idea.cost === 'منخفض';
    if (budget === 'متوسط') return idea.cost === 'منخفض' || idea.cost === 'متوسط';
    return true; // مرتفع - جميع الأفكار
  });
  
  // تحديد الميزانية التقديرية
  const budgetRanges = {
    birthday: { low: 200, medium: 800, high: 2000 },
    wedding: { low: 5000, medium: 20000, high: 50000 },
    graduation: { low: 300, medium: 1000, high: 3000 },
    baby_shower: { low: 500, medium: 1500, high: 4000 }
  };
  
  // الجدول الزمني للتحضير
  const timelines: Record<string, any[]> = {
    birthday: [
      { task: 'تحديد التاريخ والمكان', timeframe: '2-3 أسابيع قبل الحفلة', priority: 'عالي' },
      { task: 'إرسال الدعوات', timeframe: '1-2 أسبوع قبل الحفلة', priority: 'عالي' },
      { task: 'شراء الديكورات والمستلزمات', timeframe: '3-5 أيام قبل الحفلة', priority: 'متوسط' },
      { task: 'تحضير الطعام والكيك', timeframe: 'يوم الحفلة', priority: 'عالي' }
    ],
    wedding: [
      { task: 'حجز القاعة والتاريخ', timeframe: '6-12 شهر قبل الزفاف', priority: 'عالي' },
      { task: 'اختيار فريق التصوير', timeframe: '3-6 أشهر قبل الزفاف', priority: 'عالي' },
      { task: 'إرسال الدعوات', timeframe: '1-2 شهر قبل الزفاف', priority: 'عالي' },
      { task: 'التجهيزات النهائية', timeframe: '1-2 أسبوع قبل الزفاف', priority: 'عالي' }
    ]
  };
  
  return {
    occasion,
    celebrationIdeas: filteredIdeas,
    giftIdeas: gifts,
    budget: budgetRanges[occasion as keyof typeof budgetRanges] || budgetRanges.birthday,
    timeline: timelines[occasion] || timelines.birthday
  };
}

export function getOccasionSuggestions(): { id: string; name: string; description: string; emoji: string }[] {
  return [
    {
      id: 'birthday',
      name: 'عيد ميلاد',
      description: 'احتفال بعيد الميلاد للأطفال والكبار',
      emoji: '🎂'
    },
    {
      id: 'wedding',
      name: 'زفاف',
      description: 'احتفال بالزواج والعرس',
      emoji: '💒'
    },
    {
      id: 'graduation',
      name: 'تخرج',
      description: 'احتفال بالتخرج من المدرسة أو الجامعة',
      emoji: '🎓'
    },
    {
      id: 'baby_shower',
      name: 'استقبال المولود',
      description: 'احتفال بقدوم مولود جديد',
      emoji: '👶'
    },
    {
      id: 'anniversary',
      name: 'ذكرى سنوية',
      description: 'احتفال بالذكرى السنوية للزواج أو مناسبة مهمة',
      emoji: '💕'
    },
    {
      id: 'promotion',
      name: 'ترقية وظيفية',
      description: 'احتفال بالترقية أو النجاح المهني',
      emoji: '🏆'
    }
  ];
}

// فلترة الأفكار حسب المعايير
export function filterCelebrationIdeas(
  occasionType: string,
  budgetLevel: 'منخفض' | 'متوسط' | 'مرتفع',
  ageGroup?: number
): CelebrationIdea[] {
  const ideas = celebrationIdeas[occasionType] || [];
  
  return ideas.filter(idea => {
    // فلترة حسب الميزانية
    if (budgetLevel === 'منخفض' && idea.cost !== 'منخفض') return false;
    if (budgetLevel === 'متوسط' && idea.cost === 'مرتفع') return false;
    
    // فلترة حسب العمر (للأعياد الميلاد)
    if (occasionType === 'birthday' && ageGroup) {
      if (ageGroup <= 12 && idea.difficulty === 'صعب') return false;
      if (ageGroup >= 60 && idea.category === 'activity' && idea.difficulty === 'صعب') return false;
    }
    
    return true;
  });
}

// حساب إحصائيات المهام
export function calculateTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const overdue = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return !task.completed && dueDate < now;
  }).length;
  
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, overdue, progress };
}

// حساب إحصائيات الميزانية
export function calculateBudgetStats(budgetItems: BudgetItem[], totalBudget: number) {
  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0);
  const remaining = totalBudget - totalEstimated;
  const actualRemaining = totalBudget - totalActual;
  
  return {
    totalEstimated,
    totalActual,
    remaining,
    actualRemaining,
    isOverBudget: totalEstimated > totalBudget,
    isActualOverBudget: totalActual > totalBudget
  };
}

export function calculateBudgetBreakdown(totalBudget: number, occasion: string) {
  const breakdowns: Record<string, Record<string, number>> = {
    birthday: {
      'الطعام والمشروبات': 0.4,
      'الديكورات والبالونات': 0.2,
      'الهدايا والجوائز': 0.2,
      'الترفيه والأنشطة': 0.15,
      'متفرقات': 0.05
    },
    wedding: {
      'القاعة والضيافة': 0.5,
      'التصوير والفيديو': 0.15,
      'الديكورات والزهور': 0.15,
      'الموسيقى والترفيه': 0.1,
      'الملابس والتجميل': 0.1
    },
    graduation: {
      'الطعام والحلويات': 0.4,
      'الهدايا التذكارية': 0.3,
      'الديكورات': 0.2,
      'التصوير': 0.1
    }
  };
  
  const breakdown = breakdowns[occasion] || breakdowns.birthday;
  
  return Object.entries(breakdown).map(([category, percentage]) => ({
    category,
    amount: Math.round(totalBudget * percentage),
    percentage: Math.round(percentage * 100)
  }));
}

// دالة للحصول على اقتراحات توفير المال
export function getBudgetSavingTips(occasionType: string, budgetLevel: 'منخفض' | 'متوسط' | 'مرتفع'): string[] {
  const tips = {
    birthday: [
      'اصنع الديكورات بنفسك بدلاً من شرائها',
      'اطبخ الطعام في المنزل بدلاً من طلبه من الخارج',
      'استخدم الموسيقى من الهاتف بدلاً من استئجار DJ',
      'اطلب من الأصدقاء المساعدة في التحضير',
      'اختر مكان مجاني مثل المنزل أو الحديقة العامة'
    ],
    wedding: [
      'اختر موسم غير ذروة للزفاف',
      'قلل عدد المدعوين',
      'استخدم زهور الموسم المحلية',
      'اختر قاعة تشمل الطعام والديكور',
      'استعن بطلاب التصوير بدلاً من المحترفين'
    ],
    graduation: [
      'نظم الحفلة في المنزل',
      'اطلب من الأهل المساعدة في الطبخ',
      'استخدم الصور الرقمية بدلاً من الطباعة',
      'اصنع الهدايا التذكارية بنفسك',
      'استخدم ديكورات بسيطة وأنيقة'
    ]
  };
  
  return tips[occasionType as keyof typeof tips] || tips.birthday;
}