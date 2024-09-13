import React, { useState } from "react";
import Magnifier from "../../assets/svgs/Magnifier.svg";

const CheckboxSearchOptions = ({ selectedOptions = [], handleChange, options }) => {
  const [itemToShow, setItemToShow] = useState(5);
  const [search, setSearch] = useState("");

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const newTags = checked ? [...selectedOptions, value] : selectedOptions.filter((tag) => tag !== value);
    handleChange(newTags);
  };

  return (
    <div>
      <div className="search-box w-[100%] mt-2">
        <input
          type="text"
          className="body-S"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search here...."
          style={{ width: "100%" }}
        />
        <span className="icon-search"></span>
      </div>

      {/* <div className="relative mt-4">
        <img src={Magnifier} className="absolute left-3 top-1/2 transform -translate-y-1/2" alt="search-icon" />
        <input
          type="text"
          className="body-N pl-10 pr-8 w-full"
          placeholder="Search here..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />

        {search && (
          <CloseIcon
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => {
              setSearch("");
            }}
          />
        )}
      </div> */}

      <div className="mt-4">
        {options
          ?.filter((item) => item?.label?.toLowerCase().includes(search?.toLowerCase()))
          ?.slice(0, itemToShow)
          ?.flatMap((el, i) => (
            <label key={i} className="container">
              <input type="checkbox" value={el.value} checked={selectedOptions?.includes(el.value?.toString())} onChange={handleCheckboxChange} />
              <span className="checkmark"></span>
              <p className="dark-M body-N capitalize">{el?.label}</p>
            </label>
          ))}
      </div>

      {itemToShow === 5 ? (
        <p role="button" onClick={() => setItemToShow(options?.length)} className="dark-M body-N">
          Show More
        </p>
      ) : (
        <p role="button" onClick={() => setItemToShow(5)} className="dark-M body-N">
          Show Less
        </p>
      )}
    </div>
  );
};

export default CheckboxSearchOptions;
