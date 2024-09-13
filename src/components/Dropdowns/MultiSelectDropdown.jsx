import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import { handleDropdownClose } from "../../utils/utils";

const MultiSelectDropdown = ({ label, placeholder, options, selectOptions, onSetSelectOptions }) => {
  const dropdownRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectOption = (value) => {
    if (selectOptions.includes(value)) {
      onSetSelectOptions(selectOptions.filter((el) => el !== value));
    } else {
      onSetSelectOptions([...selectOptions, value]);
    }
  };

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const getName = (value) => {
    const name = options?.find((el) => el?.value === value)?.label;
    return name;
  };

  return (
    <div className="">
      <p className="head-4 dark-H ">
        {label}
        <span className="red-D">*</span>
      </p>
      <div ref={dropdownRef} className="custom-dropdown mt-2">
        <div
          role="button"
          className="select-header-input capitalize light-bg-L body-N dark-M flex justify-between items-center"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          style={{ height: "auto", padding: "8px" }}
        >
          <p className="flex gap-2 flex-wrap">
            {selectOptions?.length === 0
              ? placeholder
              : selectOptions?.map((el) => (
                  <p className="tags green-H body-S capitalize" style={{ padding: "3px 8px" }}>
                    {getName(el)}
                  </p>
                ))}
          </p>
          <ArrowDown />
        </div>

        {isOpen && (
          <div className="dropdown-list-container shadow light-bg-L dark-M body-N rounded-box" style={{ width: "100%", maxHeight: "230px", overflowY: "auto" }}>
            {options.map((el, idx) => (
              <ul key={idx} className="">
                <li className="">
                  <label className="container" style={{ marginBottom: `${idx === options?.length - 1 ? "0px" : ""}` }}>
                    <p>{el.label}</p>
                    <input
                      type="checkbox"
                      checked={selectOptions?.includes(el.value)}
                      onChange={() => {
                        handleSelectOption(el.value);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                </li>
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
