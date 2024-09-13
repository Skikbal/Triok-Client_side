import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import { handleDropdownClose } from "../../../utils/utils";
import moment from "moment";
import CustomDateFilterModal from "../../../components/CustomDateFilterModal";

const filterOptions = [
  { value: "4", startDate: moment().subtract(3, "months").startOf("month")?.format(), endDate: moment().subtract(3, "months").endOf("month")?.format(), label: moment().subtract(3, "months").format("MMM YYYY") },
  { value: "3", startDate: moment().subtract(2, "months").startOf("month")?.format(), endDate: moment().subtract(2, "months").endOf("month")?.format(), label: moment().subtract(2, "months").format("MMM YYYY") },
  { value: "1", startDate: moment().subtract(1, "months").startOf("month")?.format(), endDate: moment().subtract(1, "months").endOf("month")?.format(), label: moment().subtract(1, "months").format("MMM YYYY") },
  { value: "0", startDate: moment().startOf("month")?.format(), endDate: moment().endOf("month")?.format(), label: moment().format("MMM YYYY") },
  { value: "custom", startDate: "", endDate: "", label: "Custom" },
];

const yearOptions = [
  { label: moment().subtract(5, "year").year(), value: moment().subtract(5, "year").year() },
  { label: moment().subtract(4, "year").year(), value: moment().subtract(4, "year").year() },
  { label: moment().subtract(3, "year").year(), value: moment().subtract(3, "year").year() },
  { label: moment().subtract(2, "year").year(), value: moment().subtract(2, "year").year() },
  { label: moment().subtract(1, "year").year(), value: moment().subtract(1, "year").year() },
  { label: moment().year(), value: moment().year() },
];

const DashboardFilter = ({ filterData, onSetFilterData, onSetSelectedFilter, selectedFilter, type, onSuccess }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const handleSelect = (el) => {
    if (type === "year") {
      onSetFilterData(el.value);
    } else {
      onSetSelectedFilter(el.value);
      if (el.value === "custom") {
        setShowCustomDateModal(true);
      } else {
        onSetFilterData({
          startDate: el?.startDate,
          endDate: el.endDate,
        });
      }
    }
    setIsOpen(false);
  };

  const optionsToShow = type === "year" ? yearOptions : filterOptions;

  const selectedOption = type === "year" ? yearOptions?.find((el) => el.value === filterData) : filterOptions?.find((el) => el.value === selectedFilter);

  return (
    <>
      <div ref={dropdownRef} className="custom-dropdown">
        <div
          role="button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="rounded-[100px] px-3 py-2 light-bg-L border border-[#2d5b30] head-6 green-H flex items-center gap-2"
        >
          <p>{selectedOption?.label}</p>
          <ArrowDown />
        </div>

        {isOpen && (
          <div className="dropdown-list-container dropdown-end light-bg-L dark-M body-N p-2 shadow rounded-box" style={{ width: "140px" }}>
            <ul className="dropdown-list">
              {optionsToShow?.map((el, idx) => (
                <li
                  role="button"
                  className={`${selectedOption?.label === el.label ? "active" : ""}`}
                  key={idx}
                  onClick={() => {
                    handleSelect(el);
                  }}
                >
                  {el.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <CustomDateFilterModal
        showModal={showCustomDateModal}
        onClose={() => {
          setShowCustomDateModal(false);
        }}
        onSuccess={onSuccess}
        filterCustomDate={filterData}
        onSetFilterCustomDate={onSetFilterData}
      />
    </>
  );
};

export default DashboardFilter;
