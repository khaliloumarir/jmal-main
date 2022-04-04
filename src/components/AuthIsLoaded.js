import { isLoaded } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from "react-router-dom";
export default function AuthIsLoaded({ children }) {
    const navigate = useNavigate()
    const auth = useSelector(state => state.firebase.auth)
    const session = useSelector(state => state.session)
    if (!isLoaded(auth)) navigate("/")
    if (!session) navigate("/telegram")
    return children
}

