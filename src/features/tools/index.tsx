import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences-store';
import { useFavoritesStore } from '@/stores/favorites-store';
import { TOOLS } from '@/tools/registry/tools';
import { CATEGORY_IDS } from '@/tools/registry/constants';
import { CATEGORY_ICONS } from '@/ui/icon-map';
import { ToolIcon } from '@/ui/ToolIcon';
import type { ToolId, CategoryId, ToolDefinition } from '@/tools/registry/types';

const toolIds = Object.keys(TOOLS) as ToolId[];
const allTools: ToolDefinition[] = toolIds
  .map((id) => TOOLS[id])
  .filter((t): t is ToolDefinition => t !== undefined);

export function ToolsPage() {
  const { t } = useTranslation();
  const { language } = usePreferencesStore();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const categories = CATEGORY_IDS.map((catId) => ({
    id: catId as CategoryId,
    name: t(`nav.category.${catId}`),
    tools: allTools.filter((tool) => tool.categoryId === catId),
  }));

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold">{t('nav.tools')}</h1>

      <nav aria-label={t('tools.browseByCategory')}>
        {categories.map((cat) => {
          const CategoryIcon = CATEGORY_ICONS[cat.id];
          return (
            <section key={cat.id} className="mt-6">
              <h2 className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <CategoryIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                {cat.name}
                <span className="text-xs text-text-muted">({cat.tools.length})</span>
              </h2>
              {cat.tools.length === 0 ? (
                <p className="mt-2 text-sm text-text-muted">{t('tools.emptyCategory')}</p>
              ) : (
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {cat.tools.map((tool) => {
                    const isFav = favorites.includes(tool.id);
                    return (
                      <li key={tool.id}>
                        <div className="group relative flex items-start justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary">
                          <Link
                            to={tool.route}
                            className="flex min-w-0 items-center gap-2.5 rounded after:absolute after:inset-0 after:rounded-lg focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
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
                          <button
                            type="button"
                            onClick={() => toggleFavorite(tool.id)}
                            aria-pressed={isFav}
                            aria-label={isFav ? t('favorites.remove') : t('favorites.add')}
                            className="relative z-10 ml-3 shrink-0 rounded p-1 text-text-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <Star
                              className="h-4 w-4"
                              fill={isFav ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </nav>
    </div>
  );
}
