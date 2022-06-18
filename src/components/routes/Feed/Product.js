import { connect } from "react-redux";
import { createProduct } from "../../../actions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Product({ product, createProduct, channelName }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex sm:flex-col border-[#EAEAEA] border-[0.5px] px-2  py-2 max-h-[400px] rounded-md ">
      <section
        onClick={() => {
          createProduct(product);
          navigate("../product", { state: product });
        }}
      >
        <img
          alt={`product ${product["Name"]}`}
          src={`data:image/png;base64,${product.image?.toString("base64")}`}
          className="sm:w-[225px] w-[150px] h-[150px]  sm:h-[225px] object-contain self-center "
        />
      </section>
      <section className="flex flex-col sm:ml-0 px-2">
        <section
          onClick={() => {
            createProduct(product);
            navigate("../product", { state: product });
          }}
          className="hover:underline cursor-pointer"
        >
          <p className="font-bold">
            {product["Name"].length >= 30
              ? product["Name"].substring(0, 30) + "..."
              : product["Name"].substring(0, 30)}
          </p>
        </section>
        <ul className="mt-4 mb-6 w-[70%]">
          <li>
            <p className="">
              {product["Price"]} {t("per_unit")}
            </p>
          </li>
          {/* <li>
            <p className="text-[#717171] text-sm ">
              From{" "}
              <Link
                to={`/${product["Channel"] ?? product["channelName"]}`}
                className="text-main"
              >
                {product["Channel"] ?? product["channelName"]}
              </Link>
            </p>
          </li> */}
          <li>
            <p className="text-[#717171] text-sm">{`${new Date(
              product["date"]
            ).toLocaleDateString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}</p>
          </li>
        </ul>
        {/* <i className="self-end cursor-pointer text-[#545454] border-[#b5b5b5] hover:text-main mb-4 inline-flex justify-center items-center w-[28px] h-[28px] rounded-full border-[0.5px] hover:border-main  active:text-main active:border-main ">
          <FavoriteBorderIcon
            sx={{
              fontSize: "18px",
            }}
          />
        </i> */}
      </section>
    </div>
  );
}

function mapStateToProps(state) {
  return { client: state.client, session: state.session };
}
export default connect(mapStateToProps, { createProduct })(Product);
