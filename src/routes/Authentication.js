import { useState, useEffect } from "react"
import { connect } from "react-redux"
import { signIn } from "../actions"
import { useNavigate } from "react-router-dom";
function Authentication(props) {
  const navigate = useNavigate()
  useEffect(() => {

  }, [])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  async function handleSubmit(evt) {
    evt.preventDefault();
    props.signIn({ email, password })
    if (props.firebase.auth.uid) {
      console.log("user logged in")
    }
    navigate("../telegram")
  }
  return (
    <div>
      <form onSubmit={handleSubmit} >
        <input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Register</button>
      </form>
    </div>
  )
}

function mapStateToProps(state) {
  console.log(state)
  return { firebase: state.firebase }
}
function mapDispatchToProps(dispatch) {
  return {
    signIn: (cred) => dispatch(signIn(cred))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Authentication)
