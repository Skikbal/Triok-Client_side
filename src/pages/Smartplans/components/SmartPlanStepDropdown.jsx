import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import { handleDropdownClose, handleScrollToTop } from "../../../utils/utils";
import { smartPlanOptions } from "../../../utils/options";
import { CreateSmartPlanContext } from "../../../context/CreateSmartPlanContext";

const SmartPlanStepDropdown = ({ element }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const { setActive, setActiveDay, setActiveTask, active } = useContext(CreateSmartPlanContext);

  const selectedOption = smartPlanOptions.find((el) => el.value === category);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  useEffect(() => {
    if (active === "details") {
      setCategory("");
    }
  }, [active]);

  return (
    <div ref={dropdownRef} className="custom-dropdown mt-2 w-[60%]">
      <div role="button" className="select-header-input capitalize light-bg-L body-N dark-H flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
        {category === "" ? (
          "Select"
        ) : (
          <div className="flex items-center">
            <img src={selectedOption.icon} alt="" className="mr-3 w-[20px]" />
            {selectedOption.label}
          </div>
        )}
        <ArrowDown />
      </div>

      {isOpen && (
        <div className="dropdown-list-container light-bg-L dark-M body-N shadow rounded-box" style={{ width: "100%" }}>
          <ul className="dropdown-list">
            {smartPlanOptions.flatMap((el, i) => (
              <li
                key={i}
                role="button"
                onClick={() => {
                  setCategory(el.value);
                  setIsOpen(false);
                  setActive(el.value);
                  setActiveDay(element);
                  setActiveTask();
                  handleScrollToTop();
                }}
                className={`body-N dark-H ${smartPlanOptions === el.value ? "active" : ""}`}
              >
                <img src={el.icon} alt="" className="mr-3 w-[20px]" /> {el.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmartPlanStepDropdown;
