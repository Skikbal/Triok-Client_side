import React, { useRef, useState, useEffect } from "react";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import CustomDateFilterModal from "../CustomDateFilterModal";

const activityData = ["Meeting", "Conversation", "Left Message", "Email", "Text", "Note", "Mail", "Contact", "Company", "Task", "Acquisition", "Property", "SmartPlan"];

const allTimeFilterOptions = [
  { value: "alltime", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 days" },
  { value: "30days", label: "Last 30 days" },
  { value: "90days", label: "Last 90 days" },
  { value: "custom", label: "Custom" },
];

const ActivityFilter = ({ filterData, onSetFilterData, onSuccess, selectedActivities, onSetSelectedActivities }) => {
  const allTimeDropdownRef = useRef(null);
  const activityDropdownRef = useRef(null);
  const [isAllTimeOpen, setIsAllTimeOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  const handleActivityOptionClick = (value) => {
    if (selectedActivities?.includes(value)) {
      onSetSelectedActivities(selectedActivities?.filter((activity) => activity !== value));
    } else {
      onSetSelectedActivities([...selectedActivities, value]);
    }
  };

  const handleSelectAllActivities = () => {
    if (selectedActivities?.length === activityData.length) {
      onSetSelectedActivities([]);
    } else {
      onSetSelectedActivities(activityData.map((activity) => activity.title));
    }
  };

  const handleAllTimeDropdownClick = () => {
    setIsAllTimeOpen(!isAllTimeOpen);
    setIsActivityOpen(false);
  };

  const handleActivityDropdownClick = () => {
    setIsActivityOpen(!isActivityOpen);
    setIsAllTimeOpen(false);
  };

  const handleCloseDropdowns = (event) => {
    if (allTimeDropdownRef.current && !allTimeDropdownRef.current.contains(event.target) && activityDropdownRef.current && !activityDropdownRef.current.contains(event.target)) {
      setIsAllTimeOpen(false);
      setIsActivityOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleCloseDropdowns);
    return () => {
      document.removeEventListener("mousedown", handleCloseDropdowns);
    };
  }, []);

  return (
    <>
      <div className="flex">
        <div ref={allTimeDropdownRef} className="custom-dropdown">
          <div role="button" className="flex items-center gap-1" onClick={handleAllTimeDropdownClick}>
            <p className="capitalize">{allTimeFilterOptions.find((el) => el.value === filterData?.type)?.label}</p>
            <ArrowDown />
          </div>

          {isAllTimeOpen && (
            <div className="dropdown-list-container light-bg-L dark-M body-N p-2 shadow rounded-box w-48 ">
              <ul className="dropdown-list">
                {allTimeFilterOptions.map((el, idx) => (
                  <li
                    role="button"
                    className={`${filterData?.type === el.value ? "active" : ""}`}
                    key={idx}
                    onClick={() => {
                      if (el.value === "custom") {
                        setShowCustomDateModal(true);
                      }
                      onSetFilterData({ type: el.value, startDate: "", endDate: "" });
                      setIsAllTimeOpen(false);
                    }}
                  >
                    {el.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div ref={activityDropdownRef} className="custom-dropdown ml-6">
          <div role="button" className="flex items-center gap-1 w-28" onClick={handleActivityDropdownClick}>
            <p className="">All Activity</p>
            <ArrowDown className="" />
          </div>

          {isActivityOpen && (
            <ul className="dropdown-list-container p-2 shadow light-bg-L dark-M body-N rounded-box" style={{ width: "310px" }}>
              <div className="flex items-center green-H head-6 pb-3" style={{ borderBottom: "1px solid #F4F4F4" }}>
                <p role="button" className="text-center w-[50%]" onClick={handleSelectAllActivities}>
                  Select All
                </p>
                <p
                  role="button"
                  className="text-center w-[50%]"
                  style={{ borderLeft: "1px solid #F4F4F4" }}
                  onClick={() => {
                    onSetSelectedActivities([]);
                  }}
                >
                  Clear All
                </p>
              </div>

              <ul className="h-[240px] overflow-y-auto">
                {activityData.map((el, idx) => (
                  <li key={idx} className="mt-4">
                    <label className="container" style={{ marginBottom: `${idx === activityData?.length - 1 ? "0px" : "10px"}` }}>
                      <p>{el}</p>
                      <input
                        type="checkbox"
                        checked={selectedActivities.includes(el.title)}
                        onChange={() => {
                          handleActivityOptionClick(el);
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </li>
                ))}
              </ul>
            </ul>
          )}
        </div>
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

export default ActivityFilter;
