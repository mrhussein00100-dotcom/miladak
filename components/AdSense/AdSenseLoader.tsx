'use client';

import { useEffect, useState } from 'react';

interface AdSenseLoaderProps {
  clientId?: string;
}

/**
 * مكون لتحميل AdSense بشكل كسول
 * يتم التحميل بعد requestIdleCallback أو بعد 2 ثانية
 * لتحسين أداء الصفحة وتقليل Render Blocking
 */
export default function AdSenseLoader({ clientId }: AdSenseLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // التحقق من وجود client ID
    const adsenseClient = clientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    if (!adsenseClient || loaded) return;

    // دالة تحميل AdSense
    const loadAdSense = () => {
      // التحقق من عدم وجود السكريبت مسبقاً
      if (document.querySelector('script[src*="adsbygoogle"]')) {
        setLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient.trim()}`;
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        setLoaded(true);
      };

      script.onerror = () => {
        setError(true);
        console.warn('AdSense: فشل تحميل السكريبت');
      };

      document.head.appendChild(script);
    };

    // تحميل كسول باستخدام requestIdleCallback أو setTimeout
    if ('requestIdleCallback' in window) {
      const idleCallbackId = requestIdleCallback(loadAdSense, {
        timeout: 3000,
      });
      return () => cancelIdleCallback(idleCallbackId);
    } else {
      // fallback للمتصفحات التي لا تدعم requestIdleCallback
      const timeoutId = setTimeout(loadAdSense, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [clientId, loaded]);

  // لا نعرض أي شيء - هذا المكون فقط لتحميل السكريبت
  return null;
}
