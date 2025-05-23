export const initialPropertyFilterData = {
  propertyName: "",
  storeId: "",
  propertyType: "",
  streetAddress: "",
  city: "",
  state: "",
  zip: "",
  lastUpdateOption: "date",
  sentDate: "",
  lastUpStartDate: "",
  lastUpEndDate: "",
  lastUpDateCategory: "days",
  withinLastDay: "",
  longerThanDay: "",
  minCaprate: "",
  maxCaprate: "",
  minPrice: "",
  maxPrice: "",
  minBuilding: "",
  maxBuilding: "",
  minLand: "",
  maxLand: "",
  // minVacancy: "",
  // maxVacancy: "",
  lastSoldOption: "date",
  lastSoldSentDate: "",
  lastSoldStartDate: "",
  lastSoldEndDate: "",
  lastSoldCategory: "days",
  lastSoldWithinLastValue: "",
  lastSoldLongerThanValue: "",
  tags: [],
  hasOwner: "no",
  ownerPhoneCheck: "no",
  ownerPhone: "",
  ownerStreetAddressCheck: "no",
  ownerStreetAddress: "",
  ownerTaxRecordCheck: "no",
  taxRecordSentDate: "",
  taxRecordSentStartDate: "",
  taxRecordSentEndDate: "",
  ownerWebsite: "no",
  ownerTags: "with",
  ownerType: "",
  owner: { id: "", name: "" },
};

export const initialBuyerFilterData = {
  availability_status: "",
  // buyer_status: "",
  buyer_status: [],
  min_asking_cap_rate: "",
  min_price: "",
  max_price: "",
  landlord_responsibilities: [],
  property_type: [],
  min_lease_term_reamaining: "date",
  lease_date: "",
  lease_start_date: "",
  lease_end_date: "",
  lease_date_category: "days",
  lease_within_last_day: "",
  lease_longer_than_day: "",
  last_update: "date",
  last_update_date: "",
  last_update_start_date: "",
  last_update_end_date: "",
  date_category: "days",
  within_last_day: "",
  longer_than_day: "",
  state: [],
  tenant_name: "",
};

export const initialTaskFilterData = {
  selectedPriorities: [],
  isRepeatingTask: "no",
  selectedTaskTypes: [],
  selectedLinkedOptions: [],
  selectedDueDate: "",
};

export const initialContactFilterData = {
  first_name: "",
  last_name: "",
  email: "",
  company: { id: "", name: "" },
  phone: "",
  street_address: "",
  city: "",
  state: "",
  zip_code: "",
  leadsource_id: [],
  website: "no",
  first_deal_anniversary: "no",
  has_acquisition: "no",
  tax_record_sent: "no",
  tax_record_sent_date: "",
  tax_record_start_date: "",
  tax_record_end_date: "",
  tags: [],
  tag_category: "with",

  last_contact: "date",
  lastContactSentDate: "",
  lastContactSentSdate: "",
  lastContactSentEdate: "",
  date_category: "days",
  within_last_day: "",
  longer_than_day: "",
};

export const initialCompanyFilterData = {
  company_name: "",
  primaryphone: "",
  streetaddress: "",
  city: "",
  state: "",
  zip: "",
  website: "no",
  taxrecord: "no",
  taxrecordsentdate: "",
  taxrecordsentSdate: "",
  taxrecordsentEdate: "",
  tags: [],
  last_contact: "date",
  lastContactSentDate: "",
  lastContactSentSdate: "",
  lastContactSentEdate: "",
  date_category: "days",
  within_last_day: "",
  longer_than_day: "",
};

export const initialSmartPlanFilterData = {
  touches: "",
  duration: "",
  priority: [],
  contacts: [],
  task_type: "",
  repeat_number: "no",
  link_other_smartplan: [],
};

export const initialLeadFilterData = {
  bds: "",
  broker: "",
  lead_source: [],
  created_at: "",
  contact: { id: "", name: "" },
  property: { id: "", name: "" },
  lead_type: "",
  buyer_id: "",
  link_id: "",
  created_start_date: "",
  created_end_date: "",
};

export const initialProposalFilterData = {
  bds: "",
  broker: "",
  created_at: "",
  lead_type: "",
  contact: { id: "", name: "" },
  property: { id: "", name: "" },
  buyer_id: "",
  link_id: "",
  status: "",
  created_start_date: "",
  created_end_date: "",
};

export const initialOfferFilterData = {
  associate: "",
  property_name: "",
  property_address: "",
  city: "",
  state: "",
  zip_code: "",
  offer_from: "",
  deal_type: "",
  created_at: "",
  offer_type: "",
  noi: "",
  offer_cap_rate: "",
  offer_price: "",
  min_asking_cap_rate: "",
  max_asking_cap_rate: "",
  min_asking_price: "",
  max_asking_price: "",
  percent_of_asking_price: "",
  created_start_date: "",
  created_end_date: "",
  contact: { id: "", name: "" },
  // contact: "",
  // contact_name: "",
};
