import { useTranslation } from 'react-i18next';

export function PrivacyPage() {
  const { t } = useTranslation();
  const items = [
    t('privacy.items.local'),
    t('privacy.items.noUpload'),
    t('privacy.items.noTracking'),
    t('privacy.items.noPersist'),
    t('privacy.items.browserRisk'),
    t('privacy.items.hostingMeta'),
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold">{t('privacy.title')}</h1>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
