import React from "react";
import Modal from "../../../components/Modal/Modal";

const RecoveryEmailModal = ({ showModal, onClose }) => {
  return (
    <Modal title={"Add Recovery Mail"} desc={"Enter a backup email for account recovery."} show={showModal} onClose={onClose}>
      <form>
        <div>
          <label className="dark-H head-4 mb-2">
            Recovery Email <span className="red-D">*</span>
          </label>
          <input className="body-N" name="username" type="text" placeholder="write recovery mail" />
        </div>

        <div className="mt-6">
          <button type="button" onClick={onClose} className="save-button light-L head-5 green-bg-H">
            Add Recovery Mail
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecoveryEmailModal;
