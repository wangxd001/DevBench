import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { createWorker, type WorkerManager } from "@/lib/worker/worker-base";
import type { HashWorkerOutput } from "@/lib/worker/hash-worker-entry";
import type { HashAlgorithm } from "./core";

// Vite 原生 Worker 语法
import HashWorker from "@/lib/worker/hash-worker-entry?worker";

const ALGOS: HashAlgorithm[] = ["md5", "sha-1", "sha-256", "sha-384", "sha-512"];
const HASH_TIMEOUT_MS = 10000;

export function HashGenerator() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<HashAlgorithm>("sha-256");
  const [result, setResult] = useState<HashWorkerOutput | null>(null);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const managerRef = useRef<WorkerManager | null>(null);
  useEffect(() => {
    managerRef.current = createWorker(() => new HashWorker() as unknown as Worker);
    return () => managerRef.current?.terminate();
  }, []);

  const handleHash = useCallback(async () => {
    setProcessing(true);
    setResult(null);
    setCopied(false);
    setCopyError(false);
    try {
      const out = (await managerRef.current!.execute(
        { text: input, algorithm: algo },
        HASH_TIMEOUT_MS
      )) as HashWorkerOutput;
      setResult(out);
    } catch (e) {
      setResult({ value: "", error: e instanceof Error ? e.message : String(e) });
    } finally {
      setProcessing(false);
    }
  }, [input, algo]);

  const handleCopy = useCallback(async () => {
    if (!result?.value) return;
    try {
      await navigator.clipboard.writeText(result.value);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
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

        {/* 不传 processing：hash 计算极快，loading 态一闪而过反而像闪烁；
            只用 disabled 防重复点击，按钮文案保持「计算」。 */}
        <ToolActionBar
          primaryLabel={t("tools.hash-generator.calculate")}
          onPrimary={handleHash}
          primaryDisabled={!input || processing}
        />

        {result?.value && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary hover:bg-primary-soft hover:text-primary"
              >
                {t("tools.hash-generator.copy")}
              </button>
              {copied && (
                <span role="status" aria-live="polite" className="text-xs text-success">
                  {t("common.copied")}
                </span>
              )}
              {copyError && (
                <span role="alert" className="text-xs text-error">
                  {t("common.copyError")}
                </span>
              )}
            </div>
          </div>
        )}

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
