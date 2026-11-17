import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { computeHash, type HashAlgorithm } from "./core";

const ALGOS: HashAlgorithm[] = ["md5", "sha-1", "sha-256", "sha-384", "sha-512"];

export function HashGenerator() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<HashAlgorithm>("sha-256");
  const [result, setResult] = useState<import("./core").HashResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleHash = useCallback(async () => {
    setProcessing(true);
    setResult(null);
    const res = await computeHash(input, algo);
    setResult(res);
    setProcessing(false);
  }, [input, algo]);

  const handleCopy = useCallback(async () => {
    if (result?.value) {
      try { await navigator.clipboard.writeText(result.value); } catch {}
    }
  }, [result]);

  return (
    <ToolPageLayout
      title={t("tools.hash-generator.name")}
      description={t("tools.hash-generator.description")}
      category={t("nav.category.encoding")}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {ALGOS.map((a) => (
            <button key={a} type="button" onClick={() => setAlgo(a)}
              className={`rounded-md px-3 py-1.5 text-sm font-mono ${algo === a ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
              {a.toUpperCase()}
            </button>
          ))}
        </div>

        <ToolInputPanel label={t("tools.hash-generator.input")} value={input} onChange={setInput} onClear={() => setInput("")}>
          <TextareaInput value={input} onChange={setInput} rows={4} />
        </ToolInputPanel>

        <ToolActionBar
          primaryLabel={t("tools.hash-generator.calculate")}
          onPrimary={handleHash}
          primaryDisabled={!input}
          processing={processing}
          secondaryActions={result?.value ? [{ label: t("tools.hash-generator.copy"), onClick: handleCopy }] : undefined}
        />

        {result?.error && (
          <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{result.error}</div>
        )}

        {result?.value && (
          <div className="rounded-md bg-surface-muted p-3">
            <div className="break-all font-mono text-sm text-text">{result.value}</div>
          </div>
        )}

        <div className="rounded-md border border-warning bg-warning/10 p-2 text-xs text-warning">
          {t("tools.hash-generator.securityNote")}
        </div>
      </div>
    </ToolPageLayout>
  );
}
