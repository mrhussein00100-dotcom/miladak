'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId?: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const id = gaId || process.env.NEXT_PUBLIC_GA_ID;
  
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}

type GtagFunction = (command: string, ...args: unknown[]) => void;

// Event tracking helper
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  const win = window as Window & { gtag?: GtagFunction };
  if (typeof window !== 'undefined' && win.gtag) {
    win.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Page view tracking
export function trackPageView(url: string) {
  const win = window as Window & { gtag?: GtagFunction };
  if (typeof window !== 'undefined' && win.gtag) {
    win.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
}
