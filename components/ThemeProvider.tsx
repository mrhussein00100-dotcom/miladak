'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { ThemeMode } from '@/types';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark' | 'miladak';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  themes: ThemeMode[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'miladak-theme';
const THEMES: ThemeMode[] = ['system', 'light', 'dark', 'miladak'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<
    'light' | 'dark' | 'miladak'
  >('light');
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  // Resolve theme
  const resolveTheme = useCallback(
    (themeMode: ThemeMode): 'light' | 'dark' | 'miladak' => {
      if (themeMode === 'system') {
        return getSystemTheme();
      }
      return themeMode;
    },
    [getSystemTheme]
  );

  // Apply theme to DOM - تحسين لمنع CLS
  const applyTheme = useCallback((resolved: 'light' | 'dark' | 'miladak') => {
    const root = document.documentElement;
    // فقط أضف الـ class إذا لم يكن موجوداً
    if (!root.classList.contains(resolved)) {
      root.classList.remove('light', 'dark', 'miladak');
      root.classList.add(resolved);
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const colors = {
      light: '#FFF5F5',
      dark: '#0D0D1A',
      miladak: '#1A0A2E',
    };
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors[resolved]);
    }
  }, []);

  // Set theme
  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);

      try {
        localStorage.setItem(THEME_KEY, newTheme);
      } catch {
        console.warn('Failed to save theme preference');
      }
    },
    [resolveTheme, applyTheme]
  );

  // Toggle through themes
  const toggleTheme = useCallback(() => {
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  }, [theme, setTheme]);

  // Initialize
  useEffect(() => {
    setMounted(true);

    // Load saved theme
    try {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode;
      if (stored && THEMES.includes(stored)) {
        setThemeState(stored);
        const resolved = resolveTheme(stored);
        setResolvedTheme(resolved);
        applyTheme(resolved);
      } else {
        const resolved = resolveTheme('system');
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    } catch {
      const resolved = resolveTheme('system');
      setResolvedTheme(resolved);
      applyTheme(resolved);
    }
  }, [resolveTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const resolved = resolveTheme('system');
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, theme, resolveTheme, applyTheme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    themes: THEMES,
  };

  // Prevent flash
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      theme: 'system' as ThemeMode,
      resolvedTheme: 'light' as const,
      setTheme: () => {},
      toggleTheme: () => {},
      themes: THEMES,
    };
  }
  return context;
}

// Theme icons helper
export const themeIcons: Record<ThemeMode, string> = {
  system: '💻',
  light: '☀️',
  dark: '🌙',
  miladak: '🎂',
};

// Theme labels helper
export const themeLabels: Record<ThemeMode, string> = {
  system: 'تلقائي',
  light: 'فاتح',
  dark: 'ليلي',
  miladak: 'ميلادك',
};
