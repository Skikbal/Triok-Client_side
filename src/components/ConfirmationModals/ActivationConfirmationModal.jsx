import React from "react";
import Modal from "../Modal/Modal";
import gif from "../../assets/gif/active.gif";

const ActivationConfirmationModal = ({ showModal, onClose, handleConfirm, type, error }) => {
  return (
    <Modal width="450px" show={showModal} onClose={onClose}>
      <form className="py-3 text-center">
        <div className="flex justify-center mt-[-20px]">
          <img src={gif} alt="binimg" height={120} width={120} />
        </div>

        <div className="flex-1 mt-4 text-center w-30">
          <p className="head-1 dark-H font-bold">Confirm {type === "active" ? "Activation" : "Deactivation"}?</p>
          <p className="py-1 dark-M body-L">Are you sure to {type === "active" ? "activate" : "deactivate"} this profile? This action can be reversed anytime.</p>
        </div>

        {error && <p className="body-S red-D">{error}</p>}

        <div className="mt-6 flex justify-center">
          <button type="button" onClick={handleConfirm} className="save-button light-L head-5 green-bg-H px-[30px] py-[12px]">
            {type === "active" ? "Active" : "Deactive"}
          </button>
          <button type="button" onClick={onClose} className="green-H body-N ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ActivationConfirmationModal;
