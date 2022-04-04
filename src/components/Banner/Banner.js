import language from "./language";

export default function Banner() {
  //TODO:Get current language from context or from somewhere ? window ? os ? idk

  return (
    <div className=" text-center pt-4 px-4">
      <input
        className="sm:w-3/5 rounded-full sm:py-5 sm:px-8 py-3 px-6 w-3/4 outline-none  searchBar"
        type="text"
        placeholder={language.english.banner.searchBar}
      />
      <h1 className="pt-4">{language.english.banner.title}</h1>
      <section className="flex items-center justify-center pt-12 pb-20">
        <h6>Open your store Now:</h6>
        <button className="ml-4">become seller</button>
      </section>
    </div>
  );
}
