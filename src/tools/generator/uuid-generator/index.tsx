import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { generateUuid } from "./core";

export function UuidGenerator() {
  const { t } = useTranslation();
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    setError(null);
    setCopied(false);
    try {
      setResults(generateUuid(count));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [count]);

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(results.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("common.copyError"));
    }
  }, [results, t]);

  const handleCopyOne = useCallback(async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("common.copyError"));
    }
  }, [t]);

  return (
    <ToolPageLayout
      title={t("tools.uuid-generator.name")}
      description={t("tools.uuid-generator.description")}
      category={t("nav.category.generator")}
      relatedTools={[
        { id: "random-string-generator", name: t("tools.random-string-generator.name") },
        { id: "test-data-generator", name: t("tools.test-data-generator.name") },
        { id: "hash-generator", name: t("tools.hash-generator.name") },
      ]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="uuid-count" className="text-sm font-medium text-text">
            {t("tools.uuid-generator.count")}
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
            className="mt-1 w-24 rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
          />
        </div>

        <ToolActionBar
          primaryLabel={t("tools.uuid-generator.generate")}
          onPrimary={handleGenerate}
        />

        {error && (
          <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-text-secondary hover:bg-primary-soft hover:text-primary"
              >
                {copied ? t("common.copied") : t("tools.uuid-generator.copyAll")}
              </button>
            </div>
            <ul className="max-h-96 space-y-1 overflow-auto rounded-md bg-surface-muted p-3">
              {results.map((uuid, i) => (
                <li key={i} className="flex items-center justify-between gap-2 font-mono text-sm">
                  <span className="text-text">{uuid}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyOne(uuid)}
                    className="shrink-0 text-xs text-text-muted hover:text-text"
                  >
                    {t("tools.uuid-generator.copyOne")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.length === 0 && !error && (
          <div className="text-sm text-text-muted">{t("tools.uuid-generator.empty")}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
