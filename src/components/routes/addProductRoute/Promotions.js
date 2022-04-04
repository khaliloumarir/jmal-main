import { useState, useEffect } from "react"
import SizeField from "./SizeField"
import RemoveIcon from '@mui/icons-material/Remove';
export default function Promotions() {
    const [inputs, setInputs] = useState([{ min: "", max: "", pricePerUnit: "" }])
    function changeInput(index, key, value) {
        const temp = inputs;
        temp[index][key] = value;
        setInputs([...temp])
    }
    useEffect(() => {
        const element = inputs[inputs.length - 1]
        if (((element.min.length > 0) && (element.max.length > 0) && (element.pricePerUnit.length > 0))) {
            inputs.push({ min: "", max: "", pricePerUnit: "" })
        }
    }, [inputs])

    return (
        <div>
            <h6 className="font-semibold pt-4">Promotions</h6>
            {inputs.map((item, index) => {
                return (
                    <div className="md:my-4 ">

                        <section className="flex  items-center justify-between  ">

                            <SizeField field="Min" reference="min" value={item.min} index={index} changeInput={changeInput} />
                            <SizeField field="Max" reference="max" value={item.max} index={index} changeInput={changeInput} />
                            <div className="flex items-center">
                                <SizeField field="Price Per Unit" reference="pricePerUnit" value={item.pricePerUnit} index={index} changeInput={changeInput} >
                                    <span className="headerElement ">dh/unit</span>
                                </SizeField>
                            </div>
                            <i onClick={() => {
                                if (inputs.length <= 1) {
                                    return;
                                }
                                const temp = inputs;
                                temp.splice(index, 1);
                                setInputs([...temp])
                            }} className="ml-4 lg:ml-0 cursor-pointer w-[26px] h-[26px] inline-flex bg-[#919191] hover:bg-[#313131] rounded-full justify-center items-center ">
                                <RemoveIcon sx={{ color: "white" }} />
                            </i>
                        </section>
                    </div>
                )
            })}
            <hr className="border-[#C3C8BF]  mt-4" />
        </div>
    )
}