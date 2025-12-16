'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-3xl font-bold">حدث خطأ</h1>
        <p className="text-muted-foreground max-w-md">
          عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>المحاولة مرة أخرى</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
