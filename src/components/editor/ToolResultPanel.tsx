import { ReactNode } from "react";

type ResultStatus = "idle" | "processing" | "success" | "error" | "empty";

interface ToolResultPanelProps {
  title: string;
  status: ResultStatus;
  error?: string;
  onCopy?: () => void;
  children: ReactNode;
}

export function ToolResultPanel({ title, status, error, onCopy, children }: ToolResultPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-text">{title}</h2>
        <div className="flex gap-2">
          {status === "processing" && <span className="text-xs text-text-muted" aria-live="polite">Processing...</span>}
          {onCopy && status === "success" && (
            <button type="button" onClick={onCopy} className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted">Copy</button>
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
