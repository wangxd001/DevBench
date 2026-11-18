import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePreferencesStore } from '@/stores/preferences-store';

export function TopBar() {
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage } = usePreferencesStore();

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-2">
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-secondary">
          {t('app.subtitle')}
        </span>
        <Link
          to="/search"
          className="rounded-md px-2 py-1 text-sm text-text-secondary hover:bg-surface-muted"
          aria-label={t('search.ariaLabel')}
        >
          🔍
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-muted"
          aria-label={theme === 'light' ? t('theme.toggleToDark') : t('theme.toggleToLight')}
        >
          {theme === 'light' ? `🌙 ${t('theme.dark')}` : `☀️ ${t('theme.light')}`}
        </button>
        <button
          type="button"
          onClick={() => setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}
          className="rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-muted"
          aria-label={language === 'zh-CN' ? t('language.switchToEn') : t('language.switchToZh')}
        >
          {language === 'zh-CN' ? 'EN' : t('language.shortZh')}
        </button>
      </div>
    </header>
  );
}
