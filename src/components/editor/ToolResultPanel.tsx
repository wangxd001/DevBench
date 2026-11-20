import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

type ResultStatus = "idle" | "processing" | "success" | "error" | "empty";

interface ToolResultPanelProps {
  title: string;
  status: ResultStatus;
  error?: string;
  onCopy?: () => void | Promise<void>;
  children: ReactNode;
}

export function ToolResultPanel({ title, status, error, onCopy, children }: ToolResultPanelProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = async () => {
    if (!onCopy) return;
    setCopyError(false);
    try {
      await onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-text">{title}</h2>
        <div className="flex items-center gap-2">
          {status === "processing" && <span className="text-xs text-text-muted" aria-live="polite">Processing...</span>}
          {onCopy && status === "success" && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
              >
                {copied ? t("common.copied") : t("common.copy")}
              </button>
              {copied && (
                <span role="status" aria-live="polite" className="text-xs text-success">
                  {t("common.copied")}
                </span>
              )}
              {copyError && (
                <span role="alert" className="text-xs text-error">
                  {t("common.copyError")}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {status === "error" && error && (
        <div role="alert" className="mb-2 rounded-md border border-error bg-error/10 p-2 text-sm text-error">{error}</div>
      )}
      {status === "empty" && <div className="text-sm text-text-muted">No result</div>}
      {(status === "success" || status === "idle") && children}
    </div>
  );
}