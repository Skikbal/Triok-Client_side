import React, { useState } from "react";
import EyeClose from "../assets/svgs/eye-off-outline.svg";
import EyeOpen from "../assets/svgs/Outline.svg";

const PasswordInput = ({ name, value, onChange, disabled }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="flex password-field">
      <input disabled={disabled} className="body-N" name={name} value={value} onChange={onChange} type={isShowPassword ? "text" : "password"} placeholder="write your password here" />
      <img
        role="button"
        src={isShowPassword ? EyeOpen : EyeClose}
        alt="eye"
        onClick={() => {
          setIsShowPassword(!isShowPassword);
        }}
      />
    </div>
  );
};

export default PasswordInput;
