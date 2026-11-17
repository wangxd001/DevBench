import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { compareJson } from "./core";

const LIMIT = 2 * 1024 * 1024;

export function JsonDiff() {
  const { t } = useTranslation();
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState<ReturnType<typeof compareJson> | null>(null);

  const leftBytes = new TextEncoder().encode(left).byteLength;
  const rightBytes = new TextEncoder().encode(right).byteLength;

  const handleCompare = () => {
    setResult(compareJson(left, right));
  };

  const diffTypeIcon: Record<string, string> = {
    added: "+",
    removed: "-",
    modified: "~",
    unchanged: "",
  };

  const diffTypeColor: Record<string, string> = {
    added: "text-success",
    removed: "text-error",
    modified: "text-warning",
  };

  return (
    <ToolPageLayout
      title={t("tools.json-diff.name")}
      description={t("tools.json-diff.description")}
      category={t("nav.category.data")}
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ToolInputPanel
            label={t("tools.json-diff.left")}
            value={left}
            onChange={setLeft}
            onClear={() => setLeft("")}
            sizeLimit={{ current: leftBytes, limit: LIMIT, unit: "B" }}
          >
            <CodeEditor value={left} onChange={setLeft} language="json" height={200} />
          </ToolInputPanel>
          <ToolInputPanel
            label={t("tools.json-diff.right")}
            value={right}
            onChange={setRight}
            onClear={() => setRight("")}
            sizeLimit={{ current: rightBytes, limit: LIMIT, unit: "B" }}
          >
            <CodeEditor value={right} onChange={setRight} language="json" height={200} />
          </ToolInputPanel>
        </div>

        {(leftBytes > LIMIT || rightBytes > LIMIT) && (
          <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">
            {t("tools.json-diff.error.tooLarge")}
          </div>
        )}

        <ToolActionBar
          primaryLabel={t("tools.json-diff.compare")}
          onPrimary={handleCompare}
          primaryDisabled={!left && !right}
        />

        {result?.error && (
          <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">
            {result.error}
          </div>
        )}

        {result && !result.error && !result.hasDiff && (
          <div className="rounded-md border border-success bg-success/10 p-2 text-sm text-success">
            {t("tools.json-diff.noDiff")}
          </div>
        )}

        {result && result.hasDiff && (
          <div className="max-h-96 overflow-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-3 py-2 text-left text-text-secondary">Type</th>
                  <th className="px-3 py-2 text-left text-text-secondary">Path</th>
                  <th className="px-3 py-2 text-left text-text-secondary">Value</th>
                </tr>
              </thead>
              <tbody>
                {result.entries.map((entry, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className={`px-3 py-2 font-medium ${diffTypeColor[entry.type] || ""}`}>
                      <span aria-hidden="true">{diffTypeIcon[entry.type]}</span>
                      {t(`tools.json-diff.type.${entry.type}`)}
                    </td>
                    <td className="px-3 py-2 font-mono text-text">{entry.path}</td>
                    <td className="px-3 py-2 font-mono text-text-secondary">
                      {entry.newValue !== undefined ? JSON.stringify(entry.newValue) : JSON.stringify(entry.oldValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
