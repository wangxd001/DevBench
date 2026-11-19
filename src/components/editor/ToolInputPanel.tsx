import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Eraser } from "lucide-react";
import { InputSizeIndicator } from "./InputSizeIndicator";

interface ToolInputPanelProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  sizeLimit?: { current: number; limit: number };
  children?: ReactNode;
}

export function ToolInputPanel({ label, placeholder, value, onChange, onClear, sizeLimit, children }: ToolInputPanelProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text">{label}</label>
        <div className="flex items-center gap-2">
          {sizeLimit && <InputSizeIndicator current={sizeLimit.current} limit={sizeLimit.limit} />}
          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded text-xs text-text-muted hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
              {t("common.clear")}
            </button>
          )}
        </div>
      </div>
      {children ? children : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={10}
          className="w-full rounded-md border border-border bg-surface-muted p-3 font-mono text-sm text-text focus:border-primary focus:outline-none"
        />
      )}
    </div>
  );
}
