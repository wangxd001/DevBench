import i18n, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

let initPromise: Promise<I18nInstance> | null = null;

/**
 * 初始化 i18next。多次调用复用同一个 Promise，避免 StrictMode 下重复 init。
 */
export function initI18n(): Promise<I18nInstance> {
  if (!initPromise) {
    initPromise = i18n
      .use(initReactI18next)
      .init({
        resources: {
          'zh-CN': { translation: zhCN },
          'en-US': { translation: enUS },
        },
        lng: 'zh-CN',
        fallbackLng: 'zh-CN',
        interpolation: { escapeValue: false },
        returnNull: false,
      })
      .then(() => i18n);
  }
  return initPromise;
}
