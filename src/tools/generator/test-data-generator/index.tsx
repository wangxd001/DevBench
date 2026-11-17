import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { ToolResultPanel } from "@/components/editor/ToolResultPanel";
import { generateTestData, type TestField, type TestGenerateResult } from "./core";

const FIELD_TYPES: TestField["type"][] = ["string", "email", "phone", "age", "integer", "decimal", "boolean", "date", "uuid", "fixed"];

interface FieldConfig extends TestField {
  id: number;
}

let fieldId = 0;

export function TestDataGenerator() {
  const { t } = useTranslation();
  const [fields, setFields] = useState<FieldConfig[]>([
    { id: fieldId++, type: "string", name: "name" },
    { id: fieldId++, type: "email", name: "email" },
    { id: fieldId++, type: "integer", name: "age", min: 18, max: 80 },
  ]);
  const [count, setCount] = useState(10);
  const [result, setResult] = useState<TestGenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addField = () => {
    setFields((prev) => [...prev, { id: fieldId++, type: "string", name: "field" + (prev.length + 1) }]);
  };

  const removeField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const updateField = (id: number, updates: Partial<TestField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleGenerate = useCallback(() => {
    setError(null);
    setCopied(false);
    try {
      setResult(generateTestData({ fields, count }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [fields, count]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("common.copyError"));
    }
  }, [result, t]);

  return (
    <ToolPageLayout
      title={t("tools.test-data-generator.name")}
      description={t("tools.test-data-generator.description")}
      category={t("nav.category.generator")}
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text">{t("tools.test-data-generator.fields")}</span>
            <button type="button" onClick={addField}
              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary hover:bg-surface-muted">
              + {t("tools.test-data-generator.addField")}
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {fields.map((field) => (
              <div key={field.id} className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface-muted p-2">
                <select
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as TestField["type"] })}
                  className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text focus:border-primary focus:outline-none"
                  aria-label={t("tools.test-data-generator.fieldType")}
                >
                  {FIELD_TYPES.map((ft) => (
                    <option key={ft} value={ft}>{ft}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(field.id, { name: e.target.value })}
                  className="w-24 rounded-md border border-border bg-surface px-2 py-1 text-sm text-text focus:border-primary focus:outline-none"
                  aria-label={t("tools.test-data-generator.fieldName")}
                />
                {field.type === "integer" && (
                  <>
                    <input type="number" value={field.min ?? 0} onChange={(e) => updateField(field.id, { min: parseInt(e.target.value, 10) || 0 })}
                      className="w-16 rounded-md border border-border bg-surface px-2 py-1 text-sm text-text focus:border-primary focus:outline-none"
                      aria-label="min" />
                    <span className="text-xs text-text-muted">–</span>
                    <input type="number" value={field.max ?? 1000} onChange={(e) => updateField(field.id, { max: parseInt(e.target.value, 10) || 1000 })}
                      className="w-16 rounded-md border border-border bg-surface px-2 py-1 text-sm text-text focus:border-primary focus:outline-none"
                      aria-label="max" />
                  </>
                )}
                {field.type === "fixed" && (
                  <input type="text" value={field.value ?? ""} onChange={(e) => updateField(field.id, { value: e.target.value })}
                    className="flex-1 rounded-md border border-border bg-surface px-2 py-1 text-sm text-text focus:border-primary focus:outline-none"
                    aria-label={t("tools.test-data-generator.fixedValue")} />
                )}
                <button type="button" onClick={() => removeField(field.id)}
                  className="ml-auto text-xs text-text-muted hover:text-error" aria-label={t("common.clear")}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="tdg-count" className="text-sm text-text-secondary">{t("tools.test-data-generator.count")}</label>
          <input id="tdg-count" type="number" min={1} max={10000} value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
            className="mt-1 w-24 rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none" />
        </div>

        <ToolActionBar
          primaryLabel={t("tools.test-data-generator.generate")}
          onPrimary={handleGenerate}
          secondaryActions={result ? [{ label: copied ? t("common.copied") : t("tools.test-data-generator.copyAll"), onClick: handleCopy }] : undefined}
        />

        {error && <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{error}</div>}

        {result && (
          <ToolResultPanel title={t("tools.test-data-generator.result")} status="success">
            <pre className="max-h-96 overflow-auto rounded-md bg-surface-muted p-3 font-mono text-xs text-text">
              {result.json}
            </pre>
          </ToolResultPanel>
        )}
      </div>
    </ToolPageLayout>
  );
}
