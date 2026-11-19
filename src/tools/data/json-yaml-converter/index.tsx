import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolResultPanel } from "@/components/editor/ToolResultPanel";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { jsonToYaml, yamlToJson } from "./core";

const LIMIT = 2 * 1024 * 1024;

export function JsonYamlConverter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"jsonToYaml" | "yamlToJson">("jsonToYaml");
  const [result, setResult] = useState<{ value: string; error?: string } | null>(null);

  const byteLength = new TextEncoder().encode(input).byteLength;

  const handleConvert = () => {
    setResult(direction === "jsonToYaml" ? jsonToYaml(input) : yamlToJson(input));
  };

  const status = !result ? "idle" : result.error ? "error" : result.value ? "success" : "empty";

  return (
    <ToolPageLayout
      title={t("tools.json-yaml-converter.name")}
      description={t("tools.json-yaml-converter.description")}
      category={t("nav.category.data")}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => setDirection("jsonToYaml")}
            className={`rounded-md px-3 py-1.5 text-sm ${direction === "jsonToYaml" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
            JSON → YAML
          </button>
          <button type="button" onClick={() => setDirection("yamlToJson")}
            className={`rounded-md px-3 py-1.5 text-sm ${direction === "yamlToJson" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
            YAML → JSON
          </button>
        </div>

        <ToolInputPanel
          label={direction === "jsonToYaml" ? t("tools.json-yaml-converter.input.json") : t("tools.json-yaml-converter.input.yaml")}
          value={input}
          onChange={setInput}
          onClear={() => { setInput(""); setResult(null); }}
          sizeLimit={{ current: byteLength, limit: LIMIT }}
        >
          <CodeEditor value={input} onChange={setInput} language={direction === "jsonToYaml" ? "json" : "javascript"} height={250} />
        </ToolInputPanel>

        {byteLength > LIMIT && (
          <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">
            {t("tools.json-yaml-converter.error.tooLarge")}
          </div>
        )}

        <ToolActionBar
          primaryLabel={direction === "jsonToYaml" ? t("tools.json-yaml-converter.toYaml") : t("tools.json-yaml-converter.toJson")}
          onPrimary={handleConvert}
          primaryDisabled={!input || byteLength > LIMIT}
        />

        <ToolResultPanel title="Result" status={status} error={result?.error}>
          {result?.value && (
            <pre className="max-h-64 overflow-auto rounded-md bg-surface-muted p-3 font-mono text-sm text-text">
              {result.value}
            </pre>
          )}
        </ToolResultPanel>
      </div>
    </ToolPageLayout>
  );
}
