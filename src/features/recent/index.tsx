import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/common/EmptyState';

export function RecentPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-xl font-semibold">{t('nav.recent')}</h1>
      <div className="mt-4">
        <EmptyState title={t('common.empty')} />
      </div>
    </div>
  );
}
