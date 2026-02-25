'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // التحقق من موافقة المستخدم المحفوظة
    const consent = localStorage.getItem('cookieConsent');

    if (!consent) {
      // إظهار البانر بعد 4 ثواني (بعد شاشة الترحيب)
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 4000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    closeConsent();

    // تفعيل Google Analytics و AdSense
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    closeConsent();

    // تعطيل الكوكيز غير الضرورية
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  const closeConsent = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleAccept}
      />

      {/* Cookie Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-primary/20">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Cookie className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    🍪 نحن نستخدم ملفات تعريف الارتباط
                  </h3>
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك وعرض
                  إعلانات مخصصة من Google AdSense. بالمتابعة، أنت توافق على
                  استخدام ملفات تعريف الارتباط وفقاً لـ{' '}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    سياسة الخصوصية
                  </Link>
                  .
                </p>

                {/* Extra Info */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <Cookie className="w-3 h-3" />
                    ملفات أساسية
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    📊 تحليلات
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                    📢 إعلانات مخصصة
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  قبول الكل
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 whitespace-nowrap"
                >
                  الضروري فقط
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
