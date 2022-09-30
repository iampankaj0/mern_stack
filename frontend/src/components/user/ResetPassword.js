import React, { Fragment, useEffect, useState } from "react";
import "./ResetPassword.css";
import Loader from "../layout/loader/Loader";
import { useHistory } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const ResetPassword = ({ match }) => {
  const alert = useAlert();
  const history = useHistory();
  const dispatch = useDispatch();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Password Updated Successfully");
      history.push("/login");
    }
  }, [alert, error, dispatch, history, success]);

  const resetPasswordSubmit = () => {
    const myform = new FormData();

    myform.set("password", password);
    myform.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(match.params.token, myform));
    return false;
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`Update Password`} />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Update Password</h2>

              <form className="resetPasswordForm">
               
                <div className="resetPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="resetPassword">
                  <LockIcon />
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <input
                  onClick={resetPasswordSubmit}
                  type="button"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;
