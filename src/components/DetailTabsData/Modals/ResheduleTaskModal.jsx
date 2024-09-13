import React, { useState } from "react";
import Modal from "../../Modal/Modal";

const ResheduleTaskModal = ({ showModal, onClose, onDateChange, handleResheduleTask }) => {
  const [date, setDate] = useState();

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <Modal title={"Reschedule Task"} desc={"Adjust task date to better fit your schedule"} show={showModal} onClose={onClose} className="linkContacts-modal" width="400px" zIndex="1050">
      <form>
        <div>
          <label className="dark-H head-4 mb-2">
            Change date<span className="red-D">*</span>
          </label>
          <input className="body-N" name="date" type="date" placeholder="Change date here" value={date} onChange={handleDateChange} />
        </div>

        <div className="mt-6">
          <button type="button" onClick={handleResheduleTask} className="save-button light-L head-5 green-bg-H">
            Reschedule Task
          </button>

          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ResheduleTaskModal;
