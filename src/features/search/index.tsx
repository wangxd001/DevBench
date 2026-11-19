import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon } from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences-store';
import { TOOLS } from '@/tools/registry/tools';
import { CATEGORY_ICONS } from '@/ui/icon-map';
import { ToolIcon } from '@/ui/ToolIcon';
import type { ToolDefinition } from '@/tools/registry/types';
import { searchTools } from './search';

const toolIds = Object.keys(TOOLS) as Array<keyof typeof TOOLS>;
const allTools: ToolDefinition[] = toolIds
  .map((id) => TOOLS[id])
  .filter((t): t is ToolDefinition => t !== undefined);

export function SearchPage() {
  const { t } = useTranslation();
  const { language } = usePreferencesStore();
  const [params, setParams] = useSearchParams();
  const query = params.get('query') ?? '';
  const [input, setInput] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input from URL on mount and when URL changes
  useEffect(() => {
    setInput(query);
    inputRef.current?.focus();
  }, [query]);

  // Ctrl+K handled globally in AppShell

  const submit = useCallback(() => {
    setParams(input ? { query: input } : {}, { replace: true });
  }, [input, setParams]);

  const results = searchTools(query, allTools);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">{t('search.title')}</h1>

      <div className="relative mt-4">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder={t('search.placeholder')}
          aria-label={t('search.ariaLabel')}
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-text outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {query && (
        <p className="mt-2 text-xs text-text-secondary" aria-live="polite">
          {results.length}
          {t('search.resultCountSuffix')}
        </p>
      )}

      {query && results.length === 0 && (
        <div className="mt-6 rounded-lg border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-secondary">{t('search.noResult')}</p>
          <Link
            to="/tools"
            className="mt-2 inline-block text-sm text-primary underline"
          >
            {t('search.viewAll')}
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map(({ tool }) => {
            const CategoryIcon = CATEGORY_ICONS[tool.categoryId];
            return (
              <li key={tool.id}>
                <Link
                  to={tool.route}
                  className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
                >
                  <div className="flex items-center gap-2">
                    <ToolIcon icon={tool.icon} className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-text">
                      {language === 'zh-CN' ? tool.name['zh-CN'] : tool.name['en-US']}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs text-text-secondary">
                      <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {t(`nav.category.${tool.categoryId}`)}
                    </span>
                  </div>
                  <p className="mt-1 pl-6 text-xs text-text-secondary">
                    {language === 'zh-CN'
                      ? tool.description['zh-CN']
                      : tool.description['en-US']}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
