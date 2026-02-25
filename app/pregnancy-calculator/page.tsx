'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PregnancyCalculatorRedirect() {
  const router = useRouter();

  useEffect(() => {
    // إعادة التوجيه إلى الصفحة الجديدة
    router.replace('/tools/pregnancy-stages');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          جاري التحويل إلى حاسبة مراحل الحمل...
        </p>
      </div>
    </div>
  );
}
