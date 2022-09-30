import React, { Fragment, useEffect, useRef, useState } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/loader/Loader";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors, register } from "../../actions/userAction";
import { useAlert } from "react-alert";

const LoginSignUp = ({ history, location }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState();
  const [loginPassword, setLoginPassword] = useState();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setavatarPreview] = useState("/Profile.jfif");

  const loginSubmit = (e) => {
    dispatch(login(loginEmail, loginPassword));
    return false;
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      history.push(redirect);
    }
  }, [alert, error, dispatch, isAuthenticated, history, redirect]);

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setavatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const registerSubmit = () => {
    const myform = new FormData();
    myform.set("name", name);
    myform.set("email", email);
    myform.set("password", password);
    myform.set("avatar", avatar);
    dispatch(register(myform));
    return false;
  };

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.remove("shiftToNeutral");
      switcherTab.current.classList.add("shiftToRight");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="loginSignUpContainer">
            <div className="loginSignUpBox">
              <div>
                <div className="login-SignUp_Toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              {/* LOGIN FORM START */}
              <form className="loginForm" ref={loginTab}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    autoComplete="off"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input
                  onClick={loginSubmit}
                  type="button"
                  value="Login"
                  className="loginBtn"
                />
              </form>
              {/* LOGIN FORM ENDS */}

              {/* SIGN UP FORM START */}
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
              >
                <div className="signUPName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                    required
                  />
                </div>
                <div className="signUPEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                    required
                  />
                </div>
                <div className="signUPPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                    required
                  />
                </div>
                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input
                  onClick={registerSubmit}
                  type="button"
                  value="register"
                  className="signUpBtn"
                />
              </form>
              {/* SIGN UP FORM ENDS */}
            </div>
          </div>
        </Fragment>
      )}{" "}
    </Fragment>
  );
};

export default LoginSignUp;
