import { Link } from 'react-router-dom';
import { usePreferencesStore } from '@/stores/preferences-store';

export function TopBar() {
  const { theme, setTheme, language, setLanguage } = usePreferencesStore();

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-secondary">
          开发者与测试人员工具箱
        </span>
        <Link
          to="/search"
          className="rounded-md px-2 py-1 text-sm text-text-secondary hover:bg-surface-muted"
          aria-label="搜索工具"
        >
          🔍
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-muted"
          aria-label={theme === 'light' ? '切换到深色主题' : '切换到浅色主题'}
        >
          {theme === 'light' ? '🌙 深色' : '☀️ 浅色'}
        </button>
        <button
          type="button"
          onClick={() => setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}
          className="rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-muted"
          aria-label={language === 'zh-CN' ? 'Switch to English' : '切换到简体中文'}
        >
          {language === 'zh-CN' ? 'EN' : '中文'}
        </button>
      </div>
    </header>
  );
}
