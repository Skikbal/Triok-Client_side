import React, { useEffect, useRef, useState } from "react";
import { handleDropdownClose } from "../../utils/utils";

const SearchDropdown = ({ text, placeholder, options, handleSelect, fetchSuggestions, onSetOptions, isTop = false }) => {
  const dropdownRef = useRef(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (text && text !== "") {
      setInput(text);
    } else {
      setInput("");
    }
  }, [text]);

  useEffect(() => {
    const handleClose = () => {
      onSetOptions([]);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  return (
    <div ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className="body-N mt-0 dark-H w-full h-[40px] rounded-[6px] focus:outline-none"
        />

        {options?.length !== 0 && (
          <div className={`absolute ${isTop ? "bottom-10" : ""} z-10 w-full mt-1 light-bg-L border border-gray-300 rounded-md shadow-md max-h-[40vh] overflow-y-auto`}>
            {options.map((option) => (
              <div
                role="button"
                key={option.value}
                className="px-3 py-2 body-N hover:bg-gray-100 dark-H"
                onClick={() => {
                  handleSelect(option);
                }}
              >
                {option.label}
                {option?.desc && <p className="body-S dark-M">{option?.desc}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
