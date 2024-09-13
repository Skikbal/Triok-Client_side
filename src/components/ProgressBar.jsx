import React from "react";

const ProgressBar = ({ width }) => {
  return (
    <div className="w-full rounded-full h-[4px]" style={{ backgroundColor: "#D9D9D9" }}>
      <div className="h-[4px] rounded-full green-bg-H" style={{ width: `${width}%` }}></div>
    </div>
  );
};

export default ProgressBar;
