import Hero from "./routes/landingPage-components/Hero";
import Body from "./routes/landingPage-components/Body";
import FAQGroup from "./routes/landingPage-components/FAQ";
import Footer from "./routes/landingPage-components/Footer";
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
          <div className="">
            <div className="bg-[#C9E6E3] sm:px-16 px-3">
              <Hero />
            </div>
            <div className="sm:px-16 px-3 ">
              <Body />
              <FAQGroup />
              <Footer />
            </div>
          </div>
        );
      }
    }
  }
  return <>{render()}</>;
}

function mapToState(state) {
  return {
    session: state.session,
    client: state.client,
    firebase: state.firebase,
  };
}
export default connect(mapToState, { createClient, createSession })(App);
