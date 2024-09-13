import React from "react";
import Modal from "../Modal/Modal";
import gif from "../../assets/gif/inbox.gif";

const ArchiveConfirmationModal = ({ showModal, onClose, handleAction }) => {
  return (
    <Modal show={showModal} onClose={onClose}>
      <form className="py-3 text-center">
        <div className="flex justify-center mt-[-20px]">
          <img src={gif} alt="binimg" height={120} width={120} />
        </div>

        <div className="flex-1 mt-4 text-center w-30">
          <p className="head-1 dark-H font-bold">Confirm Archiving?</p>
          <p className="py-1 dark-M body-L">This item has been moved to an archive for reference purposes. It is no longer active but can be retrieved if needed.</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button type="button" onClick={handleAction} className="save-button light-L head-5 green-bg-H">
            Archived
          </button>
          <button type="button" onClick={onClose} className="green-H body-N ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ArchiveConfirmationModal;
