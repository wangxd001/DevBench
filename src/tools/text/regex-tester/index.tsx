import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { createWorker, type WorkerManager } from "@/lib/worker/worker-base";
import type { RegexWorkerOutput } from "@/lib/worker/regex-worker";
import { validatePattern } from "./core";

// Vite 原生 Worker 语法：?worker 后缀打包为独立 Worker 脚本
import RegexWorker from "@/lib/worker/regex-worker-entry?worker";

const REGEX_TIMEOUT_MS = 3000;

export function RegexTester() {
  const { t } = useTranslation();
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g"]));
  const [results, setResults] = useState<RegexWorkerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [processing, setProcessing] = useState(false);

  // 每个组件实例持有独立 WorkerManager，卸载时终止
  const managerRef = useRef<WorkerManager | null>(null);
  useEffect(() => {
    managerRef.current = createWorker(() => new RegexWorker() as unknown as Worker);
    return () => managerRef.current?.terminate();
  }, []);
  const flagsStr = Array.from(flags).join("");

  const toggleFlag = (flag: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  };

  const handleTest = useCallback(async () => {
    setError(null);
    setTruncated(false);
    setProcessing(true);

    const validation = validatePattern(pattern, flagsStr);
    if (!validation.valid) {
      setError(validation.error || t("tools.regex-tester.error.invalidPattern"));
      setResults(null);
      setProcessing(false);
      return;
    }

    try {
      const out = (await managerRef.current!.execute(
        { pattern, flags: flagsStr, text },
        REGEX_TIMEOUT_MS
      )) as RegexWorkerOutput;
      setResults(out);
      if (out.truncated) setTruncated(true);
      if (out.error) setError(out.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResults(null);
    } finally {
      setProcessing(false);
    }
  }, [pattern, flagsStr, text, t]);

  return (
    <ToolPageLayout
      title={t("tools.regex-tester.name")}
      description={t("tools.regex-tester.description")}
      category={t("nav.category.text")}
    >
      <div className="space-y-4">
        <ToolInputPanel label={t("tools.regex-tester.pattern")} value={pattern} onChange={setPattern}>
          <CodeEditor value={pattern} onChange={setPattern} language="javascript" height={80} />
        </ToolInputPanel>

        <div>
          <span className="text-sm font-medium text-text">{t("tools.regex-tester.flags")}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {["g", "i", "m", "s", "u", "y", "d"].map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                aria-pressed={flags.has(flag)}
                className={`rounded-md px-2.5 py-1 text-sm font-mono ${
                  flags.has(flag)
                    ? "bg-primary text-white"
                    : "border border-border text-text-secondary"
                }`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        <ToolInputPanel label={t("tools.regex-tester.testText")} value={text} onChange={setText} onClear={() => setText("")}>
          <TextareaInput value={text} onChange={setText} placeholder="Test text..." rows={6} />
        </ToolInputPanel>

        <ToolActionBar
          primaryLabel={t("tools.regex-tester.test")}
          onPrimary={handleTest}
          primaryDisabled={!pattern || processing}
          processing={processing}
        />

        {error && (
          <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{error}</div>
        )}

        {truncated && (
          <div role="alert" className="rounded-md border border-warning bg-warning/10 p-2 text-sm text-warning">
            {t("tools.regex-tester.truncated")}
          </div>
        )}

        {results && results.matches.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-text-secondary">
              {t("tools.regex-tester.matches")} ({results.count})
            </h3>
            <ul className="mt-2 max-h-96 space-y-1 overflow-auto rounded-md bg-surface-muted p-3">
              {results.matches.slice(0, 100).map((m, i) => (
                <li key={i} className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded bg-primary-soft px-1.5 py-0.5 font-mono text-xs text-primary">
                    {m.index}
                  </span>
                  <span className="font-mono text-text">{m.text}</span>
                  {m.groups.length > 0 && (
                    <span className="text-xs text-text-muted">
                      groups: {m.groups.map((g, gi) => `[${gi}]${g}`).join(" ")}
                    </span>
                  )}
                </li>
              ))}
              {results.matches.length > 100 && (
                <li className="text-xs text-text-muted">
                  ... {results.matches.length - 100} more
                </li>
              )}
            </ul>
          </div>
        )}

        {results && results.matches.length === 0 && !error && (
          <div className="text-sm text-text-muted">{t("tools.regex-tester.noMatch")}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
