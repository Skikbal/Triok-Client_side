import React from "react";
import Modal from "../Modal/Modal";
import gif from "../../assets/gif/inbox.gif";

const ConfirmationModal = ({ showModal, onClose, handleConfirm, from }) => {
  return (
    <Modal width="450px" show={showModal} onClose={onClose}>
      <form className="py-3 text-center">
        {from === "smartPlan" ? (
          <div className="text-center w-30 -mt-6">
            <p className="head-1 dark-H font-bold">Exit without adding contacts to the plan?</p>
            <p className="py-1 dark-M body-L">If you exit now, your contact selections will be lost. Are you sure you want to exit?</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mt-[-20px]">
              <img src={gif} alt="binimg" height={120} width={120} />
            </div>

            <div className="flex-1 mt-4 text-center w-30">
              <p className="head-1 dark-H font-bold">Are you sure?</p>
              <p className="py-1 dark-M body-L">Kindly be aware that this action will result in a permanent and cannot be undone.</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button type="button" onClick={handleConfirm} className="save-button light-L head-5 green-bg-H">
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

export default ConfirmationModal;
