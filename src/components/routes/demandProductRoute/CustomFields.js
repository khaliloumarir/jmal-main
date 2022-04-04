import { useEffect, useState } from "react"
import SizeField from "../addProductRoute/SizeField"
import RemoveIcon from '@mui/icons-material/Remove';
export default function CustomFields() {
    const [inputs, setInputs] = useState([{ field: "", quantity: "" }])
    function changeInput(index, key, value) {
        const temp = inputs;
        temp[index][key] = value;
        setInputs([...temp])
    }
    useEffect(() => {
        const element = inputs[inputs.length - 1]
        if (((element.field.length > 0) && (element.quantity.length > 0))) {
            inputs.push({ field: "", quantity: "" })
        }
    }, [inputs])

    return (
        <div>
            <h6 className="font-semibold pt-4 ">Custom Fields</h6>
            {inputs.map((item, index) => {
                return (
                    <div  >
                        <section className="flex items-center md:justify-between lg:justify-start md:my-4">
                            <SizeField field="Custon name" reference="field" value={item.field} index={index} changeInput={changeInput} />
                            <SizeField field="Quantity" reference="quantity" value={item.quantity} index={index} changeInput={changeInput} />
                            <i onClick={() => {
                                if (inputs.length <= 1) {
                                    return;
                                }
                                const temp = inputs;
                                temp.splice(index, 1);
                                setInputs([...temp])
                            }} className="cursor-pointer w-[26px] h-[26px] inline-flex bg-[#919191] hover:bg-[#313131] rounded-full justify-center items-center ">
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