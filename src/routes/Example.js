import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import MediaUploader from "../components/routes/addProductRoute/MediaUploader";
const App = () => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [media, setMedia] = useState([]);
  useEffect(() => {
    console.log("media", media);
  }, [media]);
  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          if (media.length) {
            console.log(data);
          } else {
            console.log("needs a way to throw error");
          }
        })}
        className="flex flex-col w-1/4"
      >
        <input
          placeholder="idk"
          className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
          {...register("test")}
        />
        {errors.test && <p>{errors.test.message}</p>}

        <MediaUploader setMedia={setMedia} media={media} />
        {/* <button
          type="button"
          onClick={() => {
            setError(
              "test",
              { type: "focus", message: "No media" },
              { shouldFocus: true }
            );
          }}
        >
          Set Error Focus
        </button> */}
        <button>SUBMIT</button>
      </form>
    </div>
  );
};

export default App;
