import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import { handleDropdownClose } from "../../utils/utils";

const options = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Month" },
];

const OptionalOption = ({ title, onSetLastDate, onSetDateRange1, onSetDateRange2, date, date2, date3, activeTab, onSetDays, lastUp_days, onSetCategory, category }) => {
  const [isChecked, setIsChecked] = useState(false);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState("");

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  return (
    <div>
      {activeTab === "date" ? (
        <div>
          <div className="mt-2 body-N">
            {!isChecked ? (
              <input type="date" value={date} onChange={(e) => onSetLastDate(e.target.value)} />
            ) : (
              <div className="flex flex-row">
                <input type="date" style={{ width: "50%" }} value={date2} onChange={(e) => onSetDateRange1(e.target.value)} />
                <input type="date" style={{ width: "50%" }} value={date3} onChange={(e) => onSetDateRange2(e.target.value)} />
              </div>
            )}
          </div>

          <div className="mt-2">
            <label className="container">
              <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
              <span className="checkmark"></span>
              <p className="dark-M body-N" style={{ paddingLeft: "27px" }}>
                {title ? title : "Date Range"}
              </p>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 items-start mt-4">
          <div className="search-box w-[70%]">
            <input
              type="number"
              min={0}
              className="body-N"
              placeholder="write here"
              style={{ width: "100%" }}
              value={lastUp_days}
              onChange={(e) => {
                onSetDays(e.target.value);
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div ref={dropdownRef} className="custom-dropdown mt-1 w-[30%]">
            <div
              role="button"
              className="select-header-input filter-select light-bg-L body-N dark-M h-auto flex justify-between items-center"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              {options.find((el) => el?.value === category)?.label}
              <ArrowDown />
            </div>
            {isOpen && (
              <div className="dropdown-list-container light-bg-L dark-M body-N shadow rounded-box  ">
                <ul className="dropdown-list">
                  {options.flatMap((el, i) => (
                    <li
                      key={i}
                      role="button"
                      className=""
                      onClick={() => {
                        onSetCategory(el.value);
                        setIsOpen(false);
                      }}
                    >
                      {el.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionalOption;
