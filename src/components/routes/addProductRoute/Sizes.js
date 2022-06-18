import { useState, useEffect } from "react";
import SizeField from "./SizeField";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Sizes({ changeData, sizeTitle, sizeName }) {
  const [inputs, setInputs] = useState([{ size: "", quantity: "" }]);
  function changeInput(index, key, value) {
    const temp = inputs;
    temp[index][key] = value;
    setInputs([...temp]);
  }
  useEffect(() => {
    const element = inputs[inputs.length - 1];
    //&& (element.quantity.length > 0)
    if (element.size.length > 0) {
      setInputs([...inputs, { size: "", quantity: "" }]);
    }
  }, [inputs]);

  function handleText(finalSizes) {
    changeData("Sizes", finalSizes.toString());
  }
  useEffect(() => {
    const finalSizes = [];
    inputs.forEach((element) => {
      for (const [key, value] of Object.entries(element)) {
        if (value) {
          finalSizes.push(value.toUpperCase());
        }
      }
    });
    handleText(finalSizes);
  }, [inputs]);
  return (
    <div>
      <h6 className="font-semibold pt-4 ">{sizeTitle}</h6>
      {inputs.map((item, index) => {
        return (
          <div>
            <section className="flex items-center md:justify-between lg:justify-start md:my-4">
              <SizeField
                field={sizeName}
                reference="size"
                value={item.size}
                index={index}
                changeInput={changeInput}
              />
              {/* <SizeField field="Quantity" reference="quantity" value={item.quantity} index={index} changeInput={changeInput} /> */}
              {!(index === inputs.length - 1) && (
                <i
                  onClick={() => {
                    if (inputs.length <= 1) {
                      return;
                    }
                    const temp = inputs;
                    temp.splice(index, 1);
                    setInputs([...temp]);
                  }}
                  className="cursor-pointer w-[26px] h-[26px] inline-flex bg-[#919191] hover:bg-[#313131] rounded-full justify-center items-center "
                >
                  <RemoveIcon sx={{ color: "white" }} />
                </i>
              )}
            </section>
          </div>
        );
      })}
      <hr className="border-[#C3C8BF]  mt-4" />
    </div>
  );
}
