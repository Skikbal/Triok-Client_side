import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import Modal from "../../components/Modal/Modal";
import AddContactData from "./components/AddContactData";
import { NotificationManager } from "react-notifications";

const initialData = {
  firstName: "",
  lastName: "",
  company: "",
  company_name: "",
  title: "",
  description: "",
  mailingAddress: "",
  selectedLeadData: "",
  first_deal_anniversary: "",
  birthday: "",
  tax_record_sent: "",
  leadSourceType: "list",
  tags: [],
  isLead: false,
  contact_name: "",
};
const initialAddressData = [{ address_category: "work", street: "", city: "", state: "", zip_code: "", apt_unit_suite: "" }];
const initialPhoneData = [{ phone_category: "mobile", country_code: "+1", phone_number: "", ext: "" }];
const initialRelationData = [{ relation_category: "", name: "", id: "" }];
const initialEmailData = [{ email_category: "work", email: "" }];
const initialLinkData = [{ link_category: "", link: "" }];
const initialDateData = { date: "", month: "", year: "" };

const AddContactModal = ({ showModal, onClose, onCallApi }) => {
  const [config] = useAuth();
  const [error, setError] = useState("");
  const [disable, setDisable] = useState(false);
  const [links, setLinks] = useState(initialLinkData);
  const [emails, setEmails] = useState(initialEmailData);
  const [phones, setPhones] = useState(initialPhoneData);
  const [birthday, setBirthday] = useState(initialDateData);
  const [taxRecord, setTaxRecord] = useState(initialDateData);
  const [anniversary, setAnniversary] = useState(initialDateData);
  const [addresses, setAddresses] = useState(initialAddressData);
  const [relations, setRelations] = useState(initialRelationData);
  const [addContactData, setAddContactData] = useState(initialData);

  const handleClose = () => {
    setDisable(false);
    onClose();
    setPhones(initialPhoneData);
    setAddContactData(initialData);
    setAddresses(initialAddressData);
    setTaxRecord(initialDateData);
    setAnniversary(initialDateData);
    setBirthday(initialDateData);
    setLinks(initialLinkData);
    setEmails(initialEmailData);
    setRelations(initialRelationData);
    setError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      mark_as_lead: addContactData?.isLead ? "1" : "0",
      first_name: addContactData?.firstName,
      last_name: addContactData?.lastName,
      phone: phones,
      email: emails,
      address: addresses,
      // tags: tags,
      tag_ids: addContactData?.tags,
      relationship: relations,
      links: links,
      company_id: addContactData?.company,
      title: addContactData?.title,
      // first_deal_anniversary: `${anniversary.year}/${anniversary.month}/${anniversary.date}`,
      // birthday: `${birthday.year}/${birthday.month}/${birthday.date}`,
      // tax_record_sent: `${taxRecord.year}/${taxRecord.month}/${taxRecord.date}`,
      first_deal_anniversary: addContactData?.first_deal_anniversary,
      birthday: addContactData?.birthday,
      tax_record_sent: addContactData?.tax_record_sent,
      description: addContactData?.description,
      select_lead_type: addContactData?.leadSourceType,
      // lead_source_value: addContactData?.selectedLeadData,
      lead_source_contact_id: addContactData?.leadSourceType === "contact" ? addContactData?.selectedLeadData : "",
      leadsource_id: addContactData?.leadSourceType === "list" ? addContactData?.selectedLeadData : "",
      select_contact: 0,
      contact_source: "",
    };

    axios
      .post(`${BASE_URL}/add-contact`, dataToSend, config)
      .then((res) => {
        handleClose();
        onCallApi();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setDisable(false);
        setError(err.response.data.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal title={"Add Contact"} desc={"Add the Contact information."} width="580px" show={showModal} onClose={handleClose}>
      <AddContactData
        addContactData={addContactData}
        phones={phones}
        onSetPhones={(value) => {
          setPhones(value);
        }}
        emails={emails}
        onSetEmails={(value) => setEmails(value)}
        addresses={addresses}
        onSetAddresses={(value) => setAddresses(value)}
        onClose={handleClose}
        handleSubmit={handleSubmit}
        onSetAddContactData={(value) => setAddContactData(value)}
        relations={relations}
        onSetRelations={(value) => setRelations(value)}
        links={links}
        onSetLinks={(value) => setLinks(value)}
        anniversary={anniversary}
        onSetAnniversary={(value) => setAnniversary(value)}
        birthday={birthday}
        onSetBirthday={(value) => setBirthday(value)}
        taxRecord={taxRecord}
        onSetTaxRecord={(value) => setTaxRecord(value)}
        error={error}
        onSetError={(value) => setError(value)}
        disable={disable}
        showModal={showModal}
      />
    </Modal>
  );
};

export default AddContactModal;
