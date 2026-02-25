'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Copy, Heart, Star } from 'lucide-react';

interface QuickActionsProps {
  onDownload: () => void;
  onShare: () => void;
  onCopy: () => void;
  isGenerating?: boolean;
  compact?: boolean;
}

export default function QuickActions({
  onDownload,
  onShare,
  onCopy,
  isGenerating = false,
  compact = false,
}: QuickActionsProps) {
  const actions = [
    {
      id: 'download',
      label: compact ? 'حمّل' : 'تحميل البطاقة',
      icon: Download,
      onClick: onDownload,
      className: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      disabled: isGenerating,
    },
    {
      id: 'share',
      label: compact ? 'واتساب' : 'مشاركة واتساب',
      icon: Share2,
      onClick: onShare,
      className: 'bg-gradient-to-r from-green-500 to-emerald-500',
      disabled: false,
    },
    {
      id: 'copy',
      label: compact ? 'نسخ' : 'نسخ النص',
      icon: Copy,
      onClick: onCopy,
      className: 'bg-gradient-to-r from-gray-500 to-gray-600',
      disabled: false,
    },
  ];

  if (compact) {
    return (
      <div className="flex gap-2 justify-center">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`px-3 py-2 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-all disabled:opacity-50 ${action.className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <action.icon size={16} />
            {action.label}
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Primary Action */}
      <motion.button
        onClick={onDownload}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Download size={20} />
        {isGenerating ? 'جاري التحميل...' : 'تحميل البطاقة 📥'}
      </motion.button>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          onClick={onShare}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 size={18} />
          واتساب
        </motion.button>
        <motion.button
          onClick={onCopy}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Copy size={18} />
          نسخ النص
        </motion.button>
      </div>

      {/* Additional Actions */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <Heart size={16} className="text-pink-500" />
          <span>إجراءات إضافية</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Star size={16} />
            <span>حفظ كمفضل</span>
          </motion.button>
          <motion.button
            className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={16} />
            <span>حفظ PDF</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
