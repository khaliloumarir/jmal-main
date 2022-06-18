import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiId, apiHash } from "../config";
import { createClient, createSession, addUserToTg } from "../actions";
import PhoneInput from "react-phone-number-input";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import "react-phone-number-input/style.css";
import { Api, TelegramClient, sessions } from "telegram";
import { computeCheck } from "telegram/Password";
function TelegramLogin(props) {
  const { t } = useTranslation();
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
  const [client, setClient] = useState();

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [successfulLogin, setSuccessfulLogin] = useState(false);
  useEffect(() => {
    async function addUser() {
      const user = await props.client.getMe();
      props.addUserToTg(user.phone);
    }
    if (successfulLogin) {
      addUser();
    }
  }, [successfulLogin]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const [sentDone, setSentDone] = useState(true);
  function render() {
    switch (stages) {
      case 0: {
        return (
          <form
            className="space-y-4"
            onSubmit={async (evt) => {
              evt.preventDefault();
              setSentDone(false);
              setOpenSnackBar(false);
              setSignInError("");
              const session = new sessions.StringSession(props.session);
              const client = new TelegramClient(session, apiId, apiHash, {
                connectionRetries: 5,
              });
              await client.connect();

              setClient(client);

              try {
                const { phoneCodeHash } = await client.sendCode(
                  { apiHash, apiId },
                  number
                );
                setPhoneCodeHash(phoneCodeHash);

                setOpenSnackBar(true);
                setStages(1);
              } catch (err) {
                setSignInError(err.message);
                setOpenSnackBar(true);
              }
              setSentDone(true);
            }}
          >
            <p>{t("insert_your_number")} </p>
            <PhoneInput
              placeholder={t("enter_phone_number")}
              value={number}
              onChange={setNumber}
              countries={["MA"]}
              defaultCountry={"MA"}
              className="w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4"
              labels={{ MA: "Maroc" }}
            />
            <button>
              {sentDone ? (
                t("generate_code")
              ) : (
                <CircularProgress size={28} color="inherit" />
              )}
            </button>
          </form>
        );
      }

      case 1: {
        return (
          <form
            className="space-y-4"
            onSubmit={async (evt) => {
              evt.preventDefault();
              setSentDone(false);
              setOpenSnackBar(false);
              setSignInError("");
              try {
                await client.invoke(
                  new Api.auth.SignIn({
                    phoneNumber: number,
                    phoneCodeHash: phoneCodeHash,
                    phoneCode: code,
                  })
                );
                props.createSession(client.session.save());
                props.createClient(client);
                setSuccessfulLogin(true);
                navigate("/");
              } catch (err) {
                if (err.errorMessage === "PHONE_CODE_INVALID") {
                  setSignInError(t("PHONE_CODE_INVALID"));
                  setOpenSnackBar(true);
                }
                if (err.errorMessage === "SESSION_PASSWORD_NEEDED") {
                  setStages(2);
                }
              }
              setSentDone(true);
            }}
          >
            <p>{t("insert_verfication_code")}</p>
            <input
              className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("insert_verfication_code")}
            />
            <button>
              {sentDone ? (
                t("login")
              ) : (
                <CircularProgress size={28} color="inherit" />
              )}
            </button>
          </form>
        );
      }

      case 2: {
        return (
          <form
            className="space-y-4"
            onSubmit={async (evt) => {
              evt.preventDefault();
              setSentDone(false);
              setOpenSnackBar(false);
              setSignInError("");
              try {
                const passwordSrpResult = await client.invoke(
                  new Api.account.GetPassword()
                );
                const passwordSRPCheck = await computeCheck(
                  passwordSrpResult,
                  password
                );
                const authorization = await client.invoke(
                  new Api.auth.CheckPassword({
                    password: passwordSRPCheck,
                  })
                );
                console.log("authorization state:", authorization);
                props.createSession(client.session.save());
                props.createClient(client);

                setSuccessfulLogin(true);
                navigate("../");
              } catch (err) {
                if (err.errorMessage === "PASSWORD_HASH_INVALID") {
                  setSignInError(t("PASSWORD_HASH_INVALID"));
                  setOpenSnackBar(true);
                }
              }
              setSentDone(true);
            }}
          >
            <p>{t("insert_password")}</p>
            <input
              className={`w-full border-[0.5px] border-[#C3C8BF] rounded-md py-2 px-4  `}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("insert_password")}
            />
            <button>
              {sentDone ? (
                t("login")
              ) : (
                <CircularProgress size={28} color="inherit" />
              )}
            </button>
          </form>
        );
      }
      default:
        return;
    }
  }
  return (
    <div className=" px-2 sm:px-4 lg:px-8 flex justify-center items-center h-screen sm:bg-background  ">
      <section className="flex flex-col bg-[#FFFFFF] sm:border-[1px] border-[#8f8f8f] w-full sm:w-1/2 lg:w-[30%] px-8 py-8 space-y-4">
        <h4>{t("link_telegram")}</h4>

        {render()}
      </section>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          variant="filled"
          severity={signInError.length ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {signInError.length ? signInError : t("verification_code_sent")}
        </Alert>
      </Snackbar>
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

function mapDispatchToProps(dispatch) {
  return {
    addUserToTg: (uid) => dispatch(addUserToTg(uid)),
    createClient: (client) => dispatch(createClient(client)),
    createSession: (session) => dispatch(createSession(session)),
  };
}

export default connect(mapToState, mapDispatchToProps)(TelegramLogin);
