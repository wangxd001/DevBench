import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { searchStatusCodes } from "./core";

const CATEGORIES = ["1xx", "2xx", "3xx", "4xx", "5xx"] as const;

export function HttpStatusCodes() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchStatusCodes(query), [query]);
  const isZh = i18n.language === "zh-CN";

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const cat of CATEGORIES) {
      map.set(cat, []);
    }
    for (const entry of results) {
      const cat = String(Math.floor(entry.code / 100) * 100) + "x";
      map.get(cat)?.push(entry);
    }
    return map;
  }, [results]);

  return (
    <ToolPageLayout
      title={t("tools.http-status-codes.name")}
      description={t("tools.http-status-codes.description")}
      category={t("nav.category.http")}
    >
      <div className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("tools.http-status-codes.search")}
          className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
          aria-label={t("tools.http-status-codes.search")}
        />

        {results.length === 0 ? (
          <div className="text-sm text-text-muted">{t("tools.http-status-codes.empty")}</div>
        ) : (
          <div className="space-y-4">
            {CATEGORIES.map((cat) => {
              const items = grouped.get(cat) || [];
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <h2 className="text-sm font-medium text-text-secondary">{t(`tools.http-status-codes.category.${cat}`)}</h2>
                  <ul className="mt-2 space-y-1">
                    {items.map((entry) => (
                      <li key={entry.code} className="flex gap-3 rounded-md border border-border bg-surface p-2 text-sm">
                        <span className="font-mono text-primary">{entry.code}</span>
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-text-secondary">{isZh ? entry.description.zh : entry.description.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
