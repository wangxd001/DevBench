import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { addDays, subtractDays, dateDiff, isValidDateString } from "./core";

interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  pickerLabel: string;
  className?: string;
}

function DateField({ id, label, value, onChange, placeholder, pickerLabel, className }: DateFieldProps) {
  const pickerRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const picker = pickerRef.current;
    if (!picker) return;
    if (typeof picker.showPicker === "function") {
      try {
        picker.showPicker();
        return;
      } catch {
        // 部分浏览器要求输入框可见，回退到点击输入框
      }
    }
    picker.focus();
    picker.click();
  };

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm text-text-secondary">{label}</label>
      <div className="mt-1 flex gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-md border border-border bg-surface-muted px-3 py-2 font-mono text-sm text-text focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={openPicker}
          aria-label={pickerLabel}
          title={pickerLabel}
          className="flex shrink-0 items-center justify-center rounded-md border border-border bg-surface-muted px-3 py-2 text-text-secondary hover:bg-primary-soft hover:text-primary focus:border-primary focus:outline-none"
        >
          <Calendar size={16} aria-hidden="true" />
        </button>
        <input
          ref={pickerRef}
          type="date"
          value={isValidDateString(value) ? value : ""}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
      </div>
    </div>
  );
}

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
      if (!isValidDateString(diffFrom) || !isValidDateString(diffTo)) {
        setError(t("tools.date-calculator.invalidDate"));
        return;
      }
      setDiffResult(dateDiff(diffFrom, diffTo));
      return;
    }
    if (!dateInput) return;
    if (!isValidDateString(dateInput)) {
      setError(t("tools.date-calculator.invalidDate"));
      return;
    }
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
            <DateField
              id="diff-from"
              label={t("tools.date-calculator.from")}
              value={diffFrom}
              onChange={setDiffFrom}
              placeholder={t("tools.date-calculator.dateFormat")}
              pickerLabel={t("tools.date-calculator.openCalendar")}
            />
            <DateField
              id="diff-to"
              label={t("tools.date-calculator.to")}
              value={diffTo}
              onChange={setDiffTo}
              placeholder={t("tools.date-calculator.dateFormat")}
              pickerLabel={t("tools.date-calculator.openCalendar")}
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            <DateField
              id="dc-date"
              label={t("tools.date-calculator.date")}
              value={dateInput}
              onChange={setDateInput}
              placeholder={t("tools.date-calculator.dateFormat")}
              pickerLabel={t("tools.date-calculator.openCalendar")}
              className="w-44"
            />
            <div className="flex flex-col">
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
