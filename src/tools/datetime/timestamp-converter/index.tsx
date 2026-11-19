import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { timestampToDate, dateToTimestamp, getNowTimestamp, formatTimestampDate, type TimestampUnit, type DisplayFormat } from "./core";

export function TimestampConverter() {
  const { t } = useTranslation();
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [format, setFormat] = useState<DisplayFormat>("local");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    setResult(null);

    if (tsInput) {
      const d = timestampToDate(tsInput, unit);
      if (!d) {
        setError(t("tools.timestamp-converter.invalid"));
        return;
      }
      setResult(formatTimestampDate(d, format));
    } else if (dateInput) {
      const ts = dateToTimestamp(dateInput, unit);
      if (ts === null) {
        setError(t("tools.timestamp-converter.invalidDate"));
        return;
      }
      setResult(ts);
    }
  };

  const handleNow = () => {
    setTsInput(getNowTimestamp(unit));
    setDateInput("");
    setResult(null);
    setError(null);
  };

  return (
    <ToolPageLayout
      title={t("tools.timestamp-converter.name")}
      description={t("tools.timestamp-converter.description")}
      category={t("nav.category.datetime")}
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <div>
            <span className="text-sm text-text-secondary">{t("tools.timestamp-converter.unit")}</span>
            <div className="mt-1 flex gap-2">
              <button type="button" onClick={() => setUnit("seconds")}
                className={`rounded-md px-3 py-1.5 text-sm ${unit === "seconds" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t("tools.timestamp-converter.unit.seconds")}
              </button>
              <button type="button" onClick={() => setUnit("milliseconds")}
                className={`rounded-md px-3 py-1.5 text-sm ${unit === "milliseconds" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                {t("tools.timestamp-converter.unit.milliseconds")}
              </button>
            </div>
          </div>
          <div>
            <span className="text-sm text-text-secondary">{t("tools.timestamp-converter.format")}</span>
            <div className="mt-1 flex gap-2">
              {(["local", "utc", "iso"] as DisplayFormat[]).map((f) => (
                <button key={f} type="button" onClick={() => setFormat(f)}
                  className={`rounded-md px-3 py-1.5 text-sm ${format === f ? "bg-primary text-white" : "border border-border text-text-secondary"}`}>
                  {t(`tools.timestamp-converter.${f}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <label htmlFor="ts-input" className="text-sm font-medium text-text">
              {t("tools.timestamp-converter.tsLabel")}
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="ts-input"
                type="text"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder="1700000000"
                className="flex-1 rounded-md border border-border bg-surface-muted px-3 py-2 text-sm font-mono text-text focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleNow}
                className="rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary hover:bg-primary-soft hover:text-primary"
              >
                {t("tools.timestamp-converter.now")}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="date-input" className="text-sm font-medium text-text">
              {t("tools.timestamp-converter.dateLabel")}
            </label>
            <input
              id="date-input"
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="2023-11-14T22:13:20Z"
              className="mt-1 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm font-mono text-text focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <ToolActionBar primaryLabel={t("tools.timestamp-converter.convert")} onPrimary={handleConvert} />

        {error && (
          <div role="alert" className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{error}</div>
        )}
        {result && (
          <div className="rounded-md bg-surface-muted p-3 font-mono text-sm text-text">{result}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
