import React, { useEffect, useRef, useState } from "react";
import OfferFilterData from "./OfferFilterData";
import RightModal from "../../../components/Modal/RightModal";
import { initialOfferFilterData } from "../../../utils/initialData";
import { countNonMatchingEntries, handleDropdownClose } from "../../../utils/utils";
import SavedFilterComponent from "../../../components/SavedFilters/SavedFilterComponent";

const OfferFilter = ({ filterData, onSetFilterData, onCallApiAgain }) => {
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSavefilterId, setSelectedSaveFilterId] = useState("");

  const count = countNonMatchingEntries(filterData, initialOfferFilterData);

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

  const saveSearchFilterData = {
    associate: filterData?.associate,
    property_name: filterData?.property_name,
    property_address: filterData?.property_address,
    city: filterData?.city,
    state: filterData?.state,
    zip_code: filterData?.zip_code,
    offer_from: filterData?.offer_from,
    deal_type: filterData?.deal_type === "" ? "" : filterData?.deal_type === "acquisition" ? 1 : 0,
    created_at: filterData?.created_at,
    offer_type: filterData?.offer_type,
    noi: filterData?.noi,
    offer_cap_rate: filterData?.offer_cap_rate,
    offer_price: filterData?.offer_price,
    min_asking_cap_rate: filterData?.min_asking_cap_rate,
    min_asking_cap_rate: filterData?.max_asking_cap_rate,
    min_asking_price: filterData?.min_asking_price,
    max_asking_price: filterData?.max_asking_price,
    percent_of_asking_price: filterData?.percent_of_asking_price,
    created_start_date: filterData?.created_start_date,
    created_end_date: filterData?.created_end_date,
    contact: filterData?.contact,
  };

  const handleSelectFilter = (value) => {
    const dataToSet = {
      associate: value?.associate ?? "",
      property_name: value?.property_name ?? "",
      property_address: value?.property_address ?? "",
      city: value?.city ?? "",
      state: value?.state ?? "",
      zip_code: value?.zip_code ?? "",
      offer_from: value?.offer_from ?? "",
      deal_type: value?.deal_type === "" || value?.deal_type === null ? "" : value?.deal_type === 1 ? "acquisition" : "disposition",
      created_at: value?.created_at ?? "",
      offer_type: value?.offer_type ?? "",
      noi: value?.noi ?? "",
      offer_cap_rate: value?.offer_cap_rate ?? "",
      offer_price: value?.offer_price ?? "",
      min_asking_cap_rate: value?.min_asking_cap_rate ?? "",
      max_asking_cap_rate: value?.max_asking_cap_rate ?? "",
      min_asking_price: value?.min_asking_price ?? "",
      max_asking_price: value?.max_asking_price ?? "",
      percent_of_asking_price: value?.percent_of_asking_price ?? "",
      created_start_date: value?.created_start_date ?? "",
      created_end_date: value?.created_end_date ?? "",
      contact: value?.contact,
    };
    onSetFilterData(dataToSet);
    onCallApiAgain(dataToSet);
  };

  return (
    <div>
      <SavedFilterComponent
        from="offer"
        count={count}
        isSidebarOpen={isSidebarOpen}
        saveSearchFilterData={saveSearchFilterData}
        selectedSavefilterId={selectedSavefilterId}
        initialFilterData={initialOfferFilterData}
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
        desc={`Enter offer information.`}
        onFilter={handleFilter}
        onClose={() => {
          setIsSidebarOpen(false);
          onSetFilterData(initialOfferFilterData);
        }}
        from={"offer"}
        saveSearchFilterData={saveSearchFilterData}
        onSetSelectedSaveFilterId={(value) => setSelectedSaveFilterId(value)}
      >
        <OfferFilterData isSidebarOpen={isSidebarOpen} filterData={filterData} onSetFilterData={onSetFilterData} />
      </RightModal>
    </div>
  );
};

export default OfferFilter;
