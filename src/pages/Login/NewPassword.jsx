import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardLayout from "../../layouts/OnboardLayout";
import PasswordInput from "../../components/PasswordInput";
import ProgressBar from "../../components/ProgressBar";
import axios from "axios";
import { BASE_URL } from "../../utils/Element";
import usePasswordValidation from "../../hooks/usePasswordValidation";
import { NotificationManager } from "react-notifications";
import { completeRegex } from "../../utils/utils";

const NewPassword = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disable, setDisable] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [progress, handleProgress] = usePasswordValidation();
  const [passwordErr, setPasswordErr] = useState(false);

  useEffect(() => {
    handleProgress(newPassword);
  }, [newPassword]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      email: email,
      password: newPassword,
      password_confirmation: confirmPassword,
    };

    if (newPassword?.match(completeRegex)) {
      axios
        .post(`${BASE_URL}/change-password`, dataToSend)
        .then((res) => {
          setDisable(false);
          setErrMsg("");
          setPasswordErr(false);
          navigate("/password-success");
          if (res?.data?.message) {
            NotificationManager.success(res?.data?.message);
          }
        })
        .catch((err) => {
          setDisable(false);
          setErrMsg(err?.response?.data?.errors);
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setPasswordErr(true);
    }
  };

  const handleSetPassword = (e) => {
    setNewPassword(e.target.value);
  };

  return (
    <OnboardLayout title={"New Password"} desc={"Enter a new password for your account."}>
      <form className=" login-form" onSubmit={handleChangePassword}>
        {errMsg !== "" && <p className="error">{errMsg}</p>}
        <div className="mb-4 mt-[18px]">
          <label className="dark-H head-4 mb-2" htmlFor="newPassword">
            New Password
          </label>
          <PasswordInput name="newPassword" value={newPassword} onChange={handleSetPassword} />
        </div>

        <div className="mb-4">
          <label className="dark-H head-4 mb-2" htmlFor="username">
            Again Password
          </label>
          <PasswordInput name="againPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        <ProgressBar width={progress} />

        <p className={`body-S mt-4 ${passwordErr ? "red-D" : "dark-M"}`}>Password must be 8+ characters with at least one uppercase, one lowercase, one number, and one special character.</p>
        <button type="submit" disabled={disable} className="green-bg-H body-L light-L py-[8px] px-[18px] login-button" onClick={handleChangePassword}>
          Change Password
        </button>
      </form>
    </OnboardLayout>
  );
};

export default NewPassword;
