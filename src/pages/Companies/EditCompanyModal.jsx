import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import Modal from "../../components/Modal/Modal";
import AddCompanyData from "./components/AddCompanyData";

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

const EditCompanyModal = ({ showModal, onClose, onSetCallApiAgain }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const [loading, setLoading] = useState(true);
  const [disable, setDisable] = useState(false);
  const [phones, setPhones] = useState(initialPhoneData);
  const [addresses, setAddresses] = useState(initialAddressData);
  const [addCompanyData, setAddCompanyData] = useState(initialData);
  const [error, setError] = useState({ companyname: "" });

  const handleClose = () => {
    setDisable(false);
    setAddCompanyData(initialData);
    setPhones(initialPhoneData);
    setAddresses(initialAddressData);
    setError({ companyname: "" });
    onClose();
  };

  const fetchCompanyDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/company-getbyid/${id}`, config)
      .then((res) => {
        const companyDetails = res?.data?.data;
        setAddresses(companyDetails?.address ? companyDetails?.address : initialAddressData);
        setPhones(companyDetails?.phone ? companyDetails?.phone : initialPhoneData);
        setAddCompanyData({
          companyName: companyDetails?.company_name,
          websiteLink: companyDetails?.website_link,
          comment: companyDetails?.comment,
          communication: companyDetails?.communication,
          tax_record_sent: companyDetails?.tax_record_sent,
        });
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
    if (showModal && id) {
      fetchCompanyDetails();
    }
  }, [id, showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      company_name: addCompanyData?.companyName,
      phone: phones,
      communication: addCompanyData.communication,
      address: addresses,
      tax_record_sent: addCompanyData?.tax_record_sent,
      website_link: addCompanyData.websiteLink,
      comment: addCompanyData.comment,
    };

    axios
      .post(`${BASE_URL}/company-edit/${id}`, dataToSend, config)
      .then((res) => {
        handleClose();
        onSetCallApiAgain();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setDisable(false);
        if (err.response.data.errors) {
          setError({ ...error, companyname: err.response.data.errors });
        }
        onClose();
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleChange = (value, name) => {
    setAddCompanyData({ ...addCompanyData, [name]: value });
  };

  return (
    <Modal title={"Edit Company"} desc={"Edit the Company information."} show={showModal} onClose={handleClose}>
      {loading ? (
        <Loader />
      ) : (
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
          error={error}
        />
      )}
    </Modal>
  );
};

export default EditCompanyModal;
