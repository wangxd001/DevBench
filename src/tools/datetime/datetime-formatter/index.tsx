import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { parseDatetime, formatDatetime, formatNowInput } from "./core";

export function DatetimeFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [preset, setPreset] = useState<"iso" | "local" | "utc" | "custom">("iso");
  const [customPattern, setCustomPattern] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNow = () => {
    setInput(formatNowInput());
    setError(null);
    setResult(null);
  };

  const handleFormat = () => {
    setError(null);
    setResult(null);
    const parsed = parseDatetime(input);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }
    const pattern = preset === "custom" ? customPattern : undefined;
    setResult(formatDatetime(parsed.date!, preset, pattern));
  };

  return (
    <ToolPageLayout
      title={t("tools.datetime-formatter.name")}
      description={t("tools.datetime-formatter.description")}
      category={t("nav.category.datetime")}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="dt-input" className="text-sm font-medium text-text">
            {t("tools.datetime-formatter.input")}
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="dt-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="2023-11-14T22:13:20Z"
              className="min-w-0 flex-1 rounded-md border border-border bg-surface-muted px-3 py-2 text-sm font-mono text-text focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={handleNow}
              className="shrink-0 rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary hover:bg-primary-soft hover:text-primary"
            >
              {t("tools.datetime-formatter.now")}
            </button>
          </div>
        </div>

        <div>
          <span className="text-sm text-text-secondary">{t("tools.datetime-formatter.preset")}</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {(["iso", "local", "utc", "custom"] as const).map((p) => (
              <button key={p} type="button" onClick={() => setPreset(p)}
                className={`rounded-md px-3 py-1.5 text-sm ${preset === p ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t(`tools.datetime-formatter.preset.${p}`)}
              </button>
            ))}
          </div>
          {preset === "custom" && (
            <input
              type="text"
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              placeholder="yyyy-MM-dd HH:mm:ss"
              className="mt-2 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm font-mono text-text focus:border-primary focus:outline-none"
              aria-label={t("tools.datetime-formatter.customPattern")}
            />
          )}
        </div>

        <ToolActionBar primaryLabel={t("tools.datetime-formatter.format")} onPrimary={handleFormat} primaryDisabled={!input} />

        {error && <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{error}</div>}
        {result && <div className="rounded-md bg-surface-muted p-3 font-mono text-sm text-text">{result}</div>}
      </div>
    </ToolPageLayout>
  );
}
