import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOL_IDS } from '@/tools/registry/constants';

export function ToolDetail() {
  const { toolId } = useParams<{ toolId: string }>();
  const { t } = useTranslation();

  const isValidId = TOOL_IDS.includes(toolId as (typeof TOOL_IDS)[number]);

  return (
    <div>
      <h1 className="text-xl font-semibold">{toolId}</h1>
      <p className="mt-2 text-sm">{isValidId ? t('tool.comingSoon') : t('tool.notImplemented')}</p>
    </div>
  );
}
