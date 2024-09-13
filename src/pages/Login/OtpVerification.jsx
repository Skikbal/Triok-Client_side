import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import axios from "axios";
import { BASE_URL } from "../../utils/Element";
import OnboardLayout from "../../layouts/OnboardLayout";
import { NotificationManager } from "react-notifications";

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const email = localStorage.getItem("email");
  const [disable, setDisable] = useState(false);
  const [disableResend, setDisableResend] = useState(false);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setDisable(true);

    const dataToSend = {
      email: email,
      otp: otp,
    };

    axios
      .post(`${BASE_URL}/verify-otp`, dataToSend)
      .then((res) => {
        setDisable(false);
        setErrMsg("");
        setOtp("");
        navigate("/new-password");
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setDisable(false);
        setErrMsg(err?.response?.data?.message);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleResendOtp = (e) => {
    setOtp("");
    e.preventDefault();
    setDisableResend(true);
    const dataToSend = {
      email: email,
    };

    axios
      .post(`${BASE_URL}/forgot-password`, dataToSend)
      .then((res) => {
        setMsg(res.data.message);
        setDisableResend(false);
        setMinutes(30);
        setSeconds(0);
        setErrMsg("");
        setOtp("");
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setDisableResend(false);
        setErrMsg(err?.response?.data?.message);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text");
    console.log(data);
  };

  return (
    <OnboardLayout title={"OTP Verification"} desc={"Enter the OTP (One-Time Password) sent to your email address"}>
      <p className="timer-text green-H">
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>

      {errMsg !== "" && <p className="error">{errMsg}</p>}

      <form className="mt-[20px] login-form" onSubmit={handleVerifyOtp}>
        <OtpInput inputStyle={{ width: "54px", height: "48px", borderRadius: "8px", marginRight: "16px" }} placeholder="X" onPaste={handlePaste} value={otp} onChange={setOtp} numInputs={6} renderInput={(props) => <input type="number" {...props} />} />
        <p className="body-L dark-M mt-4">This OTP will expire in 30 minutes. If you haven't received the OTP, click the “Resend OTP" button.</p>

        {msg !== "" && <p className="green-M head-5 mt-6">{msg}</p>}
        <div className="flex gap-6">
          <button type="submit" disabled={otp.length < 6 || disable} className="green-bg-H body-L light-L py-[8px] px-[39px] login-button" onClick={handleVerifyOtp}>
            Verify
          </button>

          <button type="button" disabled={disableResend} className="green-H body-L py-[8px] px-[16px] outline-button" onClick={handleResendOtp}>
            Resend OTP
          </button>
        </div>
      </form>
    </OnboardLayout>
  );
};

export default OtpVerification;
