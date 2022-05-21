import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
const Buffer = require("buffer/").Buffer;
export default function MediaUploader({ media, videos, setVideos, setMedia }) {
  function addMedia(item, state, setState) {
    const tempHolder = state;
    tempHolder.push(item);
    setState([...tempHolder]);
  }
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      acceptedFiles.forEach((item) => {
        const type = item.type.split("/")[0];
        const reader = new FileReader();

        const metadata = item.name.split(".");
        reader.onload = () => {
          const binaryStr = Buffer.from(reader.result);
          const content = {
            data: binaryStr,
            size: Buffer.byteLength(binaryStr),
            name: metadata[0],
            ext: metadata[1],
            id: media.length + 1,
          };
          if (type === "video") {
            // addMedia(content, videos, setVideos)
          } else if (type === "image") {
            addMedia(content, media, setMedia);
          }
        };

        reader.readAsArrayBuffer(item);
      });
    },
    [media, setMedia]
  );
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, accept: "image/*" });

  const baseStyle = {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#000000",
    borderStyle: "dashed",
    width: 100,
    height: 100,
  };

  const focusedStyle = {
    borderColor: "#0A64B7",
  };

  const acceptStyle = {
    borderColor: "#004231",
  };

  const rejectStyle = {
    borderColor: "#b50718",
  };
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );
  return (
    <div className="">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <section className="flex flex-col items-center text-center py-4">
          <p className="text-[#0A64B7] headerElement ">Add Media</p>
          <p className="overlineElement">Or drop file to upload</p>
        </section>
      </div>
    </div>
  );
}
