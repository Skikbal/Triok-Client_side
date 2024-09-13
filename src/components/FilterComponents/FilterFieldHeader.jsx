import React from "react";
import Cross from "../../assets/svgs/Close.svg";
import { RiArrowUpSLine as UpArrow } from "react-icons/ri";

const FilterFieldHeader = ({ title, data, handleCross, type, symbol, data2 }) => {
  return (
    <div className="flex justify-between items-center">
      <p className="head-4 dark-H">{title}</p>
      <div className="flex items-center">
        {type === "array"
          ? data > 0 && (
              <div className="dark-bg-L dark-M rounded-full py-1 px-2.5 body-S flex items-center gap-3">
                {data} selected
                <img role="button" src={Cross} alt="close" style={{ height: 15, width: 15 }} onClick={handleCross} />
              </div>
            )
          : type === "to"
          ? data &&
            data2 && (
              <div className="dark-bg-L dark-M rounded-full py-1 px-2.5 body-S flex items-center gap-3">
                {symbol ? <p>{data + symbol + data2}</p> : <p>{data + " " + data2}</p>}

                <img role="button" src={Cross} alt="close" style={{ height: 15, width: 15 }} onClick={handleCross} />
              </div>
            )
          : data && (
              <div className="dark-bg-L dark-M rounded-full py-1 px-2.5 body-S flex items-center gap-3">
                <p>
                  {data} {symbol ? symbol : ""}
                </p>
                <img role="button" src={Cross} alt="close" style={{ height: 15, width: 15 }} onClick={handleCross} />
              </div>
            )}
        {/* <UpArrow /> */}
      </div>
    </div>
  );
};

export default FilterFieldHeader;
