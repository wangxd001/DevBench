import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { ToolResultPanel } from "@/components/editor/ToolResultPanel";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { encodeBase64, decodeBase64, type Base64Variant } from "./core";

const LIMIT = 5 * 1024 * 1024;

export function Base64Converter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [variant, setVariant] = useState<Base64Variant>("standard");

  const byteLength = useMemo(() => new TextEncoder().encode(input).byteLength, [input]);
  const result = useMemo(() => {
    if (!input) return { value: "", error: undefined };
    return mode === "encode" ? encodeBase64(input, variant) : decodeBase64(input, variant);
  }, [input, mode, variant]);

  const status = !input ? "idle" : result.error ? "error" : "success";

  return (
    <ToolPageLayout
      title={t("tools.base64-converter.name")}
      description={t("tools.base64-converter.description")}
      category={t("nav.category.encoding")}
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <div>
            <span className="text-sm text-text-secondary">{t("tools.base64-converter.mode")}</span>
            <div className="mt-1 flex gap-2">
              <button type="button" onClick={() => setMode("encode")}
                className={`rounded-md px-3 py-1.5 text-sm ${mode === "encode" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t("tools.base64-converter.mode.encode")}
              </button>
              <button type="button" onClick={() => setMode("decode")}
                className={`rounded-md px-3 py-1.5 text-sm ${mode === "decode" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t("tools.base64-converter.mode.decode")}
              </button>
            </div>
          </div>
          <div>
            <span className="text-sm text-text-secondary">{t("tools.base64-converter.variant")}</span>
            <div className="mt-1 flex gap-2">
              <button type="button" onClick={() => setVariant("standard")}
                className={`rounded-md px-3 py-1.5 text-sm ${variant === "standard" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t("tools.base64-converter.variant.standard")}
              </button>
              <button type="button" onClick={() => setVariant("urlsafe")}
                className={`rounded-md px-3 py-1.5 text-sm ${variant === "urlsafe" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t("tools.base64-converter.variant.urlsafe")}
              </button>
            </div>
          </div>
        </div>

        <ToolInputPanel
          label={mode === "encode" ? t("tools.base64-converter.input.text") : t("tools.base64-converter.input.base64")}
          value={input}
          onChange={setInput}
          onClear={() => setInput("")}
          sizeLimit={{ current: byteLength, limit: LIMIT, unit: "B" }}
        >
          <TextareaInput value={input} onChange={setInput} />
        </ToolInputPanel>

        <ToolResultPanel title={mode === "encode" ? t("tools.base64-converter.result.base64") : t("tools.base64-converter.result.text")}
          status={status} error={result.error}>
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
