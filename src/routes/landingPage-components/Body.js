import Telegram from "./Telegram.svg";
import JmalIllustration from "./JmalIllustration.svg";
import ClientIllustration from "./ClientIllustration.svg";
import { useTranslation } from "react-i18next";
function Arguments({ illustration, title, text, side }) {
  return (
    <div className="flex my-8 flex-col sm:flex-row ">
      <img
        alt={`e-commerce ${side}`}
        src={illustration}
        className={
          side === "last"
            ? ` sm:order-last w-[350px] lg:w-full  `
            : ` sm:order-first w-[350px] lg:w-full`
        }
      />
      <section className="flex flex-col justify-center  space-y-8 py-4 lg:px-4 ">
        <h4>{title}</h4>
        <p>{text}</p>
      </section>
    </div>
  );
}

function Body() {
  const { t } = useTranslation();
  return (
    <div>
      <section className="flex justify-center my-16">
        <img
          alt="e-commerce products mock up"
          className=""
          src="https://i.postimg.cc/pdqpWZGV/Safari-Dark-Mode-ON.png"
        />
      </section>
      <section className="flex justify-center flex-col items-center space-y-4 text-center">
        <img alt="telegram icon" className="w-[80px] h-[80px]" src={Telegram} />
        <h3 className="">{t("first_arg")}</h3>
        <p className="sm:max-w-[450px]">{t("first_arg_comment")}</p>
      </section>
      <section className="my-16">
        <section className="px-8">
          <hr />
        </section>
        <Arguments
          illustration={ClientIllustration}
          title={t("second_arg")}
          text={t("second_arg_comment")}
          side="last"
        />
        <Arguments
          illustration={JmalIllustration}
          title={t("third_arg")}
          text={t("third_arg_comment")}
          side="first"
        />
      </section>
    </div>
  );
}

export default Body;
