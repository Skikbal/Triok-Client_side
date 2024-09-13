import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import { CreateSmartPlanContext } from "../../../context/CreateSmartPlanContext";
import { handleNumberKeyDown } from "../../../utils/utils";

const AddDelayModal = ({ showModal, onClose }) => {
  const { activeDay, data, setData, handleUpdateDays } = useContext(CreateSmartPlanContext);
  const [delay, setDelay] = useState(0);
  const [error, setError] = useState("");

  const updateArray = (arr, indexToUpdate, newWait) => {
    arr[indexToUpdate].wait_time = Number(newWait);

    if (indexToUpdate === 0) {
      arr[indexToUpdate].day = 1 + Number(newWait);
    } else {
      arr[indexToUpdate].day = Number(arr[indexToUpdate - 1].day) + Number(newWait);
    }
    for (let i = indexToUpdate + 1; i < arr.length; i++) {
      arr[i].day = Number(arr[i - 1]?.day) + Number(arr[i]?.wait_time);
    }

    return arr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentIndex = data?.findIndex((el) => Number(el?.day_id) === Number(activeDay?.day_id));
    let updatedArray = await updateArray(data, currentIndex, delay);
    if (updatedArray) {
      setData([...updatedArray]);
      handleUpdateDays([...updatedArray]);
      onClose();
    }
  };

  useEffect(() => {
    setDelay(activeDay?.wait_time);
  }, [activeDay?.wait_time]);

  // const onlyAlphabets = e.target.value.replace(/[^a-zA-Z ]/g, "");
  // const onlyNumber = e.target.value.replace(/[^0-9 ]/, "");
  // const numberAlphabets = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");

  return (
    <Modal title={"Add Delay"} desc={"Set a delay time for the plan."} show={showModal} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2 ">Delay (Days)</label>
          <input
            className="body-N"
            name="delay"
            type="number"
            min="0"
            placeholder="write here"
            value={delay}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => {
              if (e.target.value > 365) {
                setError("Delay time not greater than 365");
              } else {
                const onlyNumber = e.target.value.replace(/[^0-9 ]/, "");
                setDelay(onlyNumber);
                setError("");
              }
            }}
            onKeyDown={handleNumberKeyDown}
          />
          {error !== "" && <span className="body-S red-D">{error}</span>}
        </div>

        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Add Delay
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDelayModal;
