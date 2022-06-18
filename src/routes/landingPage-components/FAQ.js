const QandAs = [
  {
    question: "ما هي أفضل طريقة للعثور على المنتج الذي أبحث عنه؟",
    answer:
      "ألا كنتي عارف شنو بغيتي ماعليك غير تفتح الموقع و بحث ف 'الفئات' وشوف هير البرودوي اللي مهتم بيه ",
  },
  {
    question: "بعد أن أجد منتجي المثالي,كيف يمكنني طلبه؟",
    answer:
      "كل ما عليك فعله هو النقر فوق المنتج للحصول على مزيد من المعلمومات حول البائع و اتصال بالبائع لطلب المنتوج",
  },
  {
    question: "هل صلة مجاني ؟",
    answer: "صلة خالية من أي رسوم,الموقع مجاني ثماما",
  },
  {
    question: "مادا أفعل ادا كان لدي سؤال أو شكوة في استعمال الموقع",
    answer: "يرجى الاتصال بنا عن طريق الدردشة أو من خلال صفحتنا الفايسبوك",
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
