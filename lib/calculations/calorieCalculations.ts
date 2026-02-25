export interface CalorieInput {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'maintain' | 'lose' | 'gain';
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  goalCalories: number;
  macros: {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fats: { grams: number; calories: number; percentage: number };
  };
  mealPlan: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
  recommendations: string[];
  tips: string[];
}

export function calculateCalories(input: CalorieInput): CalorieResult {
  const { age, gender, weight, height, activityLevel, goal } = input;
  
  // حساب معدل الأيض الأساسي (BMR) باستخدام معادلة Mifflin-St Jeor
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // معاملات مستوى النشاط
  const activityMultipliers = {
    sedentary: 1.2,      // قليل الحركة
    light: 1.375,        // نشاط خفيف
    moderate: 1.55,      // نشاط متوسط
    active: 1.725,       // نشاط عالي
    very_active: 1.9     // نشاط عالي جداً
  };
  
  // حساب إجمالي الطاقة المستهلكة يومياً (TDEE)
  const tdee = bmr * activityMultipliers[activityLevel];
  
  // حساب السعرات المطلوبة حسب الهدف
  let goalCalories: number;
  let recommendations: string[] = [];
  
  switch (goal) {
    case 'lose':
      goalCalories = tdee - 500; // نقص 500 سعرة لفقدان 0.5 كجم أسبوعياً
      recommendations = [
        'اشرب الماء قبل الوجبات لزيادة الشبع',
        'تناول البروتين في كل وجبة للحفاظ على العضلات',
        'اختر الأطعمة الغنية بالألياف لتشعر بالشبع أطول',
        'مارس تمارين القوة للحفاظ على كتلة العضلات',
        'تجنب المشروبات السكرية والعصائر المحلاة'
      ];
      break;
    case 'gain':
      goalCalories = tdee + 300; // زيادة 300 سعرة لزيادة الوزن تدريجياً
      recommendations = [
        'تناول وجبات متكررة كل 3-4 ساعات',
        'أضف المكسرات والبذور لوجباتك',
        'اشرب العصائر الطبيعية والحليب',
        'مارس تمارين القوة لبناء العضلات',
        'تناول البروتين بعد التمرين مباشرة'
      ];
      break;
    default: // maintain
      goalCalories = tdee;
      recommendations = [
        'حافظ على نظام غذائي متوازن ومتنوع',
        'مارس الرياضة بانتظام 150 دقيقة أسبوعياً',
        'اشرب 8-10 أكواب من الماء يومياً',
        'احصل على نوم كافي 7-9 ساعات يومياً',
        'تناول الخضروات والفواكه بكثرة'
      ];
  }
  
  // حساب توزيع المغذيات الكبرى (Macros)
  const proteinPercentage = goal === 'gain' ? 25 : goal === 'lose' ? 30 : 20;
  const fatPercentage = 25;
  const carbPercentage = 100 - proteinPercentage - fatPercentage;
  
  const proteinCalories = (goalCalories * proteinPercentage) / 100;
  const fatCalories = (goalCalories * fatPercentage) / 100;
  const carbCalories = (goalCalories * carbPercentage) / 100;
  
  const macros = {
    protein: {
      grams: Math.round(proteinCalories / 4),
      calories: Math.round(proteinCalories),
      percentage: proteinPercentage
    },
    carbs: {
      grams: Math.round(carbCalories / 4),
      calories: Math.round(carbCalories),
      percentage: carbPercentage
    },
    fats: {
      grams: Math.round(fatCalories / 9),
      calories: Math.round(fatCalories),
      percentage: fatPercentage
    }
  };
  
  // توزيع الوجبات
  const mealPlan = {
    breakfast: Math.round(goalCalories * 0.25),
    lunch: Math.round(goalCalories * 0.35),
    dinner: Math.round(goalCalories * 0.30),
    snacks: Math.round(goalCalories * 0.10)
  };
  
  // نصائح عامة
  const tips = [
    'اقرأ ملصقات الطعام لمعرفة السعرات الحرارية',
    'استخدم أطباق أصغر للتحكم في الحصص',
    'تناول الطعام ببطء واستمتع بكل قضمة',
    'احتفظ بمذكرة طعام لتتبع ما تأكله',
    'لا تتجاهل وجبة الإفطار أبداً',
    'اطبخ في المنزل أكثر من الأكل خارجاً',
    'تناول الفواكه والخضروات الطازجة كوجبات خفيفة'
  ];
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    goalCalories: Math.round(goalCalories),
    macros,
    mealPlan,
    recommendations,
    tips
  };
}

export function getActivityLevelDescription(level: string): string {
  const descriptions = {
    sedentary: 'قليل الحركة (عمل مكتبي، لا توجد رياضة)',
    light: 'نشاط خفيف (رياضة خفيفة 1-3 أيام أسبوعياً)',
    moderate: 'نشاط متوسط (رياضة متوسطة 3-5 أيام أسبوعياً)',
    active: 'نشاط عالي (رياضة قوية 6-7 أيام أسبوعياً)',
    very_active: 'نشاط عالي جداً (رياضة قوية يومياً + عمل بدني)'
  };
  return descriptions[level as keyof typeof descriptions] || '';
}

export function getGoalDescription(goal: string): string {
  const descriptions = {
    lose: 'إنقاص الوزن (فقدان 0.5 كجم أسبوعياً)',
    maintain: 'الحفاظ على الوزن الحالي',
    gain: 'زيادة الوزن (زيادة 0.3 كجم أسبوعياً)'
  };
  return descriptions[goal as keyof typeof descriptions] || '';
}

export function getFoodSuggestions(goal: string): { category: string; foods: string[] }[] {
  const suggestions = {
    lose: [
      {
        category: 'بروتينات قليلة الدسم',
        foods: ['صدر الدجاج المشوي', 'السمك الأبيض', 'البيض', 'الجبن القريش', 'البقوليات']
      },
      {
        category: 'خضروات منخفضة السعرات',
        foods: ['السبانخ', 'البروكلي', 'الخيار', 'الطماطم', 'الفلفل الملون']
      },
      {
        category: 'كربوهيدرات معقدة',
        foods: ['الشوفان', 'الأرز البني', 'الكينوا', 'البطاطا الحلوة', 'الخبز الأسمر']
      }
    ],
    maintain: [
      {
        category: 'وجبات متوازنة',
        foods: ['سلطة الدجاج', 'السمك مع الأرز', 'العدس مع الخضار', 'البيض مع الخبز', 'الفواكه والمكسرات']
      },
      {
        category: 'وجبات خفيفة صحية',
        foods: ['التفاح مع زبدة اللوز', 'الزبادي مع التوت', 'الجزر مع الحمص', 'المكسرات المشكلة']
      }
    ],
    gain: [
      {
        category: 'أطعمة عالية السعرات',
        foods: ['الأفوكادو', 'المكسرات والبذور', 'زبدة الفول السوداني', 'الموز', 'التمر']
      },
      {
        category: 'بروتينات لبناء العضلات',
        foods: ['اللحم الأحمر', 'الدجاج', 'السمك الدهني', 'البيض', 'مسحوق البروتين']
      },
      {
        category: 'كربوهيدرات للطاقة',
        foods: ['الأرز', 'المعكرونة', 'الشوفان', 'الخبز', 'البطاطس']
      }
    ]
  };
  
  return suggestions[goal as keyof typeof suggestions] || suggestions.maintain;
}