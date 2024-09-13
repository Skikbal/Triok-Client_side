import React, { useEffect, useRef, useState } from "react";
import LeadsFilterData from "./LeadsFilterData";
import RightModal from "../../../components/Modal/RightModal";
import { countNonMatchingEntries, handleDropdownClose } from "../../../utils/utils";
import SavedFilterComponent from "../../../components/SavedFilters/SavedFilterComponent";
import { initialLeadFilterData, initialProposalFilterData } from "../../../utils/initialData";

const LeadsFilter = ({ filterData, onSetFilterData, onCallApiAgain, from }) => {
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSavefilterId, setSelectedSaveFilterId] = useState("");

  const count = from === "lead" ? countNonMatchingEntries(filterData, initialLeadFilterData) : countNonMatchingEntries(filterData, initialProposalFilterData);

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

  const leadSaveSearchFilterData = {
    bds: filterData?.bds,
    broker: filterData?.broker,
    lead_source: filterData?.lead_source,
    created_at: filterData?.created_at,
    contact: filterData?.contact,
    lead_type: filterData?.lead_type === "" ? "" : filterData?.lead_type === "acquisition" ? 1 : 0,
    link_id: filterData?.link_id,
    property: filterData?.property,
    buyer_id: filterData?.buyer_id,
  };

  const proposalSaveSearchFilterData = {
    bds: filterData?.bds,
    broker: filterData?.broker,
    created_at: filterData?.created_at,
    contact: filterData?.contact,
    lead_type: filterData?.lead_type === "" ? "" : filterData?.lead_type === "acquisition" ? 1 : 0,
    link_id: filterData?.link_id,
    status: filterData?.status === "" ? "" : filterData?.status === "followup" ? 0 : filterData?.status === "won" ? 1 : 2,
    property: filterData?.property,
    buyer_id: filterData?.buyer_id,
  };

  const handleSelectFilter = (value) => {
    const dataToSet = {
      bds: value?.bds ?? "",
      broker: value?.broker ?? "",
      created_at: value?.created_at ?? "",
      contact: value?.contact?.id === null ? { id: "", name: "" } : value?.contact,
      lead_type: value?.lead_type === null || value?.lead_type === "" ? "" : value?.lead_type === 1 ? "acquisition" : "disposition",
      link_id: value?.link_id ?? "",
      created_start_date: value?.created_start_date ?? "",
      created_end_date: value?.created_end_date ?? "",
      property: value?.property?.id === null ? { id: "", name: "" } : value.property,
      buyer_id: value?.buyer_id ?? "",
    };
    if (from === "lead") {
      dataToSet.lead_source = value?.lead_source ?? "";
    }

    if (from === "proposal") {
      dataToSet.status = value?.status === null || value?.status === "" ? "" : value?.status === 0 ? "followup" : value?.status === 1 ? "won" : "lost";
    }
    onSetFilterData(dataToSet);
    onCallApiAgain(dataToSet);
  };

  return (
    <div>
      <SavedFilterComponent
        from={from}
        count={count}
        isSidebarOpen={isSidebarOpen}
        saveSearchFilterData={from === "lead" ? leadSaveSearchFilterData : proposalSaveSearchFilterData}
        selectedSavefilterId={selectedSavefilterId}
        initialFilterData={from === "lead" ? initialLeadFilterData : initialProposalFilterData}
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
        ref={dropdownRef}
        title="Filter"
        from={from}
        desc={`Enter ${from} information.`}
        onFilter={handleFilter}
        onClose={() => {
          setIsSidebarOpen(false);
          if (from === "lead") {
            onSetFilterData(initialLeadFilterData);
          } else {
            onSetFilterData(initialProposalFilterData);
          }
        }}
        saveSearchFilterData={from === "lead" ? leadSaveSearchFilterData : proposalSaveSearchFilterData}
        onSetSelectedSaveFilterId={(value) => setSelectedSaveFilterId(value)}
      >
        <LeadsFilterData from={from} isSidebarOpen={isSidebarOpen} filterData={filterData} onSetFilterData={onSetFilterData} />
      </RightModal>
    </div>
  );
};

export default LeadsFilter;
