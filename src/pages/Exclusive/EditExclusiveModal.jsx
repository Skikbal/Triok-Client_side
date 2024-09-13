import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Modal from "../../components/Modal/Modal";
import Loader from "../../components/Loader";
import AddExclusiveData from "./components/AddExclusiveData";
import { BASE_URL } from "../../utils/Element";

const initialData = {
  client_name: "",
  client_id: "",
  client_type: "contact",
  property_id: "",
  current_list_date: "",
  initial_list_date: "",
  expiration_date: "",
  gross_commission_company: "",
};

const EditExclusiveModal = ({ showModal, onClose, onCallApi, id }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (id && showModal) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/exclusive-getby-Id/${id}`, config)
        .then((res) => {
          const data = res?.data?.exclusive;
          setFormData({
            client_name: data?.contact_id ? `${data?.contact?.first_name} ${data?.contact?.last_name}` : data?.company?.company_name,
            client_id: data?.contact_id ? data?.contact_id : data?.company_id,
            client_type: data?.contact_id ? "contact" : "company",
            property_id: data?.property_id,
            current_list_date: data?.current_list_date,
            initial_list_date: data?.initial_list_date,
            expiration_date: data?.expiration_date,
            gross_commission_company: data?.gross_commission_company,
          });
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, showModal]);

  const handleClose = () => {
    setFormData(initialData);
    onClose();
    setError();
    setDisable(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      property_id: formData?.property_id,
      contact_id: formData?.client_id,
      gross_commission_company: formData?.gross_commission_company?.toString(),
      current_list_date: formData?.current_list_date,
      initial_list_date: formData?.initial_list_date,
      expiration_date: formData?.expiration_date,
    };

    axios
      .post(`${BASE_URL}/update-exclusive/${id}`, dataToSend, config)
      .then((res) => {
        handleClose();
        onCallApi();
      })
      .catch((err) => {
        setError(err.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setDisable(false));
  };

  return (
    <Modal title={`Edit Exclusive`} desc={`Edit the offer information.`} show={showModal} onClose={onClose}>
      {loading ? (
        <Loader />
      ) : (
        <AddExclusiveData
          formData={formData}
          error={error}
          onSetFormData={(value) => {
            setFormData(value);
          }}
          onSetError={(value) => setError(value)}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          showModal={showModal}
          disable={disable}
        />
      )}
    </Modal>
  );
};

export default EditExclusiveModal;
