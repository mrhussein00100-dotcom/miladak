# دليل البدء السريع - ميلادك v2

## ⚡ البدء في 5 دقائق

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd miladak_v2
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد قاعدة البيانات
```bash
npm run db:init
```

### 4. تشغيل الخادم المحلي
```bash
npm run dev
```

### 5. فتح المتصفح
افتح [http://localhost:3000](http://localhost:3000)

## 🎯 الأوامر الأساسية

```bash
# التطوير
npm run dev          # تشغيل خادم التطوير
npm run build        # بناء المشروع للإنتاج
npm run start        # تشغيل المشروع المبني

# الاختبارات
npm run test         # تشغيل الاختبارات
npm run test:ui      # واجهة الاختبارات

# قاعدة البيانات
npm run db:init      # إعداد قاعدة البيانات

# فحص الكود
npm run lint         # فحص الكود
```

## 📁 الملفات المهمة

- `app/page.tsx` - الصفحة الرئيسية
- `components/AgeCalculator.tsx` - حاسبة العمر الرئيسية
- `lib/calculations/ageCalculations.ts` - منطق الحسابات
- `app/globals.css` - الأنماط العامة
- `tailwind.config.ts` - إعدادات Tailwind

## 🛠️ إضافة أداة جديدة

### 1. إنشاء المكون
```typescript
// components/tools/NewCalculator.tsx
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function NewCalculator() {
  const [result, setResult] = useState<number | null>(null);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>حاسبة جديدة</CardTitle>
      </CardHeader>
      <CardContent>
        {/* محتوى الحاسبة */}
      </CardContent>
    </Card>
  );
}
```

### 2. إنشاء الصفحة
```typescript
// app/tools/new-calculator/page.tsx
import { Metadata } from 'next';
import { NewCalculator } from '@/components/tools/NewCalculator';

export const metadata: Metadata = {
  title: 'حاسبة جديدة',
  description: 'وصف الحاسبة الجديدة',
};

export default function NewCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">حاسبة جديدة</h1>
      <NewCalculator />
    </div>
  );
}
```

## 🚀 النشر السريع

### على Vercel
```bash
npm i -g vercel
vercel --prod
```

## 🔧 استكشاف الأخطاء

**خطأ في قاعدة البيانات:**
```bash
rm -f data/miladak.db
npm run db:init
```

**مشاكل في التبعيات:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---
**مرحباً بك في مجتمع ميلادك!** 🎉
