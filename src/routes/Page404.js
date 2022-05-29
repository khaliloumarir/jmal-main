import { useTranslation } from "react-i18next";
export default function Page404() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("404_page")}</h1>
    </div>
  );
}
