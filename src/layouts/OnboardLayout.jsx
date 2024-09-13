import React from "react";
import "./layout.css";
// import logoImg from "../assets/images/logo-white.png";
import logoImg from "../assets/images/White-Logo.png";

const OnboardLayout = ({ children, title, desc }) => {
  return (
    <div className="layout">
      <div className="layout-inner my-auto">
        <div className="layout-left dark-bg-M">
          <img src={logoImg} alt="logo" className="my-auto" />
        </div>
        <div className="layout-right light-bg-L">
          <h1 className="text-3xl font-bold ">{title}</h1>
          <p className="body-L dark-M mt-2">{desc}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardLayout;
