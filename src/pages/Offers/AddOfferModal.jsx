import React, { useState } from "react";
import AddOfferData from "./components/AddOfferData";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Modal from "../../components/Modal/Modal";
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

const AddOfferModal = ({ showModal, onClose, onCallApi, id }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [disable, setDisable] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleClose = () => {
    setFormData(initialData);
    onClose();
    setError();
    setDisable(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);

    const percent_of_asking_price = getPercentAskingPrice(formData?.offer_price, formData?.asking_price);

    const addDataToSend = {
      exclusive_id: formData?.list_type === "exclusive" ? formData?.type_id : null,
      lead_id: formData?.list_type !== "exclusive" ? formData?.type_id : null,
      offer_price: formData?.offer_price,
      offer_cap_rate: formData?.offer_cap_rate,
      type: formData?.user_type,
      percent_of_asking_price: percent_of_asking_price,
    };

    const updateDataToSend = {
      offer_price: formData?.offer_price,
      offer_cap_rate: formData?.offer_cap_rate,
      type: formData?.user_type,
      offer_id: id,
    };

    const dataToSend = id === "" ? addDataToSend : updateDataToSend;

    const url = id === "" ? "add-offer?type=new" : "add-offer";

    axios
      .post(`${BASE_URL}/${url}`, dataToSend, config)
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
    <Modal title={`Add Offer`} desc={`Add the offer information.`} show={showModal} onClose={handleClose}>
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
        from={id === "" ? "new" : "update"}
        disable={disable}
      />
    </Modal>
  );
};

export default AddOfferModal;
