import ProductShow from "./ProductShow";
import { FaLongArrowAltRight } from "react-icons/fa";
import { BsChevronRight } from "react-icons/bs";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
export default function BodySlidingShow({ title, showDetails, data, link }) {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
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
  const CustomRightArrow = ({ onClick, ...rest }) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType },
    } = rest;
    // onMove means if dragging or swiping in progress.
    return <button onClick={() => onClick()} />;
  };
  return (
    <div className=" pt-8 ">
      <section className="flex items-center pb-8 ">
        {title && <h6>{title}</h6>}
        {showDetails && (
          <a href={link ?? "#"} className="ml-2 flex items-center">
            See all <FaLongArrowAltRight />
          </a>
        )}
      </section>
      <Carousel
        containerClass=""
        itemClass=""
        swipeable={true}
        transitionDuration={0}
        responsive={responsive}
      >
        {data.map((item) => {
          return (
            <ProductShow
              image={item.image}
              pricePerQuantity={item.pricePerQuantity}
              quantity={item.quantity}
              name={item.name ?? null}
            />
          );
        })}
      </Carousel>
    </div>
  );
}
