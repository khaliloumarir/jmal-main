import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { checkConnection } from "./helpers";
import { useNavigate } from "react-router-dom";
import Feed from "./routes/Feed";

import { createClient, createSession } from "./actions";
const AuthIsRequired = React.lazy(() => import("./components/AuthIsLoaded"));
const Hero = React.lazy(() => import("./routes/landingPage-components/Hero"));
const Body = React.lazy(() => import("./routes/landingPage-components/Body"));
const FAQGroup = React.lazy(() =>
  import("./routes/landingPage-components/FAQ")
);
const Footer = React.lazy(() =>
  import("./routes/landingPage-components/Footer")
);
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
          <React.Suspense fallback={<></>}>
            <AuthIsRequired>
              <Feed />
            </AuthIsRequired>
          </React.Suspense>
        );
      } else {
        return (
          <div className="">
            <div className="bg-[#C9E6E3] sm:px-16 px-3">
              <React.Suspense fallback={<></>}>
                <Hero />
              </React.Suspense>
            </div>
            <div className="sm:px-16 px-3 ">
              <React.Suspense fallback={<></>}>
                <Body />
              </React.Suspense>
              <React.Suspense fallback={<></>}>
                <FAQGroup />
              </React.Suspense>
              <React.Suspense fallback={<></>}>
                <Footer />
              </React.Suspense>
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
