import React, { useEffect, useRef, useState } from "react";
import CompanyFilterData from "./CompanyFilterData";
import RightModal from "../../../components/Modal/RightModal";
import { initialCompanyFilterData } from "../../../utils/initialData";
import { countNonMatchingEntries, handleDropdownClose } from "../../../utils/utils";
import SavedFilterComponent from "../../../components/SavedFilters/SavedFilterComponent";

const CompanyFilter = ({ filterData, onSetFilterData, onCallApiAgain }) => {
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSavefilterId, setSelectedSaveFilterId] = useState("");

  const count = countNonMatchingEntries(filterData, initialCompanyFilterData);

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

  const handleSelectFilter = (value) => {
    const dataToSet = {
      company_name: value?.company_name ?? "",
      primaryphone: value?.phone ?? "",
      streetaddress: value?.street_address ?? "",
      city: value?.city ?? "",
      state: value?.state ?? "",
      zip: value?.zip_code ?? "",
      website: value?.website ?? "no",
      taxrecord: value?.tax_record_sent ?? "no",
      taxrecordsentdate: value?.tax_record_sent_date ?? "",
      taxrecordsentSdate: value?.tax_record_start_date ?? "",
      taxrecordsentEdate: value?.tax_record_end_date ?? "",
      tags: value?.tags ?? [],
      last_contact: value?.last_contact ?? "date",
      lastContactSentDate: value?.lastContactSentDate ?? "",
      lastContactSentSdate: value?.lastContactSentSdate ?? "",
      lastContactSentEdate: value?.lastContactSentEdate ?? "",
      date_category: value?.date_category ?? "days",
      within_last_day: value?.within_last_day ?? "",
      longer_than_day: value?.longer_than_day ?? "",
    };
    onSetFilterData(dataToSet);
    onCallApiAgain(dataToSet);
  };

  const saveSearchFilterData = {
    company_name: filterData?.company_name,
    phone: filterData?.primaryphone,
    street_address: filterData?.streetaddress,
    city: filterData?.city,
    state: filterData?.state,
    zip_code: filterData?.zip,
    website: filterData?.website,
    tax_record_sent: filterData?.taxrecord,
    tax_record_sent_date: filterData?.taxrecordsentdate,
    tax_record_start_date: filterData?.taxrecordsentSdate,
    tax_record_end_date: filterData?.taxrecordsentEdate,
    tags: filterData?.tags,
    last_contact: filterData?.last_contact,
    lastContactSentDate: filterData?.lastContactSentDate,
    lastContactSentSdate: filterData?.lastContactSentSdate,
    lastContactSentEdate: filterData?.lastContactSentEdate,
    date_category: filterData?.date_category,
    within_last_day: filterData?.within_last_day,
    longer_than_day: filterData?.longer_than_day,
  };

  return (
    <div>
      <SavedFilterComponent
        from="company"
        count={count}
        isSidebarOpen={isSidebarOpen}
        saveSearchFilterData={saveSearchFilterData}
        selectedSavefilterId={selectedSavefilterId}
        initialFilterData={initialCompanyFilterData}
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
          onSetFilterData(initialCompanyFilterData);
        }}
        ref={dropdownRef}
        title={"Filter"}
        desc={"Enter company information."}
        onFilter={handleFilter}
        from="company"
        saveSearchFilterData={saveSearchFilterData}
        onSetSelectedSaveFilterId={(value) => setSelectedSaveFilterId(value)}
      >
        <CompanyFilterData isSidebarOpen={isSidebarOpen} filterData={filterData} handleFilterChange={handleFilterChange} onSetFilterData={onSetFilterData} />
      </RightModal>
    </div>
  );
};

export default CompanyFilter;
