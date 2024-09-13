import React from "react";
import Dropdown from "react-dropdown";
import { dateOptions, yearOptions } from "../../utils/utils";
import { monthOptions } from "../../utils/options";

const DateDropdown = ({ title, selectedMonth, selectedYear, selectedDate, onDateSelect, onMonthSelect, onYearSelect }) => {
  return (
    <div className="mt-6">
      <p className="dark-H head-4 mb-2">{title}</p>
      <div className="flex gap-5">
        <Dropdown className="company-select" value={monthOptions.find((el) => el.value == selectedMonth)} onChange={onMonthSelect} options={monthOptions} placeholder="Month" />
        <Dropdown className="company-select" value={dateOptions.find((el) => el.value == selectedDate)} onChange={onDateSelect} options={dateOptions} placeholder="Date" />
        <Dropdown className="company-select" value={yearOptions.find((el) => el.value == selectedYear)} onChange={onYearSelect} options={yearOptions} placeholder="Year" />
      </div>
    </div>
  );
};

export default DateDropdown;
