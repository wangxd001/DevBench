import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { ToolResultPanel } from "@/components/editor/ToolResultPanel";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { formatJson, type JsonFormatMode } from "./core";

const LIMIT = 5 * 1024 * 1024;

export function JsonFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<JsonFormatMode>("pretty");
  const [indent, setIndent] = useState<2 | 4>(2);
  const [result, setResult] = useState<ReturnType<typeof formatJson> | null>(null);

  const byteLength = new TextEncoder().encode(input).byteLength;

  const handleFormat = () => {
    setResult(formatJson(input, mode, indent));
  };

  const status = !result ? "idle" : result.error ? "error" : result.value ? "success" : "empty";

  return (
    <ToolPageLayout
      title={t("tools.json-formatter.name")}
      description={t("tools.json-formatter.description")}
      category={t("nav.category.data")}
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <div>
            <span className="text-sm text-text-secondary">{t("tools.json-formatter.mode")}</span>
            <div className="mt-1 flex gap-2">
              <button type="button" onClick={() => setMode("pretty")}
                className={`rounded-md px-3 py-1.5 text-sm ${mode === "pretty" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t("tools.json-formatter.mode.pretty")}
              </button>
              <button type="button" onClick={() => setMode("minify")}
                className={`rounded-md px-3 py-1.5 text-sm ${mode === "minify" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t("tools.json-formatter.mode.minify")}
              </button>
            </div>
          </div>
          {mode === "pretty" && (
            <div>
              <span className="text-sm text-text-secondary">{t("tools.json-formatter.indent")}</span>
              <div className="mt-1 flex gap-2">
                <button type="button" onClick={() => setIndent(2)}
                  className={`rounded-md px-3 py-1.5 text-sm ${indent === 2 ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                  2
                </button>
                <button type="button" onClick={() => setIndent(4)}
                  className={`rounded-md px-3 py-1.5 text-sm ${indent === 4 ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                  4
                </button>
              </div>
            </div>
          )}
        </div>

        <ToolInputPanel
          label={t("tools.json-formatter.input")}
          value={input}
          onChange={setInput}
          onClear={() => { setInput(""); setResult(null); }}
          sizeLimit={{ current: byteLength, limit: LIMIT }}
        >
          <CodeEditor value={input} onChange={setInput} language="json" height={250} />
        </ToolInputPanel>

        <ToolActionBar
          primaryLabel={t("tools.json-formatter.format")}
          onPrimary={handleFormat}
          primaryDisabled={!input || byteLength > LIMIT}
        />

        {byteLength > LIMIT && (
          <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">
            {t("tools.json-formatter.error.tooLarge")}
          </div>
        )}

        <ToolResultPanel
          title={t("tools.json-formatter.result")}
          status={status}
          error={result?.error?.message}
          onCopy={result?.value ? async () => {
            await navigator.clipboard.writeText(result.value);
          } : undefined}
        >
          {result?.value && (
            <CodeEditor value={result.value} onChange={() => {}} language="json" readOnly height={250} />
          )}
        </ToolResultPanel>

        {result?.error && result.error.line && (
          <div className="text-sm text-text-secondary">
            {t("tools.json-formatter.error.position", { line: result.error.line, column: result.error.column })}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
