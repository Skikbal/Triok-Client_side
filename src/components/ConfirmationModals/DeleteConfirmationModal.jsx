import React from "react";
import Modal from "../Modal/Modal";
import deletegif from "../../assets/gif/bin.gif";

const DeleteConfirmationModal = ({ showModal, onClose, handleDelete }) => {
  return (
    <Modal width="450px" show={showModal} onClose={onClose}>
      <form className="py-3 text-center">
        <div className="flex justify-center mt-[-20px]">
          <img src={deletegif} alt="binimg" height={120} width={120} />
        </div>

        <div className="flex-1 mt-4 text-center w-30">
          <p className="head-1 dark-H font-bold">Delete Confirmation</p>
          <p className="py-1 dark-M body-L">Kindly be aware that this action will result in a permanent deletion and cannot be undone.</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button type="button" onClick={handleDelete} className="save-button light-L head-5 red-bg-D px-[30px] py-[12px]">
            Delete
          </button>
          <button type="button" onClick={onClose} className="green-H body-N ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteConfirmationModal;
