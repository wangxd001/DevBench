import { lazy, Suspense } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "json" | "javascript";
  readOnly?: boolean;
  height?: number;
}

const CodeMirrorEditorImpl = lazy(() => import("@/components/editor/CodeMirrorEditorImpl"));

export function CodeEditor({ value, onChange, language, readOnly, height = 300 }: CodeEditorProps) {
  return (
    <div style={{ height }}>
      <Suspense fallback={<div className="h-full animate-pulse rounded-md bg-surface-muted" />}>
        <CodeMirrorEditorImpl
          value={value}
          onChange={onChange}
          language={language}
          readOnly={readOnly}
          height={height}
        />
      </Suspense>
    </div>
  );
}
