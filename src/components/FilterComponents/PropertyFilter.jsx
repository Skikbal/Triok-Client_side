import React, { useEffect, useRef, useState } from "react";
import RightModal from "../Modal/RightModal";
import { initialPropertyFilterData } from "../../utils/initialData";
import SavedFilterComponent from "../SavedFilters/SavedFilterComponent";
import { countNonMatchingEntries, handleDropdownClose } from "../../utils/utils";
import PropertyFilterData from "../../pages/Properties/components/PropertyFilterData";

const PropertyFilter = ({ filterData, onSetFilterData, onCallApiAgain }) => {
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSavefilterId, setSelectedSaveFilterId] = useState("");

  const count = countNonMatchingEntries(filterData, initialPropertyFilterData);

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

  const handleFilterChange = (value, name) => {
    onSetFilterData({ ...filterData, [name]: value });
  };

  const saveSearchFilterData = {
    store_id: filterData?.storeId,
    property_name: filterData?.propertyName,
    property_type: filterData?.propertyType,
    street_address: filterData?.streetAddress,
    city: filterData?.city,
    state: filterData?.state,
    zip_code: filterData?.zip,
    last_update: filterData?.lastUpdateOption,
    last_update_date: filterData?.sentDate,
    last_update_start_date: filterData?.lastUpStartDate,
    last_update_end_date: filterData?.lastUpEndDate,
    date_category: filterData?.lastUpDateCategory,
    within_last_day: filterData?.withinLastDay,
    longer_than_day: filterData?.longerThanDay,
    min_rate: filterData?.minCaprate,
    max_rate: filterData?.maxCaprate,
    building_min_size: filterData?.minBuilding,
    building_max_size: filterData?.maxBuilding,
    min_price: filterData?.minPrice,
    max_price: filterData?.maxPrice,
    land_min_size: filterData?.minLand,
    land_max_size: filterData?.maxLand,
    has_owner: filterData?.hasOwner,
    has_owner_phone: filterData?.ownerPhoneCheck,
    owner_phone: filterData?.ownerPhone,
    has_owner_street_adrees: filterData?.ownerStreetAddressCheck,
    owner_street_adrees: filterData?.ownerStreetAddress,
    owner_website: filterData?.ownerWebsite,
    has_owner_tax_record: filterData?.ownerTaxRecordCheck,
    tax_record_sent_date: filterData?.taxRecordSentDate,
    tax_record_start_date: filterData?.taxRecordSentStartDate,
    tax_record_end_date: filterData?.taxRecordSentEndDate,
    owner_tags: filterData?.ownerTags,
    tags: filterData?.tags,
    last_sold: filterData?.lastSoldOption,
    last_sold_date: filterData?.lastSoldSentDate,
    last_sold_start_date: filterData?.lastSoldStartDate,
    last_sold_end_date: filterData?.lastSoldEndDate,
    sold_date_category: filterData?.lastSoldCategory,
    sold_within_last_day: filterData?.lastSoldWithinLastValue,
    sold_longer_than_day: filterData?.lastSoldLongerThanValue,
    owner: filterData?.owner,
    owner_type: filterData?.ownerType ?? "",
  };

  const handleSelectFilter = (value) => {
    const dataToSet = {
      propertyName: value?.property_name ?? "",
      storeId: value?.store_id ?? "",
      propertyType: value?.property_type ?? "",
      streetAddress: value?.street_address ?? "",
      city: value?.city ?? "",
      state: value?.state ?? "",
      zip: value?.zip_code ?? "",
      lastUpdateOption: value?.last_update ?? "date",
      sentDate: value?.last_update_date ?? "",
      lastUpStartDate: value?.last_update_start_date ?? "",
      lastUpEndDate: value?.last_update_end_date ?? "",
      lastUpDateCategory: value?.date_category ?? "days",
      withinLastDay: value?.within_last_day ?? "",
      longerThanDay: value?.longer_than_day ?? "",
      minCaprate: value?.min_rate ?? "",
      maxCaprate: value?.max_rate ?? "",
      minBuilding: value?.building_min_size ?? "",
      maxBuilding: value?.building_max_size ?? "",
      minPrice: value?.min_price ?? "",
      maxPrice: value?.max_price ?? "",
      minLand: value?.land_min_size ?? "",
      maxLand: value?.land_max_size ?? "",
      hasOwner: value?.has_owner ?? "no",
      ownerPhoneCheck: value?.has_owner_phone ?? "no",
      ownerPhone: value?.owner_phone ?? "",
      ownerStreetAddressCheck: value?.has_owner_street_adrees ?? "no",
      ownerStreetAddress: value?.owner_street_adrees ?? "",
      ownerWebsite: value?.owner_website ?? "",
      ownerTaxRecordCheck: value?.has_owner_tax_record ?? "no",
      taxRecordSentDate: value?.tax_record_sent_date ?? "",
      taxRecordSentStartDate: value?.tax_record_start_date ?? "",
      taxRecordSentEndDate: value?.tax_record_end_date ?? "",
      ownerTags: value?.owner_tags ?? "with",
      tags: value?.tags ?? [],
      lastSoldOption: value?.last_sold ?? "date",
      lastSoldSentDate: value?.last_sold_date ?? "",
      lastSoldStartDate: value?.last_sold_start_date ?? "",
      lastSoldEndDate: value?.last_sold_end_date ?? "",
      lastSoldCategory: value?.sold_date_category ?? "days",
      lastSoldWithinLastValue: value?.sold_within_last_day ?? "",
      lastSoldLongerThanValue: value?.sold_longer_than_day ?? "",
      owner: value?.owner?.id == null ? { id: "", name: "" } : value?.owner,
      ownerType: value?.ownerType ?? "",
    };
    onSetFilterData(dataToSet);
    onCallApiAgain(dataToSet);
  };

  return (
    <div>
      <SavedFilterComponent
        from="property"
        count={count}
        isSidebarOpen={isSidebarOpen}
        saveSearchFilterData={saveSearchFilterData}
        selectedSavefilterId={selectedSavefilterId}
        initialFilterData={initialPropertyFilterData}
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
          onSetFilterData(initialPropertyFilterData);
        }}
        ref={dropdownRef}
        title={"Filter"}
        desc={"Enter task information."}
        onFilter={handleFilter}
        from="property"
        saveSearchFilterData={saveSearchFilterData}
        onSetSelectedSaveFilterId={(value) => setSelectedSaveFilterId(value)}
      >
        <PropertyFilterData isSidebarOpen={isSidebarOpen} filterData={filterData} handleFilterChange={handleFilterChange} onSetFilterData={onSetFilterData} />
      </RightModal>
    </div>
  );
};

export default PropertyFilter;
