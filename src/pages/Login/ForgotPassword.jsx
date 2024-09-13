import React, { useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/Element";
import { NotificationManager } from "react-notifications";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleGetOtp = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      email: email,
    };

    localStorage.setItem("email", email);

    axios
      .post(`${BASE_URL}/forgot-password`, dataToSend)
      .then((res) => {
        setDisable(false);
        setErrMsg("");
        navigate("/otp-verify");
      })
      .catch((err) => {
        setDisable(false);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
        setErrMsg(err?.response?.data?.errors);
      });
  };

  return (
    <OnboardLayout title={"Forgot Password"} desc={"Enter the email address associated with your account to receive a OTP (One-Time Password)"}>
      <form className="login-form" onSubmit={handleGetOtp}>
        {errMsg !== "" && <p className="error">{errMsg}</p>}

        <div className="mb-4 mt-[35px]">
          <label className="dark-H head-4 mb-2" htmlFor="username">
            Email
          </label>
          <input
            className="body-N"
            name="email"
            type="email"
            placeholder="write your email here"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <button type="submit" disabled={disable} className="green-bg-H body-L light-L py-[8px] px-[39px] login-button" onClick={handleGetOtp}>
          Get OTP
        </button>
      </form>
    </OnboardLayout>
  );
};

export default ForgotPassword;
