interface SecondaryAction { label: string; onClick: () => void; }

interface ToolActionBarProps {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  secondaryActions?: SecondaryAction[];
  processing?: boolean;
}

export function ToolActionBar({ primaryLabel, onPrimary, primaryDisabled, secondaryActions, processing }: ToolActionBarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled || processing}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {processing ? "..." : primaryLabel}
      </button>
      {secondaryActions?.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className="rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary hover:bg-primary-soft hover:text-primary"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
