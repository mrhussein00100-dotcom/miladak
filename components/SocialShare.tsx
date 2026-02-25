'use client';

import {
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  heading?: string;
}

export default function SocialShare({
  title,
  url,
  description,
  heading = 'شارك المقال',
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  // التأكد من أن الرابط كامل
  const fullUrl = url.startsWith('http') ? url : `https://miladak.com${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={18} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={18} />,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600 text-white',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={18} />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`,
      color: 'bg-blue-700 hover:bg-blue-800 text-white',
    },
    {
      name: 'Telegram',
      icon: <Share2 size={18} />, // Telegram uses a paper plane, Share2 is close enough or use Send
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-sky-600 hover:bg-sky-700 text-white',
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-purple-500/20 text-center shadow-sm">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Share2 className="text-purple-600 dark:text-purple-400" size={20} />
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{heading}</h3>
      </div>
      
      <div className="flex flex-nowrap sm:flex-wrap justify-center items-center gap-3 w-full overflow-x-auto py-2 scrollbar-hide">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-110 ${link.color}`}
            title={`مشاركة عبر ${link.name}`}
            aria-label={`مشاركة عبر ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          title="نسخ الرابط"
          aria-label="نسخ الرابط"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}
