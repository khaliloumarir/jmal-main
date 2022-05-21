import Telegram from "./Telegram.svg";
import JmalIllustration from "./JmalIllustration.svg";
import ClientIllustration from "./ClientIllustration.svg";

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
  return (
    <div>
      <section className="flex justify-center my-16">
        <img
          alt="e-commerce products mock up"
          className=""
          src="https://i.postimg.cc/ZK1hmpwr/mock-Up-min.png"
        />
      </section>
      <section className="flex justify-center flex-col items-center space-y-4 text-center">
        <img alt="telegram icon" className="w-[80px] h-[80px]" src={Telegram} />
        <h3 className="">جميع منتوجات الجمالة المتواجدين ف تيليغرام </h3>
        <p className="sm:max-w-[450px]">
          أول ﻣﺤﺮك أوﺗﻮﻣﺎﺗﻴﻜﻲ او ﺑﺮﻧﺎﻣﺞ ﻛﺨﺪﻣﺔ ﻳﻘﺪم ﻟﻚ ﻣﻨﺘﺠﺎ ﻣﻨﻈﻤﺎ ﻣﻦ ﻗﻨﻮات ﺗﺠﺎر
          اﻟﺠﻤﻠﺔ ﺑﺘﻴﻠﻴﻐﺮام اﻟﻤﻨﺨﺮﻃﻴﻦ ﻣﻊ ﺻﻠﺔ , ﻏﻴﺮ ﻃﺮﻳﻘﺔ ﻋﻤﻠﻚ ووﻓﺮ ﻋﻠﻰ ﻧﻔﺴﻚ وﻗت
          كبير ﺣﺘﻰ ﺗﺘﻤﻜﻦ ﻣﻦ اﻟﺘﺮﻛﻴﺰ ﻋﻠﻰ ﻣﺎ ﻫﻮ ﻣﻬﻢ
        </p>
      </section>
      <section className="my-16">
        <section className="px-8">
          <hr />
        </section>
        <Arguments
          illustration={ClientIllustration}
          title="؟ COD كتقلب على برودوي تخدم عليم ؟ بغيتي تبدى الكوميرس ؟ أو "
          text="هدي هي الفرصة باش تبدا أولا تطور المشروع ديالك,صلة كينقص عليك الوقت لي تقدر تضيعو على الخاوي,تصفح و ختار البرودوي لي باغي وصلة توفر ليك جميع المعلومات لي محتاجها. طل على السوق كامل فينما كنتي فقط من بلاصة وحدة, عند صلة"
          side="last"
        />
        <Arguments
          illustration={JmalIllustration}
          title="ﺑﺎﺋﻊ ﺑﺎﻟﺠﻤﻠﺔ ؟ ﻋﻨﺪك ﺷﺎﻧﻴﻞ ﺗﻴﻠﻴﻐﺮام؟"
          text="ﻗﻢ ﺑﺎﻟﺘﺴﺠﻴﻞ وﺗﺰوﻳﺪ زبناﺋﻚ ﺑﺄﺣﺪث اﻟﻤﻨﺘﺠﺎت اﻟﻤﻨﻈﻤﺔ اﻟﺘﻲ ﺗﻘﺪﻣﻬﺎ ، ﺑﺎﺳﺘﺨﺪام ﺳﻴﺮ اﻟﻌﻤﻞ اﻟﻤﻌﺘﺎد ﻓﻲ ﺗﻴﻠﻴﻐﺮامو وجيب  و زبناء جداد وشهر المنتوجات و المحل الديالك"
          side="first"
        />
      </section>
    </div>
  );
}

export default Body;
