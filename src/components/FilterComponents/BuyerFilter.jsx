import React, { useEffect, useRef, useState } from "react";
import RightModal from "../Modal/RightModal";
import { initialBuyerFilterData } from "../../utils/initialData";
import SavedFilterComponent from "../SavedFilters/SavedFilterComponent";
import BuyersFilterData from "../../pages/Buyers/components/BuyersFilterData";
import { countNonMatchingEntries, handleDropdownClose } from "../../utils/utils";

const BuyerFilter = ({ filterData, onSetFilterData, onCallApiAgain }) => {
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSavefilterId, setSelectedSaveFilterId] = useState("");

  const count = countNonMatchingEntries(filterData, initialBuyerFilterData);

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
      min_asking_cap_rate: value?.min_asking_cap_rate ?? "",
      min_price: value?.min_price ?? "",
      max_price: value?.max_price ?? "",
      min_lease_term_reamaining: value?.min_lease_term_reamaining ?? "date",
      lease_date: value?.lease_date ?? "",
      lease_start_date: value?.lease_start_date ?? "",
      lease_end_date: value?.lease_end_date ?? "",
      lease_date_category: value?.lease_date_category ?? "days",
      lease_within_last_day: value?.lease_within_last_day ?? "",
      lease_longer_than_day: value?.lease_longer_than_day ?? "",
      last_update: value?.last_update ?? "date",
      last_update_date: value?.last_update_date ?? "",
      last_update_start_date: value?.last_update_start_date ?? "",
      last_update_end_date: value?.last_update_end_date ?? "",
      date_category: value?.date_category ?? "days",
      within_last_day: value?.within_last_day ?? "",
      longer_than_day: value?.longer_than_day ?? "",
      landlord_responsibilities: value?.landlord_responsibilities ?? [],
      property_type: value?.property_type ?? [],
      availability_status: value?.availability_status === "" || value?.availability_status === null ? "" : value?.availability_status === "Off Market" ? 0 : 1,
      // buyer_status: value?.buyer_status === "Pipeline" ? 0 : "",
      buyer_status: value?.buyer_status ?? [],
      state: value?.state ?? [],
      tenant_name: value?.tenant_name ?? "",
    };
    onSetFilterData(dataToSet);
    onCallApiAgain(dataToSet);
  };

  const saveSearchFilterData = {
    min_asking_cap_rate: filterData?.min_asking_cap_rate,
    min_price: filterData?.min_price,
    max_price: filterData?.max_price,
    min_lease_term_reamaining: filterData?.min_lease_term_reamaining,
    lease_date: filterData?.lease_date,
    lease_start_date: filterData?.lease_start_date,
    lease_end_date: filterData?.lease_end_date,
    lease_date_category: filterData?.lease_date_category,
    lease_within_last_day: filterData?.lease_within_last_day,
    lease_longer_than_day: filterData?.lease_longer_than_day,
    last_update: filterData?.last_update,
    last_update_date: filterData?.last_update_date,
    last_update_start_date: filterData?.last_update_start_date,
    last_update_end_date: filterData?.last_update_end_date,
    date_category: filterData?.date_category,
    within_last_day: filterData?.within_last_day,
    longer_than_day: filterData?.longer_than_day,
    landlord_responsibilities: filterData?.landlord_responsibilities,
    property_type: filterData?.property_type,
    availability_status: filterData?.availability_status === "" ? "" : filterData?.availability_status === 0 ? "Off Market" : "On Market",
    // buyer_status: filterData?.buyer_status === 0 ? "Pipeline" : filterData?.buyerStatus,
    state: filterData?.state,
    tenant_name: filterData?.tenant_name,
    buyer_status: filterData?.buyer_status,
  };

  return (
    <div>
      <SavedFilterComponent
        from="buyer"
        count={count}
        isSidebarOpen={isSidebarOpen}
        saveSearchFilterData={saveSearchFilterData}
        selectedSavefilterId={selectedSavefilterId}
        initialFilterData={initialBuyerFilterData}
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
          onSetFilterData(initialBuyerFilterData);
        }}
        ref={dropdownRef}
        title={"Filter"}
        desc={"Enter buyers information."}
        onFilter={handleFilter}
        from="buyer"
        saveSearchFilterData={saveSearchFilterData}
        onSetSelectedSaveFilterId={(value) => setSelectedSaveFilterId(value)}
      >
        <BuyersFilterData isSidebarOpen={isSidebarOpen} filterData={filterData} onSetFilterData={onSetFilterData} />
      </RightModal>
    </div>
  );
};

export default BuyerFilter;
