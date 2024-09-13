import React, { useEffect, useRef, useState } from "react";
import Modal from "../../Modal/Modal";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import { handleDropdownClose } from "../../../utils/utils";
import useAuth from "../.././../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import { useSelectedOptions } from "../../../context/selectedOptionsContext";
import { activityOptions } from "../../../utils/options";
import { NotificationManager } from "react-notifications";

const EditMessageModal = ({ showModal, onClose, activityId }) => {
  const dropdownRef = useRef(null);
  const { setIsEditedactivity } = useSelectedOptions();
  const [isOpen, setIsOpen] = useState(false);
  const [interactionType, setInteractionType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [config] = useAuth();

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${BASE_URL}/activity-getbyid/${activityId}`, config)
        .then((res) => {
          const { data } = res.data;
          setInteractionType(data?.interaction_type);
          setDate(data?.date);
          setDescription(data?.description);
          // if (res?.data?.message) {
          //   NotificationManager.success(res?.data?.message);
          // }
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    };

    if (showModal && activityId) {
      fetchData();
    }
  }, [activityId, showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      interaction_type: interactionType,
      date: date,
      description: description,
    };
    axios
      .put(`${BASE_URL}/activity-edit/${activityId}`, dataToSend, config)
      .then((res) => {
        setIsEditedactivity(true);
        onClose();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal title={"Edit Activity"} desc={"Update details for this activity here."} show={showModal} onClose={onClose}>
      <form className="py-3">
        <div className=" flex gap-3 items-center">
          <div className="mt-5 md:mt-0 w-[50%]">
            <p className="head-4 dark-H">Interaction Type</p>
            <div ref={dropdownRef} className="custom-dropdown mt-2">
              <div role="button" className="select-header-input capitalize light-bg-L body-N dark-M flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
                {interactionType === "" ? "Select" : interactionType} <ArrowDown />
              </div>
              {isOpen && (
                <div className="dropdown-list-container light-bg-L dark-M body-N shadow rounded-box w-52 ">
                  <ul className="dropdown-list">
                    {activityOptions.map((el, i) => (
                      <li
                        key={i}
                        role="button"
                        onClick={() => {
                          setInteractionType(el.value);
                          setIsOpen(false);
                        }}
                        className={`${interactionType === el.value ? "active" : ""}`}
                      >
                        {el.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 md:mt-0 w-[50%]">
            <p className="head-4 dark-H">Date</p>
            <div className=" mt-1">
              <input type="date" className="body-N" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex-1 mt-4">
          <p className="head-4 dark-H">
            Description <span className="body-S dar-M">(optional)</span>
          </p>
          <textarea rows={4} placeholder="Enter description here..." className="mt-2 w-full body-N" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 w-20 green-bg-H" onClick={handleSubmit}>
            Edit
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditMessageModal;
