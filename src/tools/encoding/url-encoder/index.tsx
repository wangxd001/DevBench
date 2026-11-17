import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { ToolResultPanel } from "@/components/editor/ToolResultPanel";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { encodeUri, decodeUri, encodeComponent, decodeComponent } from "./core";

type Mode = "encode" | "decode";
type Type = "uri" | "component";

export function UrlEncoder() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [type, setType] = useState<Type>("component");

  const result = useMemo(() => {
    if (!input) return { value: "", error: undefined };
    if (mode === "encode") {
      return type === "uri" ? encodeUri(input) : encodeComponent(input);
    } else {
      return type === "uri" ? decodeUri(input) : decodeComponent(input);
    }
  }, [input, mode, type]);

  const status = !input ? "idle" : result.error ? "error" : "success";

  return (
    <ToolPageLayout
      title={t("tools.url-encoder.name")}
      description={t("tools.url-encoder.description")}
      category={t("nav.category.encoding")}
      relatedTools={[
        { id: "base64-converter", name: t("tools.base64-converter.name") },
        { id: "unicode-converter", name: t("tools.unicode-converter.name") },
        { id: "html-entity-converter", name: t("tools.html-entity-converter.name") },
      ]}
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <div>
            <span className="text-sm text-text-secondary">{t("tools.url-encoder.mode")}</span>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("encode")}
                className={`rounded-md px-3 py-1.5 text-sm ${mode === "encode" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}
              >
                {t("tools.url-encoder.mode.encode")}
              </button>
              <button
                type="button"
                onClick={() => setMode("decode")}
                className={`rounded-md px-3 py-1.5 text-sm ${mode === "decode" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}
              >
                {t("tools.url-encoder.mode.decode")}
              </button>
            </div>
          </div>
          <div>
            <span className="text-sm text-text-secondary">{t("tools.url-encoder.type")}</span>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setType("uri")}
                className={`rounded-md px-3 py-1.5 text-sm ${type === "uri" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}
              >
                URI
              </button>
              <button
                type="button"
                onClick={() => setType("component")}
                className={`rounded-md px-3 py-1.5 text-sm ${type === "component" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}
              >
                {t("tools.url-encoder.type.component")}
              </button>
            </div>
          </div>
        </div>

        <ToolInputPanel
          label={t("tools.url-encoder.input")}
          value={input}
          onChange={setInput}
          onClear={() => setInput("")}
        >
          <TextareaInput value={input} onChange={setInput} />
        </ToolInputPanel>

        <ToolResultPanel title={t("tools.url-encoder.result")} status={status} error={result.error}>
          {result.value && (
            <pre className="max-h-64 overflow-auto rounded-md bg-surface-muted p-3 font-mono text-sm text-text">
              {result.value}
            </pre>
          )}
        </ToolResultPanel>
      </div>
    </ToolPageLayout>
  );
}
