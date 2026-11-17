import { useTranslation } from 'react-i18next';

export function ToolsPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-xl font-semibold">{t('nav.tools')}</h1>
      <p className="mt-2 text-sm text-text-secondary">
        {/* 工具列表在工具实现阶段补入 */}
      </p>
    </div>
  );
}
