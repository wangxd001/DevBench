import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pin, Paperclip, X, Star } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favorites-store';
import { usePreferencesStore } from '@/stores/preferences-store';
import { TOOLS } from '@/tools/registry/tools';
import { ToolIcon } from '@/ui/ToolIcon';
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
                  <span className="flex items-center gap-1.5 text-sm font-medium text-text">
                    <ToolIcon icon={tool.icon} className="h-4 w-4 shrink-0 text-primary" />
                    {language === 'zh-CN' ? tool.name['zh-CN'] : tool.name['en-US']}
                  </span>
                  <span className="pl-6 text-xs text-text-secondary">
                    {language === 'zh-CN'
                      ? tool.description['zh-CN']
                      : tool.description['en-US']}
                  </span>
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => togglePinned(id)}
                    title={isPinned ? t('favorites.unpin') : t('favorites.pin')}
                    className="rounded p-1.5 text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={isPinned ? t('favorites.unpin') : t('favorites.pin')}
                  >
                    {isPinned ? (
                      <Pin className="h-4 w-4 text-primary" aria-hidden="true" />
                    ) : (
                      <Paperclip className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(id)}
                    className="rounded p-1.5 text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={t('favorites.remove')}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <Star
                    className="h-4 w-4 text-primary"
                    fill="currentColor"
                    aria-hidden="true"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
