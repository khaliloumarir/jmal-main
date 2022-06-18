import WholeSaleSVG from "./WholeSale.svg";
import { Link } from "react-router-dom";
import "react-phone-number-input/style.css";
function Hero() {
  return (
    <div>
      <nav className="flex items-center justify-between py-4">
        <img
          alt="sella logo"
          src={"https://i.postimg.cc/Y9qwKpkv/Logo-1.png"}
          className="h-[40px] max-w-[120px]  "
        />
        <Link to="/telegram">
          <button className="hover:opacity-75 active:opacity-100">
            تسجل معنا
          </button>
        </Link>
      </nav>
      <div className="flex justify-center items-center py-8 ">
        <section className=" sm:space-y-8 ">
          {/* Writings and buttons */}
          <h1>ﺗﻘﺪا اﻟﺒﺮودوي دﻳﺎﻟﻚ ﻣﻦ ﻋﻨﺪ اﻟﺠﻤﺎل ﻟﻲ ﻳﻨﺎﺳﺒﻚ</h1>
          <h2 className="">
            حل مرن و مبتكر لتحقيق المزيد. ابق على اطلاع بأحدث المنتجات.أحسن شبكة
            ديال تجار الجملة في المغرب
          </h2>
          <section className="my-2 flex">
            <Link to="/telegram">
              <button className="hover:opacity-75 active:opacity-100">
                تسجل معنا
              </button>
            </Link>
          </section>
        </section>
        <section className="">
          {/* Illustration */}
          <img
            alt="wholesale"
            src={WholeSaleSVG}
            className="w-[900px] sm:block hidden"
          />
        </section>
      </div>
    </div>
  );
}

export default Hero;
