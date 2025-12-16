'use client';

import { useEffect, useRef, useState, useId } from 'react';

interface AdSenseSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
    adsbygooleLoaded?: Set<string>;
  }
}

export function AdSenseSlot({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
}: AdSenseSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const uniqueId = useId();
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !adRef.current || isLoaded) return;

    // تتبع الإعلانات المحملة لمنع التكرار
    if (typeof window !== 'undefined') {
      window.adsbygooleLoaded = window.adsbygooleLoaded || new Set();

      // تحقق إذا كان هذا الإعلان محمل مسبقاً
      const adKey = `${slot}-${uniqueId}`;
      if (window.adsbygooleLoaded.has(adKey)) {
        setIsLoaded(true);
        return;
      }

      // تحقق إذا كان العنصر يحتوي على إعلان بالفعل
      const insElement = adRef.current;
      if (
        insElement &&
        insElement.getAttribute('data-adsbygoogle-status') === 'done'
      ) {
        setIsLoaded(true);
        return;
      }

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        window.adsbygooleLoaded.add(adKey);
        setIsLoaded(true);
      } catch (error) {
        // تجاهل أخطاء AdSense في بيئة التطوير
        if (process.env.NODE_ENV === 'development') {
          console.log('AdSense: تجاهل الخطأ في بيئة التطوير');
        } else {
          console.error('AdSense error:', error);
        }
        setIsLoaded(true);
      }
    }
  }, [client, isLoaded, slot, uniqueId]);

  // لا تعرض شيء إذا لم يكن هناك client ID
  if (!client) {
    return null;
  }

  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// ============================================
// مكونات الإعلانات الجاهزة للاستخدام
// ============================================

// إعلان أعلى الصفحة (Leaderboard)
export function HeaderAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto py-2 ${className}`}>
      <AdSenseSlot
        slot={process.env.NEXT_PUBLIC_AD_SLOT_HEADER || '1234567890'}
        format="horizontal"
      />
    </div>
  );
}

// إعلان الشريط الجانبي
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`sticky top-20 ${className}`}>
      <AdSenseSlot
        slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || '1234567891'}
        format="rectangle"
        style={{ minHeight: '250px' }}
      />
    </div>
  );
}

// إعلان داخل المحتوى
export function InContentAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-6 ${className}`}>
      <AdSenseSlot
        slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT || '1234567892'}
        format="fluid"
      />
    </div>
  );
}

// إعلان بين المقالات
export function InFeedAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-4 ${className}`}>
      <AdSenseSlot
        slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_FEED || '1234567893'}
        format="fluid"
        style={{ minHeight: '100px' }}
      />
    </div>
  );
}

// إعلان أسفل الصفحة
export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto py-4 ${className}`}>
      <AdSenseSlot
        slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '1234567894'}
        format="horizontal"
      />
    </div>
  );
}

// إعلان مربع (للأدوات)
export function SquareAd({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <AdSenseSlot
        slot={process.env.NEXT_PUBLIC_AD_SLOT_SQUARE || '1234567895'}
        format="rectangle"
        style={{ minWidth: '300px', minHeight: '250px' }}
      />
    </div>
  );
}
