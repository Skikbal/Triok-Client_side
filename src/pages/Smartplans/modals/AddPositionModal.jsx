import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import Modal from "../../../components/Modal/Modal";
import { CreateSmartPlanContext } from "../../../context/CreateSmartPlanContext";

const AddPositionModal = ({ showModal, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [position, setPosition] = useState(0);
  const { activeDay, data, setData, handleUpdateDays } = useContext(CreateSmartPlanContext);

  const handleUpdateArray = (currentIndex) => {
    const targetIndex = Number(position) - 1;
    if (currentIndex !== -1 && targetIndex !== -1) {
      data.splice(currentIndex, 1);
      data.splice(targetIndex, 0, activeDay);

      for (let i = 0; i < data?.length; i++) {
        if (i === 0) {
          data[i].day = 1 + Number(data[i]?.wait_time);
        } else {
          const updatedWaitTime = Number(data[i]?.wait_time) === 0 ? Number(data[i]?.wait_time) + 1 : Number(data[i]?.wait_time);
          data[i].day = Number(data[i - 1]?.day) + updatedWaitTime;
          data[i].wait_time = updatedWaitTime;
        }
      }

      const newData = data.map((obj, i) => ({ ...obj, position: i + 1 }));
      setData(newData);
      handleUpdateDays(newData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentIndex = data?.findIndex((el) => Number(el?.day_id) === Number(activeDay?.day_id));
    handleUpdateArray(currentIndex);
    onClose();
  };

  useEffect(() => {
    setPosition(activeDay?.position);
  }, [activeDay?.position]);

  const options = data.map((el) => ({
    value: el.position,
    label: el.position,
  }));

  const handleDropdownToggle = (value) => {
    setIsDropdownOpen(value);
  };

  return (
    <Modal title={"Add Position"} desc={"Set a position for the plan."} show={showModal} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div
        // className="min-h-[100px]"
        // className={isDropdownOpen ? "min-h-[150px]" : "min-h-auto"}
        >
          <Select
            placeholder="search here..."
            options={options}
            value={options.find((el) => Number(el.value) === Number(position))}
            onChange={(option) => {
              setPosition(option.value);
            }}
            onMenuOpen={() => handleDropdownToggle(true)}
            onMenuClose={() => handleDropdownToggle(false)}
          />
        </div>

        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Add Position
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPositionModal;
