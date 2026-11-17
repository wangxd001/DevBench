interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div role="status" aria-label={title}>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
    </div>
  );
}
