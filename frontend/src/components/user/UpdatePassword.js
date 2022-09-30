import React, { Fragment, useEffect, useState } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/loader/Loader";
import { useHistory } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";

const UpdatePassword = () => {
  const alert = useAlert();
  const history = useHistory();
  const dispatch = useDispatch();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Profile Updated Successfully");
      history.push("/account");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [alert, error, dispatch, history, isUpdated]);


  const updatePasswordSubmit = () => {
    const myform = new FormData();
    
    myform.set("oldPassword", oldPassword);
    myform.set("newPassword", newPassword);
    myform.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myform));
    return false;
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`Update Password`} />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Password</h2>

              <form className="updatePasswordForm">
                <div className="updatePassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="updatePassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="updatePassword">
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
                  onClick={updatePasswordSubmit}
                  type="button"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
