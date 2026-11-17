import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { ToolResultPanel } from "@/components/editor/ToolResultPanel";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { textToHtmlEntity, htmlEntityToText } from "./core";

export function HtmlEntityConverter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"toEntity" | "toText">("toEntity");

  const result = useMemo(() => {
    if (!input) return { value: "" };
    return mode === "toEntity" ? { value: textToHtmlEntity(input) } : { value: htmlEntityToText(input) };
  }, [input, mode]);

  const status = !input ? "idle" : "success";

  return (
    <ToolPageLayout
      title={t("tools.html-entity-converter.name")}
      description={t("tools.html-entity-converter.description")}
      category={t("nav.category.encoding")}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode("toEntity")}
            className={`rounded-md px-3 py-1.5 text-sm ${mode === "toEntity" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
            {t("tools.html-entity-converter.mode.toEntity")}
          </button>
          <button type="button" onClick={() => setMode("toText")}
            className={`rounded-md px-3 py-1.5 text-sm ${mode === "toText" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
            {t("tools.html-entity-converter.mode.toText")}
          </button>
        </div>

        <ToolInputPanel
          label={mode === "toEntity" ? t("tools.html-entity-converter.input.text") : t("tools.html-entity-converter.input.entity")}
          value={input}
          onChange={setInput}
          onClear={() => setInput("")}
        >
          <TextareaInput value={input} onChange={setInput} />
        </ToolInputPanel>

        <ToolResultPanel
          title={mode === "toEntity" ? t("tools.html-entity-converter.result.entity") : t("tools.html-entity-converter.result.text")}
          status={status}
        >
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
