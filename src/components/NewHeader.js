import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import { createSession } from "../actions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Api } from "telegram";
function NewHeader(props) {
  const { t } = useTranslation();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackbarError, setSnackbarError] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <div className="flex items-center py-6 justify-between">
      <Link className="" to="/">
        <img
          alt="sella logo"
          src={"https://i.postimg.cc/Y9qwKpkv/Logo-1.png"}
          className="h-[40px] "
        />
      </Link>

      <nav className="basis-2/3 flex justify-between items-center">
        <Link to="/addproduct">
          <button className="bg-[#ffffff00] m-0 px-2 py-1 normal-case rounded-full border-main border-2 drop-shadow-none">
            <p>{t("add_product_page")}</p>
          </button>
        </Link>

        <i
          className="text-[#FF0000] cursor-pointer"
          onClick={async () => {
            try {
              await props.client.invoke(new Api.auth.LogOut({}));
              props.createSession("");
              window.location.reload();
            } catch (err) {
              setSnackbarError(err.errorMessage);
              setOpenSnackBar(true);
            }
          }}
        >
          <LogoutIcon />
        </i>
      </nav>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          variant="filled"
          severity={snackbarError.length ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarError.length ? snackbarError : t("verification_code_sent")}
        </Alert>
      </Snackbar>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    client: state.client,
    session: state.session,
  };
}

export default connect(mapStateToProps, { createSession })(NewHeader);
