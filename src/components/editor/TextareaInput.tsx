interface TextareaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextareaInput({ value, onChange, placeholder, rows = 10 }: TextareaInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-md border border-border bg-surface-muted p-3 font-mono text-sm text-text focus:border-primary focus:outline-none"
      aria-label="Input"
    />
  );
}
