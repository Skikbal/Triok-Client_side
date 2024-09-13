import React, { useEffect, useRef, useState } from "react";
import RightModal from "../Modal/RightModal";
import { initialSmartPlanFilterData } from "../../utils/initialData";
import SavedFilterComponent from "../SavedFilters/SavedFilterComponent";
import { countNonMatchingEntries, handleDropdownClose } from "../../utils/utils";
import SmartPlanFilterData from "../../pages/Smartplans/components/SmartPlanFilterData";

const SmartPlanFilter = ({ filterData, onSetFilterData, onCallApiAgain }) => {
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSavefilterId, setSelectedSaveFilterId] = useState("");

  const count = countNonMatchingEntries(filterData, initialSmartPlanFilterData);

  useEffect(() => {
    const handleClose = () => {
      setIsSidebarOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const handleFilter = () => {
    onCallApiAgain();
    setIsSidebarOpen(false);
    setSelectedSaveFilterId("");
  };

  const handleSelectFilter = (value) => {
    const dataToSet = {
      duration: value?.duration ?? "",
      touches: value?.touches ?? "",
      task_type: value?.task_type ?? "",
      repeat_number: value?.repeat_number ?? "no",
      link_other_smartplan: value?.link_other_smartplan ?? [],
      priority: value?.priority ?? [],
      contacts: value?.contacts ?? [],
    };
    onSetFilterData(dataToSet);
    onCallApiAgain(dataToSet);
  };

  const saveSearchFilterData = {
    duration: filterData?.duration,
    touches: filterData?.touches,
    task_type: filterData?.task_type,
    repeat_number: filterData?.repeat_number,
    link_other_smartplan: filterData?.link_other_smartplan,
    priority: filterData?.priority,
    contacts: filterData?.contacts,
  };

  return (
    <div>
      <SavedFilterComponent
        from="smartplan"
        count={count}
        isSidebarOpen={isSidebarOpen}
        saveSearchFilterData={saveSearchFilterData}
        selectedSavefilterId={selectedSavefilterId}
        initialFilterData={initialSmartPlanFilterData}
        onCallApiAgain={onCallApiAgain}
        onSetFilterData={onSetFilterData}
        onSetSelectedSaveFilterId={(value) => {
          setSelectedSaveFilterId(value);
        }}
        handleSelectFilter={handleSelectFilter}
        onSetIsSidebarOpen={(value) => setIsSidebarOpen(value)}
      />

      <RightModal
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          onSetFilterData(initialSmartPlanFilterData);
        }}
        ref={dropdownRef}
        title={"Filter"}
        desc={"Enter task information."}
        onFilter={handleFilter}
        from="smartplan"
        saveSearchFilterData={saveSearchFilterData}
        onSetSelectedSaveFilterId={(value) => setSelectedSaveFilterId(value)}
      >
        <SmartPlanFilterData isSidebarOpen={isSidebarOpen} filterData={filterData} onSetFilterData={onSetFilterData} />
      </RightModal>
    </div>
  );
};

export default SmartPlanFilter;
