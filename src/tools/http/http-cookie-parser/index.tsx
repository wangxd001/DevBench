import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { parseCookie, parseSetCookie } from "./core";

export function HttpCookieParser() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"cookie" | "setCookie">("cookie");
  const [result, setResult] = useState<ReturnType<typeof parseCookie> | ReturnType<typeof parseSetCookie> | null>(null);

  const handleParse = () => {
    setResult(mode === "cookie" ? parseCookie(input) : parseSetCookie(input));
  };


  return (
    <ToolPageLayout
      title={t("tools.http-cookie-parser.name")}
      description={t("tools.http-cookie-parser.description")}
      category={t("nav.category.http")}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode("cookie")}
            className={`rounded-md px-3 py-1.5 text-sm ${mode === "cookie" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
            {t("tools.http-cookie-parser.mode.cookie")}
          </button>
          <button type="button" onClick={() => setMode("setCookie")}
            className={`rounded-md px-3 py-1.5 text-sm ${mode === "setCookie" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
            {t("tools.http-cookie-parser.mode.setCookie")}
          </button>
        </div>

        <ToolInputPanel
          label={mode === "cookie" ? t("tools.http-cookie-parser.input.cookie") : t("tools.http-cookie-parser.input.setCookie")}
          value={input}
          onChange={setInput}
          onClear={() => { setInput(""); setResult(null); }}
        >
          <TextareaInput value={input} onChange={setInput} rows={4} />
        </ToolInputPanel>

        <ToolActionBar primaryLabel={t("tools.http-cookie-parser.parse")} onPrimary={handleParse} primaryDisabled={!input} />

        {mode === "cookie" && result && "cookies" in result && (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-3 py-2 text-left text-text-secondary">Name</th>
                  <th className="px-3 py-2 text-left text-text-secondary">Value</th>
                </tr>
              </thead>
              <tbody>
                {result.cookies.map((c, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-3 py-2 font-mono text-text">{c.name}</td>
                    <td className="px-3 py-2 font-mono text-text-secondary">{c.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.cookies.length === 0 && (
              <div className="p-3 text-sm text-text-muted">{t("tools.http-cookie-parser.empty")}</div>
            )}
          </div>
        )}

        {mode === "setCookie" && result && "name" in result && (
          <div className="space-y-2">
            {result.error && (
              <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{result.error}</div>
            )}
            <div className="rounded-md bg-surface-muted p-3">
              <div className="text-sm font-mono text-text">
                {result.name} = {result.value}
              </div>
              {result.domain && <div className="text-sm text-text-secondary">Domain: {result.domain}</div>}
              {result.path && <div className="text-sm text-text-secondary">Path: {result.path}</div>}
              {result.expires && <div className="text-sm text-text-secondary">Expires: {result.expires}</div>}
              {result.maxAge !== undefined && <div className="text-sm text-text-secondary">Max-Age: {result.maxAge}</div>}
              {result.secure && <div className="text-sm text-success">Secure</div>}
              {result.httpOnly && <div className="text-sm text-success">HttpOnly</div>}
              {result.sameSite && <div className="text-sm text-text-secondary">SameSite: {result.sameSite}</div>}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
