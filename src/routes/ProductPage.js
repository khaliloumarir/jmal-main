import Carousel from "react-multi-carousel";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import validator from "validator";
import NewHeader from "../components/NewHeader";
import Dialog from "@mui/material/Dialog";
import "react-multi-carousel/lib/styles.css";
import { useTranslation } from "react-i18next";
import Linkify from "react-linkify";
//,product:state.product
const Buffer = require("buffer/").Buffer;
function ProductPage({ product }) {
  const { t } = useTranslation();
  const { state } = useLocation();

  const currentProduct = useState(state ? state : product)[0];
  const [currentMedia, setCurrentMedia] = useState(currentProduct.image);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const handleContactDialogClose = () => {
    setOpenContactDialog(!openContactDialog);
  };
  useEffect(() => {
    console.log(currentProduct);
  }, []);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 8,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 8,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 6,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 4,
    },
  };

  return (
    <div className="px-2 sm:px-4 lg:px-8">
      <NewHeader />
      <div className="border-t-[1px] border-borderColor py-2">
        <div className="grid sm:grid-cols-2 grid-cols-1 ">
          <section>
            <img
              alt="main "
              src={`data:image/png;base64,${Buffer.from(currentMedia).toString(
                "base64"
              )}`}
              className="object-contain md:h-[500px]"
            />
          </section>
          <section className="flex flex-col sm:px-4 my-2 space-y-4  ">
            <p className="productName">
              {currentProduct["Name"].length >= 30
                ? currentProduct["Name"].substring(0, 30) + "..."
                : currentProduct["Name"].substring(0, 30)}
            </p>
            <p className="text-main">{currentProduct["channelName"]}</p>
            <section>
              {currentProduct.Sizes?.length && (
                <p className="text-xl">{t("sizes")}</p>
              )}

              <ul className="grid sm:grid-cols-4 grid-cols-4  gap-2">
                {currentProduct.Sizes?.split(",").map((size) => {
                  return (
                    <li className="bg-[#cecece] text-center  p-2">
                      <p>{size}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
            {/* <section>
                        <p>Colors</p>
                        <ul className="grid sm:grid-cols-4 grid-cols-3 gap-2">

                            <li className="bg-[#cecece]  text-center p-2"><p>Red</p></li>
                            <li className="bg-[#cecece]  text-center p-2"><p>Green</p></li>
                            <li className="bg-[#cecece]  text-center p-2"><p>Blue</p></li>
                            <li className="bg-[#cecece]  text-center p-2"><p>Alpha</p></li>
                            <li className="bg-[#cecece]  text-center p-2"><p>Red</p></li>
                        </ul>
                    </section> */}
            <section className="flex flex-col justify-start items-start">
              {currentProduct["Quantity"] && (
                <>
                  <p className="option text-xl">{t("quantity")}</p>
                  <p className=" text-[#5B6871] option">
                    {t("available")} : {currentProduct["Quantity"]}
                  </p>
                </>
              )}
              {currentProduct["Minimum"] && (
                <p className=" text-[#5B6871] option">
                  {t("minimum_quantity")} : {currentProduct["Minimum"]}
                </p>
              )}
            </section>
            <section className="flex items-center">
              <p className=" font-bold ">{t("price")}:</p>
              <p className="ml-2  option">
                {validator.trim(currentProduct.Price)}
              </p>
            </section>
            {/* <section className="flex justify-between">
                        <div className="flex flex-col items-center">
                            <p className="text-main font-bold ">150 Dh/u</p>
                            <p>100-200 Pièces</p>
                        </div>
                        <div className="flex flex-col items-center ">
                            <p className="text-main font-bold ">120 Dh/u</p>
                            <p>200-500 Pièces</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-main font-bold">100 Dh/u</p>
                            <p>{">"}500 Pièces</p>
                        </div>
                    </section> */}
            <button
              onClick={() => {
                handleContactDialogClose();
              }}
              className="sm:self-start"
            >
              {t("contact_seller")}
            </button>
          </section>
          <Carousel
            containerClass="sm:col-span-2 my-2 "
            itemClass="even:mx-2 "
            swipeable={true}
            transitionDuration={0}
            responsive={responsive}
          >
            <img
              alt={`mini main `}
              onClick={() => {
                setCurrentMedia(currentProduct.image);
              }}
              src={`data:image/png;base64,${Buffer.from(
                currentProduct.image
              ).toString("base64")}`}
              className="object-contain cursor-pointer h-[100px] "
            />
            {currentProduct?.media?.map((item, index) => {
              return (
                <img
                  alt={`other media  ${index}`}
                  src={`data:image/png;base64,${Buffer.from(
                    item.bytes
                  ).toString("base64")}`}
                  onClick={() => {
                    setCurrentMedia(item.bytes);
                  }}
                  className="object-contain cursor-pointer h-[100px]"
                />
              );
            })}
          </Carousel>
        </div>

        <div className="pt-6">
          <h6 className="py-2 productName">{t("description")}</h6>
          <p className="whitespace-pre-line">
            {currentProduct.Description ?? ""}
          </p>
        </div>
        <Dialog onClose={handleContactDialogClose} open={openContactDialog}>
          <section className="w-min-[200px] h-[100px] flex justify-center items-center px-4">
            <Linkify>
              {t("contact_seller")} : {currentProduct.Contact}
            </Linkify>
          </section>
        </Dialog>
      </div>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    product: state.product,
    client: state.client,
    session: state.session,
  };
}
export default connect(mapStateToProps, {})(ProductPage);
