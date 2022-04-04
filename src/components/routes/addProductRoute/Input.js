import { useEffect } from "react"
import validator from 'validator';
export default function Input(props) {

    const { title, placeholder, value, changeInput, reference, showBorder, multiline, properties, number, register, formInput } = props
    function handleText(e) {
        if (number) {
            if (validator.isNumeric(e.target.value)) {
                changeInput(reference, parseInt(e.target.value))
            }
        } else {
            changeInput(reference, e.target.value)
        }

    }
    useEffect(() => {

    }, [])
    function render() {
        if (multiline) {
            return <textarea value={value} onChange={handleText} className={`${properties} border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `} rows="5" />
        } else {
            return <input placeholder={placeholder} value={value} onChange={handleText} className={`${properties} border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `} type={number ? `number` : `text`} />

        }
    }
    return (
        <div>
            <p className="headerElement py-4">{title}</p>
            <section className="mb-4">
                {render()}
            </section>
            {showBorder && <hr className="border-[#C3C8BF]" />}
            {/* <p className="text-[#FF0000]">Error:lorem ipsum</p> */}
        </div>
    )
}