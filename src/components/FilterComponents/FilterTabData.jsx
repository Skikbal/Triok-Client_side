import React from "react";
import { RiArrowUpSLine as UpArrow } from "react-icons/ri";
import Tabs from "../Tabs/Tabs";
import Cross from "../../assets/svgs/Close.svg";
import FilterFieldHeader from "./FilterFieldHeader";

const FilterTabData = ({ title, tabData, activeTab, onSetActiveTab, lastDate, handleLastUpdate }) => {
  return (
    <div>
      <FilterFieldHeader title={title} type="to" symbol={"  to  "} data={activeTab} data2={lastDate} handleCross={handleLastUpdate} />

      <div className="mt-6">
        <Tabs tabData={tabData} activeTab={activeTab} onSetActiveTab={onSetActiveTab} />
      </div>

      {/* <div className="flex gap-3 items-start mt-6">
        <div className="search-box w-[70%]">
          <input type="text" className="body-N" placeholder="write here" style={{ width: "100%" }} />
          <span className="icon-search"></span>
        </div>

        <div ref={dropdownRef} className="custom-dropdown mt-1 w-[30%]">
          <div role="button" className="select-header-input filter-select light-bg-L body-N dark-M h-auto flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
            Days <ArrowDown />
          </div>
          {isOpen && (
            <div className="dropdown-list-container light-bg-L dark-M body-N  shadow rounded-box w-52 ">
              <ul className="dropdown-list">
                {options.flatMap((el, i) => (
                  <li key={i} role="button" className="">
                    {el.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div> */}
    </div>
  );
};

export default FilterTabData;
