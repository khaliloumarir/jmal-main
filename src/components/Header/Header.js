import { MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";
export default function Header() {
  const navigation = [
    {
      name: "Find seller",
      url: "/find-seller",
    },
    {
      name: "Demands for products",
      url: "/products-demand",
    },
    {
      name: "How does it work ?",
      url: "/how",
    },
    {
      name: "Why us",
      url: "/why-us",
    },
  ];
  return (
    <div>
      <header className="z-50 h-1/4   flex items-center justify-between border-b-[1px] border-[#b4b4b4] sticky top-[0px]  px-4 lg:px-16 py-4 sm:py-8 ">
        <p>Logo</p>
        <nav className=" lg:basis-2/4  basis-3/5 sm:block hidden ">
          <ul className="flex lg:justify-between justify-around  items-center">
            {navigation.map((item) => {
              return (
                <li key={item.url} className="cursor-pointer">
                  <a>{item.name}</a>
                </li>
              );
            })}
          </ul>
        </nav>
        <section className="flex items-center  justify-between    ">
          <a href="#" className="">
            <Link to="telegram">
              <button>Login</button>
            </Link>
          </a>
          <a className="block sm:hidden  ">
            <MdMenu className=" text-2xl " />
          </a>
        </section>
      </header>
    </div>
  );
}
