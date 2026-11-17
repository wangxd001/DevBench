interface InputSizeIndicatorProps {
  current: number;
  limit: number;
  unit: string;
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

export function InputSizeIndicator({ current, limit, unit }: InputSizeIndicatorProps) {
  const ratio = limit > 0 ? current / limit : 0;
  const colorClass = ratio >= 1 ? "text-error" : ratio >= 0.8 ? "text-warning" : "text-text-muted";
  return (
    <span className={"text-xs " + colorClass} aria-live="polite">
      {formatSize(current)} {unit} / {formatSize(limit)} {unit}
    </span>
  );
}
