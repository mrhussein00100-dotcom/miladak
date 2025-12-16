'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatArabicNumber } from '@/lib/formatArabic';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

interface CalorieResult {
  bmr: number;
  maintenance: number;
  weightLoss: number;
  weightGain: number;
}

const activityLevels: { value: ActivityLevel; label: string; multiplier: number }[] = [
  { value: 'sedentary', label: 'قليل الحركة (مكتبي)', multiplier: 1.2 },
  { value: 'light', label: 'نشاط خفيف (1-3 أيام/أسبوع)', multiplier: 1.375 },
  { value: 'moderate', label: 'نشاط متوسط (3-5 أيام/أسبوع)', multiplier: 1.55 },
  { value: 'active', label: 'نشاط عالي (6-7 أيام/أسبوع)', multiplier: 1.725 },
  { value: 'very_active', label: 'نشاط مكثف (رياضي)', multiplier: 1.9 },
];

export function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [error, setError] = useState('');

  const calculateCalories = () => {
    setError('');
    
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) {
      setError('يرجى إدخال جميع البيانات بشكل صحيح');
      return;
    }
    
    if (ageNum < 15 || ageNum > 100) {
      setError('يرجى إدخال عمر صحيح (15-100)');
      return;
    }
    
    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }
    
    const activityMultiplier = activityLevels.find(a => a.value === activity)?.multiplier || 1.55;
    const maintenance = Math.round(bmr * activityMultiplier);
    
    setResult({
      bmr: Math.round(bmr),
      maintenance,
      weightLoss: Math.round(maintenance - 500),
      weightGain: Math.round(maintenance + 500),
    });
  };

  const handleReset = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">أدخل بياناتك</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">الجنس</label>
            <div className="flex gap-4">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 p-3 rounded-xl border transition-colors ${
                  gender === 'male' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'border-border hover:bg-muted'
                }`}
              >
                👨 ذكر
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 p-3 rounded-xl border transition-colors ${
                  gender === 'female' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'border-border hover:bg-muted'
                }`}
              >
                👩 أنثى
              </button>
            </div>
          </div>
          
          <Input
            type="number"
            label="العمر (سنة)"
            placeholder="مثال: 25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          
          <Input
            type="number"
            label="الطول (سم)"
            placeholder="مثال: 170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          
          <Input
            type="number"
            label="الوزن (كجم)"
            placeholder="مثال: 70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          
          {/* Activity Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">مستوى النشاط</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full p-3 rounded-xl border border-border bg-background text-right"
            >
              {activityLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={calculateCalories}>
              احسب السعرات
            </Button>
            {result && (
              <Button variant="outline" onClick={handleReset}>
                إعادة تعيين
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">احتياجاتك اليومية من السعرات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CalorieBox
                label="معدل الأيض الأساسي"
                value={result.bmr}
                description="السعرات التي يحرقها جسمك في الراحة"
                color="blue"
              />
              <CalorieBox
                label="للحفاظ على الوزن"
                value={result.maintenance}
                description="السعرات اللازمة للحفاظ على وزنك الحالي"
                color="green"
              />
              <CalorieBox
                label="لخسارة الوزن"
                value={result.weightLoss}
                description="لخسارة ~0.5 كجم أسبوعياً"
                color="yellow"
              />
              <CalorieBox
                label="لزيادة الوزن"
                value={result.weightGain}
                description="لزيادة ~0.5 كجم أسبوعياً"
                color="purple"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CalorieBox({ 
  label, 
  value, 
  description, 
  color 
}: { 
  label: string; 
  value: number; 
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
  };

  return (
    <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold text-primary">
        {formatArabicNumber(value)}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{description}</div>
    </div>
  );
}
