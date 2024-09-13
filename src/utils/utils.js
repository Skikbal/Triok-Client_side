import moment from "moment";

export const handleDropdownClose = (dropdownRef, handleClose) => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      handleClose();
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
};

export const getYears = (back) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: back }, (v, i) => currentYear - back + i + 1);
};

export const yearOptions = getYears(50)
  .reverse()
  .map((el) => ({ value: el?.toString(), label: el?.toString() }));

var dateArr = Array.from({ length: 31 }, (_, x) => x + 1);

export const dateOptions = dateArr.flatMap((el) => ({ label: el?.toString(), value: el?.toString() }));

var minusArr = Array.from({ length: 60 }, (_, x) => x + 1);

export const minutesOptions = minusArr.flatMap((el) => ({ label: el?.toString()?.length === 1 ? `0${el?.toString()}` : el?.toString(), value: el?.toString() }));

var hoursArr = Array.from({ length: 12 }, (_, x) => x + 1);

export const hoursOptions = hoursArr.flatMap((el) => ({ label: el?.toString()?.length === 1 ? `0${el?.toString()}` : el?.toString(), value: el?.toString() }));

export const completeRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

export const exceptThisSymbols = ["e", "E", "+", "-", "."];

export const handleNumberKeyDown = (e) => {
  if (e.target.value.length >= 5 && e.key !== "Backspace") {
    e.preventDefault();
  }

  exceptThisSymbols.includes(e.key) && e.preventDefault();
};

export const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

export const getDiffInDays = (startDate, endDate) => {
  var diff = moment(endDate)?.diff(moment(startDate), "days");
  const result = `${diff} ${diff > 1 ? "days" : "day"}`;
  return result;
};

export const countMatchingEntries = (obj1, obj2) => {
  let count = 0;

  // Iterate through keys of obj1
  for (let key in obj1) {
    // Check if obj2 has the same key and value
    if (obj2.hasOwnProperty(key) && obj1[key] === obj2[key]) {
      count++;
    }
  }

  return count;
};

export const countNonMatchingEntries = (obj1, obj2) => {
  let count = 0;

  // Iterate through keys of obj1
  for (let key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      // Compare values of the same property key
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        count++;
      }
    } else {
      // Handle properties that exist in obj1 but not in obj2
      count++;
    }
  }

  // Check for properties in obj2 that are not in obj1
  for (let key in obj2) {
    if (!obj1.hasOwnProperty(key)) {
      count++;
    }
  }

  return count;
};

export const getPercentAskingPrice = (offerPrice, askingPrice) => {
  const value = offerPrice && askingPrice ? (Number(offerPrice) / Number(askingPrice)) * 100 : 0;
  const res = `${value?.toLocaleString()} %`;
  return value;
};
