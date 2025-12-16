'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import ColorNumbersResults from '@/components/enhanced/ColorNumbersResults';
import { useColorNumbers } from '@/hooks/useColorNumbers';
import { UserInput } from '@/lib/colorNumbersUtils';

/**
 * Colors and Numbers Page Component
 * Feature: colors-numbers-page
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 3.1, 4.1, 5.1
 */

export default function ColorsNumbersPageClient() {
  const [userInput, setUserInput] = useState<UserInput>({
    day: 0,
    month: 0,
    year: 0,
  });

  const {
    result,
    loading,
    error,
    validationErrors,
    calculateColorsNumbers,
    clearResult,
  } = useColorNumbers();

  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = (field: keyof UserInput, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setUserInput((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleCalculate = async () => {
    await calculateColorsNumbers(userInput);
  };

  const handleShare = async (platform: string) => {
    // سيتم التعامل مع المشاركة في مكون ColorNumbersResults
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getFieldError = (field: keyof UserInput) => {
    return validationErrors.find((error) => error.field === field)?.message;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🎨 الألوان والأرقام المحظوظة
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اكتشف ألوانك وأرقامك المحظوظة بناءً على تاريخ ميلادك وبرجك الصيني
          </p>
        </div>

        {/* Date Input Form */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              أدخل تاريخ ميلادك
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Day Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اليوم
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={userInput.day || ''}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg text-center text-lg font-medium
                  ${
                    getFieldError('day')
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-purple-500'
                  }
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="يوم"
                />
                {getFieldError('day') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getFieldError('day')}
                  </p>
                )}
              </div>

              {/* Month Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الشهر
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={userInput.month || ''}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg text-center text-lg font-medium
                  ${
                    getFieldError('month')
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-purple-500'
                  }
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="شهر"
                />
                {getFieldError('month') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getFieldError('month')}
                  </p>
                )}
              </div>

              {/* Year Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  السنة
                </label>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={userInput.year || ''}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg text-center text-lg font-medium
                  ${
                    getFieldError('year')
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-purple-500'
                  }
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="سنة"
                />
                {getFieldError('year') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getFieldError('year')}
                  </p>
                )}
              </div>
            </div>

            {/* Calculate Button */}
            <div className="text-center">
              <button
                onClick={handleCalculate}
                disabled={
                  !userInput.day ||
                  !userInput.month ||
                  !userInput.year ||
                  loading
                }
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 
                text-white font-medium rounded-lg transition-colors
                disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {loading && (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                )}
                {loading ? 'جاري الحساب...' : 'احسب الألوان والأرقام المحظوظة'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Copy Success Message */}
            {copySuccess && (
              <div className="mt-4 text-center">
                <p className="text-green-600 dark:text-green-400 text-sm">
                  ✅ تم نسخ النتائج بنجاح!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <ColorNumbersResults result={result} onShare={handleShare} />
        )}
      </div>
    </div>
  );
}
