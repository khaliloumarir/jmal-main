export default function Showcase() {
  return (
    <div className="bg-[url('./images/smile.png')] h-[80vh] bg-cover  ">
      <section className="h-full w-full  flex flex-col justify-between p-8 ">
        <section className=" w-2/6 h-full flex flex-col justify-around self-end">
          <p className="text-[#FFFFFF] text-2xl font-medium ">For clients</p>
          <h3 className="text-[#FFFFFF] text-6xl font-medium ">
            Find talent your way
          </h3>
          <p className="text-[#FFFFFF]  text-xl   ">
            Work with the largest network of independent prossionals and get
            things done - from quick turnarounds to big transformations.
          </p>
        </section>
        <section className="flex  justify-center ">
        <div className="grid sm:grid-cols-3 grid-rows-3 sm:gap-4 gap-2 self-end">
          {new Array(3).fill("").map((item) => {
            return (
              <section className="bg-main  flex flex-col sm:justify-between p-4 lg:w-10/12  rounded-md ">
                <h6 className="text-[#FFFFFF] sm:text-3xl lg:w-4/5 font-medium py-2 w-3/5">
                  Post a job and hire a pro
                </h6>
                <a className="text-[#FFFFFF] text-sm sm:text-md font-semibold sm:font-medium cursor-pointer self-end">
                  Talent Marketplace
                </a>
              </section>
            );
          })}
        </div>
        </section>

      </section>
    </div>
  );
}
