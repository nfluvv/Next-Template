'use client';

import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const resolveTheme = (theme: Theme): ResolvedTheme =>
  theme === 'system' ? getSystemTheme() : theme;

const applyThemeClass = (resolved: ResolvedTheme) => {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
};

type ThemeState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  init: () => void;
  setTheme: (theme: Theme) => void;
  syncWithSystem: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Важно: SSR-safe initial state
  theme: 'system',
  resolvedTheme: 'light',

  init: () => {
    const stored = localStorage.getItem(STORAGE_KEY);

    const theme: Theme =
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : 'system';

    const resolved = resolveTheme(theme);

    // Не надо здесь повторно дёргать applyThemeClass().
    // theme-init уже сделал это до hydration.
    set({
      theme,
      resolvedTheme: resolved,
    });
  },

  setTheme: (theme) => {
    const resolved = resolveTheme(theme);

    localStorage.setItem(STORAGE_KEY, theme);
    applyThemeClass(resolved);

    set({
      theme,
      resolvedTheme: resolved,
    });
  },

  syncWithSystem: () => {
    if (get().theme !== 'system') return;

    const resolved = getSystemTheme();

    applyThemeClass(resolved);

    set({
      resolvedTheme: resolved,
    });
  },
}));