import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiId, apiHash } from "../config";
import { createClient, createSession } from "../actions";

function TelegramLogin(props) {
  useEffect(() => {
    createSession("");
  }, []);
  const navigate = useNavigate();
  //"first"==0 && "second"==1
  const [stages, setStages] = useState(0);
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [phoneCodeHash, setPhoneCodeHash] = useState("");
  const [isCodeViaApp, setIsCodeViaApp] = useState();
  const [client, setClient] = useState();

  useEffect(() => {
    // if(!props.firebase.auth.uid){
    //    redirect to authentication
    // }
  }, []);

  function render() {
    switch (stages) {
      case 0: {
        return (
          <form
            className="space-y-4"
            onSubmit={async (evt) => {
              evt.preventDefault();
              const session = new window.telegram.sessions.StringSession(
                props.session
              );
              const client = new window.telegram.TelegramClient(
                session,
                apiId,
                apiHash,
                {
                  connectionRetries: 5,
                }
              );
              await client.connect();

              setClient(client);

              const { phoneCodeHash, isCodeViaApp } = await client.sendCode(
                { apiHash, apiId },
                number
              );
              setPhoneCodeHash(phoneCodeHash);
              setIsCodeViaApp(isCodeViaApp);
              setStages(1);
            }}
          >
            <p>Insert your Number </p>
            <input
              className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={"Insert your number"}
            />
            <button>Generate Code</button>
          </form>
        );
      }

      case 1: {
        return (
          <form
            className="space-y-4"
            onSubmit={async (evt) => {
              evt.preventDefault();
              try {
                const result = await client.invoke(
                  new window.telegram.Api.auth.SignIn({
                    phoneNumber: number,
                    phoneCodeHash: phoneCodeHash,
                    phoneCode: code,
                  })
                );
                console.log("You should now be connected.");
                props.createSession(client.session.save());
                props.createClient(client);
                navigate("../feed");
              } catch (err) {
                if (err.errorMessage === "SESSION_PASSWORD_NEEDED") {
                  setStages(2);
                }
              }
            }}
          >
            <p>Insert Verification code </p>
            <input
              className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={"Insert your Verification code"}
            />
            <button>Login</button>
          </form>
        );
      }

      case 2: {
        return (
          <form
            className="space-y-4"
            onSubmit={async (evt) => {
              evt.preventDefault();
              try {
                const passwordSrpResult = await client.invoke(
                  new window.telegram.Api.account.GetPassword()
                );
                const passwordSRPCheck =
                  await window.telegram.helpers.getPasswordSrpCheck(
                    passwordSrpResult,
                    password
                  );
                const authorization = await client.invoke(
                  new window.telegram.Api.auth.CheckPassword({
                    password: passwordSRPCheck,
                  })
                );
              } catch (err) {
                console.log(err);
              }

              console.log("You should now be connected.");
              console.log("the client : ", client);
              props.createSession(client.session.save());
              props.createClient(client);
              navigate("../");
            }}
          >
            <p>Insert Password </p>
            <input
              className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"Insert your password"}
            />
            <button>Login</button>
          </form>
        );
      }
    }
  }
  return (
    <div className="flex justify-center items-center h-screen sm:bg-background  ">
      <section className="flex flex-col bg-[#FFFFFF] sm:border-[1px] border-[#8f8f8f] w-full sm:w-1/2 lg:w-[30%] px-8 py-8 space-y-4">
        <h4>Link telegram</h4>

        {render()}
      </section>
    </div>
  );
}

function mapToState(state) {
  return {
    session: state.session,
    client: state.client,
    firebase: state.firebase,
    product: state.product,
  };
}
export default connect(mapToState, { createClient, createSession })(
  TelegramLogin
);
