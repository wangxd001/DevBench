import { create } from 'zustand';
import type { ThemeMode, Locale } from '@/types';

const STORAGE_KEY = 'devbench.preferences';

interface PreferencesState {
  theme: ThemeMode;
  language: Locale;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Locale) => void;
}

function loadPreferences(): { theme: ThemeMode; language: Locale } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { theme: 'light', language: 'zh-CN' };
    const parsed = JSON.parse(raw);
    if (typeof parsed.theme !== 'string' || !['light', 'dark'].includes(parsed.theme)) {
      return { theme: 'light', language: 'zh-CN' };
    }
    if (typeof parsed.language !== 'string' || !['zh-CN', 'en-US'].includes(parsed.language)) {
      return { theme: parsed.theme as ThemeMode, language: 'zh-CN' };
    }
    return { theme: parsed.theme, language: parsed.language };
  } catch {
    return { theme: 'light', language: 'zh-CN' };
  }
}

function savePreferences(state: { theme: ThemeMode; language: Locale }): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 写入失败不影响核心功能
  }
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...loadPreferences(),
  setTheme: (theme) => {
    set({ theme });
    savePreferences(get());
    document.documentElement.setAttribute('data-theme', theme);
  },
  setLanguage: (language) => {
    set({ language });
    savePreferences(get());
  },
}));
