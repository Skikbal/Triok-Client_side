import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import Modal from "../../components/Modal/Modal";
import AddCompanyData from "./components/AddCompanyData";
import { NotificationManager } from "react-notifications";

const initialData = {
  companyName: "",
  websiteLink: "",
  comment: "",
  communication: [],
  taxRecord: { date: "", month: "", year: "" },
  tax_record_sent: "",
};
const initialPhoneData = [{ phone_category: "mobile", country_code: "+1", phone_number: "", ext: "" }];
const initialAddressData = [{ address_category: "work", street: "", city: "", state: "", zip_code: "" }];

const AddCompanyModal = ({ showModal, onClose, onSuccess }) => {
  const [config] = useAuth();
  const [disable, setDisable] = useState(false);
  const [phones, setPhones] = useState(initialPhoneData);
  const [addresses, setAddresses] = useState(initialAddressData);
  const [addCompanyData, setAddCompanyData] = useState(initialData);
  const [addcompanyError, setAddcompanyError] = useState({ companyname: "" });

  const handleClose = () => {
    setDisable(false);
    setAddCompanyData(initialData);
    setPhones(initialPhoneData);
    setAddresses(initialAddressData);
    setAddcompanyError({ companyname: "" });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      company_name: addCompanyData?.companyName,
      phone: phones,
      communication: addCompanyData.communication,
      address: addresses,
      // tax_record_sent: `${addCompanyData.taxRecord.year}-${addCompanyData.taxRecord.month}-${addCompanyData.taxRecord.date}`,
      tax_record_sent: addCompanyData?.tax_record_sent,
      website_link: addCompanyData.websiteLink,
      comment: addCompanyData.comment,
    };

    axios
      .post(`${BASE_URL}/add-company`, dataToSend, config)
      .then((res) => {
        handleClose();
        onSuccess();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response.data.errors) {
          setAddcompanyError({ ...addcompanyError, companyname: err.response.data.errors });
        }
        setDisable(false);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleChange = (value, name) => {
    setAddCompanyData({ ...addCompanyData, [name]: value });
    if (name === "companyName") {
      setAddcompanyError({ ...addcompanyError, companyname: "" });
    }
  };

  useEffect(() => {
    if (addCompanyData.companyName) {
      setAddcompanyError({ companyname: "" });
    }
  }, [addCompanyData.companyName]);

  return (
    <Modal title={"Add Company"} desc={"Add the Company information."} show={showModal} onClose={handleClose}>
      <AddCompanyData
        addCompanyData={addCompanyData}
        onSetAddCompanyData={(value) => {
          setAddCompanyData(value);
        }}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        phones={phones}
        onSetPhones={(value) => setPhones(value)}
        addresses={addresses}
        onSetAddresses={(value) => setAddresses(value)}
        disable={disable}
        error={addcompanyError}
        onClose={handleClose}
      />
    </Modal>
  );
};

export default AddCompanyModal;
