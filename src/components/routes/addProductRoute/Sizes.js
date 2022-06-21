import { useState, useEffect } from "react";
import SizeField from "./SizeField";
import RemoveIcon from "@mui/icons-material/Remove";
import { v4 as uuidv4 } from "uuid";
export default function Sizes({ changeData, sizeTitle, sizeName }) {
  const [inputs, setInputs] = useState([
    { size: "", quantity: "", key: uuidv4() },
  ]);
  function changeInput(index, key, value) {
    const temp = inputs;
    temp[index][key] = value;
    setInputs([...temp]);
  }
  useEffect(() => {
    //Add another field whenever inputs changes
    const element = inputs[inputs.length - 1];
    //&& (element.quantity.length > 0)
    if (element.size.length > 0) {
      setInputs([...inputs, { size: "", quantity: "", key: uuidv4() }]);
    }
  }, [inputs]);

  function handleText(finalSizes) {
    changeData("Sizes", finalSizes.toString());
  }
  useEffect(() => {
    //TODO: only do handleText after user stops typing or put the state here right away and change it after user is done typing
    const timeOutId = setTimeout(() => {
      const finalSizes = [];
      inputs.forEach((element) => {
        for (const [key, value] of Object.entries(element)) {
          if (key === "size" && value) {
            finalSizes.push(value.toUpperCase());
          }
        }
      });
      console.log(finalSizes);
      handleText(finalSizes);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [inputs]);
  return (
    <div>
      <h6 className="font-semibold pt-4 ">{sizeTitle}</h6>
      {inputs.map((item, index) => {
        return (
          <div key={item.key}>
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
