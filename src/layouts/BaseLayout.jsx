import React from "react";
import "./layout.css";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

const BaseLayout = ({ children, isPadding = true }) => {
  return (
    <div className="baselayout-container light-bg-H">
      <div className="sidebar-main light-bg-L">
        <Sidebar />
      </div>
      <div className="header-dasboard main_container" style={{ width: "100%" }}>
        <Header />
        <div className={`${isPadding ? "dashboard" : ""}`}>
          <div className="container-fluid main_container">
            <div className="row">
              <div className="col-lg-12 col-sm-12">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
