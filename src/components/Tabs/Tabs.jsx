import React from "react";
import "./Tabs.css";

const Tabs = ({ tabData, activeTab, onSetActiveTab }) => {
  const tabWidth = `${100 / tabData?.length}%`;

  return (
    <div className="w-full flex tabs-container body-N text-center">
      {tabData.flatMap((el, idx) => (
        <div
          key={idx}
          role="button"
          onClick={() => {
            onSetActiveTab(el.value);
          }}
          style={{ width: tabWidth }}
          className={`tab-data  ${activeTab === el.value ? "light-L dark-bg-M active" : "dark-M light-bg-L"}`}
        >
          {el.label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
