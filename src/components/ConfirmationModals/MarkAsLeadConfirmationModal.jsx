import React from "react";
import Modal from "../Modal/Modal";
import gif from "../../assets/gif/inbox.gif";

const MarkAsLeadConfirmationModal = ({ showModal, onClose, handleAction, isLead }) => {
  return (
    <Modal show={showModal} onClose={onClose}>
      <form className="py-3 text-center">
        <div className="flex justify-center mt-[-20px]">
          <img src={gif} alt="" height={120} width={120} />
        </div>

        <div className="flex-1 mt-4 text-center w-30">
          <p className="head-1 dark-H font-bold">{isLead ? "Mark as" : "Unmark"} lead?</p>
          <p className="py-1 dark-M body-L">Are you sure to {isLead ? "mark as" : "unmark"} lead in this contact? This action can be reversed anytime.</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button type="button" onClick={handleAction} className="save-button light-L head-5 green-bg-H">
            Confirm
          </button>
          <button type="button" onClick={onClose} className="green-H body-N ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MarkAsLeadConfirmationModal;
