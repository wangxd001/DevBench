import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { ToolResultPanel } from "@/components/editor/ToolResultPanel";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { textToUnicode, unicodeToText } from "./core";

export function UnicodeConverter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"toUnicode" | "toText">("toUnicode");

  const result = useMemo(() => {
    if (!input) return { value: "", error: undefined };
    return mode === "toUnicode" ? textToUnicode(input) : unicodeToText(input);
  }, [input, mode]);

  const status = !input ? "idle" : result.error ? "error" : "success";

  return (
    <ToolPageLayout
      title={t("tools.unicode-converter.name")}
      description={t("tools.unicode-converter.description")}
      category={t("nav.category.encoding")}
    >
      <div className="space-y-4">
        <div>
          <span className="text-sm text-text-secondary">{t("tools.unicode-converter.mode")}</span>
          <div className="mt-1 flex gap-2">
            <button type="button" onClick={() => setMode("toUnicode")}
              className={`rounded-md px-3 py-1.5 text-sm ${mode === "toUnicode" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
              {t("tools.unicode-converter.mode.toUnicode")}
            </button>
            <button type="button" onClick={() => setMode("toText")}
              className={`rounded-md px-3 py-1.5 text-sm ${mode === "toText" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
              {t("tools.unicode-converter.mode.toText")}
            </button>
          </div>
        </div>

        <ToolInputPanel
          label={mode === "toUnicode" ? t("tools.unicode-converter.input.text") : t("tools.unicode-converter.input.unicode")}
          value={input}
          onChange={setInput}
          onClear={() => setInput("")}
        >
          <TextareaInput value={input} onChange={setInput} />
        </ToolInputPanel>

        <ToolResultPanel title={mode === "toUnicode" ? t("tools.unicode-converter.result.unicode") : t("tools.unicode-converter.result.text")}
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
