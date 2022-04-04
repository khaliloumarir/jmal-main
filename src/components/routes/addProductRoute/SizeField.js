export default function SizeField({ field, value, changeInput, index, reference, children }) {
    function handleChange(e) {
        changeInput(index, reference, e.target.value)
    }
    return (
        <div className="flex items-center  ">
            <p className="headerElement">{field}:</p>
            <input value={value} onChange={handleChange} className="w-1/2 ml-4 border-[0.5px] border-[#C3C8BF] rounded-md p-1" />
            {children}
        </div>
    )
}