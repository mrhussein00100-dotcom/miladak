# المساهمة في ميلادك v2

نرحب بمساهماتكم في تطوير ميلادك v2!

## 🚀 كيفية المساهمة

### 1. Fork المشروع
```bash
git clone https://github.com/your-username/miladak-v2.git
cd miladak-v2
```

### 2. إعداد البيئة المحلية
```bash
npm install
npm run db:init
npm run dev
```

### 3. إنشاء branch جديد
```bash
git checkout -b feature/new-calculator
```

### 4. اختبار التغييرات
```bash
npm run test
npm run lint
npm run build
```

### 5. إرسال Pull Request
```bash
git add .
git commit -m "feat: add new calculator"
git push origin feature/new-calculator
```

## 📝 معايير الكود

### TypeScript
- استخدم TypeScript في جميع الملفات
- عرّف الأنواع بوضوح
- تجنب استخدام `any`

### React Components
```typescript
interface CalculatorProps {
  title: string;
  onCalculate: (result: number) => void;
}

export function Calculator({ title, onCalculate }: CalculatorProps) {
  // ...
}
```

## 🎯 أنواع المساهمات المرحب بها

- 🧮 أدوات حسابية جديدة
- 🐛 إصلاح الأخطاء
- 📚 تحسين الوثائق
- 🎨 تحسينات التصميم

## 🤝 قواعد السلوك

- كن محترماً ومهذباً
- ساعد الآخرين
- اقبل النقد البناء
