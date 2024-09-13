import React from "react";
import Modal from "../Modal/Modal";
import deletegif from "../../assets/gif/warning.gif";

const UnarchiveConfirmationModal = ({ showModal, onClose, handleAction }) => {
  return (
    <Modal show={showModal} onClose={onClose}>
      <form className="py-3 text-center">
        <div className="flex justify-center mt-[-20px]">
          <img src={deletegif} alt="binimg" height={120} width={120} />
        </div>

        <div className="flex-1 mt-4 text-center w-30">
          <p className="head-1 dark-H font-bold">Confirm Unarchiving?</p>
          <p className="py-1 dark-M body-L">This item has been moved from the archive. It'll active and accessible.</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button type="button" onClick={handleAction} className="save-button light-L head-5 green-bg-H">
            Unarchived
          </button>
          <button type="button" onClick={onClose} className="green-H body-N ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UnarchiveConfirmationModal;
