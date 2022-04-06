import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { connect } from "react-redux"
import { createProduct } from "../../../actions"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
const Buffer = require('buffer/').Buffer
function Product({ product, createProduct, channelName }) {
    const navigate = useNavigate()

    return (
        <div className="flex sm:flex-col border-[#EAEAEA] border-[0.5px] px-2  ">
            <a onClick={() => {
                createProduct(product)
                navigate("../product", { state: product })
            }}>
                <img src={`data:image/png;base64,${product.image?.toString("base64")}`} className="w-[225px] sm:h-[225px] object-contain self-center my-4" />
            </a>
            <section className="flex flex-col sm:ml-0 ml-2">
                <a onClick={() => {
                    createProduct(product)
                    navigate("../product", { state: product })
                }} className="hover:underline cursor-pointer">
                    <p className="font-light">{product["Name"]}</p>
                </a>
                <ul className="mt-4 mb-6 w-[70%]">
                    <li>
                        <p className="font-bold">{product["Price"]} per unit</p>
                    </li>
                    <li>
                        <p className="text-[#717171] text-sm ">From <span className="text-main" > {product["channelName"]}</span></p>
                    </li>
                    <li>
                        <p className="text-[#717171] text-sm">{`${new Date(product["date"]).toDateString()}`}</p>
                    </li>
                </ul>
                <i className="self-end cursor-pointer text-[#545454] border-[#b5b5b5] hover:text-main mb-4 inline-flex justify-center items-center w-[28px] h-[28px] rounded-full border-[0.5px] hover:border-main  active:text-main active:border-main ">
                    <FavoriteBorderIcon sx={{
                        fontSize: "18px",
                    }} />
                </i>
            </section>

        </div>
    )
}

function mapStateToProps(state) {
    return { client: state.client, session: state.session }
}
export default connect(mapStateToProps, { createProduct })(Product)