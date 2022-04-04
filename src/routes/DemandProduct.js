import Sizes from "../components/routes/addProductRoute/Sizes"

import CustomFields from "../components/routes/demandProductRoute/CustomFields"

import Input from "../components/routes/addProductRoute/Input"
import MediaUploader from "../components/routes/addProductRoute/MediaUploader"
import { useState } from "react"
export default function DemandProduct() {
    const [media, setMedia] = useState([])
    const [inputs, setInputs] = useState({
        name: "",
        price: "",
        quantity: "",
        minimum: "",
        category: ""
    })
    function changeInput(key, value) {
        const temp = inputs;
        temp[key] = value
        setInputs({ ...temp })
    }
    function addMedia(item) {
        const tempHolder = media;
        tempHolder.push(item)
        setMedia([...tempHolder])
    }

    return (
        <div className="flex flex-col p-2 sm:mx-24 sm:my-24 sm:Addshadow sm:p-8 sm:rounded-md">
            <h5 className="self-center addProduct">Add product to channel</h5>
            <hr className="border-[#C3C8BF]  my-4" />
            {/* ===================Product details=============== */}
            <Input properties="w-2/4" title="Product Name" reference="name" value={inputs.name} changeInput={changeInput} showBorder={true} />
            <div className="grid grid-cols-2 gap-10">
                <Input title="Budget" properties="w-full" reference="price" value={inputs.price} changeInput={changeInput} />
                <Input title="Quantity Desired" properties="w-full" reference="quantity" value={inputs.quantity} changeInput={changeInput} />
            </div>
            <hr className="border-[#C3C8BF] " />

            <Input properties="w-2/4" title="Category" reference="category" value={inputs.category} changeInput={changeInput} showBorder={true} />
            {/* ===================Sizes Fields=============== */}
            <Sizes />
            {/* ===================Custom Fields=============== */}
            <CustomFields />
            {/* ===================Message Field=============== */}
            <Input properties="w-full" showBorder={true} title="Message" placeholder="This a message" multiline={true} />
            {/* ===================Media Field=============== */}
            <div className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-3 my-4 gap-y-8">
                {media.map((item) => {
                    return (<img src={item} className="h-[100px] w-[100px] object-contain " />)
                })}
                <MediaUploader addMedia={addMedia} />
            </div>
            <button className="self-end py-3 px-3">Demand Product</button>
        </div>
    )
}