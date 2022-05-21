export default function ChannelDetails({ title, photo, about }) {
  return (
    <section className="flex sm:flex-row flex-col">
      <img
        alt="channel "
        className="rounded-full w-[180px] h-[180px] "
        src={`data:image/png;base64,${photo?.bytes?.toString("base64")}`}
      />
      <section className="px-4">
        <h4 className="text-main">{title}</h4>
        <p className="lg:max-w-[500px] sm:max-w-[400px] max-w-none sm:max-h-[150px] max-h-[100px] overflow-auto my-2">
          {/* {about} */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed augue
          lacus viverra vitae congue. Sit amet justo donec enim diam vulputate
          ut. Quis commodo odio aenean sed adipiscing diam donec adipiscing.
          Felis imperdiet proin fermentum leo vel orci. Diam vulputate ut
          pharetra sit amet aliquam. Eu sem integer vitae justo eget magna
          fermentum iaculis. Amet tellus cras adipiscing enim. Dignissim cras
          tincidunt lobortis feugiat vivamus at augue eget arcu. Eu facilisis
          sed odio morbi quis. Est lorem ipsum dolor sit. Ac feugiat sed lectus
          vestibulum. Fermentum et sollicitudin ac orci phasellus egestas
          tellus. Dictum varius duis at consectetur lorem donec. Viverra justo
          nec ultrices dui sapien eget. Fermentum leo vel orci porta. Nulla
          porttitor massa id neque aliquam vestibulum morbi blandit. Morbi quis
          commodo odio aenean sed adipiscing diam donec adipiscing. Habitant
          morbi tristique senectus et netus. Eu facilisis sed odio morbi quis
          commodo odio aenean.
        </p>
      </section>
    </section>
  );
}
