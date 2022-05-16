import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import { createSession } from "../actions";
function NewHeader(props) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center py-6 justify-between">
      <Link className="" to="/">
        <img
          src={"https://i.postimg.cc/Y9qwKpkv/Logo-1.png"}
          className="h-[40px] "
        />
      </Link>

      <nav className="basis-2/3 flex justify-between items-center">
        <Link to="/addproduct">
          <button className="bg-[#ffffff00] m-0 px-2 py-1 normal-case rounded-full border-main border-2">
            <p>{t("add_product_page")}</p>
          </button>
        </Link>

        <a
          className="text-[#FF0000] cursor-pointer"
          onClick={async () => {
            try {
              const result = await props.client.invoke(
                new window.telegram.Api.auth.LogOut({})
              );
              props.createSession("");
              window.location.reload();
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <LogoutIcon />
        </a>
      </nav>
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
