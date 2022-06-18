import { useEffect, useState } from "react";
import Sizes from "../components/routes/addProductRoute/Sizes";
import MediaUploader from "../components/routes/addProductRoute/MediaUploader";
import { connect } from "react-redux";
import { createClient, postChannelName } from "../actions";
//feed back and loading
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import isNumeric from "validator/es/lib/isNumeric";
import NewHeader from "../components/NewHeader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProductSchema } from "../validations";

import { useTranslation } from "react-i18next";
import { Api } from "telegram";
import { CustomFile } from "telegram/client/uploads";
function AddProduct(props) {
  const { t } = useTranslation();
  const formOptions = { resolver: yupResolver(addProductSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const [channels, setChannels] = useState([]);
  const [mediaError, setMediaError] = useState("");
  useEffect(() => {
    if (props.isClientLoaded) {
      async function getChannels() {
        try {
          const result = await props.client.invoke(
            new Api.channels.GetAdminedPublicChannels({
              byLocation: false,
              checkLimit: false,
            })
          );
          const channelsList = [];
          result.chats.forEach((channel) => {
            channelsList.push(channel.username);
          });
          if (channelsList.length) {
            setChannels(channelsList);
          }
        } catch (err) {
          setError(err.message);
          setOpenSnackBar(true);
        }
      }
      getChannels();
    }
  }, [props.isClientLoaded]);

  //snack bar
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };
  //Loading button
  const [sentDone, setSentDone] = useState(true);

  //FIXME:Add a more optimal solution to add sizes to inputs and to remove them

  const [media, setMedia] = useState([]);

  const [videos, setVideos] = useState([]);
  const [inputs, setInputs] = useState({
    channelName: "",
    Name: "",
    Price: 0,
    Quantity: 0,
    Minimum: 0,
    Category: "",
    Contact: "",
    Sizes: "",
    Description: "",
  });

  async function sendThroughClient() {
    setSentDone(false);
    const files = [];
    media.forEach((item) => {
      files.push(
        new CustomFile(`item.name.${item.ext}`, item.size, "", item.data)
      );
    });
    // videos.forEach((item) => {
    //   files.push(
    //     new CustomFile(`item.name.${item.ext}`, item.size, "", item.data)
    //   );
    // });
    //caption needs to be the same format as a normal message would be
    let finalMessage = "";

    for (const [key, value] of Object.entries(inputs)) {
      if (!(key === "channelName")) {
        if (typeof value === "string") {
          if (value.length) {
            finalMessage += `${key}: ${value}\n`;
          }
        } else if (typeof value === "number") {
          if (value) {
            finalMessage += `${key}: ${value}${key === "Price" ? "dh" : ""}\n`;
          }
        } else {
          //arrays,etc...
          if (value) {
            finalMessage += `${key}: ${value}\n`;
          }
        }
      } else if (key === "Description") {
        if (value.length) {
          finalMessage += `${key}:\n ${value}`;
        }
      }
    }
    try {
      console.log("files", files);
      await props.client.sendFile(inputs.channelName, {
        file: files,
        caption: finalMessage,
      });
      const user = await props.client.getMe();
      //post the channel name to the firestore
      props.postChannelName(inputs.channelName, user.phone);
      const channel = inputs.channelName;
      console.log(inputs);
      setInputs({
        ...inputs,
        Name: "",
        Price: 0,
        Quantity: 0,
        Minimum: 0,
        Sizes: "",
        Description: "",
      });
      setMedia([]);
      setError("");
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    setSentDone(true);
    setOpenSnackBar(true);
  }

  function changeInput(key, value) {
    const temp = inputs;
    temp[key] = value;
    setInputs({ ...temp });
  }
  function handleText(e, reference, number = false) {
    if (number) {
      if (isNumeric(e.target.value)) {
        changeInput(reference, parseInt(e.target.value));
      }
    } else {
      changeInput(reference, e.target.value);
    }
  }
  const [categoryError, setCategoryError] = useState("");
  const [channelNameError, setChannelNameError] = useState("");
  function submitToChannel(data) {
    if (media.length && inputs.Category.length && inputs.channelName.length) {
      sendThroughClient();
    } else {
      if (!media.length) {
        //throw snackbar error
        setError("No media files exist");
        setSentDone(true);
        //update media error message for below the input
        setMediaError("There must be at least 1 media");
        //focus on the media
      }
      if (!inputs.channelName.length) {
        setChannelNameError(t("channelName_required"));
      }
      if (!inputs.Category.length) {
        setCategoryError("Choose a category");
      }
      setSentDone(true);
    }
  }
  function errorifyField(key) {
    return `${
      formState?.errors[key]?.message.length
        ? "border-[#FF0000]"
        : "border-[#C3C8BF]"
    }`;
  }
  function renderErrorMessage(key) {
    return <p className="error">{formState?.errors[key]?.message}</p>;
  }
  useEffect(() => {
    if (media.length) {
      if (mediaError.length) {
        setMediaError("");
      }
    }
  }, [media, mediaError?.length]);
  function render() {
    if (props.isClientLoaded) {
      return (
        <form onSubmit={handleSubmit(submitToChannel)}>
          <h5 className="self-center addProduct">
            {t("add_product_to_channel")}
          </h5>
          <hr className="border-[#C3C8BF]  my-4" />
          {/* ===================Product details=============== */}
          {/* ==============Channel Name============ */}
          <div>
            <p className="headerElement py-4">{t("channel_name")}</p>

            <select
              className="px-2 py-4 rounded-md border-[1px] border-[#d8d8d8] hover:border-[#b3b3b3] focus:border-[#b3b3b3]"
              onChange={(e) => {
                changeInput("channelName", e.target.value);
              }}
              required
            >
              <option value="" disabled selected hidden>
                {t("choose_channel")}
              </option>
              {channels.map((channel) => {
                return (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <p className="headerElement py-4">{t("product_name")}</p>
            <section className="mb-4">
              <input
                {...register("Name")}
                value={inputs.Name}
                onChange={(e) => {
                  handleText(e, "Name");
                }}
                className={`w-2/4 border-[0.5px] ${errorifyField(
                  "Name"
                )} rounded-md py-2 px-4  `}
              />
              {renderErrorMessage("Name")}
            </section>
            <hr className="border-[#C3C8BF]" />
          </div>
          {/* ===================Price and quantity=============== */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="headerElement py-4">{t("price")}</p>
              <section className="mb-4">
                <input
                  {...register("Price")}
                  value={inputs.Price}
                  onChange={(e) => {
                    handleText(e, "Price", true);
                  }}
                  className={`w-full border-[0.5px] ${errorifyField(
                    "Price"
                  )} rounded-md py-2 px-4`}
                />
                {renderErrorMessage("Price")}
              </section>
            </div>
            <div>
              <p className="headerElement py-4">{t("quantity")}</p>
              <section className="mb-4">
                <input
                  value={inputs.Quantity}
                  onChange={(e) => {
                    handleText(e, "Quantity", true);
                  }}
                  className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
                />
              </section>

              {/* <p className="text-[#FF0000]">Error:lorem ipsum</p> */}
            </div>
          </div>
          <hr className="border-[#C3C8BF] " />
          {/* ===================Minimum Quantity=============== */}
          <div>
            <p className="headerElement py-4">{t("minimum_quantity")}</p>
            <section className="mb-4">
              <input
                value={inputs.Minimum}
                onChange={(e) => {
                  handleText(e, "Minimum", true);
                }}
                className={`w-2/4 border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
              />
            </section>
            <hr className="border-[#C3C8BF]" />
            {/* <p className="text-[#FF0000]">Error:lorem ipsum</p> */}
          </div>
          {/* ===================Category=============== */}
          <div>
            <p className="headerElement py-4">{t("category")}</p>
            <section className="mb-4">
              {/* <input
                
                value={inputs.Category}
                onChange={(e) => {
                  handleText(e, "Category");
                }}
                className={`w-2/4 ${errorifyField(
                  "Category"
                )} border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
              />
              {renderErrorMessage("Category")} */}
              <select
                className="px-2 py-4 rounded-md border-[1px] border-[#d8d8d8] hover:border-[#b3b3b3] focus:border-[#b3b3b3] "
                onChange={(e) => {
                  changeInput("Category", e.target.value);
                }}
                required
              >
                <option value="" disabled selected hidden>
                  {t("choose_category")}
                </option>
                {[
                  { value: "Fashion", name: t("Fashion") },
                  { value: "Accessories", name: t("Accessories") },
                  {
                    value: "Home gadgets and Electronics",
                    name: t("Home_gadgets_and_electronics"),
                  },
                ].map(({ name, value }) => {
                  return (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </section>
            <hr className="border-[#C3C8BF]" />
          </div>
          {/* ===================Sizes Fields=============== */}
          <Sizes
            sizeTitle={t("sizes")}
            sizes={inputs.sizes}
            changeData={changeInput}
            sizeName={t("size")}
          />
          {/* ===================Promotions Fields=============== */}
          {/* <Promotions /> */}
          {/* ===================Message Field=============== */}
          <div>
            <p className="headerElement py-4">{t("description")}</p>
            <section className="mb-4">
              <textarea
                value={inputs.Description}
                onChange={(e) => {
                  handleText(e, "Description");
                }}
                className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
                rows="5"
              />
            </section>
            <hr className="border-[#C3C8BF]" />
            {/* <p className="text-[#FF0000]">Error:lorem ipsum</p> */}
          </div>
          {/* ===================Contact Link=============== */}
          <div>
            <p className="headerElement py-4">{t("contact_link")}</p>
            <section className="mb-4">
              <input
                {...register("Contact")}
                value={inputs.Contact}
                onChange={(e) => {
                  handleText(e, "Contact");
                }}
                className={`w-2/4 ${errorifyField(
                  "Contact"
                )} border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
              />
              {renderErrorMessage("Contact")}
            </section>
            <hr className="border-[#C3C8BF]" />
          </div>
          {/* ===================Media Field=============== */}
          <div className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-3 my-4 gap-y-8 gap-x-2">
            {media.map((item, index) => {
              //item={data:bufferData,size:BufferSize}
              return (
                //FIXME: add uuid
                <div
                  key={Math.floor(Math.random() * item.size)}
                  className="relative "
                >
                  <span
                    onClick={() => {
                      const pictures = media.filter(
                        (pic) => pic.id !== item.id
                      );
                      setMedia([...pictures]);
                    }}
                    className=" cursor-pointer bg-[#FF0000] inline-flex  rounded-full absolute top-[-5px] right-[-5px] z-50 justify-center items-center w-[26px] h-[26px]"
                  >
                    <CloseIcon
                      sx={{ position: "absolute", color: "white" }}
                      fontSize="small"
                    />
                  </span>
                  <img
                    alt={`product number ${index}`}
                    src={`data:image/png;base64,${item.data.toString(
                      "base64"
                    )}`}
                    className=" object-contain  "
                  />
                </div>
              );
            })}
            <MediaUploader
              videos={videos}
              setVideos={setVideos}
              media={media}
              setMedia={setMedia}
            />
          </div>

          {/* =========================Video fields============ */}
          {videos.map((item) => {
            return (
              <p className="text-main overlineElement self-start">
                {`${item.name}.${item.ext}`} has been added
              </p>
            );
          })}
          <p className="error min-h-[50px]">{mediaError}</p>
          <p className="error min-h-[50px]">{channelNameError}</p>
          <p className="error min-h-[50px]">{categoryError}</p>
          <button className="self-end min-w-[174px] min-h-[55px]">
            {sentDone ? (
              t("send_to_channel")
            ) : (
              <CircularProgress size={28} color="inherit" />
            )}
          </button>
        </form>
      );
    } else {
      return (
        <div className="flex justify-center items-center h-[50vh] w-full text-main">
          <CircularProgress color="inherit" />
        </div>
      );
    }
  }
  return (
    <div className="px-2 sm:px-4 lg:px-8">
      <NewHeader />
      <div className="flex flex-col p-2 sm:mx-24 sm:my-24 sm:Addshadow sm:p-8 sm:rounded-md">
        {render()}
      </div>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          variant="filled"
          severity={error.length ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error.length ? error : t("product_added_success")}
        </Alert>
      </Snackbar>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    client: state.client,
    session: state.session,
    firebase: state.firebase,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    postChannelName: (channelName, uid) =>
      dispatch(postChannelName(channelName, uid)),
    createClient: (client) => dispatch(createClient(client)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
