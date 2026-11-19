import { useState } from "react";

interface ResultViewerProps {
  content: string;
  collapsible?: boolean;
}

export function ResultViewer({ content, collapsible = false }: ResultViewerProps) {
  const [expanded, setExpanded] = useState(!collapsible);
  const lines = content.split("\n");
  const previewLines = lines.slice(0, 50);
  const isTruncated = collapsible && lines.length > 50;

  return (
    <div className="relative">
      <pre className="max-h-96 overflow-auto rounded-md bg-surface-muted p-3 font-mono text-sm text-text">
        {expanded ? content : previewLines.join("\n")}
        {isTruncated && !expanded && "\n..."}
      </pre>
      {isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-1 right-1 rounded border border-border bg-surface-muted px-2 py-0.5 text-xs text-text-secondary hover:bg-primary-soft hover:text-primary"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      )}
    </div>
  );
}
