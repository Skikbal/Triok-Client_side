import React, { useState } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import useAuth from "../../hooks/useAuth";
import gif from "../../assets/gif/remove.gif";
import { BASE_URL } from "../../utils/Element";

const RemoveTagConfirmationModal = ({ showModal, onClose, onSuccess, from, selectedItem }) => {
  const [config] = useAuth();
  const [error, setError] = useState();

  const handleClose = () => {
    setError();
    onClose();
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const dataToSend = {
      action: "remove_tag",
      ids: selectedItem,
      type: from,
    };
    axios
      .post(`${BASE_URL}/handleBulk-Actions`, dataToSend, config)
      .then((res) => {
        onSuccess();
        handleClose();
      })
      .catch((error) => {
        console.error("Error add activity:", error);
        setError(error.response.data.message);
      });
  };

  return (
    <Modal width="450px" show={showModal} onClose={onClose}>
      <form onSubmit={handleConfirm} className="py-3 text-center">
        <div className="flex justify-center mt-[-20px]">
          <img src={gif} alt="binimg" height={120} width={120} />
        </div>

        <div className="flex-1 mt-4 text-center w-30">
          <p className="head-1 dark-H font-bold">Remove Tag</p>
          <p className="py-1 dark-M body-L">Are you sure you want to remove these tag?</p>
        </div>

        {error && <p className="body-S red-D">{error}</p>}

        <div className="mt-6 flex justify-center">
          <button type="submit" className="save-button light-L head-5 green-bg-H px-[30px] py-[12px]">
            Yeah Sure
          </button>
          <button type="button" onClick={handleClose} className="green-H body-N ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RemoveTagConfirmationModal;
