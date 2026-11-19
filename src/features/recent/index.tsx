import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { useRecentToolsStore } from '@/stores/recent-tools-store';
import { usePreferencesStore } from '@/stores/preferences-store';
import { TOOLS } from '@/tools/registry/tools';
import { ToolIcon } from '@/ui/ToolIcon';
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
            className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
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
              <li key={toolId} className="relative rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary">
                <Link
                  to={tool.route}
                  className="flex min-w-0 items-center gap-2.5 transition-colors after:absolute after:inset-0 after:rounded-lg hover:text-primary focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
                >
                  <ToolIcon icon={tool.icon} className="h-6 w-6 shrink-0 text-primary" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium text-text">
                      {language === 'zh-CN' ? tool.name['zh-CN'] : tool.name['en-US']}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {language === 'zh-CN'
                        ? tool.description['zh-CN']
                        : tool.description['en-US']}
                    </span>
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
