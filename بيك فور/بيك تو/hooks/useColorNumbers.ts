'use client';

import { useState, useCallback } from 'react';
import {
  LuckyColorData,
  LuckyNumbersData,
  ColorsNumbersResult,
  UserInput,
  ValidationError,
  validateDate,
  fetchLuckyColor,
  getMonthName,
} from '@/lib/colorNumbersUtils';
import { getZodiacInfo } from '@/lib/calculations/zodiacCalculations';

interface UseColorNumbersReturn {
  result: ColorsNumbersResult | null;
  loading: boolean;
  error: string | null;
  validationErrors: ValidationError[];
  calculateColorsNumbers: (input: UserInput) => Promise<void>;
  clearResult: () => void;
}

// حساب الأرقام المحظوظة للأبراج الصينية باستخدام المكتبة الموجودة
const getChineseZodiacNumbers = (year: number): LuckyNumbersData => {
  const zodiacInfo = getZodiacInfo(year);

  return {
    numbers: zodiacInfo.luckyNumbers,
    zodiacAnimal: zodiacInfo.animal,
    zodiacColors: zodiacInfo.luckyColors,
    description: zodiacInfo.description,
  };
};

export const useColorNumbers = (): UseColorNumbersReturn => {
  const [result, setResult] = useState<ColorsNumbersResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  const calculateColorsNumbers = useCallback(async (input: UserInput) => {
    // إعادة تعيين الحالة
    setError(null);
    setValidationErrors([]);
    setResult(null);

    // التحقق من صحة المدخلات
    const errors = validateDate(input.day, input.month, input.year);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // جلب بيانات الألوان المحظوظة
      const luckyColor = await fetchLuckyColor(input.month);

      if (!luckyColor) {
        throw new Error('فشل في جلب بيانات الألوان المحظوظة');
      }

      // حساب الأرقام المحظوظة للبرج الصيني
      const luckyNumbers = getChineseZodiacNumbers(input.year);

      // إنشاء النتيجة النهائية
      const colorsNumbersResult: ColorsNumbersResult = {
        luckyColor,
        luckyNumbers,
        birthDate: input,
      };

      setResult(colorsNumbersResult);
    } catch (err) {
      console.error('Error calculating colors and numbers:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'حدث خطأ في حساب الألوان والأرقام المحظوظة'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setValidationErrors([]);
  }, []);

  return {
    result,
    loading,
    error,
    validationErrors,
    calculateColorsNumbers,
    clearResult,
  };
};
