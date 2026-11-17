import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface RelatedTool { id: string; name: string; }

interface ToolPageLayoutProps {
  title: string;
  description: string;
  category: string;
  relatedTools?: RelatedTool[];
  children: ReactNode;
}

export function ToolPageLayout({ title, description, category, relatedTools, children }: ToolPageLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-text-muted">{category}</div>
        <h1 className="mt-1 text-xl font-semibold text-text">{title}</h1>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
      {relatedTools && relatedTools.length > 0 && (
        <div className="border-t border-border pt-4">
          <h2 className="text-sm font-medium text-text-secondary">Related Tools</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {relatedTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.id}`}
                className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-muted"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
