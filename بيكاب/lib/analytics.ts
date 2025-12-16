// Google Analytics 4 configuration and tracking functions

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Types for analytics events
interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  label: 'web-vital' | 'custom';
}

// Check if GA is available
const isGAAvailable = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    GA_TRACKING_ID !== 'G-XXXXXXXXXX'
  );
};

// Page view tracking
export const pageview = (url: string) => {
  if (!isGAAvailable()) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    send_page_view: true,
  });
};

// Event tracking
export const event = ({ action, category, label, value }: GAEvent) => {
  if (!isGAAvailable()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Calculator usage tracking
export const trackCalculatorUse = (
  calculatorType: 'age' | 'pregnancy' | 'date-converter'
) => {
  event({
    action: 'calculator_use',
    category: 'engagement',
    label: calculatorType,
  });
};

// Article reading tracking
export const trackArticleRead = (articleSlug: string, readingTime?: number) => {
  event({
    action: 'article_read',
    category: 'content',
    label: articleSlug,
    value: readingTime,
  });
};

// Social sharing tracking
export const trackSocialShare = (platform: string, content: string) => {
  event({
    action: 'social_share',
    category: 'engagement',
    label: `${platform}_${content}`,
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount,
  });
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string) => {
  event({
    action: 'error',
    category: 'technical',
    label: `${errorType}: ${errorMessage}`,
  });
};

// Performance tracking
export const trackPerformance = (metric: string, value: number) => {
  event({
    action: 'performance_metric',
    category: 'technical',
    label: metric,
    value: Math.round(value),
  });
};

// Web Vitals tracking
export const reportWebVitals = (metric: WebVitalMetric) => {
  // Send to Google Analytics
  if (metric.label === 'web-vital') {
    event({
      action: metric.name,
      category: 'Web Vitals',
      label: metric.id,
      value: Math.round(metric.value),
    });
  }

  // Also track performance metrics
  trackPerformance(metric.name, metric.value);

  // Store in localStorage for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);

    try {
      const existingMetrics = JSON.parse(
        localStorage.getItem('webVitals') || '[]'
      );
      existingMetrics.push({
        ...metric,
        timestamp: Date.now(),
        url: window.location.pathname,
      });

      // Keep only last 50 metrics
      if (existingMetrics.length > 50) {
        existingMetrics.splice(0, existingMetrics.length - 50);
      }

      localStorage.setItem('webVitals', JSON.stringify(existingMetrics));
    } catch (error) {
      console.error('Failed to store web vitals:', error);
    }
  }
};

// User engagement tracking
export const trackEngagement = (
  action: string,
  details?: Record<string, any>
) => {
  event({
    action,
    category: 'user_engagement',
    label: details ? JSON.stringify(details) : undefined,
  });
};

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number) => {
  event({
    action: 'conversion',
    category: 'business',
    label: conversionType,
    value,
  });
};

// Initialize GA4
export const initGA = () => {
  if (
    typeof window === 'undefined' ||
    !GA_TRACKING_ID ||
    GA_TRACKING_ID === 'G-XXXXXXXXXX'
  ) {
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
  });

  console.log('Google Analytics initialized:', GA_TRACKING_ID);
};

// Declare global gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
