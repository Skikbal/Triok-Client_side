import React from "react";
import Modal from "./Modal/Modal";
import moment from "moment";

const CustomDateFilterModal = ({ showModal, onClose, filterCustomDate, onSetFilterCustomDate, onSuccess }) => {
  const handleChange = (value, name) => {
    onSetFilterCustomDate({ ...filterCustomDate, [name]: value });
  };

  const handleFilter = () => {
    if (filterCustomDate?.startDate !== "" && filterCustomDate?.endDate !== "") {
      onSuccess();
      onClose();
    }
  };

  const handleClose = () => {
    onSetFilterCustomDate({ ...filterCustomDate, startDate: "", endDate: "" });
    onClose();
  };

  return (
    <Modal title={"Custom Filter"} desc={"Select Range"} show={showModal} onClose={handleClose}>
      <div className="flex gap-2 dark-H">
        <div>
          <label className="dark-H head-4">Start Date</label>
          <input
            className="body-N mt-2"
            name="startDate"
            type="date"
            max={moment().format("YYYY-MM-DD")}
            placeholder="write here"
            value={filterCustomDate.startDate}
            onChange={(e) => {
              handleChange(e.target.value, "startDate");
            }}
          />
        </div>

        <div>
          <label className="dark-H head-4">End Date</label>
          <input
            className="body-N mt-2"
            name="endDate"
            type="date"
            // max={moment().format("YYYY-MM-DD")}
            placeholder="write here"
            value={filterCustomDate.endDate}
            onChange={(e) => {
              handleChange(e.target.value, "endDate");
            }}
          />
        </div>
      </div>

      <div className="mt-6">
        <button onClick={handleFilter} className="save-button light-L head-5 green-bg-H">
          Apply Filter
        </button>
        <button type="button" onClick={handleClose} className="green-H ml-5">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default CustomDateFilterModal;
