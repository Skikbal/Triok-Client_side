import React, { useEffect, useState } from "react";
import AddOfferData from "./components/AddOfferData";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Modal from "../../components/Modal/Modal";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import { getPercentAskingPrice } from "../../utils/utils";

const initialData = {
  list_type: "exclusive",
  type_id: "",
  user_type: "buyer",
  offer_cap_rate: "",
  offer_price: "",
  property_name: "",
  asking_price: "",
};

const EditOfferModal = ({ showModal, onClose, onCallApi, id, leadId }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (id && showModal) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/offer-getby-Id/${id}`, config)
        .then((res) => {
          const data = res?.data;
          setFormData({
            type_id: data?.lead_id,
            offer_price: data?.offer_price,
            offer_cap_rate: data?.offer_cap_rate,
            user_type: data?.type,
            // list_type: data?.lead?.type === 1 ? "proposal" : "lead",
            list_type: data?.lead_id ? "lead" : "exclusive",
            property_name: data?.lead_id ? data?.lead?.link?.property_name : data?.exclusive?.property?.property_name,
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
    const percent_of_asking_price = getPercentAskingPrice(formData?.offer_price, formData?.offer_cap_rate);
    const dataToSend = {
      exclusive_id: formData?.list_type === "exclusive" ? formData?.type_id : null,
      lead_id: formData?.list_type !== "exclusive" ? formData?.type_id : null,
      offer_price: formData?.offer_price,
      offer_cap_rate: formData?.offer_cap_rate,
      type: formData?.user_type,
      percent_of_asking_price: percent_of_asking_price,
    };

    axios
      .post(`${BASE_URL}/update-offer/${id}`, dataToSend, config)
      .then((res) => {
        handleClose();
        onCallApi();
      })
      .catch((err) => {
        setDisable(false);
        setError(err.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal title={`Edit Offer`} desc={`Edit the offer information.`} show={showModal} onClose={handleClose}>
      {loading ? (
        <Loader />
      ) : (
        <AddOfferData
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

export default EditOfferModal;
