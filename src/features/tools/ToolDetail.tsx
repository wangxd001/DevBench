import { Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TOOL_IDS } from "@/tools/registry/constants";
import { TOOLS } from "@/tools/registry/tools";
import { useRecentToolsStore } from "@/stores/recent-tools-store";
import type { ToolId } from "@/tools/registry/types";

export function ToolDetail() {
  const { toolId } = useParams<{ toolId: string }>();
  const { t } = useTranslation();
  const addRecent = useRecentToolsStore((s) => s.addRecent);

  const isValidId = TOOL_IDS.includes(toolId as ToolId);
  const toolDef = toolId ? TOOLS[toolId as ToolId] : undefined;

  // Record recent usage only when the tool page is successfully entered
  useEffect(() => {
    if (isValidId && toolDef) {
      addRecent(toolId as ToolId);
    }
  }, [isValidId, toolDef, addRecent, toolId]);

  if (!isValidId) {
    return (
      <div>
        <h1 className="text-xl font-semibold">{toolId}</h1>
        <p className="mt-2 text-sm text-text-muted">{t("tool.notImplemented")}</p>
      </div>
    );
  }

  if (!toolDef) {
    return (
      <div>
        <h1 className="text-xl font-semibold">{toolId}</h1>
        <p className="mt-2 text-sm text-text-muted">{t("tool.comingSoon")}</p>
      </div>
    );
  }

  const ToolComponent = toolDef.component;

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="animate-pulse text-sm text-text-muted">Loading...</div>
        </div>
      }
    >
      <ToolComponent />
    </Suspense>
  );
}
