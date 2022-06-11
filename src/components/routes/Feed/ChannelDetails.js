export default function ChannelDetails({ title, photo, about }) {
  return (
    <section className="flex sm:flex-row flex-col">
      {photo?.bytes && (
        <img
          alt="channel"
          className="rounded-full w-[180px] h-[180px] "
          src={`data:image/png;base64,${photo?.bytes?.toString("base64")}`}
        />
      )}

      <section className="px-4">
        <h4 className="text-main">{title}</h4>
        <p className="lg:max-w-[500px] sm:max-w-[400px] max-w-none sm:max-h-[150px] max-h-[100px] overflow-auto my-2">
          {about}
        </p>
      </section>
    </section>
  );
}
