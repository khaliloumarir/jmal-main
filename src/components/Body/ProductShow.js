export default function ProductShow({
  image,
  pricePerQuantity,
  quantity,
  name,
}) {
  return (
    <div className=" flex flex-col items-center ">
      <section className="sample lg:h-[15vw] lg:w-[15vw] md:h-[22vw] md:w-[22vw] h-[40vw] w-[40vw] bg-main ">
        {/*TODO:Fix the img to be a certain width and height to prevent Content moving, aka Layout shift    className="sample "  className=" sample-img" object-contain object-center*/}
        <img src={image} className=" sample-img " />
      </section>
      <section className="py-4 ">
        {name ? (
          <p>{name}</p>
        ) : (
          <p>
            {pricePerQuantity} dh/{quantity} Unit
          </p>
        )}
      </section>
    </div>
  );
}
