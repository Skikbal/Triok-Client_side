import React from "react";

const FilterSearchSection = ({ title, placeholder, type, value, onChange }) => {
  return (
    <div>
      <p className="head-4 dark-H">{title}</p>

      <div className="search-box mt-2">
        <input type={type ? type : "text"} className="body-S" style={{ width: "100%" }} placeholder={placeholder ? placeholder : "write anything"} value={value} onChange={onChange} onWheel={(e) => e.target.blur()} />
      </div>
    </div>
  );
};

export default FilterSearchSection;
