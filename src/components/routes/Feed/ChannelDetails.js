export default function ChannelDetails({ title, photo, about }) {
  return (
    <section className="flex">
      <img
        className="rounded-full w-[180px] h-[180px] "
        src={`data:image/png;base64,${photo?.bytes?.toString("base64")}`}
      />
      <section className="px-4">
        <h4 className="text-main">{title}</h4>
        <p className="max-w-[500px] max-h-[150px] overflow-auto my-2">
          {about}
        </p>
      </section>
    </section>
  );
}
