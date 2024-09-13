import React from "react";

const InputWithIcon = ({ name, icon, type, placeholder, value, onChange, min }) => {
  return (
    <div className="flex password-field items-center">
      <input
        className="body-N"
        name={name}
        value={value}
        min={min ? min : 0}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        onWheel={(e) => {
          if (type === "number") {
            e.target.blur();
          }
        }}
      />
      <img role="button" src={icon} alt="" />
    </div>
  );
};

export default InputWithIcon;
