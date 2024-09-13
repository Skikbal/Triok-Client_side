import React, { useState, useRef } from "react";
import Modal from "../../Modal/Modal";
import { priorityOptions } from "../../../utils/options";

const ChangePriorityModal = ({ showModal, onClose, setPriority, priority, handlePriorityChange }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  // const [priorityLevel, setPriorityLevel] = useState("none");
  const selectedPriorityOption = priorityOptions.find((el) => el.value === priority);

  const handleSave = () => {
    // setPriority(priorityLevel);
    setIsOpen(false);
    handlePriorityChange();
  };

  return (
    <Modal title={"Change Priority"} desc={"Update task priority as needed"} show={showModal} onClose={onClose} className="linkContacts-modal">
      <form>
        <div>
          <label className="dark-H head-4 mb-2">Priority level</label>
          <div ref={dropdownRef} className="custom-dropdown mt-[6px]">
            <div role="button" className="select-header-input capitalize light-bg-L body-N dark-M flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
              <p>Select Your priority level</p>
              <p className="flex" style={{ color: selectedPriorityOption?.color }}>
                <img src={selectedPriorityOption?.icon} alt="" className="mr-2" /> {selectedPriorityOption?.label}
              </p>
            </div>

            {isOpen && (
              <div className="dropdown-list-container light-bg-L dark-M body-N shadow rounded-box" style={{ width: "100%" }}>
                <ul className="dropdown-list">
                  {priorityOptions.flatMap((el, i) => (
                    <li
                      key={i}
                      role="button"
                      onClick={() => {
                        setPriority(el.value);
                        setIsOpen(false);
                      }}
                      className={`${priority === el.value ? "active" : ""}`}
                      style={{ color: el.color }}
                    >
                      <img src={el.icon} alt="" className="mr-2" /> {el.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button type="button" onClick={handleSave} className="save-button light-L head-5 green-bg-H">
            Change
          </button>

          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePriorityModal;
