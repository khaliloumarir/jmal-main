import { useState } from "react"
import MediaUploader from "./MediaUploader"
import Sizes from "./Sizes"
function AddForm({ inputs }) {
    const [media, setMedia] = useState([])
    const [videos, setVideos] = useState([])

    function handleText(e) {
        if (number) {
            if (validator.isNumeric(e.target.value)) {
                changeInput(reference, parseInt(e.target.value))
            }
        } else {
            changeInput(reference, e.target.value)
        }

    }
    return (
        <>

        </>
    )
}


export default AddForm