import Facebook from "./socials/Facebook.svg";
import Instagram from "./socials/Instagram.svg";

const socials = [
  {
    img: Facebook,
    link: "https://www.facebook.com/sellaprod",
    analyticName: "Facebook Page",
  },
  {
    img: Instagram,
    link: "https://www.instagram.com/sella.prod/",
    analyticName: "Instagram Page",
  },
];
function JoinUs() {
  return (
    <div className="flex flex-col justify-center items-center my-4 text-center">
      <p className="max-w-[900px]">
        ﻳﺘﻜﻮن ﻣﺠﺘﻤﻌﻨﺎ ﻣﻦ أﺷﺨﺎص ﻣﻦ ﺟﻤﻴﻊ أﻧﺤﺎء اﻟﺒﻠﺎد ، ﻟﺪﻳﻬﻢ اﻟﺪاﻓﻊ ﻟﺘﻄﻮﻳﺮ وﺗﻨﻤﻴﺔ
        أﻋﻤﺎﻟﻬﻢ اﻟﺘﺠﺎرﻳﺔ .ﺗﻌﻠﻢ ﻣﻦ ﻣﺴﺘﺨﺪﻣﻲ SELLA اﻟﺂﺧﺮﻳﻦ ، ﻣﺎﻟﻜﻲ ﻋﻤﻠﻴﺎت اﻟﺪﻓﻊ ﻋﻨﺪ
        اﻟﺎﺳﺘﻠﺎم ﻣﻦ ﺧﻠﺎل ﻣﺠﻤﻮﻋﺔ اﻟﻔﻴﺴﺒﻮك ﻟﺪﻳﻨﺎ.
      </p>

      <a
        href="https://www.facebook.com/groups/sella/"
        rel="noopener noreferrer"
        target="_blank"
        className="hover:opacity-75 active:opacity-100"
      >
        <button>انضم الان</button>
      </a>
    </div>
  );
}

function Footer() {
  return (
    <div>
      <JoinUs />
      <div className="mt-4">
        <hr />
        <section className="flex items-center justify-between mt-4 sm:flex-row flex-col ">
          <section className="flex space-x-4">
            <p>Privacy Policy </p>
            <p>Terms and conditions</p>
          </section>
          <section className="flex even:mx-2">
            {socials.map((element) => {
              return (
                <a
                  key={element.analyticName}
                  className="hover:opacity-75 active:opacity-100"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={element.link}
                >
                  <img
                    alt={element.analyticName}
                    key={element.link}
                    src={element.img}
                    className="w-[28px] h-[28px]"
                  />
                </a>
              );
            })}
          </section>
        </section>

        <section className="flex flex-col items-center text-center">
          <img
            alt="sella logo"
            src={"https://i.postimg.cc/MTHv4gZ6/Logo.png"}
            className="h-[80px]"
          />
          <p>
            © Sella. 2022 All rights reserved MADE TO LAST- Developed by Sella
            Team
          </p>
        </section>
      </div>
    </div>
  );
}

export default Footer;
