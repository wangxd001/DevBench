import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFavoritesStore } from '@/stores/favorites-store';
import { usePreferencesStore } from '@/stores/preferences-store';
import { TOOLS } from '@/tools/registry/tools';
import type { ToolId } from '@/tools/registry/types';
import { EmptyState } from '@/components/common/EmptyState';

export function FavoritesPage() {
  const { t } = useTranslation();
  const { language } = usePreferencesStore();
  const { favorites, pinned, toggleFavorite, togglePinned } = useFavoritesStore();

  const allFavorites = [...favorites];
  const pinnedSet = new Set(pinned);

  // Pinned first, then by addition order
  const sorted = [
    ...allFavorites.filter((id) => pinnedSet.has(id)),
    ...allFavorites.filter((id) => !pinnedSet.has(id)),
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">{t('nav.favorites')}</h1>
      {sorted.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={t('favorites.empty')} />
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {sorted.map((id) => {
            const tool = TOOLS[id as ToolId];
            if (!tool) return null;
            const isPinned = pinnedSet.has(id);
            return (
              <li key={id} className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
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
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => togglePinned(id)}
                    className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
                    aria-label={isPinned ? t('favorites.unpin') : t('favorites.pin')}
                  >
                    {isPinned ? '📌' : '📎'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(id)}
                    className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
                    aria-label={t('favorites.remove')}
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
