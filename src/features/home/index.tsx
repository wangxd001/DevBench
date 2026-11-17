import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t('app.title')}</h1>
      <p className="mt-1 text-sm text-text-secondary">{t('app.subtitle')}</p>
      <div className="mt-4">
        <Link to="/tools" className="text-sm text-primary underline">
          {t('nav.tools')}
        </Link>
      </div>
    </div>
  );
}
