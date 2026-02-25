export interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  healthyWeightRange: {
    min: number;
    max: number;
  };
  recommendations: string[];
  riskFactors: string[];
}

export interface BMIInput {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
}

export function calculateBMI(input: BMIInput): BMIResult {
  const { weight, height, age, gender } = input;
  
  // تحويل الطول من سم إلى متر
  const heightInMeters = height / 100;
  
  // حساب مؤشر كتلة الجسم
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // تحديد الفئة واللون
  let category: string;
  let categoryColor: string;
  let recommendations: string[];
  let riskFactors: string[];
  
  if (bmi < 18.5) {
    category = 'نقص في الوزن';
    categoryColor = 'text-blue-600';
    recommendations = [
      'زيادة السعرات الحرارية بشكل صحي',
      'تناول وجبات متكررة وغنية بالعناصر الغذائية',
      'ممارسة تمارين القوة لبناء العضلات',
      'استشارة أخصائي تغذية'
    ];
    riskFactors = [
      'ضعف جهاز المناعة',
      'هشاشة العظام',
      'فقر الدم',
      'تأخر الشفاء من الأمراض'
    ];
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'وزن طبيعي';
    categoryColor = 'text-green-600';
    recommendations = [
      'الحفاظ على النظام الغذائي المتوازن',
      'ممارسة الرياضة بانتظام (150 دقيقة أسبوعياً)',
      'شرب كمية كافية من الماء',
      'النوم الكافي (7-9 ساعات يومياً)'
    ];
    riskFactors = [
      'مخاطر صحية منخفضة',
      'استمر في نمط الحياة الصحي'
    ];
  } else if (bmi >= 25 && bmi < 30) {
    category = 'زيادة في الوزن';
    categoryColor = 'text-yellow-600';
    recommendations = [
      'تقليل السعرات الحرارية بـ 500-750 سعرة يومياً',
      'زيادة النشاط البدني إلى 300 دقيقة أسبوعياً',
      'تناول المزيد من الخضروات والفواكه',
      'تجنب المشروبات السكرية والوجبات السريعة'
    ];
    riskFactors = [
      'زيادة خطر الإصابة بالسكري',
      'ارتفاع ضغط الدم',
      'أمراض القلب والأوعية الدموية',
      'مشاكل في المفاصل'
    ];
  } else {
    category = 'سمنة';
    categoryColor = 'text-red-600';
    recommendations = [
      'استشارة طبيب مختص فوراً',
      'وضع خطة إنقاص وزن تحت إشراف طبي',
      'ممارسة الرياضة تدريجياً',
      'تغيير نمط الحياة بشكل جذري'
    ];
    riskFactors = [
      'مخاطر عالية للإصابة بالسكري النوع الثاني',
      'أمراض القلب والسكتة الدماغية',
      'توقف التنفس أثناء النوم',
      'بعض أنواع السرطان',
      'مشاكل في الكبد والمرارة'
    ];
  }
  
  // حساب نطاق الوزن الصحي
  const healthyWeightRange = {
    min: Math.round(18.5 * heightInMeters * heightInMeters),
    max: Math.round(24.9 * heightInMeters * heightInMeters)
  };
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    categoryColor,
    healthyWeightRange,
    recommendations,
    riskFactors
  };
}

export function getBMITips(): string[] {
  return [
    'مؤشر كتلة الجسم هو مقياس تقريبي وليس دقيقاً 100%',
    'لا يأخذ في الاعتبار كتلة العضلات أو توزيع الدهون',
    'الرياضيون قد يكون لديهم BMI عالي بسبب العضلات',
    'كبار السن قد يحتاجون لمؤشر أعلى قليلاً',
    'استشر طبيبك للحصول على تقييم شامل'
  ];
}

export function getIdealWeightByAge(height: number, age: number, gender: 'male' | 'female'): number {
  const heightInMeters = height / 100;
  let idealBMI = 22; // BMI مثالي أساسي
  
  // تعديل حسب العمر
  if (age >= 65) {
    idealBMI = 23; // كبار السن يحتاجون وزن أعلى قليلاً
  } else if (age >= 50) {
    idealBMI = 22.5;
  }
  
  // تعديل حسب الجنس
  if (gender === 'female') {
    idealBMI -= 0.5; // النساء عادة يحتجن BMI أقل قليلاً
  }
  
  return Math.round(idealBMI * heightInMeters * heightInMeters);
}