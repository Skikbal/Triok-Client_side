import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./Login.css";
import axios from "axios";
import { BASE_URL } from "../../utils/Element";
import OnboardLayout from "../../layouts/OnboardLayout";
import PasswordInput from "../../components/PasswordInput";
import { setConnectedAppData, setToken, setUserData, setUserType } from "../../redux/Action/AuthActions";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [disable, setDisable] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    setDisable(true);

    const dataToSend = {
      email: values.email,
      password: values.password,
    };

    axios
      .post(`${BASE_URL}/login`, dataToSend)
      .then((res) => {
        const data = res?.data?.data;
        dispatch(setToken(data?.token));
        dispatch(setUserData(data?.user));
        dispatch(setUserType(data?.user?.role_id));
        dispatch(setConnectedAppData(data?.connectedapp_data));
        setDisable(false);
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        setErrMsg("");
        navigate("/");
      })
      .catch((err) => {
        setDisable(false);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
        setErrMsg(err?.response?.data?.errors);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <div className="login_only">
      <OnboardLayout title={"Hello! Welcome Back!"} desc={"Log in with the data you entered during registration."}>
        <form className=" login-form" onSubmit={handleLogin}>
          {errMsg && errMsg !== "" && <p className="error">{errMsg}</p>}
          <div className="mb-4 mt-[35px]">
            <label className="dark-H head-4 mb-2" htmlFor="email">
              Email
            </label>
            <input className="body-N" name="email" type="email" placeholder="write your email here" value={values.email} onChange={handleInputChange} />
          </div>

          <div className="mb-4 mt-[16px]">
            <div className="flex justify-between">
              <label className="dark-H head-4 mb-2" htmlFor="password">
                Password
              </label>
              <p className="body-S green-M" role="button" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </p>
            </div>
            <PasswordInput name="password" value={values.password} onChange={handleInputChange} />
          </div>

          <button type="submit" disabled={disable} className="green-bg-H body-L light-L py-[8px] px-[39px] login-button" onClick={handleLogin}>
            Login
          </button>
        </form>
      </OnboardLayout>
    </div>
  );
};

export default Login;
