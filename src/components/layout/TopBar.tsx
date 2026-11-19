import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Moon, Sun } from 'lucide-react';
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
          title={t('search.ariaLabel')}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t('search.ariaLabel')}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <kbd
            className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-xs text-text-secondary"
            aria-hidden="true"
          >
            {t('search.hint')}
          </kbd>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={theme === 'light' ? t('theme.toggleToDark') : t('theme.toggleToLight')}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Sun className="h-4 w-4" aria-hidden="true" />
          )}
          {theme === 'light' ? t('theme.dark') : t('theme.light')}
        </button>
        <button
          type="button"
          onClick={() => setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}
          className="rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={language === 'zh-CN' ? t('language.switchToEn') : t('language.switchToZh')}
        >
          {language === 'zh-CN' ? 'EN' : t('language.shortZh')}
        </button>
      </div>
    </header>
  );
}
