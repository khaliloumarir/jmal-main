import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createClient } from "../actions";
import { useNavigate } from "react-router-dom";
import { checkConnection } from "../helpers";
function AuthIsRequired(props) {
  const navigate = useNavigate();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  useEffect(() => {
    //if client instance doesn't exist, but session does
    //then connect client
    //and create client state
    //if client instance doesn't exist, nor session, then redirect to telegram

    checkConnection(props, navigate, setIsClientLoaded);
  }, []);
  return <div>{React.cloneElement(props.children, { isClientLoaded })}</div>;
}

function mapStateToProps(state) {
  return {
    client: state.client,
    firebase: state.firebase,
    session: state.session,
  };
}

export default connect(mapStateToProps, { createClient })(AuthIsRequired);
