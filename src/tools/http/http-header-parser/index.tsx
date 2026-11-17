import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { parseHeaders, type HeaderParseResult } from "./core";

export function HttpHeaderParser() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<HeaderParseResult | null>(null);

  const handleParse = () => {
    setResult(parseHeaders(input));
  };

  return (
    <ToolPageLayout
      title={t("tools.http-header-parser.name")}
      description={t("tools.http-header-parser.description")}
      category={t("nav.category.http")}
    >
      <div className="space-y-4">
        <ToolInputPanel label={t("tools.http-header-parser.input")} value={input} onChange={setInput} onClear={() => setInput("")}>
          <CodeEditor value={input} onChange={setInput} height={200} />
        </ToolInputPanel>

        <ToolActionBar primaryLabel={t("tools.http-header-parser.parse")} onPrimary={handleParse} primaryDisabled={!input} />

        {result && result.headers.length > 0 && (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-3 py-2 text-left font-medium text-text-secondary">Line</th>
                  <th className="px-3 py-2 text-left font-medium text-text-secondary">Header</th>
                  <th className="px-3 py-2 text-left font-medium text-text-secondary">Value</th>
                </tr>
              </thead>
              <tbody>
                {result.headers.map((h, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-3 py-2 text-text-muted">{h.line}</td>
                    <td className="px-3 py-2 font-mono text-text">{h.name}</td>
                    <td className="px-3 py-2 font-mono text-text-secondary">{h.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {result && result.errors.length > 0 && (
          <div className="space-y-1">
            {result.errors.map((err, i) => (
              <div key={i} className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">
                {t("tools.http-header-parser.error.invalidLine", { line: err.line })}
              </div>
            ))}
          </div>
        )}

        {result && result.headers.length === 0 && result.errors.length === 0 && (
          <div className="text-sm text-text-muted">{t("tools.http-header-parser.empty")}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
