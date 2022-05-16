import Header from "./components/Header/Header";
import Banner from "./components/Banner/Banner";
import Body from "./components/Body/Body";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { checkConnection } from "./helpers";
import { useNavigate } from "react-router-dom";
import Feed from "./routes/Feed";
import AuthIsRequired from "./components/AuthIsLoaded";
import { createClient, createSession } from "./actions";
function App(props) {
  const navigate = useNavigate();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  useEffect(() => {
    checkConnection(props, navigate, setIsClientLoaded);
  }, []);
  function render() {
    if (isClientLoaded) {
      if (props.client?.checkAuthorization()) {
        return (
          <AuthIsRequired>
            <Feed />
          </AuthIsRequired>
        );
      } else {
        return (
          <div className="App ">
            <div className="bg-[#FBF7ED]">
              <Header />
              <Banner />
            </div>
            <Body />
          </div>
        );
      }
    }
  }
  return <>{render()}</>;
}

function mapToState(state) {
  console.log(state);
  return {
    session: state.session,
    client: state.client,
    firebase: state.firebase,
  };
}
export default connect(mapToState, { createClient, createSession })(App);
