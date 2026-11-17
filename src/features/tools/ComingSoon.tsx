import { useTranslation } from "react-i18next";

export function ComingSoon() {
  const { t } = useTranslation();
  return (
    <div className="flex h-64 flex-col items-center justify-center text-center">
      <p className="text-sm text-text-muted">{t("tool.comingSoon")}</p>
    </div>
  );
}
