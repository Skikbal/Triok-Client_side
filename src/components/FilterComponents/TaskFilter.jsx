import React, { useEffect, useRef, useState } from "react";
import RightModal from "../Modal/RightModal";
import { initialTaskFilterData } from "../../utils/initialData";
import SavedFilterComponent from "../SavedFilters/SavedFilterComponent";
import TaskFilterData from "../../pages/Tasks/components/TaskFilterData";
import { countNonMatchingEntries, handleDropdownClose } from "../../utils/utils";

const TaskFilter = ({ filterData, onSetFilterData, onCallApiAgain }) => {
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSavefilterId, setSelectedSaveFilterId] = useState("");

  const count = countNonMatchingEntries(filterData, initialTaskFilterData);

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
      selectedPriorities: value?.priority ?? [],
      selectedTaskTypes: value?.task_type ?? [],
      selectedLinkedOptions: value?.linked_to ?? [],
      isRepeatingTask: value?.repeating_tasks ?? "no",
      selectedDueDate: value?.due_date ?? "",
    };
    onSetFilterData(dataToSet);
    onCallApiAgain(dataToSet);
  };

  const saveSearchFilterData = {
    task_type: filterData?.selectedTaskTypes,
    priority: filterData?.selectedPriorities,
    linked_to: filterData?.selectedLinkedOptions,
    repeating_tasks: filterData?.isRepeatingTask,
    due_date: filterData?.selectedDueDate,
  };

  return (
    <div>
      <SavedFilterComponent
        from="task"
        count={count}
        isSidebarOpen={isSidebarOpen}
        saveSearchFilterData={saveSearchFilterData}
        selectedSavefilterId={selectedSavefilterId}
        initialFilterData={initialTaskFilterData}
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
          onSetFilterData(initialTaskFilterData);
        }}
        ref={dropdownRef}
        title={"Filter"}
        desc={"Enter Contact information."}
        onFilter={handleFilter}
        from="task"
        saveSearchFilterData={saveSearchFilterData}
        onSetSelectedSaveFilterId={(value) => setSelectedSaveFilterId(value)}
      >
        <TaskFilterData isSidebarOpen={isSidebarOpen} filterData={filterData} onSetFilterData={onSetFilterData} />
      </RightModal>
    </div>
  );
};

export default TaskFilter;
