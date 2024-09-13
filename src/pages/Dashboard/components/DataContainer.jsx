import React from "react";
import { useNavigate } from "react-router-dom";

const DataContainer = ({ logo, text, value, link }) => {
  const navigate = useNavigate();
  return (
    <div
      role="button"
      onClick={() => {
        navigate(link);
      }}
      className="light-bg-L py-4 px-5 flex items-center justify-between h-[100%]"
    >
      <div className="green-bg-H p-2 rounded-[4px]">{logo && <img src={logo} alt="Logo" className="w-6 h-6" />}</div>
      <div className="text-right">
        <p className="head-2 dark-H p-0">{value}</p>
        <p className="body-S dark-M p-0">{text}</p>
      </div>
    </div>
  );
};

export default DataContainer;
