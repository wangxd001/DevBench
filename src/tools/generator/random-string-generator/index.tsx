import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { generateRandomString, type RandomStringResult } from "./core";

const CHARSET_OPTIONS = [
  { id: "lowercase", label: "A-Za-z" },
  { id: "digits", label: "0-9" },
  { id: "uppercase", label: "A-Z" },
  { id: "special", label: "!@#" },
] as const;

export function RandomStringGenerator() {
  const { t } = useTranslation();
  const [length, setLength] = useState(16);
  const [quantity, setQuantity] = useState(1);
  const [charsets, setCharsets] = useState<Set<string>>(new Set(["lowercase", "digits"]));
  const [customCharset, setCustomCharset] = useState("");
  const [result, setResult] = useState<RandomStringResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleCharset = (id: string) => {
    setCharsets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = () => {
    setError(null);
    try {
      const activeCharsets = Array.from(charsets);
      const hasCustom = customCharset.trim().length > 0;
      if (activeCharsets.length === 0 && !hasCustom) {
        setError(t("tools.random-string-generator.error.emptyCharset"));
        return;
      }
      setResult(generateRandomString(length, quantity, activeCharsets, hasCustom ? customCharset : undefined));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleCopyAll = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.results.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("common.copyError"));
    }
  };

  return (
    <ToolPageLayout
      title={t("tools.random-string-generator.name")}
      description={t("tools.random-string-generator.description")}
      category={t("nav.category.generator")}
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <div>
            <label htmlFor="rsg-length" className="text-sm text-text-secondary">{t("tools.random-string-generator.length")}</label>
            <input id="rsg-length" type="number" min={1} max={1024} value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10) || 1)}
              className="mt-1 w-20 rounded-md border border-border bg-surface-muted px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label htmlFor="rsg-quantity" className="text-sm text-text-secondary">{t("tools.random-string-generator.quantity")}</label>
            <input id="rsg-quantity" type="number" min={1} max={100} value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="mt-1 w-20 rounded-md border border-border bg-surface-muted px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <span className="text-sm text-text-secondary">{t("tools.random-string-generator.charsets")}</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {CHARSET_OPTIONS.map((opt) => (
              <button key={opt.id} type="button" onClick={() => toggleCharset(opt.id)}
                aria-pressed={charsets.has(opt.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-mono ${charsets.has(opt.id) ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {opt.label}
              </button>
            ))}
            <input
              type="text"
              value={customCharset}
              onChange={(e) => setCustomCharset(e.target.value)}
              placeholder={t("tools.random-string-generator.custom")}
              className="rounded-md border border-border bg-surface-muted px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
              aria-label={t("tools.random-string-generator.custom")}
            />
          </div>
        </div>

        <ToolActionBar
          primaryLabel={t("tools.random-string-generator.generate")}
          onPrimary={handleGenerate}
          secondaryActions={result ? [{ label: copied ? t("common.copied") : t("tools.random-string-generator.copyAll"), onClick: handleCopyAll }] : undefined}
        />

        {error && <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{error}</div>}

        {result && (
          <div className="max-h-96 space-y-1 overflow-auto rounded-md bg-surface-muted p-3">
            {result.results.map((s, i) => (
              <div key={i} className="font-mono text-sm text-text">{s}</div>
            ))}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
