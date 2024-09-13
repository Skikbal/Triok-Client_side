import React from "react";

const Toggle = ({ text, isActive, onSetIsActive }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isActive}
        onChange={(e) => {
          if (onSetIsActive) {
            onSetIsActive(e.target.checked);
          } else {
            console.log(e.target.checked);
          }
        }}
        className="sr-only peer"
      />
      <div className="toggle-container relative border-[1px] border-[#2D5B30] rounded-full peer dark:bg-[#ffffff] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-[#2D5B30] after:content-[''] after:absolute after:top-[2px] after:start-[2px] peer-checked:after:bg-white after:bg-[#2D5B30] after:border-[#2D5B30] after:border after:rounded-full  after:transition-all dark:border-[#2D5B30] peer-checked:bg-[#2D5B30]"></div>

      {text && <span className="body-N dark-M ml-4">{text}</span>}
    </label>
  );
};

export default Toggle;
