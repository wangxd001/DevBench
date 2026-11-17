import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-xl font-semibold">{t('notFound.title')}</h1>
      <p className="mt-2 text-sm text-text-secondary">{t('notFound.description')}</p>
      <div className="mt-4">
        <Link to="/" className="text-sm text-primary underline">
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}
