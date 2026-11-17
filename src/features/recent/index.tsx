import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRecentToolsStore } from '@/stores/recent-tools-store';
import { usePreferencesStore } from '@/stores/preferences-store';
import { TOOLS } from '@/tools/registry/tools';
import type { ToolId } from '@/tools/registry/types';
import { EmptyState } from '@/components/common/EmptyState';

export function RecentPage() {
  const { t } = useTranslation();
  const { language } = usePreferencesStore();
  const { recent, clearRecent } = useRecentToolsStore();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('nav.recent')}</h1>
        {recent.length > 0 && (
          <button
            type="button"
            onClick={clearRecent}
            className="rounded px-3 py-1 text-xs text-text-secondary hover:bg-surface-muted"
          >
            {t('recent.clear')}
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={t('recent.empty')} />
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {recent.map(({ toolId }) => {
            const tool = TOOLS[toolId as ToolId];
            if (!tool) return null;
            return (
              <li key={toolId} className="rounded-lg border border-border bg-surface p-4">
                <Link
                  to={tool.route}
                  className="flex flex-col gap-0.5 transition-colors hover:text-primary"
                >
                  <span className="text-sm font-medium text-text">
                    {language === 'zh-CN' ? tool.name['zh-CN'] : tool.name['en-US']}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {language === 'zh-CN'
                      ? tool.description['zh-CN']
                      : tool.description['en-US']}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
