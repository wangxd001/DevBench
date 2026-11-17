import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { addDays, subtractDays, dateDiff } from "./core";

export function DateCalculator() {
  const { t } = useTranslation();
  const [dateInput, setDateInput] = useState("");
  const [daysInput, setDaysInput] = useState("1");
  const [diffFrom, setDiffFrom] = useState("");
  const [diffTo, setDiffTo] = useState("");
  const [mode, setMode] = useState<"add" | "subtract" | "diff">("add");
  const [result, setResult] = useState<string | null>(null);
  const [diffResult, setDiffResult] = useState<ReturnType<typeof dateDiff> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const days = parseInt(daysInput, 10) || 0;

  const handleCalculate = () => {
    setError(null);
    setResult(null);
    setDiffResult(null);
    if (mode === "diff") {
      if (!diffFrom || !diffTo) return;
      setDiffResult(dateDiff(diffFrom, diffTo));
      return;
    }
    if (!dateInput) return;
    const op = mode === "add" ? addDays : subtractDays;
    const res = op(dateInput, days);
    if (res.error) setError(res.error);
    else setResult(res.value);
  };

  return (
    <ToolPageLayout
      title={t("tools.date-calculator.name")}
      description={t("tools.date-calculator.description")}
      category={t("nav.category.datetime")}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["add", "subtract", "diff"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-sm ${mode === m ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
              {t("tools.date-calculator.mode." + m)}
            </button>
          ))}
        </div>

        {mode === "diff" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="diff-from" className="text-sm text-text-secondary">{t("tools.date-calculator.from")}</label>
              <input id="diff-from" type="date" value={diffFrom} onChange={(e) => setDiffFrom(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label htmlFor="diff-to" className="text-sm text-text-secondary">{t("tools.date-calculator.to")}</label>
              <input id="diff-to" type="date" value={diffTo} onChange={(e) => setDiffTo(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <div>
              <label htmlFor="dc-date" className="text-sm text-text-secondary">{t("tools.date-calculator.date")}</label>
              <input id="dc-date" type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                className="mt-1 rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label htmlFor="dc-days" className="text-sm text-text-secondary">{t("tools.date-calculator.days")}</label>
              <input id="dc-days" type="number" min="0" value={daysInput} onChange={(e) => setDaysInput(e.target.value)}
                className="mt-1 w-24 rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            </div>
          </div>
        )}

        <ToolActionBar primaryLabel={t("tools.date-calculator.calculate")} onPrimary={handleCalculate} />

        {error && <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{error}</div>}
        {result && <div className="rounded-md bg-surface-muted p-3 font-mono text-lg text-text">{result}</div>}

        {diffResult && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-md bg-surface-muted p-2 text-center">
              <div className="text-xs text-text-muted">{t("tools.date-calculator.totalDays")}</div>
              <div className="text-lg font-semibold text-text">{diffResult.totalDays}</div>
            </div>
            <div className="rounded-md bg-surface-muted p-2 text-center">
              <div className="text-xs text-text-muted">{t("tools.date-calculator.years")}</div>
              <div className="text-lg font-semibold text-text">{diffResult.years}</div>
            </div>
            <div className="rounded-md bg-surface-muted p-2 text-center">
              <div className="text-xs text-text-muted">{t("tools.date-calculator.months")}</div>
              <div className="text-lg font-semibold text-text">{diffResult.months}</div>
            </div>
            <div className="rounded-md bg-surface-muted p-2 text-center">
              <div className="text-xs text-text-muted">{t("tools.date-calculator.days")}</div>
              <div className="text-lg font-semibold text-text">{diffResult.days}</div>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
