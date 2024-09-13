import React, { useEffect, useRef, useState } from "react";
import ContactFilterData from "./ContactFilterData";
import RightModal from "../../../components/Modal/RightModal";
import { initialContactFilterData } from "../../../utils/initialData";
import { countNonMatchingEntries, handleDropdownClose } from "../../../utils/utils";
import SavedFilterComponent from "../../../components/SavedFilters/SavedFilterComponent";

const ContactFilter = ({ filterData, onSetFilterData, onCallApiAgain }) => {
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSavefilterId, setSelectedSaveFilterId] = useState("");

  const count = countNonMatchingEntries(filterData, initialContactFilterData);

  useEffect(() => {
    const handleClose = () => {
      setIsSidebarOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const handleFilter = () => {
    onCallApiAgain(filterData);
    setIsSidebarOpen(false);
  };

  const saveSearchFilterData = {
    first_name: filterData?.first_name,
    last_name: filterData?.last_name,
    email: filterData?.email,
    company: filterData?.company,
    phone: filterData?.phone,
    street_address: filterData?.street_address,
    city: filterData?.city,
    state: filterData?.state,
    zip_code: filterData?.zip,
    leadsource_id: filterData?.leadsource_id,
    website: filterData?.website,
    first_deal_anniversary: filterData?.first_deal_anniversary,
    has_acquisition: filterData?.has_acquisition,
    tax_record_sent: filterData?.tax_record_sent,
    tax_record_sent_date: filterData?.tax_record_sent_date,
    tax_record_start_date: filterData?.tax_record_start_date,
    tax_record_end_date: filterData?.tax_record_end_date,
    tag_category: filterData?.tag_category,
    tags: filterData?.tags,
    last_contact: filterData?.last_contact,
    lastContactSentDate: filterData?.lastContactSentDate,
    lastContactSentSdate: filterData?.lastContactSentSdate,
    lastContactSentEdate: filterData?.lastContactSentEdate,
    date_category: filterData?.date_category,
    within_last_day: filterData?.within_last_day,
    longer_than_day: filterData?.longer_than_day,
  };

  const handleSelectFilter = (value) => {
    const dataToSet = {
      first_name: value?.first_name ?? "",
      last_name: value?.last_name ?? "",
      email: value?.email ?? "",
      company: value?.company?.id == null ? { id: "", name: "" } : value?.company,
      phone: value?.phone ?? "",
      street_address: value?.street_address ?? "",
      city: value?.city ?? "",
      state: value?.state ?? "",
      zip_code: value?.zip_code ?? "",
      leadsource_id: value?.leadsource_id ?? [],
      website: value?.website ?? "no",
      first_deal_anniversary: value?.first_deal_anniversary ?? "no",
      has_acquisition: value?.has_acquisition ?? "no",
      tax_record_sent: value?.tax_record_sent ?? "no",
      tax_record_sent_date: value?.tax_record_sent_date ?? "",
      tax_record_start_date: value?.tax_record_start_date ?? "",
      tax_record_end_date: value?.tax_record_end_date ?? "",
      tags: value?.tags ?? [],
      tag_category: value?.tag_category ?? "with",
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

  return (
    <div>
      <SavedFilterComponent
        from="contact"
        count={count}
        isSidebarOpen={isSidebarOpen}
        saveSearchFilterData={saveSearchFilterData}
        selectedSavefilterId={selectedSavefilterId}
        initialFilterData={initialContactFilterData}
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
        desc="Enter Contact information."
        onFilter={handleFilter}
        onClose={() => {
          setIsSidebarOpen(false);
          onSetFilterData(initialContactFilterData);
        }}
        from="contact"
        saveSearchFilterData={saveSearchFilterData}
        onSetSelectedSaveFilterId={(value) => setSelectedSaveFilterId(value)}
      >
        <ContactFilterData isSidebarOpen={isSidebarOpen} filterData={filterData} onSetFilterData={onSetFilterData} />
      </RightModal>
    </div>
  );
};

export default ContactFilter;
