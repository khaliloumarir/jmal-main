const QandAs = [
  {
    question: "ما هي أفضل طريقة للعثور على المنتج الذي أبحث عنه؟",
    answer:
      "ألا كنتي عارف شنو بغيتي ماعليك غير تفتح الموقع و بحث ف 'الفئات' وشوف هير البرودوي اللي مهتم بيه ",
  },
  {
    question: "بعد أن أجد منتجي المثالي,كيف يمكنني طلبه؟",
    answer: "",
  },
  {
    question: "ﻫﻞ ﻳﺘﻮﻟﻰ ﺳﻮق اﻟﺘﺎﺟﺮ اﻟﻤﻌﺎﻣﻠﺎت اﻟﺘﺠﺎرﻳﺔ؟",
    answer:
      ". ﻟﺎ ﻳﺸﺎرك SELLA ﻓﻲ اﻟﺼﻔﻘﺔ .ﻧﻌﺮض ﻟﻠﻤﺴﺘﺨﺪم ﻃﺮق اﻟﺪﻓﻊ اﻟﻤﻘﺒﻮﻟﺔ ﻣﻦ ﻗﺒﻞ اﻟﺒﺎﺋﻊ ﻟﻴﺴﺘﻄﻴﻊ اﻟﻤﺴﺘﺨﺪم إدارﺗﻬﺎ ﻣﺒﺎﺷﺮة ﻣﻊ اﻟﻤﻮرد",
  },
  {
    question: "ﻫﻞ ﻳﺘﻮﻟﻰ ﺳﻮق اﻟﺘﺎﺟﺮ اﻟﻤﻌﺎﻣﻠﺎت اﻟﺘﺠﺎرﻳﺔ؟",
    answer:
      ". ﻟﺎ ﻳﺸﺎرك SELLA ﻓﻲ اﻟﺼﻔﻘﺔ .ﻧﻌﺮض ﻟﻠﻤﺴﺘﺨﺪم ﻃﺮق اﻟﺪﻓﻊ اﻟﻤﻘﺒﻮﻟﺔ ﻣﻦ ﻗﺒﻞ اﻟﺒﺎﺋﻊ ﻟﻴﺴﺘﻄﻴﻊ اﻟﻤﺴﺘﺨﺪم إدارﺗﻬﺎ ﻣﺒﺎﺷﺮة ﻣﻊ اﻟﻤﻮرد",
  },
];

function FAQ({ question, answer }) {
  return (
    <div className="text-right bg-[#363636] text-[#FFFFFF] rounded-xl py-4 px-4">
      <h5 className="text-center text-[#FFFFFF]">{question}</h5>
      <hr className="text-main mt-4" />
      <p className="text-[#FFFFFF]">{answer}</p>
    </div>
  );
}

function FAQGroup() {
  return (
    <div className="flex flex-col items-center">
      <h3>FAQ</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {QandAs.map((element, index) => {
          return (
            <FAQ
              key={index * Math.floor(Math.random() * 999)}
              question={element.question}
              answer={element.answer}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FAQGroup;
