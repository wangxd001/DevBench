import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';
import { initI18n } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences-store';

export function GlobalProviders({ children }: { children: ReactNode }) {
  const theme = usePreferencesStore((state) => state.theme);
  const language = usePreferencesStore((state) => state.language);
  const [i18n, setI18n] = useState<I18nInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    void initI18n().then((instance) => {
      if (!cancelled) setI18n(instance);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 同步主题到根元素，刷新后保持用户选择
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 同步语言到 i18next，切换语言后立即重新渲染文案
  useEffect(() => {
    if (i18n && i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  if (!i18n) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
