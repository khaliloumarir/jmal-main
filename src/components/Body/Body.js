import BodySlidingShow from "./BodySlidingShow";
import Showcase from "./Showcase";
import WhyUsBanner from "./WhyUsBanner"
export default function Body() {
  const products = [
    {
      image: "https://i.postimg.cc/FKVkssPx/3.jpg/5.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/Nf2y2xJF/9.jpg/11.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/wxGyBrkn/10.jpg/1.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/fbDkFQwS/7.jpg/9.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/4d47KkqR/5.jpg/7.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/FKVkssPx/3.jpg/5.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/fbDkFQwS/7.jpg/9.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/Nf2y2xJF/9.jpg/11.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/wxGyBrkn/10.jpg/1.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/FKVkssPx/3.jpg/5.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/Nf2y2xJF/9.jpg/11.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
    {
      image: "https://i.postimg.cc/wxGyBrkn/10.jpg/1.jpg",
      pricePerQuantity: 2000,
      quantity: 100,
    },
  ];
  const sellers = new Array(6).fill({
    image: "https://i.postimg.cc/ZRx5zbLG/1068e54259e74ad8c97cdbb9b2f37a80.jpg",
    name: "Ahmed Store",
  });
  return (
    <div className="px-4">
      <BodySlidingShow
        title="Top products"
        data={products}
        showDetails={true}
        link={""}
      />
      <BodySlidingShow
        title="Most active sellers"
        data={sellers}
        showDetails={false}
      />
      <Showcase />
      <WhyUsBanner />
    </div>
  );
}
