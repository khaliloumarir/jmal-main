import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
export default function ConnectedHeader() {
    return (
        <div className="bg-background py-6">
            <nav className="sm:flex justify-between  hidden ">
                <ul className="flex lg:basis-1/6 sm:basis-[30%] justify-between items-center ">
                    <li className="headerElement cursor-pointer"><Link to="/feed" >Find Seller</Link></li>
                    {/* <li className="headerElement cursor-pointer"><Link to="/">Products in demand</Link></li> */}
                </ul>
                <ul className="flex lg:basis-1/4 sm:basis-[40%]  justify-between items-center ">
                    {/* <li className="headerElement cursor-pointer"><Link to="/demandproduct" >Demand a product</Link></li> */}
                    <li className="headerElement cursor-pointer"><Link to="/addproduct">Add a product</Link></li>
                    <li className="headerElement"><i className="cursor-pointer"><FavoriteIcon sx={{ fontSize: "32px" }} /></i>
                        <i className="cursor-pointer"><AccountCircleIcon sx={{ fontSize: "32px" }} /></i>
                    </li>

                </ul>

            </nav>
            <nav className="sm:hidden flex justify-between items-center ">
                <ul className="flex items-center">
                    <li><i><MenuIcon /></i></li>
                    <li><p>LOGO</p></li>
                </ul>
                <ul className="flex items-center  basis-[20%] justify-between">
                    <li className="headerElement"><i className="cursor-pointer"><FavoriteIcon sx={{ fontSize: "32px" }} /></i>
                    </li>
                    {/*  <li className="headerElement"><i className="cursor-pointer"><AccountCircleIcon sx={{ fontSize: "32px" }} /></i>
                    </li> */}
                </ul>
            </nav>
        </div>
    )
}