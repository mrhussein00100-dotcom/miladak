'use client';

import Link from 'next/link';
import { Heart, ExternalLink } from 'lucide-react';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* حقوق النشر */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>© {currentYear}</span>
          <span className="text-purple-400 font-semibold">ميلادك</span>
          <span>- لوحة التحكم</span>
        </div>

        {/* روابط سريعة */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-gray-400 hover:text-purple-400 text-sm transition-colors"
          >
            <span>زيارة الموقع</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <span className="text-gray-700">|</span>
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            صُنع بـ <Heart className="w-3 h-3 text-red-500 fill-red-500" /> في
            مصر
          </span>
        </div>

        {/* معلومات النظام */}
        <div className="text-gray-500 text-xs">الإصدار 2.0.0</div>
      </div>
    </footer>
  );
}
