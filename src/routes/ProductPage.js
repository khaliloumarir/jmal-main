import Carousel from "react-multi-carousel";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import validator from "validator";
//,product:state.product
const Buffer = require("buffer/").Buffer;
function ProductPage({ product }) {
  const { state } = useLocation();
  useEffect(() => {
    console.log(currentProduct);
  }, []);
  const [currentProduct, setCurrentProduct] = useState(state ? state : product);
  const [otherMedia, setOtherMedia] = useState(currentProduct.media);
  const [currentMedia, setCurrentMedia] = useState(currentProduct.image);
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
      items: 4,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
    },
  };
  return (
    <div className="lg:px-24 sm:px-8">
      <div className="grid sm:grid-cols-2 grid-cols-1 ">
        <section>
          <img
            src={`data:image/png;base64,${Buffer.from(currentMedia).toString(
              "base64"
            )}`}
            className="object-contain md:h-[500px]"
          />
        </section>
        <section className="flex flex-col sm:ml-4 my-2 space-y-4  ">
          <p className="productName">{currentProduct["Name"]}</p>
          <p className="text-main">{currentProduct["channelName"]}</p>
          <section>
            {currentProduct.Sizes?.length && <p>Sizes</p>}

            <ul className="grid sm:grid-cols-6 grid-cols-4  gap-2">
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
          <section className="flex">
            {currentProduct["Quantity"] && (
              <>
                <p className="option">Quantity</p>
                <p className=" text-[#5B6871] option">
                  Available : {currentProduct["Quantity"]}
                </p>
              </>
            )}
            {currentProduct["Minimum"] && (
              <p className=" text-[#5B6871] option">
                Minimum : {currentProduct["Minimum"]}
              </p>
            )}
          </section>
          <section className="flex items-center">
            <p className=" font-bold ">Price:</p>
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
          <a href={`#${currentProduct.Contact}`}>
            <button className="sm:self-start">Contact Seller</button>
          </a>
        </section>
        <Carousel
          containerClass="sm:col-span-2 my-2 "
          itemClass="even:mx-2"
          swipeable={true}
          transitionDuration={0}
          responsive={responsive}
        >
          <img
            onClick={() => {
              setCurrentMedia(currentProduct.image);
            }}
            src={`data:image/png;base64,${Buffer.from(
              currentProduct.image
            ).toString("base64")}`}
            className="object-contain cursor-pointer"
          />
          {otherMedia?.map((item) => {
            return (
              <img
                src={`data:image/png;base64,${Buffer.from(item.bytes).toString(
                  "base64"
                )}`}
                onClick={() => {
                  setCurrentMedia(item.bytes);
                }}
                className="object-contain cursor-pointer "
              />
            );
          })}
        </Carousel>
      </div>

      <div className="pt-6">
        <h6 className="py-2 productName">Description</h6>
        <p> {currentProduct.Description ?? ""} </p>
      </div>
    </div>
  );
}
function mapStateToProps(state) {
  console.log({
    product: state.product,
    client: state.client,
    session: state.session,
  });
  return {
    product: state.product,
    client: state.client,
    session: state.session,
  };
}
export default connect(mapStateToProps, {})(ProductPage);
