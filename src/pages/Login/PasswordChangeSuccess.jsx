import React from "react";
import OnboardLayout from "../../layouts/OnboardLayout";
import { useNavigate } from "react-router-dom";
import Password from "../../assets/gif/password.gif";

const PasswordChangeSuccess = () => {
  const navigate = useNavigate();

  return (
    <OnboardLayout title={"Password Changed"} desc={"Your password has been successfully changed."}>
      <img src={Password} alt="gif" className="mt-5" style={{ height: "150px" }} />
      <p className="body-L dark-M mt-4">You can now log in to your account using your new password.</p>

      <button className="green-bg-H body-L light-L py-[8px] px-[38px] login-button" onClick={() => navigate("/login")}>
        Login
      </button>
    </OnboardLayout>
  );
};

export default PasswordChangeSuccess;
