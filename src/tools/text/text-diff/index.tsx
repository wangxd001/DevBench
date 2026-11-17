import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolInputPanel } from "@/components/editor/ToolInputPanel";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { textDiff, type DiffLine } from "./core";

const TYPE_LABEL: Record<DiffLine["type"], string> = {
  added: "+",
  removed: "-",
  modified: "~",
  unchanged: "",
};

const TYPE_COLOR: Record<DiffLine["type"], string> = {
  added: "text-success",
  removed: "text-error",
  modified: "text-warning",
  unchanged: "text-text",
};

export function TextDiff() {
  const { t } = useTranslation();
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof textDiff> | null>(null);

  const handleCompare = () => {
    setResult(textDiff(left, right, { caseSensitive, ignoreWhitespace }));
  };

  return (
    <ToolPageLayout
      title={t("tools.text-diff.name")}
      description={t("tools.text-diff.description")}
      category={t("nav.category.text")}
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ToolInputPanel label={t("tools.text-diff.left")} value={left} onChange={setLeft} onClear={() => setLeft("")}>
            <TextareaInput value={left} onChange={setLeft} rows={8} />
          </ToolInputPanel>
          <ToolInputPanel label={t("tools.text-diff.right")} value={right} onChange={setRight} onClear={() => setRight("")}>
            <TextareaInput value={right} onChange={setRight} rows={8} />
          </ToolInputPanel>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-sm text-text-secondary">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded" />
            {t("tools.text-diff.caseSensitive")}
          </label>
          <label className="flex items-center gap-1.5 text-sm text-text-secondary">
            <input type="checkbox" checked={ignoreWhitespace} onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded" />
            {t("tools.text-diff.ignoreWhitespace")}
          </label>
        </div>

        <ToolActionBar primaryLabel={t("tools.text-diff.compare")} onPrimary={handleCompare} primaryDisabled={!left && !right} />

        {result && !result.hasDiff && (
          <div className="rounded-md border border-success bg-success/10 p-2 text-sm text-success">
            {t("tools.text-diff.noDiff")}
          </div>
        )}

        {result && result.hasDiff && (
          <div className="max-h-96 overflow-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted sticky top-0">
                  <th className="w-8 px-2 py-1 text-left text-text-muted">Ln</th>
                  <th className="w-8 px-2 py-1 text-left text-text-muted">Type</th>
                  <th className="px-2 py-1 text-left text-text-muted">{t("tools.text-diff.left")}</th>
                  <th className="px-2 py-1 text-left text-text-muted">{t("tools.text-diff.right")}</th>
                </tr>
              </thead>
              <tbody>
                {result.lines.filter((l) => l.type !== "unchanged" || true).map((line, i) => (
                  <tr key={i} className={`border-b border-border ${line.type === "unchanged" ? "" : "bg-surface-muted"}`}>
                    <td className={`px-2 py-1 font-mono text-xs text-text-muted`}>{line.lineNumber}</td>
                    <td className={`px-2 py-1 font-mono text-xs ${TYPE_COLOR[line.type]}`} aria-label={line.type}>
                      <span aria-hidden="true">{TYPE_LABEL[line.type]}</span>
                    </td>
                    <td className="px-2 py-1 font-mono text-xs">
                      {line.type === "removed" || line.type === "modified" ? line.oldText ?? "" : line.text ?? ""}
                    </td>
                    <td className="px-2 py-1 font-mono text-xs">
                      {line.type === "added" || line.type === "modified" ? line.newText ?? "" : line.text ?? ""}
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
