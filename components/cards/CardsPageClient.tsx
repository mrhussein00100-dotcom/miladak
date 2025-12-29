'use client';

import { useEffect } from 'react';
import ModernCardGenerator from './ModernCardGenerator';

// تحميل الخطوط الإضافية للبطاقات فقط عند الحاجة
const CARD_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Almarai:wght@400;700;800&family=Changa:wght@400;600;700&family=Lateef:wght@400;700&family=Scheherazade+New:wght@400;700&family=Harmattan:wght@400;600;700&display=swap';

export default function CardsPageClient() {
  useEffect(() => {
    // تحميل الخطوط الإضافية للبطاقات عند فتح الصفحة
    const existingLink = document.querySelector(
      `link[href="${CARD_FONTS_URL}"]`
    );
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CARD_FONTS_URL;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }, []);

  return <ModernCardGenerator />;
}
