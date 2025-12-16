'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Save,
  Smartphone,
  Navigation,
  Loader2,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  enabled: boolean;
  order: number;
}

interface MobileSettings {
  bottomNavEnabled: boolean;
  hideOnScroll: boolean;
  showMoreMenu: boolean;
  floatingActionsEnabled: boolean;
  floatingActionsPosition: 'right' | 'left';
  navItems: NavItem[];
  moreMenuItems: NavItem[];
}

const defaultSettings: MobileSettings = {
  bottomNavEnabled: true,
  hideOnScroll: true,
  showMoreMenu: true,
  floatingActionsEnabled: true,
  floatingActionsPosition: 'right',
  navItems: [
    {
      id: 'home',
      name: 'الرئيسية',
      href: '/',
      icon: 'Home',
      enabled: true,
      order: 1,
    },
    {
      id: 'calculator',
      name: 'الحاسبة',
      href: '/#calculator',
      icon: 'Calculator',
      enabled: true,
      order: 2,
    },
    {
      id: 'tools',
      name: 'الأدوات',
      href: '/tools',
      icon: 'Wrench',
      enabled: true,
      order: 3,
    },
    {
      id: 'articles',
      name: 'المقالات',
      href: '/articles',
      icon: 'FileText',
      enabled: true,
      order: 4,
    },
  ],
  moreMenuItems: [
    {
      id: 'friends',
      name: 'الأصدقاء',
      href: '/friends',
      icon: 'User',
      enabled: true,
      order: 1,
    },
    {
      id: 'zodiac',
      name: 'البرج الصيني',
      href: '/chinese-zodiac',
      icon: 'Star',
      enabled: true,
      order: 2,
    },
    {
      id: 'events',
      name: 'أحداث تاريخية',
      href: '/historical-events',
      icon: 'Calendar',
      enabled: true,
      order: 3,
    },
    {
      id: 'about',
      name: 'عن الموقع',
      href: '/about',
      icon: 'Info',
      enabled: true,
      order: 4,
    },
    {
      id: 'contact',
      name: 'اتصل بنا',
      href: '/contact',
      icon: 'Mail',
      enabled: true,
      order: 5,
    },
    {
      id: 'privacy',
      name: 'الخصوصية',
      href: '/privacy',
      icon: 'Shield',
      enabled: true,
      order: 6,
    },
  ],
};

export default function MobileSettingsPage() {
  const [settings, setSettings] = useState<MobileSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/mobile-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/mobile-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' });
      } else {
        setMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setSaving(false);
    }
  };

  const toggleNavItem = (type: 'navItems' | 'moreMenuItems', id: string) => {
    setSettings((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      ),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              إعدادات الموبايل
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              تحكم في شريط التنقل السفلي والأزرار العائمة
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* شريط التنقل السفلي */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Navigation className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">شريط التنقل السفلي</h2>
            </div>

            <div className="space-y-4">
              {/* تفعيل الشريط */}
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                <span>تفعيل شريط التنقل السفلي</span>
                <input
                  type="checkbox"
                  checked={settings.bottomNavEnabled}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      bottomNavEnabled: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded text-primary"
                />
              </label>

              {/* إخفاء عند التمرير */}
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                <span>إخفاء عند التمرير للأسفل</span>
                <input
                  type="checkbox"
                  checked={settings.hideOnScroll}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      hideOnScroll: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded text-primary"
                />
              </label>

              {/* قائمة المزيد */}
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                <span>إظهار زر المزيد</span>
                <input
                  type="checkbox"
                  checked={settings.showMoreMenu}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      showMoreMenu: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded text-primary"
                />
              </label>
            </div>

            {/* عناصر التنقل الرئيسية */}
            <div className="mt-6">
              <h3 className="font-medium mb-3">عناصر التنقل الرئيسية</h3>
              <div className="space-y-2">
                {settings.navItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="flex-1">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.href}</span>
                    <button
                      onClick={() => toggleNavItem('navItems', item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.enabled
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                          : 'bg-gray-200 text-gray-400 dark:bg-gray-600'
                      }`}
                    >
                      {item.enabled ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* عناصر قائمة المزيد */}
            {settings.showMoreMenu && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">عناصر قائمة المزيد</h3>
                <div className="space-y-2">
                  {settings.moreMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                      <span className="flex-1">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.href}</span>
                      <button
                        onClick={() => toggleNavItem('moreMenuItems', item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.enabled
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                            : 'bg-gray-200 text-gray-400 dark:bg-gray-600'
                        }`}
                      >
                        {item.enabled ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* الأزرار العائمة */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-6">الأزرار العائمة</h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                <span>تفعيل الأزرار العائمة</span>
                <input
                  type="checkbox"
                  checked={settings.floatingActionsEnabled}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      floatingActionsEnabled: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded text-primary"
                />
              </label>

              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="block mb-2">موقع الأزرار</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="position"
                      checked={settings.floatingActionsPosition === 'right'}
                      onChange={() =>
                        setSettings((prev) => ({
                          ...prev,
                          floatingActionsPosition: 'right',
                        }))
                      }
                      className="text-primary"
                    />
                    <span>يمين</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="position"
                      checked={settings.floatingActionsPosition === 'left'}
                      onChange={() =>
                        setSettings((prev) => ({
                          ...prev,
                          floatingActionsPosition: 'left',
                        }))
                      }
                      className="text-primary"
                    />
                    <span>يسار</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}
