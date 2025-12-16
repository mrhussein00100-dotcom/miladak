'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatArabicNumber } from '@/lib/formatArabic';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  healthyWeightRange: { min: number; max: number };
}

export function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState('');

  const calculateBMI = () => {
    setError('');
    
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setError('يرجى إدخال قيم صحيحة للطول والوزن');
      return;
    }
    
    if (h < 50 || h > 300) {
      setError('يرجى إدخال طول صحيح (50-300 سم)');
      return;
    }
    
    if (w < 10 || w > 500) {
      setError('يرجى إدخال وزن صحيح (10-500 كجم)');
      return;
    }
    
    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    
    let category: string;
    let categoryColor: string;
    
    if (bmi < 18.5) {
      category = 'نقص في الوزن';
      categoryColor = 'text-blue-600';
    } else if (bmi < 25) {
      category = 'وزن طبيعي';
      categoryColor = 'text-green-600';
    } else if (bmi < 30) {
      category = 'زيادة في الوزن';
      categoryColor = 'text-yellow-600';
    } else {
      category = 'سمنة';
      categoryColor = 'text-red-600';
    }
    
    // Calculate healthy weight range
    const healthyWeightRange = {
      min: Math.round(18.5 * heightInMeters * heightInMeters),
      max: Math.round(24.9 * heightInMeters * heightInMeters),
    };
    
    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      categoryColor,
      healthyWeightRange,
    });
  };

  const handleReset = () => {
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
          <Input
            type="number"
            label="الطول (سم)"
            placeholder="مثال: 170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            error={error && !height ? error : undefined}
          />
          
          <Input
            type="number"
            label="الوزن (كجم)"
            placeholder="مثال: 70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            error={error && height ? error : undefined}
          />
          
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={calculateBMI}>
              احسب BMI
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
            <CardTitle className="text-center">النتيجة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {formatArabicNumber(result.bmi)}
              </div>
              <div className={`text-xl font-semibold ${result.categoryColor}`}>
                {result.category}
              </div>
            </div>
            
            {/* BMI Scale */}
            <div className="relative h-4 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full">
              <div 
                className="absolute top-0 w-3 h-6 bg-black rounded-full transform -translate-x-1/2 -translate-y-1"
                style={{ 
                  left: `${Math.min(Math.max((result.bmi - 15) / 25 * 100, 0), 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-xl text-center">
              <div className="text-sm text-muted-foreground mb-1">الوزن الصحي لطولك</div>
              <div className="font-semibold">
                {formatArabicNumber(result.healthyWeightRange.min)} - {formatArabicNumber(result.healthyWeightRange.max)} كجم
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
