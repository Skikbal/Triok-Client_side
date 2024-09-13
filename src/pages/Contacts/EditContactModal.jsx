import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import AddContactData from "./components/AddContactData";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../utils/Element";
import { NotificationManager } from "react-notifications";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";

const initialDateData = { date: "", month: "", year: "" };
const initialData = {
  firstName: "",
  lastName: "",
  company: "",
  company_name: "",
  title: "",
  description: "",
  selectedLeadData: "",
  first_deal_anniversary: "",
  birthday: "",
  tax_record_sent: "",
  leadSourceType: "list",
  tags: [],
  isLead: false,
  contact_name: "",
};
const initialPhoneData = [{ phone_category: "mobile", country_code: "+1", phone_number: "", ext: "" }];
const initialAddressData = [{ address_category: "work", address: "", apt_unit_suite: "" }];
const initialEmailData = [{ email_category: "work", email_id: "" }];
const initialRelationData = [{ relation_category: "", name: "", id: "" }];
const initialLinkData = [{ link_category: "", link: "" }];

const EditContactModal = ({ showModal, onClose, onSetCallApiAgain }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [disable, setDisable] = useState(false);
  const [links, setLinks] = useState(initialLinkData);
  const [phones, setPhones] = useState(initialPhoneData);
  const [emails, setEmails] = useState(initialEmailData);
  const [birthday, setBirthday] = useState(initialDateData);
  const [taxRecord, setTaxRecord] = useState(initialDateData);
  const [anniversary, setAnniversary] = useState(initialDateData);
  const [relations, setRelations] = useState(initialRelationData);
  const [addresses, setAddresses] = useState(initialAddressData);
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

  const fetchContactDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/contact-getbyid/${id}`, config)
      .then((res) => {
        const contactDetails = res?.data?.data;
        setAddresses(contactDetails?.address ? contactDetails?.address : initialAddressData);
        setPhones(contactDetails?.phone ? contactDetails?.phone : initialPhoneData);
        setLinks(contactDetails?.links ? contactDetails?.links : initialLinkData);
        setEmails(contactDetails?.email ? contactDetails?.email : initialEmailData);
        setRelations(contactDetails?.relationship ? contactDetails?.relationship : initialRelationData);
        setTaxRecord({ date: moment(contactDetails?.tax_record_sent).date(), month: moment(contactDetails?.tax_record_sent).month() + 1, year: moment(contactDetails?.tax_record_sent).year() });
        setAnniversary({ date: moment(contactDetails?.first_deal_anniversary).date(), month: moment(contactDetails?.first_deal_anniversary).month() + 1, year: moment(contactDetails?.first_deal_anniversary).year() });
        setBirthday({ date: moment(contactDetails?.birthday).date(), month: moment(contactDetails?.birthday).month() + 1, year: moment(contactDetails?.birthday).year() });
        setAddContactData({
          firstName: contactDetails?.first_name,
          lastName: contactDetails?.last_name,
          description: contactDetails?.description,
          title: contactDetails?.title,
          company: contactDetails?.company_id,
          company_name: contactDetails?.company?.company_name,
          selectedLeadData: contactDetails?.lead_source?.id,
          tax_record_sent: contactDetails?.tax_record_sent,
          birthday: contactDetails?.birthday,
          first_deal_anniversary: contactDetails?.first_deal_anniversary,
          leadSourceType: contactDetails?.select_lead_type,
          tags: contactDetails?.tags?.map((el) => el?.id),
          isLead: contactDetails?.mark_as_lead == 0 ? false : true,
          contact_name: contactDetails?.contact_source?.name,
        });
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id && showModal) {
      fetchContactDetails();
    }
  }, [id, showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      mark_as_lead: addContactData?.isLead ? 1 : 0,
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
      lead_source_contact_id: addContactData?.leadSourceType === "contact" ? addContactData?.selectedLeadData : "",
      leadsource_id: addContactData?.leadSourceType === "list" ? addContactData?.selectedLeadData : "",
      select_contact: 0,
      contact_source: "",
    };

    axios
      .put(`${BASE_URL}/contact-edit/${id}`, dataToSend, config)
      .then((res) => {
        handleClose();
        onSetCallApiAgain();
        // setAddContactData(initialData);
        // setPhones(initialPhoneData);
        // setAddresses(initialAddressData);
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setDisable(false);
        onClose();
        setError(err.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal title={"Edit Contact"} desc={"Edit the Contact information."} width="580px" show={showModal} onClose={handleClose}>
      {loading ? (
        <Loader />
      ) : (
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
          disable={disable}
          showModal={showModal}
          error={error}
          onSetError={(value) => setError(value)}
        />
      )}
    </Modal>
  );
};

export default EditContactModal;
