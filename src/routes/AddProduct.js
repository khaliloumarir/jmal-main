import { useEffect, useState } from "react"
import Sizes from "../components/routes/addProductRoute/Sizes";
import MediaUploader from "../components/routes/addProductRoute/MediaUploader";
import { connect } from "react-redux"
import { createClient, postChannelName } from "../actions"
import { useNavigate } from "react-router-dom";
import { checkConnection, errors } from "../helpers"
//feed back and loading
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux'
import { isLoaded } from 'react-redux-firebase'
import validator from 'validator';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProductSchema } from "../validations"
function AddProduct(props) {
    const formOptions = { resolver: yupResolver(addProductSchema) };
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const auth = useSelector(state => props.firebase.auth)
    const navigate = useNavigate()
    const [isClientLoaded, setIsClientLoaded] = useState(false)
    const [channels, setChannels] = useState([])
    useEffect(() => {
        const exists = isLoaded(auth)
        if (exists) {
            console.log("auth already exists", auth)
        } else {
            console.log("auth doesn't exist yet")
        }
    }, [auth])
    useEffect(() => {
        checkConnection(props, navigate, setIsClientLoaded)
    }, [])


    useEffect(() => {
        if (isClientLoaded) {
            async function getChannels() {
                try {
                    const result = await props.client.invoke(
                        new window.telegram.Api.channels.GetAdminedPublicChannels({
                            byLocation: false,
                            checkLimit: false,
                        })
                    );
                    const channelsList = []
                    result.chats.forEach((channel) => {
                        channelsList.push(channel.username)
                    })
                    if (channelsList.length) {
                        changeInput("channelName", channelsList[0])
                        setChannels(channelsList)
                    }

                } catch (err) {
                    console.log(err)
                }
            }
            getChannels()
        }

    }, [isClientLoaded])

    //snack bar
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [error, setError] = useState("")
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };
    //Loading button
    const [sentDone, setSentDone] = useState(true)

    //FIXME:Add a more optimal solution to add sizes to inputs and to remove them

    const [media, setMedia] = useState([])
    const [videos, setVideos] = useState([])
    const [inputs, setInputs] = useState({
        channelName: "",
        Name: "Adidas trousers",
        Price: 0,
        Quantity: 0,
        Minimum: 0,
        Category: "pants",
        Contact: "xxxxxxxx",
        Sizes: "",
        Description: "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in v",
    })

    async function sendThroughClient() {
        setSentDone(false)
        const files = []
        media.forEach((item) => {
            const { CustomFile } = window.telegram.client.uploads
            files.push(new CustomFile(
                `item.name.${item.ext}`,
                item.size,
                "",
                item.data
            ))
        })
        videos.forEach((item) => {
            const { CustomFile } = window.telegram.client.uploads
            files.push(new CustomFile(
                `item.name.${item.ext}`,
                item.size,
                "",
                item.data
            ))
        })
        //caption needs to be the same format as a normal message would be
        let finalMessage = ""


        for (const [key, value] of Object.entries(inputs)) {

            if (!(key === "channelName")) {
                if (typeof (value) === "string") {
                    if (value.length) {
                        finalMessage += `${key}: ${value}\n`
                    }
                }
                else if (typeof (value) === "number") {
                    if (value) {
                        finalMessage += `${key}: ${value}${key === "Price" ? " dh" : ""}\n`
                    }
                }
                else {
                    //arrays,etc...
                    if (value) {
                        finalMessage += `${key}: ${value}\n`
                    }
                }

            } else if (key === "Description") {
                if (value.length) {
                    finalMessage += `${key}:\n ${value}`
                }
            }

        }
        try {
            await props.client.sendFile(inputs.channelName, {
                file: files, caption: finalMessage
            })
            //post the channel name to the firestore
            props.postChannelName(inputs.channelName, auth.uid)
            const channel = inputs.channelName
            setInputs(
                {
                    channelName: channel,
                    Name: "",
                    Price: 0,
                    Quantity: 0,
                    Minimum: 0,
                    Category: "",
                    Contact: "",
                    Sizes: "",
                    Description: "",
                }
            )
            setMedia([])

        } catch (err) {

            setError(err.message)
        }
        setSentDone(true)
        setOpenSnackBar(true)

    }

    function changeInput(key, value) {
        const temp = inputs;
        temp[key] = value
        setInputs({ ...temp })
    }
    function handleText(e, reference, number = false) {

        if (number) {
            if (validator.isNumeric(e.target.value)) {
                changeInput(reference, parseInt(e.target.value))
            }
        } else {
            changeInput(reference, e.target.value)
        }

    }
    function submitToChannel(data) {
        sendThroughClient()
    }
    function errorifyField(key) {
        return `${formState?.errors[key]?.message.length ? "border-[#FF0000]" : "border-[#C3C8BF]"}`
    }
    function renderErrorMessage(key) {
        return (
            <p className="error">{formState?.errors[key]?.message}</p>
        )
    }
    function render() {
        if (isClientLoaded) {
            return (
                <form onSubmit={handleSubmit(submitToChannel)} >
                    <h5 className="self-center addProduct">Add product to channel</h5>
                    <hr className="border-[#C3C8BF]  my-4" />
                    {/* ===================Product details=============== */}
                    {/* ==============Channel Name============ */}
                    <div>
                        <p className="headerElement py-4">Channel Name</p>

                        <select onChange={(e) => {
                            changeInput("channelName", e.target.value)
                        }} name="cars" id="cars">
                            {channels.map((channel) => {
                                return (
                                    <option value={channel}>{channel}</option>
                                )
                            })}

                        </select>
                    </div>
                    <div>
                        <p className="headerElement py-4">Product Name</p>
                        <section className="mb-4">
                            <input {...register("Name")} value={inputs.Name} onChange={(e) => {
                                handleText(e, "Name")
                            }} className={`w-2/4 border-[0.5px] ${errorifyField("Name")} rounded-md py-2 px-4  `} />
                            {renderErrorMessage("Name")}
                        </section>
                        <hr className="border-[#C3C8BF]" />

                    </div>
                    {/* ===================Price and quantity=============== */}
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <p className="headerElement py-4">Price</p>
                            <section className="mb-4">
                                <input {...register("Price")} value={inputs.Price} onChange={(e) => {
                                    handleText(e, "Price", true)
                                }} className={`w-full border-[0.5px] ${errorifyField("Price")} rounded-md py-2 px-4`} type="number" />
                                {renderErrorMessage("Price")}
                            </section>


                        </div>
                        <div>
                            <p className="headerElement py-4">Quantity</p>
                            <section className="mb-4">
                                <input value={inputs.Quantity} onChange={(e) => {
                                    handleText(e, "Quantity", true)
                                }} className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `} type="number" />
                            </section>

                            {/* <p className="text-[#FF0000]">Error:lorem ipsum</p> */}
                        </div>
                    </div>
                    <hr className="border-[#C3C8BF] " />
                    {/* ===================Minimum Quantity=============== */}
                    <div>
                        <p className="headerElement py-4">Minimum Quantity</p>
                        <section className="mb-4">
                            <input value={inputs.Minimum} onChange={(e) => {
                                handleText(e, "Minimum", true)
                            }} className={`w-2/4 border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `} />
                        </section>
                        <hr className="border-[#C3C8BF]" />
                        {/* <p className="text-[#FF0000]">Error:lorem ipsum</p> */}
                    </div>
                    {/* ===================Category=============== */}
                    <div>
                        <p className="headerElement py-4">Category</p>
                        <section className="mb-4">
                            <input {...register("Category")} value={inputs.Category} onChange={(e) => {
                                handleText(e, "Category")
                            }} className={`w-2/4 ${errorifyField("Category")} border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `} />
                            {renderErrorMessage("Category")}
                        </section>
                        <hr className="border-[#C3C8BF]" />

                    </div>
                    {/* ===================Sizes Fields=============== */}
                    <Sizes sizes={inputs.sizes} changeData={changeInput} />
                    {/* ===================Promotions Fields=============== */}
                    {/* <Promotions /> */}
                    {/* ===================Message Field=============== */}
                    <div>
                        <p className="headerElement py-4">Description</p>
                        <section className="mb-4">
                            <textarea value={inputs.Description} onChange={(e) => {
                                handleText(e, "Description")
                            }} className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `} rows="5" />
                        </section>
                        <hr className="border-[#C3C8BF]" />
                        {/* <p className="text-[#FF0000]">Error:lorem ipsum</p> */}
                    </div>
                    {/* ===================Contact Link=============== */}
                    <div>
                        <p className="headerElement py-4">Contact Link</p>
                        <section className="mb-4">
                            <input {...register("Contact")} value={inputs.Contact} onChange={(e) => {
                                handleText(e, "Contact")
                            }} className={`w-2/4 ${errorifyField("Contact")} border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `} />
                            {renderErrorMessage("Contact")}
                        </section>
                        <hr className="border-[#C3C8BF]" />

                    </div>
                    {/* ===================Media Field=============== */}
                    <div className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-3 my-4 gap-y-8 gap-x-2">
                        {media.map((item, index) => {
                            //item={data:bufferData,size:BufferSize}
                            return (
                                <div className="relative "  >
                                    <span onClick={() => {
                                        const pictures = media.filter(pic => pic.id !== item.id)
                                        setMedia([...pictures])
                                    }} className=" cursor-pointer bg-[#FF0000] inline-flex  rounded-full absolute top-[-5px] right-[-5px] z-50 justify-center items-center w-[26px] h-[26px]">
                                        <CloseIcon sx={{ position: "absolute", color: "white" }} fontSize="small" />
                                    </span>
                                    <img src={`data:image/png;base64,${item.data.toString("base64")}`} className=" object-contain  " />
                                </div>


                            )
                        })}
                        <MediaUploader register={register} videos={videos} setVideos={setVideos} media={media} setMedia={setMedia} />
                    </div>

                    {/* =========================Video fields============ */}
                    {videos.map((item) => {
                        return (
                            <p className="text-main overlineElement self-start">
                                {`${item.name}.${item.ext}`} has been added
                            </p>
                        )
                    })}

                    <button onClick={() => {
                        //"self-end py-3 px-3"
                    }} className="self-end min-w-[174px] min-h-[55px]">
                        {sentDone ? "Send to channel" : <CircularProgress size={28} color="inherit" />}
                    </button>
                </form>
            )
        } else {
            return (
                <div className="flex justify-center items-center h-[50vh] w-full text-main">
                    <CircularProgress color="inherit" />
                </div>
            )
        }
    }
    return (
        <>
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
                    {error.length ? error : "Message has been sent successfully"}
                </Alert>
            </Snackbar>

        </>

    )
}

function mapStateToProps(state) {
    return {
        client: state.client,
        session: state.session,
        firebase: state.firebase
    }
}
function mapDispatchToProps(dispatch) {
    return {
        postChannelName: (channelName, uid) => dispatch(postChannelName(channelName, uid)),
        createClient: (client) => dispatch(createClient(client))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct)