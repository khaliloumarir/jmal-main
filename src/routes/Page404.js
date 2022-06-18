import { useTranslation } from "react-i18next";
import image from "./assets/images/404.svg";
import { Link } from "react-router-dom";
import "./assets/css/style.css";
export default function Page404() {
  const { t } = useTranslation();
  return (
    <div>
      {/* <h1>{t("404_page")}</h1> */}
      <div class="container">
        <img class="mx-auto h-[400px]" src={image} />
        <br />
        <h3>{t("404_page")}</h3>
        <br />
        <Link to="/">
          <button class="hover:opacity-75">{t("get_back")}</button>
        </Link>
      </div>
    </div>
  );
}
